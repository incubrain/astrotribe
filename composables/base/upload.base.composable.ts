import {
  useErrorHandler,
  AppError,
  ErrorType,
  ErrorSeverity
} from './error-handler.base.composable'
import { useLogger } from './logger.base.composable'
import Sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

type FileType = 'profile' | 'document' | 'image' | 'video' | 'audio' | 'other'

interface UploadOptions {
  bucket: string
  path: string
  fileType: FileType
  userId?: string
  metadata?: Record<string, string>
  optimizeImage?: boolean
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
  rateLimitMs?: number
  auditLog?: (action: string, details: any) => Promise<void>
  onProgress?: (progress: number) => void
  maxFileSize?: number
  allowedMimeTypes?: string[]
}

interface UploadResult {
  path: string
  publicUrl: string
  size: number
  mimeType: string
  metadata: Record<string, string>
}

export function useFileUpload() {
  const supabase = useSupabaseClient()
  const { handleError } = useErrorHandler()
  const logger = useLogger('useFileUpload')
  const isUploading: Ref<boolean> = ref(false)
  const uploadProgress: Ref<number> = ref(0)
  const lastUploadTime = ref(0)
  const uploadQueue: Ref<File[]> = ref([])
  const currentUpload: Ref<File | null> = ref(null)

  const isProcessing = computed(() => uploadQueue.value.length > 0 || currentUpload.value !== null)

  const optimizeImage = async (file: File, options: UploadOptions): Promise<Buffer> => {
    const { maxWidth = 1200, maxHeight = 1200, quality = 80, format = 'webp' } = options
    const buffer = await file.arrayBuffer()

    return Sharp(buffer)
      .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
      [format]({ quality })
      .toBuffer()
  }

  const getFilePath = (fileName: string, options: UploadOptions): string => {
    const { bucket, path, fileType, userId } = options
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0]
    const uniqueId = uuidv4().slice(0, 8)
    const userPath = userId ? `${userId}/` : ''
    return `${bucket}/${fileType}/${userPath}${path}/${timestamp}_${uniqueId}_${fileName}`
  }

  const validateFile = (file: File, options: UploadOptions): void => {
    if (options.maxFileSize && file.size > options.maxFileSize) {
      throw new AppError({
        type: ErrorType.VALIDATION_ERROR,
        message: `File size exceeds the maximum allowed size of ${options.maxFileSize} bytes`,
        severity: ErrorSeverity.MEDIUM,
        context: 'File Upload'
      })
    }

    if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.type)) {
      throw new AppError({
        type: ErrorType.VALIDATION_ERROR,
        message: `File type ${file.type} is not allowed`,
        severity: ErrorSeverity.MEDIUM,
        context: 'File Upload'
      })
    }
  }

  const uploadFile = async (file: File, options: UploadOptions): Promise<UploadResult> => {
    isUploading.value = true
    uploadProgress.value = 0
    currentUpload.value = file

    try {
      validateFile(file, options)

      // Rate limiting
      if (options.rateLimitMs) {
        const timeSinceLastUpload = Date.now() - lastUploadTime.value
        if (timeSinceLastUpload < options.rateLimitMs) {
          await new Promise((resolve) =>
            setTimeout(resolve, options.rateLimitMs ?? 0 - timeSinceLastUpload)
          )
        }
      }

      let fileToUpload: File | Buffer = file
      let mimeType = file.type

      if (options.optimizeImage && file.type.startsWith('image/')) {
        fileToUpload = await optimizeImage(file, options)
        mimeType = `image/${options.format || 'webp'}`
      }

      const filePath = getFilePath(file.name, options)

      const metadata = {
        ...options.metadata,
        originalName: file.name,
        size: fileToUpload instanceof Buffer ? fileToUpload.length : file.size,
        mimeType,
        uploadedBy: options.userId || 'anonymous'
      }

      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
          contentType: mimeType,
          duplex: 'half'
          // metadata waiting on merge of https://github.com/supabase/storage-js/pull/207
        })

      if (error) {
        throw new AppError({
          type: ErrorType.UPLOAD_ERROR,
          message: `Error uploading file: ${error.message}`,
          severity: ErrorSeverity.HIGH,
          context: 'File Upload'
        })
      }

      // Get public URL
      const {
        data: { publicUrl }
      } = supabase.storage.from(options.bucket).getPublicUrl(data.path)

      // Audit logging
      if (options.auditLog) {
        await options.auditLog('UPLOAD', { filePath, options, metadata })
      }

      lastUploadTime.value = Date.now()

      return {
        path: data.path,
        publicUrl,
        size: metadata.size,
        mimeType,
        metadata
      }
    } catch (error: any) {
      handleError(error, 'Error uploading file')
      throw error
    } finally {
      isUploading.value = false
      uploadProgress.value = 100
      currentUpload.value = null
      processQueue()
    }
  }

  const processQueue = async () => {
    if (uploadQueue.value.length > 0 && !isUploading.value) {
      const nextFile = uploadQueue.value.shift()
      if (nextFile) {
        await uploadFile(nextFile, {
          bucket: 'default',
          path: 'uploads',
          fileType: 'other'
        })
      }
    }
  }

  const queueUpload = (file: File, options: UploadOptions) => {
    uploadQueue.value.push(file)
    processQueue()
  }

  const cancelUpload = () => {
    if (currentUpload.value) {
      // Implement cancellation logic here
      // This might involve aborting the Supabase upload if possible
      currentUpload.value = null
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  const clearQueue = () => {
    uploadQueue.value = []
  }

  return {
    uploadFile,
    queueUpload,
    cancelUpload,
    clearQueue,
    isUploading,
    isProcessing,
    uploadProgress,
    currentUpload,
    uploadQueue
  }
}
