import { Readable } from 'stream'
import type { ObjectCannedACL, S3ClientConfig } from '@aws-sdk/client-s3'
import {
  S3,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3'

interface ProviderConfig {
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  region: string
}

interface File {
  hash: string
  ext: string
  mime: string
  buffer: Buffer
  stream?: Readable
  url?: string
  path?: string
  size?: number
}

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB chunk size

module.exports = {
  init(config: ProviderConfig) {
    // Validate and format the endpoint URL
    if (!config.endpoint) {
      throw new Error('Supabase endpoint URL is required')
    }

    // Remove any protocol and trailing slashes
    const cleanEndpoint = config.endpoint
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '')
      .replace('/storage/v1', '')

    if (!cleanEndpoint) {
      throw new Error('Invalid Supabase endpoint URL')
    }

    // Configure S3 client
    const s3Config: S3ClientConfig = {
      endpoint: `https://${cleanEndpoint}/storage/v1/s3`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region || 'ap-south-1',
      forcePathStyle: true,
    }

    const s3 = new S3(s3Config)

    const getFileKey = (file: File): string => {
      const path = file.path ? `${file.path}/` : ''
      return `${path}${file.hash}${file.ext}`
    }

    const getFileUrl = (key: string): string => {
      return `https://${cleanEndpoint}/storage/v1/object/public/${config.bucket}/${key}`
    }

    async function* createChunks(buffer: Buffer) {
      let offset = 0
      while (offset < buffer.length) {
        const chunk = buffer.slice(offset, offset + CHUNK_SIZE)
        yield chunk
        offset += chunk.length
      }
    }

    async function uploadMultipart(file: File): Promise<void> {
      const key = getFileKey(file)
      const buffer = file.buffer

      try {
        // Initialize multipart upload
        const multipartUpload = await s3.send(
          new CreateMultipartUploadCommand({
            Bucket: config.bucket,
            Key: key,
            ContentType: file.mime,
            ACL: 'public-read',
            Metadata: {
              'Cache-Control': 'public, max-age=31536000',
              'Access-Control-Allow-Origin': '*',
            },
          }),
        )

        const uploadId = multipartUpload.UploadId
        const parts: { ETag: string; PartNumber: number }[] = []

        // Upload parts
        let partNumber = 1
        for await (const chunk of createChunks(buffer)) {
          const uploadPartResult = await s3.send(
            new UploadPartCommand({
              Bucket: config.bucket,
              Key: key,
              UploadId: uploadId,
              PartNumber: partNumber,
              Body: chunk,
            }),
          )

          parts.push({
            ETag: uploadPartResult.ETag!,
            PartNumber: partNumber,
          })

          partNumber++
        }

        // Complete multipart upload
        await s3.send(
          new CompleteMultipartUploadCommand({
            Bucket: config.bucket,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
          }),
        )

        file.url = getFileUrl(key)
      } catch (error) {
        console.error('Multipart upload error:', error)
        throw error
      }
    }

    return {
      async upload(file: File): Promise<void> {
        if (!file.hash || !file.ext) {
          throw new Error('File hash and extension are required')
        }

        try {
          // Use multipart upload for files larger than 5MB
          if (file.size && file.size > CHUNK_SIZE) {
            await uploadMultipart(file)
            return
          }

          const key = getFileKey(file)
          const params = {
            Bucket: config.bucket,
            Key: key,
            Body: file.stream || file.buffer,
            ACL: 'public-read' as ObjectCannedACL,
            ContentType: file.mime,
            Metadata: {
              'Cache-Control': 'public, max-age=31536000',
              'Access-Control-Allow-Origin': '*',
            },
          }

          await s3.send(new PutObjectCommand(params))
          file.url = getFileUrl(key)
        } catch (error) {
          console.error('Upload error:', error)
          throw error
        }
      },

      async uploadStream(file: File): Promise<Readable> {
        return new Promise((resolve, reject) => {
          const stream = new Readable({
            read() {},
          })

          this.upload(file)
            .then(() => {
              stream.push(null)
              resolve(stream)
            })
            .catch((error) => {
              reject(error)
            })
        })
      },

      async delete(file: File): Promise<void> {
        if (!file.hash || !file.ext) {
          throw new Error('File hash and extension are required')
        }

        const key = getFileKey(file)
        await s3.send(
          new DeleteObjectCommand({
            Bucket: config.bucket,
            Key: key,
          }),
        )
      },
    }
  },
}
