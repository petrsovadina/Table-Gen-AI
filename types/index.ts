export interface Column {
  id: string
  name: string
  type: "string" | "number" | "date" | "boolean" | "email"
}

export interface TableData {
  id: string
  [key: string]: string | number | boolean | Date
}

export interface Prompt {
  id: string
  name: string
  content: string
}

export interface Version {
  id: string
  name: string
  created_at: string
  columns: string
  data: string
}

export interface AIGenerationResult {
  id: string
  generatedText: string
}

export interface ValidationRule {
  columnId: string
  condition: (row: TableData) => boolean
  errorMessage: string
}

