export default defineEventHandler(async (event) => {
  const { channelName } = getQuery(event)

  console.log('channelName', channelName)

  try {
    const videos = await getYoutubeContent(String(channelName))

    console.log('returnedData', videos)
    return {
      status: 200,
      message: 'Videos returned from youtube',
      data: videos,
    }
  }
  catch (error: any) {
    console.error('social/youtube error', error.message)
    return {
      status: 500,
      message: 'Error retrieving videos',
      data: null,
      error,
    }
  }
})
