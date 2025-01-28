import type { TableData } from "@/types"

export function calculateColumnStatistics(data: TableData[], columnId: string) {
  const values = data.map((row) => Number.parseFloat(row[columnId])).filter((value) => !isNaN(value))

  const sum = values.reduce((acc, val) => acc + val, 0)
  const mean = sum / values.length
  const sortedValues = values.sort((a, b) => a - b)
  const median = sortedValues[Math.floor(sortedValues.length / 2)]
  const min = sortedValues[0]
  const max = sortedValues[sortedValues.length - 1]

  return { mean, median, min, max }
}

export function generateHistogramData(data: TableData[], columnId: string, bins = 10) {
  const values = data.map((row) => Number.parseFloat(row[columnId])).filter((value) => !isNaN(value))
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  const binSize = range / bins

  const histogram = Array(bins).fill(0)

  values.forEach((value) => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1)
    histogram[binIndex]++
  })

  return histogram.map((count, index) => ({
    binStart: min + index * binSize,
    binEnd: min + (index + 1) * binSize,
    count,
  }))
}

