import { ROUND0 } from './totals'

interface InitialLoanParams {
  loan: number
  annualInterestRate: number
  termInYears: number
}

export interface LoanResult {
  loanStart: number
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
    loanStart: loan,
    termInYears,
    annualInterestRate,
    monthlyInterestOnlyPayment: Math.round(monthlyInterestOnlyPayment * 100) / 100,
    monthlyTotalPayment: Math.round(monthlyTotalPayment * 100) / 100,
    monthlyPrincipalPayment: Math.round(monthlyPrincipalPayment * 100) / 100
  }
}

interface LoanRepaymentParams {
  month: number
  loan: number
  expenses: number
  income: number
}

export interface CapitalResult {
  runway: number
  burnRate: number
  balance: {
    start: number
    end: number
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

let balanceRemaining = 0
export function calculateRemainingBalance({
  month,
  loan,
  expenses,
  income
}: LoanRepaymentParams): CapitalResult {
  if (month === 1) {
    balanceRemaining = loan
  }

  console.log('balance remaining', balanceRemaining)

  const burnRate = calculateBurnRate(expenses, income)
  balanceRemaining -= burnRate

  const adjustedBurn = burnRate < 0 ? 0 : burnRate
  const runway = calculateRunway(balanceRemaining, adjustedBurn)

  console.log('BALANCE END', month, balanceRemaining, runway, burnRate)
  return {
    runway,
    burnRate,
    balance: {
      start: balanceRemaining + burnRate,
      end: balanceRemaining
    }
  }
}
