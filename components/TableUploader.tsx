'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface TableUploaderProps {
  onUploadComplete?: (tableId: string) => void;
}

export function TableUploader({ onUploadComplete }: TableUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const processFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error('Tabulka neobsahuje žádná data');
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const tableId = crypto.randomUUID();
      const filePath = `${userData.user.id}/${tableId}/data.json`;

      const { error: uploadError } = await supabase.storage
        .from('tables')
        .upload(filePath, JSON.stringify(jsonData));

      if (uploadError) throw uploadError;

      const { error: metadataError } = await supabase
        .from('tables')
        .insert([
          {
            id: tableId,
            name: file.name.replace(/\.[^/.]+$/, ''),
            user_id: userData.user.id,
            row_count: jsonData.length,
            columns: Object.keys(jsonData[0]),
          },
        ]);

      if (metadataError) throw metadataError;

      toast({
        title: 'Tabulka nahrána',
        description: `Soubor ${file.name} byl úspěšně nahrán`,
      });

      onUploadComplete?.(tableId);
      return tableId;
    } catch (error) {
      toast({
        title: 'Chyba při nahrávání',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    try {
      const file = acceptedFiles[0];
      await processFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <Card>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted'}
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Nahrávání souboru...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8" />
              {isDragActive ? (
                <p>Pusťte soubor pro nahrání</p>
              ) : (
                <>
                  <p className="font-medium">Klikněte nebo přetáhněte soubor</p>
                  <p className="text-sm text-muted-foreground">
                    Podporované formáty: XLSX, XLS, CSV
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
