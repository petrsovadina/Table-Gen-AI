-- Create tables for the application

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table_data table for storing processed tables
CREATE TABLE IF NOT EXISTS public.table_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    original_file_path TEXT NOT NULL,
    processed_data JSONB,
    status TEXT NOT NULL DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only see their own prompts"
    ON public.prompts
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prompts"
    ON public.prompts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts"
    ON public.prompts
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts"
    ON public.prompts
    FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own table data"
    ON public.table_data
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own table data"
    ON public.table_data
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own table data"
    ON public.table_data
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own table data"
    ON public.table_data
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS prompts_user_id_idx ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS table_data_user_id_idx ON public.table_data(user_id);
CREATE INDEX IF NOT EXISTS table_data_status_idx ON public.table_data(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON public.prompts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_table_data_updated_at
    BEFORE UPDATE ON public.table_data
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
