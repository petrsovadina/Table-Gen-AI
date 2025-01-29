import type { TableData, Column, Version } from "@/types"

export function createVersion(columns: Column[], data: TableData[]): Version {
  return {
    id: Date.now().toString(),
    name: `Version ${Date.now()}`,
    timestamp: new Date().toISOString(),
    columns,
    data,
  }
}

export function restoreVersion(version: Version): { columns: Column[]; data: TableData[] } {
  return {
    columns: version.columns,
    data: version.data,
  }
}

