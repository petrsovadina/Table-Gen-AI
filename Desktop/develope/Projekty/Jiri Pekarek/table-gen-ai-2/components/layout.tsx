import type { FC, ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: ReactNode
  onExport: () => void
}

const Layout: FC<LayoutProps> = ({ children, onExport }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TableGenAI</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={onExport}>
              Exportovat CSV
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

export default Layout

