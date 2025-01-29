import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'TableGenAI - Automatické doplňování dat pomocí AI',
  description: 'Automatické doplňování tabulkových dat pomocí umělé inteligence. Nahrajte tabulku, vyberte sloupce k doplnění a nechte AI udělat práci za vás.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}
