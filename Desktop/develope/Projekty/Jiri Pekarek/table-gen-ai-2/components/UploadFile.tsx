'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from '@/lib/supabase';

export function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Neplatný formát souboru",
          description: "Prosím nahrajte soubor ve formátu CSV nebo Excel",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Chyba",
        description: "Prosím vyberte soubor k nahrání",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('tables')
        .upload(fileName, file);

      if (error) throw error;

      toast({
        title: "Úspěch",
        description: "Soubor byl úspěšně nahrán",
      });
      setFile(null);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nastala chyba při nahrávání souboru",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nahrát tabulku</CardTitle>
        <CardDescription>
          Nahrajte CSV nebo Excel soubor s daty pro doplnění
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
          >
            {uploading ? "Nahrávání..." : "Nahrát"}
          </Button>
        </div>
        {file && (
          <p className="text-sm text-muted-foreground">
            Vybraný soubor: {file.name}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
