import { v4 as uuidv4 } from 'uuid'
import { useRateLimit } from './useRateLimit'

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
  format?: 'jpeg' | 'jpg' | 'png' | 'webp'
  rateLimitMs?: number
  auditLog?: (action: string, details: any) => Promise<void>
  onProgress?: (progress: number) => void
  maxFileSize?: number
  allowedMimeTypes?: string[]
  serverSideOptimize?: boolean
  useServerUpload?: boolean
  replace?: boolean
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
  const { checkRateLimit } = useRateLimit()
  const isUploading: Ref<boolean> = ref(false)
  const uploadProgress: Ref<number> = ref(0)
  const lastUploadTime = ref(0)
  const uploadQueue: Ref<File[]> = ref([])
  const currentUpload: Ref<File | null> = ref(null)

  const isProcessing = computed(() => uploadQueue.value.length > 0 || currentUpload.value !== null)

  const getFilePath = (fileName: string, options: UploadOptions): string => {
    const { bucket, path, fileType, userId, replace } = options
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0]
    const uniqueId = uuidv4().slice(0, 8)
    const userPath = userId ? `${userId}/` : ''
    return `${bucket}/${fileType}/${userPath}${path || ''}/${replace ? '' : `${timestamp}_${uniqueId}_`}${fileName}`
  }

  const validateFile = (file: File, options: UploadOptions): void => {
    if (options.maxFileSize && file.size > options.maxFileSize) {
      throw new AppError({
        type: ErrorType.VALIDATION_ERROR,
        message: `File size exceeds the maximum allowed size of ${options.maxFileSize} bytes`,
        severity: ErrorSeverity.MEDIUM,
        context: 'File Upload',
      })
    }

    if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.type)) {
      throw new AppError({
        type: ErrorType.VALIDATION_ERROR,
        message: `File type ${file.type} is not allowed`,
        severity: ErrorSeverity.MEDIUM,
        context: 'File Upload',
      })
    }
  }

  const serverSideUpload = async (file: File, options: UploadOptions): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', options.userId || '')
    formData.append('fileType', options.fileType)
    formData.append('bucket', options.bucket)
    formData.append('path', options.path)
    formData.append(
      'optimizationOptions',
      JSON.stringify({
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight,
        quality: options.quality,
        format: options.format,
      }),
    )

    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          uploadProgress.value = progress
          options.onProgress?.(progress)
        }
      },
    })

    if (!response || !response.fileName) {
      throw new Error('Failed to upload file on server')
    }

    const publicUrl = supabase.storage.from(options.bucket).getPublicUrl(response.fileName)
      .data.publicUrl

    return {
      path: response.fileName,
      publicUrl,
      size: file.size,
      mimeType: file.type,
      metadata: {
        originalName: file.name,
        ...options.metadata,
      },
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
        await checkRateLimit('fileUpload', { limitMs: options.rateLimitMs })
      }

      let result: UploadResult

      if (options.useServerUpload) {
        result = await serverSideUpload(file, options)
      } else {
        const filePath = getFilePath(file.name, options)
        const { data, error } = await supabase.storage.from(options.bucket).upload(filePath, file, {
          cacheControl: '3600',
          upsert: options.replace,
          contentType: file.type,
        })

        if (error) {
          throw new Error({
            type: 'UPLOAD_ERROR',
            message: `Error uploading file: ${error.message}`,
            severity: 'HIGH',
            context: 'File Upload',
          })
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from(options.bucket).getPublicUrl(data.path)

        result = {
          path: data.path,
          publicUrl,
          size: file.size,
          mimeType: file.type,
          metadata: {
            originalName: file.name,
            ...options.metadata,
          },
        }
      }

      lastUploadTime.value = Date.now()

      return result
    } catch (error: any) {
      logger.error(error, 'Error uploading file')
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
          fileType: 'other',
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
    uploadQueue,
  }
}
