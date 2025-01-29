import { type FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CSVImportProps {
  onImport: (columns: { id: string; name: string }[], data: Record<string, any>[]) => void
}

const CSVImport: FC<CSVImportProps> = ({ onImport }) => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setError(null)
    } else {
      setFile(null)
      setError("Prosím vyberte platný CSV soubor.")
    }
  }

  const handleImport = async () => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const lines = content.split("\n")
      const headers = lines[0].split(",").map((header) => header.trim())
      const columns = headers.map((header) => ({
        id: header.toLowerCase().replace(/\s+/g, "_"),
        name: header,
      }))

      const data = lines.slice(1).map((line) => {
        const values = line.split(",")
        return headers.reduce(
          (obj, header, index) => {
            obj[columns[index].id] = values[index]?.trim() || ""
            return obj
          },
          {} as Record<string, string>,
        )
      })

      onImport(columns, data)
    }

    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <Input type="file" accept=".csv" onChange={handleFileChange} />
      <Button onClick={handleImport} disabled={!file}>
        Importovat CSV
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Chyba</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default CSVImport

