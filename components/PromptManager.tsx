'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

interface Prompt {
  id: string;
  name: string;
  content: string;
  created_at: string;
  user_id: string;
}

export function PromptManager() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const { data: promptsData, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPrompts(promptsData || []);
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

  const createPrompt = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('prompts')
        .insert([
          {
            name: newPromptName,
            content: newPromptContent,
            user_id: userData.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPrompts([data, ...prompts]);
      setNewPromptName('');
      setNewPromptContent('');
      setIsDialogOpen(false);
      
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

  const updatePrompt = async (prompt: Prompt) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .update({
          name: prompt.name,
          content: prompt.content,
        })
        .eq('id', prompt.id);

      if (error) throw error;

      setPrompts(prompts.map(p => (p.id === prompt.id ? prompt : p)));
      setEditingPrompt(null);
      setIsDialogOpen(false);

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

  const deletePrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrompts(prompts.filter(p => p.id !== id));
      
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrompt) {
      updatePrompt({
        ...editingPrompt,
        name: newPromptName,
        content: newPromptContent,
      });
    } else {
      createPrompt();
    }
  };

  const openEditDialog = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setNewPromptName(prompt.name);
    setNewPromptContent(prompt.content);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingPrompt(null);
    setNewPromptName('');
    setNewPromptContent('');
    setIsDialogOpen(true);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Správa promptů</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nový prompt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPrompt ? 'Upravit prompt' : 'Vytvořit nový prompt'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="promptName" className="text-sm font-medium">
                  Název promptu
                </label>
                <Input
                  id="promptName"
                  value={newPromptName}
                  onChange={(e) => setNewPromptName(e.target.value)}
                  placeholder="Např. SEO popis produktu"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="promptContent" className="text-sm font-medium">
                  Obsah promptu
                </label>
                <Textarea
                  id="promptContent"
                  value={newPromptContent}
                  onChange={(e) => setNewPromptContent(e.target.value)}
                  placeholder="Zadejte text promptu. Použijte {proměnná} pro dynamické hodnoty."
                  rows={5}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Zrušit
                </Button>
                <Button type="submit">
                  {editingPrompt ? 'Uložit změny' : 'Vytvořit prompt'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{prompt.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(prompt)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePrompt(prompt.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
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
