import type { FetchInput } from '../base/fetch.base.composable'

type CompanyType = {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  website: string
  created_at: string
  updated_at: string
}

// What will I need for database?
// Addresses table
// id SERIAL PRIMARY KEY,
// street1 VARCHAR(255) NOT NULL,
// street2 VARCHAR(255),
// city VARCHAR(100) NOT NULL,
// state VARCHAR(100),
// postal_code VARCHAR(20),
// country VARCHAR(100) NOT NULL,
// location GEOGRAPHY(POINT, 4326)

// Countries table:
// id SERIAL PRIMARY KEY,
// name VARCHAR(100) UNIQUE NOT NULL

// Cities Table:
// id SERIAL PRIMARY KEY,
// name VARCHAR(100) NOT NULL,
// country_id INTEGER NOT NULL,
// CONSTRAINT fk_country FOREIGN KEY (country_id) REFERENCES countries(id)

// Companies table
// {
// id: number
// name: string

//
//
//
// }

export const useCompaniesStore = defineStore('companiesStore', () => {
  const companies = ref([] as CompanyType[])
  const logger = useLogger('companiesStore')
  const baseFetch = useBaseFetch()

  async function loadCompanies(input: FetchInput) {
    logger.log('loadCompanies start')
    try {
      const data = await baseFetch.fetchPaginatedData(input)
      console.log('loadCompanies return', data)
      if (!data) {
        return
      }
      logger.log(`returned ${data.length} companies`)
      companies.value.push(...data)
    } catch (error) {
      logger.error('Failed to load companies:', error)
    }
  }

  async function insertCompany(newCompany) {
    try {
      const { data, error } = await $fetch('/api/companies/insert/single', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        body: JSON.stringify({
          newData: newCompany,
          dto: 'insert:company:full'
        })
      })

      if (error) {
        throw createError(`error inserting company: ${error.value}`)
      }

      logger.log(`Company ${data.name} inserted successfully`)
    } catch (error) {
      logger.error(`Error inserting company ${newCompany.name}:`, error)
    }
  }

  // const companyById = () => {
  //   return (id: number) => companies.value.find((company: CompanyType) => company.id === id)
  // }

  return {
    companies,
    loadCompanies,
    insertCompany
  }
})
