'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface AIGeneratorProps {
  tableId: string;
  promptId: string;
  targetColumn: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function AIGenerator({
  tableId,
  promptId,
  targetColumn,
  onProgress,
  onComplete,
  onError,
}: AIGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [processedRows, setProcessedRows] = useState(0);
  const [paused, setPaused] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    loadTableInfo();
  }, [tableId]);

  const loadTableInfo = async () => {
    try {
      const { data: tableData } = await supabase.storage
        .from('tables')
        .download(`${tableId}/data.json`);

      if (tableData) {
        const jsonData = await tableData.json();
        setTotalRows(jsonData.length);
      }
    } catch (error) {
      toast({
        title: 'Chyba při načítání dat',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    }
  };

  const generateBatch = async (rows: any[], batchSize: number = 10) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
          promptId,
          targetColumn,
          rows: rows.slice(0, batchSize),
        }),
      });

      if (!response.ok) {
        throw new Error('Chyba při generování dat');
      }

      const result = await response.json();
      return result.generatedData;
    } catch (error) {
      throw error;
    }
  };

  const startGeneration = async () => {
    setGenerating(true);
    setPaused(false);
    setProgress(0);
    setProcessedRows(0);

    try {
      const { data: tableData } = await supabase.storage
        .from('tables')
        .download(`${tableId}/data.json`);

      if (!tableData) {
        throw new Error('Data tabulky nenalezena');
      }

      const data = await tableData.json();
      const batchSize = 10;
      let processed = 0;

      for (let i = 0; i < data.length; i += batchSize) {
        if (paused) {
          break;
        }

        const batch = data.slice(i, i + batchSize);
        const generatedData = await generateBatch(batch, batchSize);

        // Aktualizace dat v tabulce
        batch.forEach((row: any, index: number) => {
          if (generatedData[index].success) {
            data[i + index][targetColumn] = generatedData[index].value;
          }
        });

        processed += batch.length;
        const currentProgress = Math.round((processed / data.length) * 100);
        setProgress(currentProgress);
        setProcessedRows(processed);
        onProgress?.(currentProgress);

        // Průběžné ukládání do Supabase
        await supabase.storage
          .from('tables')
          .upload(`${tableId}/data.json`, JSON.stringify(data), {
            upsert: true,
          });
      }

      if (!paused) {
        toast({
          title: 'Generování dokončeno',
          description: 'Všechna data byla úspěšně vygenerována',
        });
        onComplete?.();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
      toast({
        title: 'Chyba při generování',
        description: errorMessage,
        variant: 'destructive',
      });
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setGenerating(false);
    }
  };

  const togglePause = () => {
    setPaused(!paused);
    if (paused) {
      startGeneration();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generování dat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {generating ? (
          <>
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                Zpracováno {processedRows} z {totalRows} řádků ({progress}%)
              </p>
            </div>
            <Button
              className="w-full"
              onClick={togglePause}
              variant={paused ? 'default' : 'secondary'}
            >
              {paused ? 'Pokračovat' : 'Pozastavit'}
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            onClick={startGeneration}
            disabled={!tableId || !promptId || !targetColumn}
          >
            {progress === 100 ? 'Generovat znovu' : 'Spustit generování'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
