'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreVertical, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TableViewerProps {
  tableId: string;
  onColumnSelect?: (column: string) => void;
}

export function TableViewer({ tableId, onColumnSelect }: TableViewerProps) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    column: string;
    value: string;
  } | null>(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [showInvalidOnly, setShowInvalidOnly] = useState(false);

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    loadTableData();
  }, [tableId]);

  const loadTableData = async () => {
    try {
      const { data: tableData } = await supabase.storage
        .from('tables')
        .download(`${tableId}/data.json`);

      if (tableData) {
        const jsonData = await tableData.json();
        setData(jsonData);
        if (jsonData.length > 0) {
          setColumns(Object.keys(jsonData[0]));
        }
      }
    } catch (error) {
      toast({
        title: 'Chyba při načítání dat',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTableData = async (newData: any[]) => {
    try {
      const { error } = await supabase.storage
        .from('tables')
        .upload(`${tableId}/data.json`, JSON.stringify(newData), {
          upsert: true,
        });

      if (error) throw error;

      setData(newData);
    } catch (error) {
      toast({
        title: 'Chyba při ukládání dat',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    }
  };

  const handleCellEdit = (row: number, column: string, value: string) => {
    const newData = [...data];
    newData[row][column] = value;
    saveTableData(newData);
    setEditingCell(null);
  };

  const addColumn = async () => {
    if (!newColumnName) return;

    const newData = data.map(row => ({
      ...row,
      [newColumnName]: '',
    }));

    await saveTableData(newData);
    setColumns([...columns, newColumnName]);
    setNewColumnName('');
    setIsAddColumnDialogOpen(false);
  };

  const deleteColumn = async (column: string) => {
    const newData = data.map(row => {
      const { [column]: removed, ...rest } = row;
      return rest;
    });

    await saveTableData(newData);
    setColumns(columns.filter(c => c !== column));
  };

  const renameColumn = async (oldName: string, newName: string) => {
    const newData = data.map(row => {
      const { [oldName]: value, ...rest } = row;
      return {
        ...rest,
        [newName]: value,
      };
    });

    await saveTableData(newData);
    setColumns(columns.map(c => (c === oldName ? newName : c)));
  };

  const validateCell = (value: any): boolean => {
    // Zde můžete přidat vlastní validační logiku
    return value !== null && value !== undefined && value !== '';
  };

  const filteredData = useMemo(() => {
    if (!showInvalidOnly) return data;
    return data.filter(row =>
      Object.values(row).some(value => !validateCell(value))
    );
  }, [data, showInvalidOnly]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowInvalidOnly(!showInvalidOnly)}
        >
          {showInvalidOnly ? 'Zobrazit vše' : 'Zobrazit pouze neplatné'}
        </Button>

        <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Přidat sloupec
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Přidat nový sloupec</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Název sloupce"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddColumnDialogOpen(false)}
                >
                  Zrušit
                </Button>
                <Button onClick={addColumn}>Přidat</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>
                  <div className="flex items-center justify-between">
                    <span>{column}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => onColumnSelect?.(column)}
                        >
                          Generovat data
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const newName = prompt('Nový název sloupce:', column);
                            if (newName && newName !== column) {
                              renameColumn(column, newName);
                            }
                          }}
                        >
                          Přejmenovat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteColumn(column)}
                          className="text-red-600"
                        >
                          Smazat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.slice(0, 100).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell
                    key={`${rowIndex}-${column}`}
                    className={`${
                      !validateCell(row[column]) ? 'bg-red-50' : ''
                    }`}
                    onClick={() =>
                      setEditingCell({
                        row: rowIndex,
                        column,
                        value: row[column],
                      })
                    }
                  >
                    {editingCell?.row === rowIndex &&
                    editingCell?.column === column ? (
                      <Input
                        value={editingCell.value}
                        onChange={(e) =>
                          setEditingCell({
                            ...editingCell,
                            value: e.target.value,
                          })
                        }
                        onBlur={() =>
                          handleCellEdit(
                            rowIndex,
                            column,
                            editingCell.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellEdit(
                              rowIndex,
                              column,
                              editingCell.value
                            );
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      row[column]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
