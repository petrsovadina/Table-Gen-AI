import { type FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Prompt {
  id: string
  name: string
  content: string
}

interface PromptManagerProps {
  onSavePrompt: (prompt: Prompt) => void
  savedPrompts: Prompt[]
}

const PromptManager: FC<PromptManagerProps> = ({ onSavePrompt, savedPrompts }) => {
  const [promptName, setPromptName] = useState("")
  const [promptContent, setPromptContent] = useState("")

  const handleSavePrompt = () => {
    if (promptName && promptContent) {
      onSavePrompt({
        id: Date.now().toString(),
        name: promptName,
        content: promptContent,
      })
      setPromptName("")
      setPromptContent("")
    }
  }

  return (
    <div className="space-y-4">
      <Input placeholder="Název promptu" value={promptName} onChange={(e) => setPromptName(e.target.value)} />
      <Textarea placeholder="Obsah promptu" value={promptContent} onChange={(e) => setPromptContent(e.target.value)} />
      <Button onClick={handleSavePrompt}>Uložit prompt</Button>
      <div>
        <h3 className="font-bold mb-2">Uložené prompty:</h3>
        <ul>
          {savedPrompts.map((prompt) => (
            <li key={prompt.id}>{prompt.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PromptManager

