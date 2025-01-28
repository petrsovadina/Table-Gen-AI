import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import pLimit from "p-limit"

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const CONCURRENT_REQUESTS = 5

export async function generateAIData(data: TableData[], prompt: string, columnId: string) {
  const limit = pLimit(CONCURRENT_REQUESTS)

  const tasks = data.map((row) => limit(() => generateSingleRow(row, prompt, columnId)))

  const results = await Promise.all(tasks)
  return results.filter((result): result is TableData => result !== null)
}

async function generateSingleRow(row: TableData, prompt: string, columnId: string): Promise<TableData | null> {
  try {
    const context = JSON.stringify(row)
    const { text } = await generateText({
      model: anthropic("claude-2"),
      prompt: `Context: ${context}\n\nPrompt: ${prompt}\n\nGenerated text:`,
      maxTokens: 1000,
      apiKey: ANTHROPIC_API_KEY,
    })
    return { ...row, [columnId]: text }
  } catch (error) {
    console.error("Error generating AI data:", error)
    return null
  }
}

