import { ROUND0, USD2INR } from './helpers'

type Subscription = {
  name: string
  baseCost: number
  seatCost: number
  annualDiscount: number
  seatRatio: number
}

const SOFTWARE: Subscription[] = [
  {
    name: 'ChatGPT',
    baseCost: 30,
    seatCost: 30,
    annualDiscount: 5,
    seatRatio: 1,
  },
  {
    name: 'GitHub Teams',
    baseCost: 4,
    seatCost: 4,
    annualDiscount: 0,
    seatRatio: 0.65,
  },
  {
    name: 'GitHub Copilot',
    baseCost: 19,
    seatCost: 19,
    annualDiscount: 0,
    seatRatio: 0.65,
  },
  {
    name: 'Adobe',
    baseCost: 25,
    seatCost: 25,
    annualDiscount: 0,
    seatRatio: 0.15,
  },
  {
    name: 'Google Business',
    baseCost: 7.2,
    seatCost: 7.2,
    annualDiscount: 0,
    seatRatio: 1,
  },
  {
    name: 'Posthog',
    baseCost: 0,
    seatCost: 19,
    annualDiscount: 0,
    seatRatio: 0.15,
  },
]

function calculateMonthlyCost(subscription: Subscription, seats: number): number {
  return USD2INR(subscription.baseCost + subscription.seatCost * seats)
}

function calculateAnnualCost(subscription: Subscription, seats: number): number {
  return (subscription.seatCost - subscription.annualDiscount) * seats
}

export interface SoftwareCosts {
  totalCost: number
  serviceCosts: {
    name: string
    seats: number
    cost: number
  }[]
}

export function calculateSubscriptionCosts(totalEmployees: number): SoftwareCosts {
  const serviceCosts = []
  let totalCost = 0
  for (const subscription of SOFTWARE) {
    const numberOfSeats = ROUND0(Math.ceil(totalEmployees * subscription.seatRatio))
    const cost = calculateMonthlyCost(subscription, numberOfSeats)
    totalCost += cost
    serviceCosts.push({ name: subscription.name, seats: numberOfSeats, cost: ROUND0(cost) })
    // const annualCost = calculateAnnualCost(subscription, numberOfSeats);
  }

  return { totalCost: ROUND0(totalCost), serviceCosts }
}
