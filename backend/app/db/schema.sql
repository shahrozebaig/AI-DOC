CREATE EXTENSION IF NOT EXISTS vector;
CREATE SCHEMA IF NOT EXISTS vecs;
CREATE TABLE IF NOT EXISTS vecs.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text,         
  metadata jsonb,        
  vec vector(384)        
);
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, 
  title text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role text CHECK (role IN ('user', 'assistant')),
  content text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE vecs.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own document chunks" 
ON vecs.documents FOR ALL 
TO authenticated 
USING ( (metadata->>'user_id')::uuid = auth.uid() );
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own sessions" 
ON public.chat_sessions FOR ALL 
TO authenticated 
USING ( auth.uid() = user_id );
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see messages in their own sessions" 
ON public.chat_messages FOR ALL 
TO authenticated 
USING ( 
  session_id IN (SELECT id FROM public.chat_sessions WHERE user_id = auth.uid()) 
);