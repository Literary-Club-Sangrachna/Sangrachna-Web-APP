-- Create pendown_posts table for blog-style posts
CREATE TABLE public.pendown_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[]
);

-- Enable RLS
ALTER TABLE public.pendown_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Approved pendown posts are publicly readable" 
ON public.pendown_posts 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Anyone can submit pendown posts" 
ON public.pendown_posts 
FOR INSERT 
WITH CHECK (true);

-- Add approval status to poems (Share Your Voice)
ALTER TABLE public.poems 
ADD COLUMN status TEXT NOT NULL DEFAULT 'approved',
ADD COLUMN submitted_by_email TEXT,
ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add approval status to events
ALTER TABLE public.events 
ADD COLUMN status TEXT NOT NULL DEFAULT 'approved',
ADD COLUMN created_by TEXT;

-- Create trigger for pendown_posts timestamps
CREATE TRIGGER update_pendown_posts_updated_at
BEFORE UPDATE ON public.pendown_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_pendown_posts_status ON public.pendown_posts(status);
CREATE INDEX idx_poems_status ON public.poems(status);
CREATE INDEX idx_events_status ON public.events(status);