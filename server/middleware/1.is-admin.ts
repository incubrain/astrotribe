export default defineEventHandler((event) => {
  const isAdmin = true
  if (event.path.includes('admin') && !isAdmin) {
    console.log(`You are not authentcated to use ${event.path}`)
    return {
      status: 403,
      statusText: `You are not authorized to access ${event.path}`
    }
  }
})
