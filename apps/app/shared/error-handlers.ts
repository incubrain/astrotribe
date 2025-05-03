export const handleFeatureLimitError = (error: any) => {
  if (
    error.statusCode === 402 ||
    (error.data && error.data.upgrade) ||
    error.message?.includes('limit')
  ) {
    // Return a standardized error response
    return createError({
      statusCode: 402,
      message: error.message || 'Feature limit reached',
      data: {
        upgrade: true,
        ...error.data,
      },
    })
  }
  // Handle other errors
  return error
}
