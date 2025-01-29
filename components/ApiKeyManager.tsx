'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function ApiKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Chyba",
        description: "API klíč nemůže být prázdný",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implementovat uložení API klíče do Supabase
      localStorage.setItem('anthropic_api_key', apiKey);
      toast({
        title: "Úspěch",
        description: "API klíč byl úspěšně uložen",
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nastala chyba při ukládání API klíče",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Klíč</CardTitle>
        <CardDescription>
          Zadejte váš Anthropic API klíč pro generování dat pomocí AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="password"
          placeholder="sk-ant-api03-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button onClick={handleSaveKey}>Uložit API klíč</Button>
      </CardContent>
    </Card>
  );
}
