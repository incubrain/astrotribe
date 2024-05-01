
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Uploads a file to a specified bucket and directory in Supabase Storage.
 *
 * @param bucketName The name of the bucket where the file will be uploaded.
 * @param path Inside the bucket, the directory path where the file will be stored.
 * @param file The File object to upload.
 * @param fileName The name of the file within the specified path.
 * @returns Promise resolving to the upload response.
 */


// maybe create this as a util for storage buckets
// then import into user.service etc for use
async function uploadFileToSupabase(
  bucketName: string,
  path: string,
  file: File,
  fileName: string
): Promise<any> {
  const supabaseClient
  // Ensure the path ends with a slash
  const directory = path.endsWith('/') ? path : `${path}/`;

  // Full path where the file will be stored
  const fullPath = `${directory}${fileName}`;

  // Perform the upload
  const { data, error } = await supabaseClient.storage
    .from(bucketName)
    .upload(fullPath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return data;
}
