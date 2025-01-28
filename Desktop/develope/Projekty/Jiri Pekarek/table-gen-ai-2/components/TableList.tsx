'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { createClient } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

type TableFile = {
  name: string;
  created_at: string;
  size: number;
};

export function TableList() {
  const [tables, setTables] = useState<TableFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('tables')
        .list();

      if (error) throw error;

      setTables(data || []);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nastala chyba při načítání tabulek",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vaše tabulky</CardTitle>
        <CardDescription>
          Seznam vašich nahraných tabulek
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tables.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Zatím nemáte nahrané žádné tabulky
          </p>
        ) : (
          <div className="space-y-4">
            {tables.map((table) => (
              <div
                key={table.name}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{table.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Nahráno: {formatDate(table.created_at)}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatFileSize(table.size)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
