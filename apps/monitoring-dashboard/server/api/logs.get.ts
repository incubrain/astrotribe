// server/api/logs.get.ts

import { defineEventHandler } from 'h3'
import { InfluxDB } from '@influxdata/influxdb-client'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Create InfluxDB client
  const influxDB = new InfluxDB({
    url: config.influxUrl,
    token: config.influxToken,
  })

  const queryApi = influxDB.getQueryApi(config.influxOrg)

  // Extract query parameters if needed
  const queryParams = getQuery(event)

  // Build InfluxDB query
  const query = `from(bucket: "${config.influxBucket}")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "logs")`

  const data = []
  await queryApi.collectRows(query, {
    next: (row) => data.push(row),
    error: (error: any) => console.error(error: any),
    complete: () => console.log('Query completed'),
  })

  return data
})
