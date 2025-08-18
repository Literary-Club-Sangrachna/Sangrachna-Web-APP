-- Create events table for storing events data
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_url TEXT,
  registration_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poems table
CREATE TABLE public.poems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poem_likes table for anonymous likes
CREATE TABLE public.poem_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poem_id, ip_address)
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT,
  year TEXT,
  bio TEXT,
  email TEXT,
  linkedin_url TEXT,
  image_url TEXT,
  order_priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Events are publicly readable" ON public.events FOR SELECT USING (true);
CREATE POLICY "Poems are publicly readable" ON public.poems FOR SELECT USING (true);
CREATE POLICY "Team members are publicly readable" ON public.team_members FOR SELECT USING (true);

-- Create policies for poem likes (anonymous users can like)
CREATE POLICY "Anyone can view poem likes" ON public.poem_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert poem likes" ON public.poem_likes FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON public.poems FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle poem likes
CREATE OR REPLACE FUNCTION public.toggle_poem_like(poem_id_param UUID, ip_address_param TEXT)
RETURNS JSON AS $$
DECLARE
  existing_like_id UUID;
  current_likes_count INTEGER;
BEGIN
  -- Check if this IP already liked this poem
  SELECT id INTO existing_like_id 
  FROM public.poem_likes 
  WHERE poem_id = poem_id_param AND ip_address = ip_address_param;
  
  IF existing_like_id IS NOT NULL THEN
    -- Unlike: remove the like
    DELETE FROM public.poem_likes WHERE id = existing_like_id;
    UPDATE public.poems SET likes_count = likes_count - 1 WHERE id = poem_id_param;
  ELSE
    -- Like: add the like
    INSERT INTO public.poem_likes (poem_id, ip_address) VALUES (poem_id_param, ip_address_param);
    UPDATE public.poems SET likes_count = likes_count + 1 WHERE id = poem_id_param;
  END IF;
  
  -- Get updated likes count
  SELECT likes_count INTO current_likes_count FROM public.poems WHERE id = poem_id_param;
  
  RETURN json_build_object('likes_count', current_likes_count, 'user_liked', existing_like_id IS NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data
INSERT INTO public.events (title, description, date, location, registration_link) VALUES
('Anchoring Workshop', 'Professional anchoring and public speaking workshop for students to build confidence.', '2024-02-15 10:00:00+00', 'NIET Auditorium', 'https://forms.google.com/anchoring-workshop'),
('Kitabghar Launch Event', 'Launching our digital library initiative to promote reading culture among students.', '2024-01-20 14:00:00+00', 'NIET Library Hall', 'https://forms.google.com/kitabghar-launch'),
('Poetry Writing Workshop', 'Learn the art of poetry writing with experienced mentors and poets.', '2024-03-10 15:30:00+00', 'Conference Room 1', 'https://forms.google.com/poetry-workshop');

INSERT INTO public.poems (title, content, author) VALUES
('सपनों का सफर', 'हम लिखते हैं तो दुनिया को सुधारने के लिए,\nशब्दों की शक्ति से हम सपने बुनते हैं,\nकविता में छुपे हैं हमारे जज्बात,\nसंग्रचना के साथ हम आगे बढ़ते हैं।', 'अनिल शर्मा'),
('युवा आवाज', 'नई सुबह की किरणों के साथ,\nउठती है युवाओं की आवाज,\nकलम हमारी तलवार है,\nशब्द हमारे हथियार हैं।', 'प्रिया गुप्ता'),
('रचना की दुनिया', 'रचना की दुनिया में खो जाते हैं हम,\nकागज पर बिखेरते हैं अपने सपने,\nहर शब्द में छुपी है एक कहानी,\nसंग्रचना के माध्यम से व्यक्त करते हैं अपनी भावनाएं।', 'रोहित कुमार');

INSERT INTO public.team_members (name, position, department, year, bio, email, order_priority) VALUES
('आर्जुन शर्मा', 'President', 'Computer Science', 'Final Year', 'Leading the club with vision and passion for literary excellence.', 'president@sangrachna.niet.in', 1),
('प्रिया गुप्ता', 'Vice President', 'Electronics', 'Third Year', 'Coordinating events and fostering creative collaboration.', 'vp1@sangrachna.niet.in', 2),
('अंकित कुमार', 'Vice President', 'Information Technology', 'Third Year', 'Supporting organizational activities and student engagement.', 'vp2@sangrachna.niet.in', 3),
('रोहित कुमार', 'Head Coordinator', 'Information Technology', 'Final Year', 'Overseeing all club activities and coordination.', 'coordinator@sangrachna.niet.in', 4),
('अंजली सिंह', 'Content Manager', 'Management', 'Third Year', 'Managing all content creation and editorial work.', 'content@sangrachna.niet.in', 5),
('राहुल वर्मा', 'Anchoring Manager', 'Electronics', 'Second Year', 'Leading anchoring workshops and public speaking events.', 'anchoring@sangrachna.niet.in', 6),
('स्नेहा पाठक', 'Content Head 1', 'Computer Science', 'Third Year', 'Creating engaging content for digital platforms.', 'content1@sangrachna.niet.in', 7),
('विकास सिंह', 'Content Head 2', 'Management', 'Second Year', 'Developing creative content strategies.', 'content2@sangrachna.niet.in', 8),
('तनुजा शर्मा', 'Social Media Head 1', 'Electronics', 'Third Year', 'Managing social media presence and engagement.', 'social1@sangrachna.niet.in', 9),
('अमित कुमार', 'Social Media Head 2', 'Information Technology', 'Second Year', 'Creating social media content and campaigns.', 'social2@sangrachna.niet.in', 10),
('नेहा गुप्ता', 'Technical Head', 'Computer Science', 'Final Year', 'Managing technical aspects and digital infrastructure.', 'tech@sangrachna.niet.in', 11),
('अभिषेक पांडे', 'UI Head', 'Information Technology', 'Third Year', 'Designing user interfaces and visual content.', 'ui@sangrachna.niet.in', 12),
('कविता सिंह', 'Events Coordinator', 'Management', 'Second Year', 'Planning and organizing club events.', 'events@sangrachna.niet.in', 13),
('रवि कुमार', 'Photography Head', 'Electronics', 'Third Year', 'Capturing and documenting club activities.', 'photo@sangrachna.niet.in', 14),
('सुमित्रा देवी', 'Cultural Head', 'Management', 'Second Year', 'Organizing cultural activities and festivals.', 'cultural@sangrachna.niet.in', 15);