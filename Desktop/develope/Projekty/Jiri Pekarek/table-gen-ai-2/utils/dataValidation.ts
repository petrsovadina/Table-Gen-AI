import { z } from "zod"
import type { Column, TableData } from "@/types"

export function validateData(data: TableData[], columns: Column[]) {
  const errors: Record<string, string[]> = {}

  columns.forEach((column) => {
    const columnErrors = data
      .map((row, index) => {
        try {
          validateCell(row[column.id], column)
          return null
        } catch (error) {
          return `Row ${index + 1}: ${error instanceof Error ? error.message : "Invalid data"}`
        }
      })
      .filter((error): error is string => error !== null)

    if (columnErrors.length > 0) {
      errors[column.id] = columnErrors
    }
  })

  return errors
}

function validateCell(value: any, column: Column) {
  const schema = getSchemaForColumn(column)
  schema.parse(value)
}

function getSchemaForColumn(column: Column) {
  switch (column.type) {
    case "string":
      return z.string()
    case "number":
      return z.number()
    case "date":
      return z.date()
    case "boolean":
      return z.boolean()
    case "email":
      return z.string().email()
    default:
      return z.any()
  }
}

export function validateDataAgainstRules(data: TableData[], rules: ValidationRule[]) {
  const errors: Record<string, string[]> = {}

  rules.forEach((rule) => {
    const columnErrors = data
      .map((row, index) => {
        try {
          if (!rule.condition(row)) {
            return `Row ${index + 1}: ${rule.errorMessage}`
          }
          return null
        } catch (error) {
          return `Row ${index + 1}: ${error instanceof Error ? error.message : "Invalid data"}`
        }
      })
      .filter((error): error is string => error !== null)

    if (columnErrors.length > 0) {
      errors[rule.columnId] = columnErrors
    }
  })

  return errors
}

export interface ValidationRule {
  columnId: string
  condition: (row: TableData) => boolean
  errorMessage: string
}

export function createValidationRule(
  columnId: string,
  condition: (value: any) => boolean,
  errorMessage: string,
): ValidationRule {
  return {
    columnId,
    condition: (row: TableData) => condition(row[columnId]),
    errorMessage,
  }
}

// Example usage:
// const rules = [
//   createValidationRule('age', (value) => value >= 18, 'Age must be 18 or older'),
//   createValidationRule('email', (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Invalid email format'),
// ]

