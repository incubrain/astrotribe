type MarketingCostParams = {
  mrr: number
  percentage: number
}

export function calculateMarketingCost({ mrr, percentage }: MarketingCostParams): number {
  if (mrr < 0) {
    throw new Error(
      'Invalid input: MRR and percentage must be positive and percentage must be between 0 and 100.'
    )
  }

  const marketingCost = mrr * percentage

  return marketingCost
}
