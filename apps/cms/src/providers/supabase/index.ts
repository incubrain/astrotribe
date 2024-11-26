import type { Readable } from 'stream'
import type { ObjectCannedACL, S3ClientConfig } from '@aws-sdk/client-s3'
import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

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
}

module.exports = {
  init(config: ProviderConfig) {
    // Ensure the endpoint is properly formatted
    const formattedEndpoint = config.endpoint
      .replace(/\/?$/, '') // Remove trailing slash if present
      .replace('/storage/v1', '') // Remove /storage/v1 if present

    // Configure S3 client
    const s3Config: S3ClientConfig = {
      endpoint: `${formattedEndpoint}/storage/v1/s3`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
      forcePathStyle: true,
    }

    const s3 = new S3(s3Config)

    const getFileKey = (file: File): string => {
      const path = file.path ? `${file.path}/` : ''
      return `${path}${file.hash}${file.ext}`
    }

    const getFileUrl = (key: string): string => {
      return `${formattedEndpoint}/storage/v1/object/public/${config.bucket}/${key}`
    }

    return {
      async upload(file: File): Promise<void> {
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

        try {
          // Upload file to Supabase storage
          await s3.send(new PutObjectCommand(params))

          // Set file URL
          file.url = getFileUrl(key)
        } catch (error) {
          console.error('Upload error:', error)
          throw error
        }
      },

      async delete(file: File): Promise<void> {
        const key = getFileKey(file)

        const params = {
          Bucket: config.bucket,
          Key: key,
        }

        await s3.send(new DeleteObjectCommand(params))
      },
    }
  },
}
