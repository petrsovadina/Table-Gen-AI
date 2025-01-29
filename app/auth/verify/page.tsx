'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Ověřte svůj email</CardTitle>
          <CardDescription>
            Poslali jsme vám email s potvrzovacím odkazem. Prosím klikněte na něj pro dokončení registrace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Zkontrolujte svou emailovou schránku a klikněte na potvrzovací odkaz.
            Pokud email nevidíte, podívejte se prosím i do složky se spamem.
          </p>
          
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/auth/login">
                Zpět na přihlášení
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
