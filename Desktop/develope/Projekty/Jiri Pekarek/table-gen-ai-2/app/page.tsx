import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TableGenAI</h1>
          <nav className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/docs">Dokumentace</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/auth/login">Přihlásit se</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">
              Generujte data do tabulek pomocí AI
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Nahrajte tabulku, upravte její strukturu a nechte AI vygenerovat chybějící data. 
              Rychle, chytře a bez manuální práce.
            </p>
            
            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Nahrání tabulky</h3>
                  <p className="text-muted-foreground">
                    Jednoduše nahrajte CSV nebo Excel soubor a upravte jeho strukturu podle potřeby.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">AI Generování</h3>
                  <p className="text-muted-foreground">
                    Vyberte sloupce k doplnění a nechte AI vygenerovat chybějící data.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Export dat</h3>
                  <p className="text-muted-foreground">
                    Stáhněte si kompletní tabulku ve formátu CSV, XLSX nebo JSON.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/auth/login">
                  Začít zdarma
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/docs">
                  Zjistit více
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 TableGenAI. Všechna práva vyhrazena.</p>
        </div>
      </footer>
    </div>
  );
}
