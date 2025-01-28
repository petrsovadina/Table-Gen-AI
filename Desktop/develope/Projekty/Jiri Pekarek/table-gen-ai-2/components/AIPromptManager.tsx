'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Prompt {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface AIPromptManagerProps {
  onPromptSelect?: (prompt: Prompt) => void;
  selectedColumn?: string;
}

export function AIPromptManager({ onPromptSelect, selectedColumn }: AIPromptManagerProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editMode, setEditMode] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    loadPrompts();
  }, []);

  useEffect(() => {
    if (selectedColumn) {
      setNewPromptContent(prev => 
        prev.includes('{column}') 
          ? prev.replace('{column}', `{${selectedColumn}}`)
          : prev
      );
    }
  }, [selectedColumn]);

  const loadPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPrompts(data || []);
    } catch (error) {
      toast({
        title: 'Chyba při načítání promptů',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrompt = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert([
          {
            name: newPromptName,
            content: newPromptContent,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPrompts(prev => [data, ...prev]);
      setNewPromptName('');
      setNewPromptContent('');

      toast({
        title: 'Prompt vytvořen',
        description: 'Nový prompt byl úspěšně vytvořen',
      });
    } catch (error) {
      toast({
        title: 'Chyba při vytváření promptu',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePrompt = async () => {
    if (!selectedPrompt) return;

    try {
      const { error } = await supabase
        .from('prompts')
        .update({
          name: newPromptName,
          content: newPromptContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedPrompt.id);

      if (error) throw error;

      setPrompts(prev =>
        prev.map(p =>
          p.id === selectedPrompt.id
            ? {
                ...p,
                name: newPromptName,
                content: newPromptContent,
                updated_at: new Date().toISOString(),
              }
            : p
        )
      );

      setEditMode(false);
      setSelectedPrompt(null);
      setNewPromptName('');
      setNewPromptContent('');

      toast({
        title: 'Prompt aktualizován',
        description: 'Prompt byl úspěšně aktualizován',
      });
    } catch (error) {
      toast({
        title: 'Chyba při aktualizaci promptu',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);

      if (error) throw error;

      setPrompts(prev => prev.filter(p => p.id !== promptId));

      toast({
        title: 'Prompt smazán',
        description: 'Prompt byl úspěšně smazán',
      });
    } catch (error) {
      toast({
        title: 'Chyba při mazání promptu',
        description: error instanceof Error ? error.message : 'Neznámá chyba',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            {editMode ? 'Upravit prompt' : 'Vytvořit nový prompt'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Upravit prompt' : 'Vytvořit nový prompt'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promptName">Název promptu</Label>
              <Input
                id="promptName"
                value={newPromptName}
                onChange={(e) => setNewPromptName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promptContent">Obsah promptu</Label>
              <Textarea
                id="promptContent"
                value={newPromptContent}
                onChange={(e) => setNewPromptContent(e.target.value)}
                rows={5}
              />
              <p className="text-sm text-muted-foreground">
                Použijte {'{sloupec}'} pro odkaz na hodnotu ze sloupce
              </p>
            </div>
            <Button
              onClick={editMode ? handleUpdatePrompt : handleCreatePrompt}
              disabled={!newPromptName || !newPromptContent}
            >
              {editMode ? 'Uložit změny' : 'Vytvořit prompt'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <Card
            key={prompt.id}
            className={`cursor-pointer transition-colors ${
              selectedPrompt?.id === prompt.id ? 'border-primary' : ''
            }`}
            onClick={() => {
              setSelectedPrompt(prompt);
              onPromptSelect?.(prompt);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{prompt.name}</CardTitle>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditMode(true);
                      setSelectedPrompt(prompt);
                      setNewPromptName(prompt.name);
                      setNewPromptContent(prompt.content);
                    }}
                  >
                    Upravit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePrompt(prompt.id);
                    }}
                  >
                    Smazat
                  </Button>
                </div>
              </div>
              <CardDescription>
                Vytvořeno: {new Date(prompt.created_at).toLocaleDateString('cs')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {prompt.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
