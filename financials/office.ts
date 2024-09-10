const OFFICE_SPACE = {
  sqMetersPerEmployee: 8,
  costPerSqMeter: 2360, // averaged from 40 offices in Pune
  maxEmployees: 35, // Maximum number of employees for full office
  costPerEmployee: (
    haveCoworking: boolean,
    haveOffice: boolean,
    employees: number,
  ): number => {
    if (haveOffice) {
      const totalSqMeters
        = OFFICE_SPACE.maxEmployees * OFFICE_SPACE.sqMetersPerEmployee
      return totalSqMeters * OFFICE_SPACE.costPerSqMeter
    } else if (haveCoworking) {
      return 8000 * employees
    } else {
      return 0
    }
  },
  insurance: 50000,
  internet: 2000,
  cleaning: 5000,
  maintenance: 5000,
}

const OFFICE_EXPENSES = {
  supplies: 800,
  utilities: 400,
  snacks: 300,
  misc: 1000,
}

export interface OfficeResult {
  total: number
  officeSpace: number
  supplies: number
  utilities: number
  snacks: number
  miscellaneous: number
  internet: number
  cleaning: number
  insurance: number
  maintenance: number
}

export function calculateOfficeCosts(employees: number): OfficeResult {
  console.log('officeCost1', employees)
  const minEmployeesForCoworking = 10
  const minEmployeesForOffice = 20
  const haveOffice = employees > minEmployeesForOffice
  const haveCoworking
    = employees > minEmployeesForCoworking && employees < minEmployeesForOffice

  const spaceCost = OFFICE_SPACE.costPerEmployee(
    haveCoworking,
    haveOffice,
    employees,
  )
  const officeSuppliesCost = employees * OFFICE_EXPENSES.supplies
  const utilitiesCost = employees * OFFICE_EXPENSES.utilities
  const snacksCoffeeCost = employees * OFFICE_EXPENSES.snacks
  const miscellaneousCost = employees * OFFICE_EXPENSES.misc

  const internetPhoneCost = haveOffice ? OFFICE_SPACE.internet : 0
  const cleaningServicesCost = haveOffice ? OFFICE_SPACE.cleaning : 0
  const insuranceCost = haveOffice ? OFFICE_SPACE.insurance : 0
  const maintenanceCost = haveOffice ? OFFICE_SPACE.maintenance : 0

  const total
    = spaceCost
    + officeSuppliesCost
    + utilitiesCost
    + snacksCoffeeCost
    + miscellaneousCost
    + internetPhoneCost
    + cleaningServicesCost
    + insuranceCost
    + maintenanceCost

  console.log('officeCost', {
    total,
    spaceCost,
    officeSuppliesCost,
    utilitiesCost,
    snacksCoffeeCost,
    miscellaneousCost,
    internetPhoneCost,
    cleaningServicesCost,
    insuranceCost,
    maintenanceCost,
  })

  return {
    total: parseInt(total.toFixed(0)),
    officeSpace: parseInt(spaceCost.toFixed(0)),
    supplies: parseInt(officeSuppliesCost.toFixed(0)),
    utilities: parseInt(utilitiesCost.toFixed(0)),
    snacks: parseInt(snacksCoffeeCost.toFixed(0)),
    miscellaneous: parseInt(miscellaneousCost.toFixed(0)),
    internet: parseInt(internetPhoneCost.toFixed(0)),
    cleaning: parseInt(cleaningServicesCost.toFixed(0)),
    insurance: parseInt(insuranceCost.toFixed(0)),
    maintenance: parseInt(maintenanceCost.toFixed(0)),
  }
}
