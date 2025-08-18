-- Create books table for Kitabghar
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT,
  description TEXT,
  image_url TEXT,
  available_copies INTEGER NOT NULL DEFAULT 0,
  total_copies INTEGER NOT NULL DEFAULT 1,
  isbn TEXT,
  publication_year INTEGER,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to books
CREATE POLICY "Books are publicly readable" 
ON public.books 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert book data from the library website
INSERT INTO public.books (title, author, genre, image_url, available_copies, total_copies, is_featured, is_recommended) VALUES
('The Wicked King', 'Holly Black', 'Fantasy', 'https://imgs.search.brave.com/Ox7G_JWtZK16nQTulOoPPqDmzrr7K6Y1SBd7VdNZAg0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcz/Lm9kLWNkbi5jb20v/SW1hZ2VUeXBlLTEw/MC8wMDE3LTEvJTdC/OTc1NzY5QkEtOEI5/Ni00RkM4LUJGNjkt/QjdFRTJGQ0I5NDVC/JTdESW1nMTAwLmpw/Zw', 1, 2, true, true),
('The Queen of Nothing', 'Holly Black', 'Fantasy', 'https://m.media-amazon.com/images/I/718ZAnHUCKL.jpg', 1, 2, true, true),
('The Cruel Prince', 'Holly Black', 'Fantasy', 'https://imgs.search.brave.com/H_Kv6cBUvH9k7NGYMZuiEqVPRLAmoF7ceBrZjVJsQSc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93aWxk/YW5kdGhlc2FnZS5j/b20vY2RuL3Nob3Av/cHJvZHVjdHMvOTc4/MTQ3MTQwNzI3Ny5q/cGc_dj0xNzQwMzkz/NDQ2JndpZHRoPTE0/NDU', 1, 2, true, true),
('Twisted Love', 'Ana Huang', 'Romance', 'https://imgs.search.brave.com/KaocQ_0YWOJ61uYuzj70UvB9SLt4Ypvxwz3n7UbLj-I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzcxSEVkeFVReEtM/LmpwZw', 1, 2, true, true),
('The Locked Door', 'Freida McFadden', 'Thriller', 'https://imgs.search.brave.com/0lfxAKyVm5ucWjSXcp6bIk4brOIkw2uG80owBv1K0T4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFvOFItbW9BVEwu/anBn', 0, 1, false, false),
('Twisted Games', 'Ana Huang', 'Romance', 'https://imgs.search.brave.com/kU7lfMcSsS4bKBujz3msrNS6fhnB6uzYBsD2ob1RwKU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFvY2Q5OXdkeUwu/anBn', 0, 1, false, false),
('Twisted Hate', 'Ana Huang', 'Romance', 'https://m.media-amazon.com/images/I/619o9Ii2MIL.jpg', 1, 1, false, false),
('Twisted Lies', 'Ana Huang', 'Romance', 'https://imgs.search.brave.com/amq6ftYrgIRzBlTZEueXjqzhx0y_9Jh29ZqzVEryvSc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDE5Nkp1eHctRkwu/anBn', 1, 1, false, false),
('King of Wrath', 'Ana Huang', 'Romance', 'https://m.media-amazon.com/images/I/61PoSRJ68QL._UF1000%2C1000_QL80_.jpg', 1, 1, false, false),
('Good Girl, Bad Blood', 'Holly Jackson', 'Mystery', 'https://m.media-amazon.com/images/I/61Qfno5VlTL.jpg', 1, 1, false, false),
('As Good As Dead', 'Holly Jackson', 'Mystery', 'https://m.media-amazon.com/images/I/81%2BRRxlC32S._UF1000%2C1000_QL80_.jpg', 1, 1, false, false),
('Zero to One', 'Peter Thiel', 'Business', 'https://m.media-amazon.com/images/I/71uAI28kJuL.jpg', 1, 1, false, false);

-- Create book requests table
CREATE TABLE public.book_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  request_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for book requests
ALTER TABLE public.book_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for book requests
CREATE POLICY "Anyone can create book requests" 
ON public.book_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Book requests are publicly readable" 
ON public.book_requests 
FOR SELECT 
USING (true);

-- Create trigger for book requests timestamp updates
CREATE TRIGGER update_book_requests_updated_at
BEFORE UPDATE ON public.book_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();