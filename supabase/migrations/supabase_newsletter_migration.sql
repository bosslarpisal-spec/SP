-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id          bigserial PRIMARY KEY,
  email       text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (newsletter API uses service role key)
CREATE POLICY "service_role_only" ON public.newsletter_subscribers
  USING (false);
