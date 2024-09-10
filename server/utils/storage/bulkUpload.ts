import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Uploads multiple files to a specified bucket and directory in Supabase Storage.
 *
 * @param supabaseClient The initialized Supabase client.
 * @param bucketName The name of the bucket where files will be uploaded.
 * @param path Inside the bucket, the directory path where files will be stored.
 * @param files An array of objects containing the File and its desired fileName.
 * @returns Promise resolving to an array of upload responses.
 */
async function bulkUploadFilesToSupabase(
  supabaseClient: SupabaseClient,
  bucketName: string,
  path: string,
  files: { file: File; fileName: string }[]
): Promise<any[]> {
  // Ensure the path ends with a slash
  const directory = path.endsWith('/') ? path : `${path}/`

  // Create an array of upload promises
  const uploadPromises = files.map(({ file, fileName }) => {
    const fullPath = `${directory}${fileName}`
    return supabaseClient.storage.from(bucketName).upload(fullPath, file, {
      cacheControl: '3600',
      upsert: false,
    })
  })

  // Execute all promises concurrently
  const results = await Promise.allSettled(uploadPromises)

  // Process results to separate successes and errors
  const successes = []
  const errors = []
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.error === null) {
      successes.push(result.value.data)
    } else if (result.status === 'rejected' || result.value.error) {
      errors.push(result.reason || result.value.error.message)
    }
  })

  // Optionally handle errors, e.g., retry failed uploads, log errors, etc.
  if (errors.length > 0) {
    console.error('Some uploads failed:', errors)
  }

  return successes
}

/**
 * Uploads multiple files to a specified bucket and directory in Supabase Storage.
 *
 * @param supabaseClient The initialized Supabase client.
 * @param bucketName The name of the bucket where files will be uploaded.
 * @param path Inside the bucket, the directory path where files will be stored.
 * @param files An array of objects containing the File and its desired fileName.
 * @returns Promise resolving to an array of upload responses.
 */
async function bulkUploadFilesToSupabase(
  supabaseClient: SupabaseClient,
  bucketName: string,
  path: string,
  files: { file: File; fileName: string }[]
): Promise<any[]> {
  // Ensure the path ends with a slash
  const directory = path.endsWith('/') ? path : `${path}/`

  // Create an array of upload promises
  const uploadPromises = files.map(({ file, fileName }) => {
    const fullPath = `${directory}${fileName}`
    return supabaseClient.storage.from(bucketName).upload(fullPath, file, {
      cacheControl: '3600',
      upsert: false,
    })
  })

  // Execute all promises concurrently
  const results = await Promise.allSettled(uploadPromises)

  // Process results to separate successes and errors
  const successes = []
  const errors = []
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.error === null) {
      successes.push(result.value.data)
    } else if (result.status === 'rejected' || result.value.error) {
      errors.push(result.reason || result.value.error.message)
    }
  })

  // Optionally handle errors, e.g., retry failed uploads, log errors, etc.
  if (errors.length > 0) {
    console.error('Some uploads failed:', errors)
  }

  return successes
}

const bucketName = 'your-bucket-name'
const directoryPath = 'uploads/multiple'
const filesToUpload = [
  { file: new File(['contents of file 1'], 'file1.txt'), fileName: 'file1.txt' },
  { file: new File(['contents of file 2'], 'file2.txt'), fileName: 'file2.txt' },
]

bulkUploadFilesToSupabase(supabaseClient, bucketName, directoryPath, filesToUpload)
  .then((successfulUploads) => {
    console.log('Successfully uploaded files:', successfulUploads)
  })
  .catch((error) => {
    console.error('Error during bulk upload:', error)
  })
