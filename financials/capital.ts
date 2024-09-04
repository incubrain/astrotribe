import { ROUND0 } from './helpers'

interface InitialLoanParams {
  loan: number
  annualInterestRate: number
  termInYears: number
}

export interface LoanResult {
  principal: number
  termInYears: number
  annualInterestRate: number
  monthlyInterestOnlyPayment: number
  monthlyTotalPayment: number
  monthlyPrincipalPayment: number
}

export function calculateInitialLoan({
  loan,
  annualInterestRate,
  termInYears
}: InitialLoanParams): LoanResult {
  const interestRateDecimal = annualInterestRate > 1 ? annualInterestRate / 100 : annualInterestRate

  // Convert annual interest rate to monthly rate
  const monthlyInterestRate = interestRateDecimal / 12

  // Convert loan term from years to months
  const numberOfPayments = termInYears * 12

  // Calculate monthly interest-only payment
  const monthlyInterestOnlyPayment = loan * monthlyInterestRate

  // Calculate total monthly payment using the loan amortization formula
  const monthlyTotalPayment =
    (loan * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

  // Calculate the principal payment
  const monthlyPrincipalPayment = monthlyTotalPayment - monthlyInterestOnlyPayment

  return {
    principal: loan,
    termInYears,
    annualInterestRate,
    monthlyInterestOnlyPayment: Math.round(monthlyInterestOnlyPayment * 100) / 100,
    monthlyTotalPayment: Math.round(monthlyTotalPayment * 100) / 100,
    monthlyPrincipalPayment: Math.round(monthlyPrincipalPayment * 100) / 100
  }
}

function calculateBurnRate(totalExpenses: number, MRR: number) {
  return ROUND0(totalExpenses - MRR)
}

function calculateRunway(currentBalance: number, burnRate: number): number {
  if (burnRate === 0) {
    return Infinity // or a large number to indicate no burn
  }
  return parseInt((currentBalance / Math.abs(burnRate)).toFixed(0))
}

export interface CapitalResult {
  loan: LoanResult
  runway: number
  burnRate: number
  balance: {
    start: number
    end: number
  }
}

interface LoanRepaymentParams {
  month: number
  loan: {
    AMOUNT: number
    ANNUAL_INTEREST_RATE: number
    TERM_IN_YEARS: number
  }
  expenses: number
  income: number
  bootstrapMonths: number
  initialCapital: number
}

let balanceRemaining = 0
let loanStarted = {
  principal: 0,
  termInYears: 0,
  annualInterestRate: 0,
  monthlyInterestOnlyPayment: 0,
  monthlyTotalPayment: 0,
  monthlyPrincipalPayment: 0
}

export function calculateRemainingBalance({
  month,
  expenses,
  income,
  bootstrapMonths,
  initialCapital,
  loan
}: LoanRepaymentParams): CapitalResult {
  if (month === 1) {
    balanceRemaining = initialCapital
  }

  if (month === bootstrapMonths) {
    balanceRemaining += loan.AMOUNT
    loanStarted = calculateInitialLoan({
      loan: loan.AMOUNT,
      annualInterestRate: loan.ANNUAL_INTEREST_RATE,
      termInYears: loan.TERM_IN_YEARS
    })
  }

  const burnRate = calculateBurnRate(expenses, income)
  balanceRemaining -= burnRate

  const adjustedBurn = burnRate < 0 ? 0 : burnRate
  const runway = calculateRunway(balanceRemaining, adjustedBurn)

  return {
    loan: loanStarted,
    runway,
    burnRate,
    balance: {
      start: balanceRemaining + burnRate,
      end: balanceRemaining
    }
  }
}
