"use server"

import { anthropic } from "@ai-sdk/anthropic"
import { getSupabase } from "../../lib/supabase"
import { decrypt } from "../../utils/encryption"

const BATCH_SIZE = 50
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

if (!ANTHROPIC_API_KEY) {
  throw new Error("Chybí Anthropic API klíč. Zkontrolujte váš soubor .env.")
}

const client = anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export async function generateDataWithAI(columnId: string, rowIds: string[], prompt: string) {
  const batches = chunk(rowIds, BATCH_SIZE)
  const results = []
  const supabase = getSupabase()

  for (const batch of batches) {
    try {
      const { data: rowData, error } = await supabase.from("table_data").select("*").in("id", batch)

      if (error) throw error

      const batchResults = await Promise.all(
        rowData.map(async (row) => {
          const context = JSON.stringify(row)
          try {
            const completion = await client.messages.create({
              model: "claude-2",
              max_tokens: 1000,
              messages: [
                {
                  role: "user",
                  content: `Context: ${context}\n\nPrompt: ${prompt}\n\nGenerated text:`,
                }
              ],
            });
            return { id: row.id, generatedText: completion.content }
          } catch (error) {
            console.error("Chyba při generování dat:", error)
            return { id: row.id, generatedText: "" }
          }
        }),
      )

      results.push(...batchResults)

      const updates = batchResults.map((result) => ({
        id: result.id,
        [columnId]: result.generatedText,
      }))

      const { error: updateError } = await supabase.from("table_data").upsert(updates)

      if (updateError) throw updateError
    } catch (error) {
      console.error("Chyba při zpracování dávky:", error)
    }
  }

  return results
}

function chunk(array: any[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  )
}
