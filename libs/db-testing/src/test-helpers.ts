// db-testing/src/test-helpers.ts
import type { CrudOperations, RLSTestCase } from './types'

export const executeTest = (crudOperations: CrudOperations) => {
  return async (operation: string, tableName: string, testCase: RLSTestCase) => {
    const { setup, context } = testCase
    const dataToTest = setup.data[0]
    let result: any

    switch (operation.toLowerCase()) {
      case 'insert':
        try {
          const { insertData } = crudOperations.useInsert(tableName, {})
          result = await insertData(dataToTest)
          return { success: true, data: result }
        } catch (error) {
          return { success: false, error }
        }

      case 'update':
        try {
          const { updateData } = crudOperations.useUpdate(tableName, {})
          const updatedData = { ...dataToTest, some_field: 'newValue' } // Adjust as needed
          result = await updateData(dataToTest.id, updatedData)
          return { success: true, data: result }
        } catch (error) {
          return { success: false, error }
        }

      case 'delete':
        try {
          const { deleteData } = crudOperations.useDelete(tableName, {})
          await deleteData(dataToTest.id)
          return { success: true }
        } catch (error) {
          return { success: false, error }
        }

      case 'select':
        try {
          const { store, refresh } = crudOperations.useSelect(tableName, {
            filters: { id: { eq: dataToTest.id } },
          })
          await refresh()
          const item = store.getItemById(dataToTest.id)
          if (item) {
            return { success: true, data: item }
          } else {
            throw new Error('Item not found')
          }
        } catch (error) {
          return { success: false, error }
        }

      default:
        throw new Error(`Unsupported operation: ${operation}`)
    }
  }
}
