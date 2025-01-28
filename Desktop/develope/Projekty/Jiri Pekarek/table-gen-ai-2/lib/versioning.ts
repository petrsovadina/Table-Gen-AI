import { supabase } from "./supabase"
import type { Column, TableData } from "@/types"

export async function saveTableVersion(columns: Column[], data: TableData[]) {
  try {
    const { data: savedVersion, error } = await supabase
      .from("table_versions")
      .insert({
        columns: JSON.stringify(columns),
        data: JSON.stringify(data),
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error
    return savedVersion[0]
  } catch (error) {
    console.error("Chyba při ukládání verze tabulky:", error)
    return null
  }
}

export async function getTableVersions() {
  try {
    const { data, error } = await supabase
      .from("table_versions")
      .select("id, created_at")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Chyba při načítání verzí tabulky:", error)
    return []
  }
}

export async function loadTableVersion(versionId: string) {
  try {
    const { data, error } = await supabase.from("table_versions").select("columns, data").eq("id", versionId).single()

    if (error) throw error
    return {
      columns: JSON.parse(data.columns),
      data: JSON.parse(data.data),
    }
  } catch (error) {
    console.error("Chyba při načítání verze tabulky:", error)
    return null
  }
}

