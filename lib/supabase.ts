import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Chybí Supabase environment proměnné');
}

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function createSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      db: {
        schema: 'public'
      }
    });
  }
  return supabaseInstance;
}

// Pomocná funkce pro retry logiku
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}

// Pomocné funkce pro práci s daty
export async function uploadTableData(
  tableId: string,
  data: any[],
  options?: { upsert?: boolean }
) {
  const supabase = createSupabaseClient();
  
  return withRetry(async () => {
    const { error } = await supabase.storage
      .from('tables')
      .upload(
        `${tableId}/data.json`,
        JSON.stringify(data),
        { upsert: options?.upsert ?? false }
      );
      
    if (error) throw error;
  });
}

export async function downloadTableData(tableId: string) {
  const supabase = createSupabaseClient();
  
  return withRetry(async () => {
    const { data, error } = await supabase.storage
      .from('tables')
      .download(`${tableId}/data.json`);
      
    if (error) throw error;
    
    return JSON.parse(await data.text());
  });
}

export async function deleteTableData(tableId: string) {
  const supabase = createSupabaseClient();
  
  return withRetry(async () => {
    const { error } = await supabase.storage
      .from('tables')
      .remove([`${tableId}/data.json`]);
      
    if (error) throw error;
  });
}

export default createSupabaseClient;
