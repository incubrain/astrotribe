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
}

module.exports = {
  init(config: ProviderConfig) {
    // Configure S3 client
    const s3Config: S3ClientConfig = {
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
      forcePathStyle: true,
    }

    const s3 = new S3(s3Config)

    return {
      async upload(file: File): Promise<void> {
        const params = {
          Bucket: config.bucket,
          Key: `${file.hash}${file.ext}`,
          Body: file.stream || file.buffer,
          ACL: 'public-read' as ObjectCannedACL,
          ContentType: file.mime,
        }

        // Upload file to Supabase storage
        await s3.send(new PutObjectCommand(params))

        // Set file URL
        file.url = `${config.endpoint}/${config.bucket}/${file.hash}${file.ext}`
      },

      async delete(file: File): Promise<void> {
        const params = {
          Bucket: config.bucket,
          Key: `${file.hash}${file.ext}`,
        }

        // Delete file from Supabase storage
        await s3.send(new DeleteObjectCommand(params))
      },
    }
  },
}
