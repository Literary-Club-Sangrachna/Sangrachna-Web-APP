-- Fix function search path issues for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix poem like function search path for security
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';