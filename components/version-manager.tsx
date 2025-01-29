import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTableVersions, loadTableVersion, saveTableVersion } from "../../lib/supabase"

interface VersionManagerProps {
  columns: any[]
  data: any[]
  onLoadVersion: (columns: any[], data: any[]) => void
}

const VersionManager: React.FC<VersionManagerProps> = ({ columns, data, onLoadVersion }) => {
  const [versions, setVersions] = useState<{ id: string; created_at: string }[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  useEffect(() => {
    loadVersions()
  }, [])

  const loadVersions = async () => {
    const tableVersions = await getTableVersions()
    setVersions(tableVersions)
  }

  const handleSaveVersion = async () => {
    const savedVersion = await saveTableVersion(columns, data)
    if (savedVersion) {
      console.log("Verze tabulky byla úspěšně uložena.")
      loadVersions() // Aktualizace seznamu verzí
    }
  }

  const handleLoadVersion = async () => {
    if (selectedVersion) {
      const loadedVersion = await loadTableVersion(selectedVersion)
      if (loadedVersion) {
        onLoadVersion(loadedVersion.columns, loadedVersion.data)
      }
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Správa verzí</h2>
      <Button onClick={handleSaveVersion}>Uložit aktuální verzi</Button>
      <div className="flex space-x-2">
        <Select onValueChange={setSelectedVersion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vyberte verzi" />
          </SelectTrigger>
          <SelectContent>
            {versions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {new Date(version.created_at).toLocaleString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleLoadVersion} disabled={!selectedVersion}>
          Načíst vybranou verzi
        </Button>
      </div>
    </div>
  )
}

export default VersionManager

