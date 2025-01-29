import { type FC, useState, useMemo } from "react"
import { FixedSizeList as List } from "react-window"
import { PlusCircle, ArrowUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Column {
  id: string
  name: string
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, any>[]
  onAddColumn: (columnName: string) => void
  onCellClick: (columnId: string, rowIndex: number) => void
  onCellEdit: (columnId: string, rowIndex: number, value: string) => void
  onRowSelect: (rowIndex: number, isSelected: boolean) => void
}

const DataTable: FC<DataTableProps> = ({ columns, data, onAddColumn, onCellClick, onCellEdit, onRowSelect }) => {
  const [activeColumn, setActiveColumn] = useState<string | null>(null)
  const [newColumnName, setNewColumnName] = useState("")
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
  const [editingCell, setEditingCell] = useState<{ columnId: string; rowIndex: number } | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterColumn, setFilterColumn] = useState<string | null>(null)
  const [filterValue, setFilterValue] = useState("")

  const handleColumnClick = (columnId: string) => {
    setActiveColumn(columnId)
  }

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      onAddColumn(newColumnName.trim())
      setNewColumnName("")
      setIsAddColumnOpen(false)
    }
  }

  const handleCellDoubleClick = (columnId: string, rowIndex: number) => {
    setEditingCell({ columnId, rowIndex })
  }

  const handleCellEdit = (columnId: string, rowIndex: number, value: string) => {
    onCellEdit(columnId, rowIndex, value)
    setEditingCell(null)
  }

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedData = useMemo(() => {
    let result = [...data]

    if (filterColumn && filterValue) {
      result = result.filter((row) => String(row[filterColumn]).toLowerCase().includes(filterValue.toLowerCase()))
    }

    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, filterColumn, filterValue, sortColumn, sortDirection])

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="flex">
      <div className="flex-shrink-0 w-10 flex items-center justify-center">
        <Checkbox
          checked={filteredAndSortedData[index].selected}
          onCheckedChange={(checked) => onRowSelect(data.indexOf(filteredAndSortedData[index]), checked as boolean)}
        />
      </div>
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-1 p-2 border-b border-r cursor-pointer hover:bg-gray-100"
          onClick={() => onCellClick(column.id, data.indexOf(filteredAndSortedData[index]))}
          onDoubleClick={() => handleCellDoubleClick(column.id, data.indexOf(filteredAndSortedData[index]))}
        >
          {editingCell?.columnId === column.id &&
          editingCell?.rowIndex === data.indexOf(filteredAndSortedData[index]) ? (
            <Input
              value={filteredAndSortedData[index][column.id]}
              onChange={(e) => handleCellEdit(column.id, data.indexOf(filteredAndSortedData[index]), e.target.value)}
              onBlur={() => setEditingCell(null)}
              autoFocus
            />
          ) : (
            filteredAndSortedData[index][column.id]
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <div className="flex border-b">
        <div className="flex-shrink-0 w-10"></div>
        {columns.map((column) => (
          <div
            key={column.id}
            className={`flex-1 p-2 border-r cursor-pointer ${
              activeColumn === column.id ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <span onClick={() => handleColumnClick(column.id)}>{column.name}</span>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={() => handleSort(column.id)}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                <Input
                  className="w-24 ml-2"
                  placeholder="Filtr"
                  value={filterColumn === column.id ? filterValue : ""}
                  onChange={(e) => {
                    setFilterColumn(column.id)
                    setFilterValue(e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex-shrink-0 w-10 flex items-center justify-center">
          <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Přidat nový sloupec</DialogTitle>
              </DialogHeader>
              <Input
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Název sloupce"
              />
              <Button onClick={handleAddColumn}>Přidat</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <List height={400} itemCount={filteredAndSortedData.length} itemSize={35} width="100%">
        {Row}
      </List>
    </div>
  )
}

export default DataTable

