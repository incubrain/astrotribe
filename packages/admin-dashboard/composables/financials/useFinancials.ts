import data from '../../../admin-dashboard/assets/business-financials.json'

function formatNumber(value: number, style: 'INR' | 'USD' = 'INR'): string {
  const absValue = Math.abs(value)
  let formattedNumber

  switch (style) {
    case 'INR':
      if (absValue >= 1_00_00_00_000) {
        formattedNumber = `${(absValue / 1_00_00_00_000).toFixed(2)} T`
      } else if (absValue >= 1_00_00_000) {
        formattedNumber = `${(absValue / 1_00_00_000).toFixed(2)} CR`
      } else if (absValue >= 1_00_000) {
        formattedNumber = `${(absValue / 1_00_000).toFixed(2)} L`
      } else if (absValue >= 1_000) {
        formattedNumber = `${(absValue / 1_000).toFixed(2)} K`
      } else {
        formattedNumber = absValue.toFixed(2)
      }
      break
    case 'USD':
      if (absValue >= 1_000_000_000) {
        formattedNumber = `${(absValue / 1_000_000_000).toFixed(2)} B`
      } else if (absValue >= 1_000_000) {
        formattedNumber = `${(absValue / 1_000_000).toFixed(2)} M`
      } else if (absValue >= 1_000) {
        formattedNumber = `${(absValue / 1_000).toFixed(2)} K`
      } else {
        formattedNumber = absValue.toString()
      }
      break
  }

  return value < 0 ? '-' + formattedNumber : formattedNumber
}

function formatCurrency(amount: number, currencyType: 'INR' | 'USD'): string {
  const formattedNumber = formatNumber(amount, currencyType)
  const currencySymbol = currencyType === 'INR' ? '₹' : '$'
  return `${currencySymbol}${formattedNumber}`
}

function formatStorage(sizeInGB: number): string {
  const absSize = Math.abs(sizeInGB)
  let formattedSize: string

  if (absSize >= 1_000_000) {
    formattedSize = `${(absSize / 1_000_000).toFixed(2)} PB`
  } else if (absSize >= 1_000) {
    formattedSize = `${(absSize / 1_000).toFixed(2)} TB`
  } else if (absSize >= 1) {
    formattedSize = `${absSize.toFixed(2)} GB`
  } else {
    formattedSize = `${(absSize * 1_000).toFixed(2)} MB`
  }

  return sizeInGB < 0 ? '-' + formattedSize : formattedSize
}

function findLargestValue(values: number[]): number {
  return Math.max(...values)
}

const colorPalette = {
  darkBlue: [0, 102, 255],
  mediumBlue: [83, 104, 120],
  lightBlue: [122, 138, 153],
  darkGray: [161, 176, 186],
  mediumGray: [182, 194, 207],
  lightGray: [199, 210, 221],
  veryLightGray: [216, 226, 235],
  extraLightGray: [233, 241, 245],
  darkRed: [139, 0, 0],
  mediumRed: [178, 34, 34],
  lightRed: [220, 20, 60],
  darkGreen: [0, 100, 0],
  mediumGreen: [34, 139, 34],
  lightGreen: [46, 139, 87],
  darkOrange: [255, 140, 0],
  mediumOrange: [255, 165, 0],
  lightOrange: [255, 215, 0],
  darkPurple: [75, 0, 130],
  mediumPurple: [138, 43, 226],
  lightPurple: [147, 112, 219],
  darkPink: [255, 20, 147],
  mediumPink: [255, 105, 180],
  lightPink: [255, 182, 193],
  darkYellow: [255, 255, 0],
  mediumYellow: [255, 255, 0],
  lightYellow: [255, 255, 153],
  darkCyan: [0, 139, 139],
  mediumCyan: [0, 255, 255],
  lightCyan: [224, 255, 255],
  darkBrown: [139, 69, 19],
  mediumBrown: [160, 82, 45],
  lightBrown: [210, 105, 30],
  black: [0, 0, 0],
}

type ColorName =
  | 'darkBlue'
  | 'mediumBlue'
  | 'lightBlue'
  | 'darkGray'
  | 'mediumGray'
  | 'lightGray'
  | 'veryLightGray'
  | 'extraLightGray'
  | 'darkRed'
  | 'mediumRed'
  | 'lightRed'
  | 'darkGreen'
  | 'mediumGreen'
  | 'lightGreen'
  | 'darkOrange'
  | 'mediumOrange'
  | 'lightOrange'
  | 'darkPurple'
  | 'mediumPurple'
  | 'lightPurple'
  | 'darkPink'
  | 'mediumPink'
  | 'lightPink'
  | 'darkYellow'
  | 'mediumYellow'
  | 'lightYellow'
  | 'darkCyan'
  | 'mediumCyan'
  | 'lightCyan'
  | 'darkBrown'
  | 'mediumBrown'
  | 'lightBrown'
  | 'black'

interface FinancialDataItem {
  [key: string]: any
}

interface FinancialData {
  [key: string]: FinancialDataItem[] | number[] | string[]
}

// Function to convert RGB to RGBA
function rgba(colorName: ColorName, opacity: number = 1): string {
  const color = colorPalette[colorName]
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
}

export default function useFinancials() {
  const globalChartRange = reactive({ start: 0, end: 12 })

  const filteredData = reactive(
    Object.entries(data).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc[key] = value.slice(globalChartRange.start, globalChartRange.end)
      } else {
        acc[key] = value
      }
      return acc
    }, {} as FinancialData),
  )

  // function updateGlobalRange(newRange: { start: number; end: number }): void {
  //   globalChartRange.start = newRange.start
  //   globalChartRange.end = newRange.end
  //   // Re-filter data when range changes
  // }

  const haveData = computed(() => !!filteredData && filteredData.months?.length > 0)

  const months = computed(() => filteredData?.months?.map((month: number) => `M${month}`) || [])

  console.log('data in composable:', filteredData)

  return {
    ...toRefs(filteredData),
    haveData,
    months,
    formatCurrency,
    formatNumber,
    formatStorage,
    updateGlobalRange: () => console.log('hi'),
    findLargestValue,
    rgba,
  }
}
