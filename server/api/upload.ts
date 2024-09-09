import crypto from 'crypto'
import { defineEventHandler, createError } from 'h3'
import { PDFDocument } from 'pdf-lib'
import lame from 'node-lame'
import ffmpeg from 'fluent-ffmpeg'
import sharp from 'sharp'

// Base optimizer interface
interface FileOptimizer {
  optimize(
    buffer: Buffer,
    options: any
  ): Promise<{
    data: Buffer
    extension: string
    mimeType: string
  }>
}

// Image optimizer using Sharp
class ImageOptimizer implements FileOptimizer {
  async optimize(buffer: Buffer, options: any) {
    const { maxWidth = 1920, maxHeight = 1080, quality = 80 } = options
    const optimized = await sharp(buffer)
      .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()
    return { data: optimized, extension: 'webp', mimeType: 'image/webp' }
  }
}

// PDF optimizer using pdf-lib
class PDFOptimizer implements FileOptimizer {
  async optimize(buffer: Buffer, options: any) {
    const pdfDoc = await PDFDocument.load(buffer)
    // Implement PDF optimization logic here
    const optimized = await pdfDoc.save({ useObjectStreams: false })
    return { data: Buffer.from(optimized), extension: 'pdf', mimeType: 'application/pdf' }
  }
}

class VideoOptimizer implements FileOptimizer {
  async optimize(buffer: Buffer, options: any) {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      videoBitrate = '1000k',
      audioBitrate = '128k',
    } = options

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(buffer)
        .videoFilters(
          `scale='min(${maxWidth},iw)':min'(${maxHeight},ih)':force_original_aspect_ratio=decrease`,
        )
        .videoBitrate(videoBitrate)
        .audioBitrate(audioBitrate)
        .toFormat('mp4')
        .on('end', (stdout, stderr) => {
          resolve({ data: stdout, extension: 'mp4', mimeType: 'video/mp4' })
        })
        .on('error', reject)
        .pipe()
    })
  }
}

class AudioOptimizer implements FileOptimizer {
  async optimize(buffer: Buffer, options: any) {
    const { bitrate = 128 } = options

    const encoder = new lame.Lame({
      output: 'buffer',
      bitrate: bitrate,
    }).setBuffer(buffer)

    const encodedBuffer = await encoder.encode()
    return { data: encodedBuffer, extension: 'mp3', mimeType: 'audio/mpeg' }
  }
}

// Optimizer factory
class OptimizerFactory {
  private optimizers: Map<string, FileOptimizer> = new Map()

  register(mimeType: string, optimizer: FileOptimizer) {
    this.optimizers.set(mimeType, optimizer)
  }

  getOptimizer(mimeType: string): FileOptimizer | undefined {
    return this.optimizers.get(mimeType)
  }
}

// Create and configure the optimizer factory
const optimizerFactory = new OptimizerFactory()
optimizerFactory.register('image', new ImageOptimizer())
optimizerFactory.register('application/pdf', new PDFOptimizer())
optimizerFactory.register('video', new VideoOptimizer())
optimizerFactory.register('audio', new AudioOptimizer())

export default defineEventHandler(async (event) => {
  console.log('File optimization and upload eventHandler')
  const form = await readMultipartFormData(event)
  if (!form?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No form data provided' })
  }

  const userId = form.find((item) => item.name === 'userId')?.data.toString()
  const fileType = form.find((item) => item.name === 'fileType')?.data.toString()
  const bucket = form.find((item) => item.name === 'bucket')?.data.toString()
  const path = form.find((item) => item.name === 'path')?.data.toString()
  const optimizationOptions = JSON.parse(
    form.find((item) => item.name === 'optimizationOptions')?.data.toString() || '{}',
  )

  const file = form.find((item) => item.name === 'file')
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  if (!userId || !fileType || !bucket || !path) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required parameters' })
  }

  const fileName = `${fileType}-${crypto.randomUUID()}`
  const mimeType = file.type || 'application/octet-stream'

  console.log('Processing file:', userId, fileType, fileName, mimeType)

  try {
    let optimizedFile: Buffer
    let finalExtension: string
    let finalMimeType: string

    const optimizerKey = mimeType.split('/')[0]
    const optimizer
      = optimizerFactory.getOptimizer(optimizerKey) || optimizerFactory.getOptimizer(mimeType)

    if (optimizer) {
      const result = await optimizer.optimize(file.data, optimizationOptions)
      optimizedFile = result.data
      finalExtension = result.extension
      finalMimeType = result.mimeType
    }
    else {
      console.log('No optimizer found for this file type, uploading as-is')
      optimizedFile = file.data
      finalExtension = mimeType.split('/')[1]
      finalMimeType = mimeType
    }

    const client = await serverSupabaseClient(event)
    const { error } = await client.storage
      .from(bucket)
      .upload(`${path}/${fileName}.${finalExtension}`, optimizedFile, {
        contentType: finalMimeType,
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    // If this is a profile-related upload, update the user_profiles table
    if (bucket === 'user-profiles' && ['avatar', 'cover-photo'].includes(fileType)) {
      const { error: updateError, data } = await client
        .from('user_profiles')
        .update({ [fileType]: `${fileName}.${finalExtension}` })
        .eq('id', userId)
        .select()

      if (updateError) {
        console.error('Error updating user profile:', updateError)
      }
      else {
        console.log('User profile updated:', data)
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File successfully uploaded and optimized',
        fileName: `${fileName}.${finalExtension}`,
      }),
    }
  }
  catch (error: any) {
    console.error('Error processing file:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
