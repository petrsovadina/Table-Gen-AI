import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Kontrola autentizace
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Načtení dat z požadavku
    const { tableId, promptId, targetColumn, rows } = await request.json();

    // Načtení promptu
    const { data: promptData, error: promptError } = await supabase
      .from('prompts')
      .select('content')
      .eq('id', promptId)
      .single();
      
    if (promptError || !promptData) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Generování hodnot pro každý řádek
    const generatedData = await Promise.all(
      rows.map(async (row: any) => {
        try {
          let promptText = promptData.content;

          // Nahrazení proměnných v promptu
          Object.entries(row).forEach(([key, value]) => {
            promptText = promptText.replace(
              new RegExp(`{${key}}`, 'g'),
              String(value)
            );
          });

          const response = await anthropic.messages.create({
            model: 'claude-3-opus-20240229',
            max_tokens: 1000,
            messages: [{ role: 'user', content: promptText }],
          });

          return {
            success: true,
            value: response.content[0].text,
          };
        } catch (error) {
          console.error('Error generating value:', error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    // Aktualizace tabulky s vygenerovanými daty
    const { data: tableData } = await supabase.storage
      .from('tables')
      .download(`${tableId}/data.json`);
      
    if (!tableData) {
      throw new Error('Data tabulky nenalezena');
    }

    const data = await tableData.json();
    
    // Aktualizace dat v tabulce
    rows.forEach((row, index) => {
      if (generatedData[index].success) {
        const rowIndex = data.findIndex((r: any) => 
          Object.entries(row).every(([key, value]) => r[key] === value)
        );
        if (rowIndex !== -1) {
          data[rowIndex][targetColumn] = generatedData[index].value;
        }
      }
    });

    // Uložení aktualizovaných dat
    await supabase.storage
      .from('tables')
      .upload(`${tableId}/data.json`, JSON.stringify(data), {
        upsert: true
      });

    return NextResponse.json({ 
      success: true,
      generatedData 
    });
  } catch (error) {
    console.error('Error generating data:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Neznámá chyba při generování dat' 
      },
      { status: 500 }
    );
  }
}
