import create from "zustand"
import { persist } from "zustand/middleware"

interface Column {
  id: string
  name: string
}

interface Prompt {
  id: string
  name: string
  content: string
}

interface Version {
  id: string
  name: string
  timestamp: string
  columns: Column[]
  data: any[]
}

interface State {
  columns: Column[]
  data: any[]
  prompts: Prompt[]
  versions: Version[]
  setColumns: (columns: Column[]) => void
  setData: (data: any[]) => void
  addPrompt: (prompt: Prompt) => void
  removePrompt: (id: string) => void
  addVersion: (version: Version) => void
  loadVersion: (id: string) => void
  updateCell: (rowIndex: number, columnId: string, value: string) => void
}

export const useStore = create<State>()(
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
          if (version) {
            return { columns: version.columns, data: version.data }
          }
          return {}
        }),
      updateCell: (rowIndex, columnId, value) =>
        set((state) => ({
          data: state.data.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)),
        })),
    }),
    {
      name: "table-gen-ai-storage",
    },
  ),
)

