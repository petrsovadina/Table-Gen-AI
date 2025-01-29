"use client"

import { type FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateDataWithAI } from "../actions/generate-data"

interface RightPanelProps {
  activeColumn: string | null
  selectedRows: number[]
  data: Record<string, any>[]
  onGenerateData: (columnId: string, rowIndex: number, generatedData: string) => void
  savedPrompts: Array<{ id: string; name: string; content: string }>
}

const RightPanel: FC<RightPanelProps> = ({ activeColumn, selectedRows, data, onGenerateData, savedPrompts }) => {
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerateData = async () => {
    if (!activeColumn || selectedRows.length === 0) return

    setIsGenerating(true)
    setProgress(0)

    const promptToUse = selectedPrompt ? savedPrompts.find((p) => p.id === selectedPrompt)?.content : customPrompt

    const rowIds = selectedRows.map((index) => data[index].id)
    const results = await generateDataWithAI(activeColumn, rowIds, promptToUse || "")

    results.forEach((result, index) => {
      const rowIndex = data.findIndex((row) => row.id === result.id)
      if (rowIndex !== -1) {
        onGenerateData(activeColumn, rowIndex, result.generatedText)
      }
      setProgress(((index + 1) / results.length) * 100)
    })

    setIsGenerating(false)
  }

  return (
    <div className="space-y-4">
      <div className="border p-4">
        <h2 className="text-xl font-bold mb-4">Prompt</h2>
        <Select onValueChange={setSelectedPrompt}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte uložený prompt" />
          </SelectTrigger>
          <SelectContent>
            {savedPrompts.map((prompt) => (
              <SelectItem key={prompt.id} value={prompt.id}>
                {prompt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          className="mt-4"
          placeholder="Nebo zadejte vlastní prompt..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
      </div>
      <div className="border p-4">
        <h2 className="text-xl font-bold mb-4">Generování</h2>
        <Button onClick={handleGenerateData} disabled={isGenerating || !activeColumn || selectedRows.length === 0}>
          {isGenerating ? "Generování..." : "Spustit hromadné generování"}
        </Button>
        {isGenerating && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-center mt-2">Generování dat... ({Math.round(progress)}% dokončeno)</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RightPanel

