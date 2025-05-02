// server/api/contact.post.ts
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const response = await $fetch(
      `https://www.udemy.com/instructor-api/v1/taught-courses/courses/?fields[course]=@all`,
      {
        method: 'GET',
        headers: {
          Authorization: `bearer ${config.API_TOKEN}`,
          Accept: 'application/json',
        },
      },
    )
    return response
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
})
