import { useState, useCallback } from "react"

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error.message)
    } else if (typeof error === "string") {
      setError(error)
    } else {
      setError("Došlo k neočekávané chybě")
    }
    console.error(error)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}

