'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Download } from 'lucide-react';

interface TableExporterProps {
  tableId: string;
  columns: string[];
}

export function TableExporter({ tableId, columns }: TableExporterProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
          format: selectedFormat,
          columns: selectedColumns,
        }),
      });

      if (!response.ok) {
        throw new Error('Export selhal');
      }

      // Získání názvu souboru z hlavičky Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `export.${selectedFormat}`;

      // Stažení souboru
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsDialogOpen(false);
      toast({
        title: 'Export dokončen',
        description: `Soubor byl úspěšně exportován jako ${filename}`,
      });
    } catch (error) {
      toast({
        title: 'Chyba při exportu',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    }
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns(
      selectedColumns.includes(column)
        ? selectedColumns.filter((c) => c !== column)
        : [...selectedColumns, column]
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportovat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportovat tabulku</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Formát souboru</Label>
            <Select
              value={selectedFormat}
              onValueChange={setSelectedFormat}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vyberte sloupce k exportu</Label>
            <div className="grid grid-cols-2 gap-2">
              {columns.map((column) => (
                <div key={column} className="flex items-center space-x-2">
                  <Checkbox
                    id={column}
                    checked={selectedColumns.includes(column)}
                    onCheckedChange={() => toggleColumn(column)}
                  />
                  <Label htmlFor={column}>{column}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Zrušit
            </Button>
            <Button
              onClick={handleExport}
              disabled={selectedColumns.length === 0}
            >
              Exportovat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
