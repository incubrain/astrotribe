// import all the functions I want to test

// mapp functions to a switch block
async function testingFunction(name: string) {
  console.log('working', name)
  switch (name) {
    case 'newsScraper':
      await newsScraper()
      break
    case 'scrapeSeo':
      await scrapeSeo()
      break
    default:
      throw createError('no testing function defined')
  }
}

export default defineEventHandler(async (event) => {
  console.log('scrape-blogs start')
  const params = getQuery(event)
  // pass the function name I want to test as param
  console.log('params', params, params.functionName)
  try {
    await testingFunction(String(params.functionName))

    return {
      status: 200,
      message: 'Function tested'
    }
  } catch (error: any) {
    console.log('testing error', error.message)
    return {
      status: 500,
      message: 'Error testing function',
      error
    }
  }
})
