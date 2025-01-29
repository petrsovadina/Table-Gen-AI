import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || apiKey.trim() === "") {
    return false
  }

  try {
    const { text } = await generateText({
      model: anthropic("claude-2"),
      prompt: "Test API key validity",
      maxTokens: 5,
      apiKey: apiKey,
    })

    return true
  } catch (error) {
    console.error("Chyba při validaci API klíče:", error)
    return false
  }
}

