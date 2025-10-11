-- Add missing columns to book_requests table
ALTER TABLE public.book_requests 
ADD COLUMN mobile_no TEXT,
ADD COLUMN academic_year TEXT,
ADD COLUMN roll_no TEXT,
ADD COLUMN preferred_due_date DATE;