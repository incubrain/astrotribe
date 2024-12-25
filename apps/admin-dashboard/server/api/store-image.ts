export default defineEventHandler(async (event) => {
  try {
    console.log('store-image start')
    // !todo: I envision this endpoint being called, fetching all the image URLs that need to be stored
    // We would need to check if we have already stored the image, and if not, fetch and store it
    // When storing it would need to be stored in a folder using the news.id as the folder name
    // image name doesn't matter
    // then we would need to update the news.featured_image with the new URL

    // Fetch the image as a blob
    const imgBlob = await $fetch(
      'https://cdn.mos.cms.futurecdn.net/594rdNk4Ci9qT8e2XKsQ7Q-970-80.jpg.webp',
      { responseType: 'blob' },
    )

    console.log('Image fetched', imgBlob)

    // Get the Supabase client
    const supabase = await dbClient(event)

    // Upload the blob to Supabase Storage
    const { data, error } = await supabase.storage.from('posts').upload('public/test.webp', imgBlob)

    if (error: any) {
      throw createError({ message: `Error uploading image: ${error.message}` })
    }

    console.log('Image uploaded successfully')

    return {
      status: 200,
      message: 'Image Stored',
    }
  } catch (error: any) {
    console.error('store-image error', error.message)
    return {
      status: 500,
      message: 'Error Storing Image',
      error,
    }
  }
})
