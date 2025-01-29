'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { TableUploader } from '@/components/TableUploader';
import { TableViewer } from '@/components/TableViewer';
import { PromptManager } from '@/components/PromptManager';
import { AIGenerator } from '@/components/AIGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Table {
  id: string;
  name: string;
  row_count: number;
  columns: string[];
  created_at: string;
}

export default function Dashboard() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const { data: tablesData, error } = await supabase
        .from('tables')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTables(tablesData || []);
    } catch (error) {
      toast({
        title: 'Chyba při načítání tabulek',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (tableId: string) => {
    loadTables();
    setSelectedTable(tableId);
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tables')
        .delete()
        .eq('id', tableId);

      if (deleteError) throw deleteError;

      setTables(tables.filter(t => t.id !== tableId));
      if (selectedTable === tableId) {
        setSelectedTable(null);
      }

      toast({
        title: 'Tabulka smazána',
        description: 'Tabulka byla úspěšně smazána',
      });
    } catch (error) {
      toast({
        title: 'Chyba při mazání tabulky',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">TableGenAI Dashboard</h1>
      </div>

      <Tabs defaultValue="tables">
        <TabsList>
          <TabsTrigger value="tables">Tabulky</TabsTrigger>
          <TabsTrigger value="prompts">Prompty</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-8">
          <TableUploader onUploadComplete={handleUploadComplete} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <Card
                key={table.id}
                className={`cursor-pointer transition-colors ${
                  selectedTable === table.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedTable(table.id)}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{table.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTable(table.id);
                      }}
                    >
                      Smazat
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {table.row_count} řádků
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {table.columns.length} sloupců
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTable && (
            <div className="space-y-8">
              <TableViewer
                tableId={selectedTable}
                onColumnSelect={setSelectedColumn}
              />

              {selectedColumn && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Generování dat pro sloupec: {selectedColumn}
                    </h3>
                    <AIGenerator
                      tableId={selectedTable}
                      promptId={selectedPrompt || ''}
                      targetColumn={selectedColumn}
                      onComplete={() => {
                        toast({
                          title: 'Generování dokončeno',
                          description: 'Data byla úspěšně vygenerována',
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prompts">
          <PromptManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
