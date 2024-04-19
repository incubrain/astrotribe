export default function handleQueryParams(query: any) {
  console.log('handleQueryParams', query)
  if (query.filterBy) {
    console.log('is not array')
    query.filterBy = JSON.parse(query.filterBy)
  }

  if (query.pagination) {
    query.pagination = JSON.parse(query.pagination)
  }
  console.log('handleQueryParams 2', query)
  return query
}
