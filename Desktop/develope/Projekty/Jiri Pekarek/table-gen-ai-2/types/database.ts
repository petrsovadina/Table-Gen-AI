export interface Prompt {
  id: string;
  user_id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TableData {
  id: string;
  user_id: string;
  file_name: string;
  original_file_path: string;
  processed_data: {
    headers: string[];
    rows: any[][];
  };
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: Prompt;
        Insert: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Prompt, 'id'>>;
      };
      table_data: {
        Row: TableData;
        Insert: Omit<TableData, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TableData, 'id'>>;
      };
    };
  };
}
