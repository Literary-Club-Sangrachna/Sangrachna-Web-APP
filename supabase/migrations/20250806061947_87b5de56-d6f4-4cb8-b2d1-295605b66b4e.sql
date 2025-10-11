-- Create book_requests table for student book requests
CREATE TABLE public.book_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  mobile_no TEXT NOT NULL,
  email TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  preferred_due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'returned')),
  request_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.book_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for book requests
CREATE POLICY "Book requests are publicly readable" 
ON public.book_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create book requests" 
ON public.book_requests 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for timestamps
CREATE TRIGGER update_book_requests_updated_at
BEFORE UPDATE ON public.book_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();