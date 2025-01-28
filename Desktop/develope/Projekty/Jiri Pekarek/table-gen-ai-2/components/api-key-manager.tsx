import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSupabase } from "../../lib/supabase"
import { encrypt, decrypt } from "../../utils/encryption"
import { validateApiKey } from "../../utils/api-validation"

const ApiKeyManager: React.FC = () => {
  const [apiKey, setApiKey] = useState("")
  const [savedKey, setSavedKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadApiKey()
  }, [])

  const loadApiKey = async () => {
    const supabase = getSupabase()
    if (!supabase) return

    try {
      const { data, error } = await supabase.from("user_settings").select("anthropic_api_key").single()

      if (error) throw error
      if (data && data.anthropic_api_key) {
        const decryptedKey = decrypt(data.anthropic_api_key)
        setSavedKey(decryptedKey)
      }
    } catch (error) {
      console.error("Chyba při načítání API klíče:", error)
    }
  }

  const handleSaveApiKey = async () => {
    setError(null)
    setIsValidating(true)

    try {
      const isValid = await validateApiKey(apiKey)
      if (!isValid) {
        setError("Neplatný API klíč. Prosím zkontrolujte a zkuste to znovu.")
        setIsValidating(false)
        return
      }

      const supabase = getSupabase()
      if (!supabase) throw new Error("Supabase není k dispozici")

      const encryptedKey = encrypt(apiKey)
      const { error } = await supabase.from("user_settings").upsert({ anthropic_api_key: encryptedKey })

      if (error) throw error
      setSavedKey(apiKey)
      setApiKey("")
      console.log("API klíč byl úspěšně uložen.")
    } catch (error) {
      console.error("Chyba při ukládání API klíče:", error)
      setError("Došlo k chybě při ukládání API klíče. Zkuste to prosím znovu.")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Správa API klíče</h2>
      <Input
        type="password"
        placeholder="Zadejte API klíč pro Anthropic Claude"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <Button onClick={handleSaveApiKey} disabled={isValidating}>
        {isValidating ? "Ověřování..." : "Uložit API klíč"}
      </Button>
      {savedKey && <p className="text-sm text-green-600">API klíč je uložen</p>}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Chyba</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default ApiKeyManager

