-- Allow admin operations on books table
CREATE POLICY "Enable all operations for admin" ON public.books
FOR ALL USING (true) WITH CHECK (true);

-- Allow admin operations on events table
CREATE POLICY "Enable all operations for admin on events" ON public.events
FOR ALL USING (true) WITH CHECK (true);

-- Allow admin operations on pendown_posts table
CREATE POLICY "Enable admin update and delete on pendown_posts" ON public.pendown_posts
FOR UPDATE USING (true);

CREATE POLICY "Enable admin delete on pendown_posts" ON public.pendown_posts
FOR DELETE USING (true);

-- Allow admin operations on poems table
CREATE POLICY "Enable all operations for admin on poems" ON public.poems
FOR ALL USING (true) WITH CHECK (true);

-- Allow admin operations on team_members table
CREATE POLICY "Enable all operations for admin on team_members" ON public.team_members
FOR ALL USING (true) WITH CHECK (true);

-- Allow admin operations on book_requests table
CREATE POLICY "Enable admin update on book_requests" ON public.book_requests
FOR UPDATE USING (true);

CREATE POLICY "Enable admin delete on book_requests" ON public.book_requests
FOR DELETE USING (true);