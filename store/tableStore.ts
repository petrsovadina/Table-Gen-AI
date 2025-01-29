import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type TableState, type TableActions, Column, TableData, Prompt, Version } from "@/types"

const useTableStore = create<TableState & TableActions>()(
  persist(
    (set) => ({
      columns: [],
      data: [],
      prompts: [],
      versions: [],
      setColumns: (columns) => set({ columns }),
      setData: (data) => set({ data }),
      addPrompt: (prompt) => set((state) => ({ prompts: [...state.prompts, prompt] })),
      removePrompt: (id) => set((state) => ({ prompts: state.prompts.filter((p) => p.id !== id) })),
      addVersion: (version) => set((state) => ({ versions: [...state.versions, version] })),
      loadVersion: (id) =>
        set((state) => {
          const version = state.versions.find((v) => v.id === id)
          return version ? { columns: version.columns, data: version.data } : {}
        }),
      updateCell: (rowIndex, columnId, value) =>
        set((state) => ({
          data: state.data.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)),
        })),
    }),
    {
      name: "table-storage",
      getStorage: () => localStorage,
    },
  ),
)

export default useTableStore

