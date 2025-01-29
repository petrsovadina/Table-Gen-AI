import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import type { Column, TableData, AIGenerationResult } from "@/types"

const BATCH_SIZE = 50

export async function generateDataWithAI(
  columns: Column[],
  data: TableData[],
  prompt: string,
): Promise<AIGenerationResult[]> {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

  if (!ANTHROPIC_API_KEY) {
    throw new Error("Chybí Anthropic API klíč. Zkontrolujte váš soubor .env.")
  }

  const batches = chunk(data, BATCH_SIZE)
  const results: AIGenerationResult[] = []

  for (const batch of batches) {
    const batchResults = await Promise.all(
      batch.map(async (row) => {
        const context = JSON.stringify(row)
        try {
          const { text } = await generateText({
            model: anthropic("claude-2"),
            prompt: `Context: ${context}\n\nPrompt: ${prompt}\n\nGenerated text:`,
            maxTokens: 1000,
            apiKey: ANTHROPIC_API_KEY,
          })
          return { id: row.id, generatedText: text }
        } catch (error) {
          console.error("Chyba při generování dat:", error)
          return { id: row.id, generatedText: "" }
        }
      }),
    )

    results.push(...batchResults)
  }

  return results
}

function chunk<T>(array: T[], size: number): T[][] {
  const chunked = []
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size))
  }
  return chunked
}

