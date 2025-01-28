import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { tableId, format, columns } = await request.json();

    // Načtení dat tabulky
    const { data: tableData } = await supabase.storage
      .from('tables')
      .download(`${tableId}/data.json`);

    if (!tableData) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    const jsonData = await tableData.json();

    // Filtrace sloupců, pokud jsou specifikovány
    const filteredData = columns
      ? jsonData.map((row: any) =>
          columns.reduce((acc: any, col: string) => {
            acc[col] = row[col];
            return acc;
          }, {})
        )
      : jsonData;

    // Export podle požadovaného formátu
    switch (format.toLowerCase()) {
      case 'csv': {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        
        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="export.csv"',
          },
        });
      }

      case 'xlsx': {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        
        const buffer = XLSX.write(workbook, {
          type: 'buffer',
          bookType: 'xlsx',
        });

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="export.xlsx"',
          },
        });
      }

      case 'json': {
        return NextResponse.json(filteredData, {
          headers: {
            'Content-Disposition': 'attachment; filename="export.json"',
          },
        });
      }

      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
