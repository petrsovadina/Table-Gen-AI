import { useQuery, useMutation, useQueryClient } from "react-query"
import { supabase } from "@/lib/supabase"
import type { TableData, Column } from "@/types"

export const useTableData = () => {
  return useQuery<TableData[], Error>("tableData", async () => {
    const { data, error } = await supabase.from("table_data").select("*")
    if (error) throw error
    return data
  })
}

export const useColumns = () => {
  return useQuery<Column[], Error>("columns", async () => {
    const { data, error } = await supabase.from("columns").select("*")
    if (error) throw error
    return data
  })
}

export const useUpdateCell = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ rowId, columnId, value }: { rowId: string; columnId: string; value: string }) => {
      const { data, error } = await supabase
        .from("table_data")
        .update({ [columnId]: value })
        .eq("id", rowId)
      if (error) throw error
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tableData")
      },
    },
  )
}

