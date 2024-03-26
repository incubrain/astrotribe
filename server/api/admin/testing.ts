// import all the functions I want to test

// mapp functions to a switch block
async function testingFunction(name: string) {
  switch (name) {
    case 'scraperGeneric':
      await scraperGeneric()
      break
    case 'scrapeSeo':
      await scrapeSeo()
      break
    default:
      throw createError('no testing function defined')
  }
}

export default defineEventHandler(async (event) => {
  const params = getQuery(event)
  // pass the function name I want to test as param
  try {
    await testingFunction(String(params.functionName))

    return {
      status: 200,
      message: 'Function tested'
    }
  } catch (error: any) {
    console.error('testing error', error.message)
    return {
      status: 500,
      message: 'Error testing function',
      error
    }
  }
})
