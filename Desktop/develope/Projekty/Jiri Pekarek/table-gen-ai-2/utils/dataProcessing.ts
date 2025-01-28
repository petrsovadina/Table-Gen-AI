import type { TableData } from "@/types"

export function processLargeDataset(data: TableData[], batchSize = 1000): TableData[] {
  const result: TableData[] = []

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    // Zde můžeme provést další zpracování pro každou dávku, pokud je potřeba
    result.push(...batch)
  }

  return result
}

export function memoizedSort(data: TableData[], sortBy: string, direction: "asc" | "desc"): TableData[] {
  const sortedData = [...data].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return direction === "asc" ? -1 : 1
    if (a[sortBy] > b[sortBy]) return direction === "asc" ? 1 : -1
    return 0
  })

  return sortedData
}

export function memoizedFilter(data: TableData[], filters: Record<string, string>): TableData[] {
  return data.filter((row) =>
    Object.entries(filters).every(([key, value]) => String(row[key]).toLowerCase().includes(value.toLowerCase())),
  )
}

