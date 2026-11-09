-- ARENA AUCTIONS: Production Supabase PostgreSQL Schema
-- Supports Cricket, Volleyball, Kabaddi tournaments & player management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TOURNAMENTS TABLE
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_name TEXT NOT NULL,
  sport_type TEXT NOT NULL CHECK (sport_type IN ('Cricket', 'Volleyball', 'Kabaddi')),
  tournament_date DATE NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  registration_status TEXT NOT NULL DEFAULT 'Active' CHECK (registration_status IN ('Active', 'Closed', 'Completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup by status and sport
CREATE INDEX IF NOT EXISTS idx_tournaments_sport ON public.tournaments(sport_type);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(registration_status);

-- 2. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  class TEXT NOT NULL,
  usn TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  profile_image_url TEXT NOT NULL,
  playing_role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_usn_per_tournament UNIQUE (tournament_id, usn)
);

-- Indexes for player search & filtering
CREATE INDEX IF NOT EXISTS idx_players_tournament ON public.players(tournament_id);
CREATE INDEX IF NOT EXISTS idx_players_role ON public.players(playing_role);
CREATE INDEX IF NOT EXISTS idx_players_usn ON public.players(usn);

-- 3. PROFILES TABLE (for organizers)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'organizer' CHECK (role IN ('organizer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Tournaments Policies:
-- Anyone can view tournaments (needed for public registration page)
CREATE POLICY "Public tournaments are viewable by everyone" 
  ON public.tournaments FOR SELECT 
  USING (true);

-- Only authenticated organizers can insert/update/delete tournaments
CREATE POLICY "Organizers can insert tournaments" 
  ON public.tournaments FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Organizers can update tournaments" 
  ON public.tournaments FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Organizers can delete tournaments" 
  ON public.tournaments FOR DELETE 
  TO authenticated 
  USING (true);

-- Players Policies:
-- Public can INSERT a player IF the tournament is Active and not past deadline
CREATE POLICY "Public players can register for active tournaments" 
  ON public.players FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tournaments t 
      WHERE t.id = tournament_id 
        AND t.registration_status = 'Active' 
        AND t.registration_deadline > now()
    )
  );

-- Only authenticated organizers can view all players
CREATE POLICY "Only organizers can view players" 
  ON public.players FOR SELECT 
  TO authenticated 
  USING (true);

-- Only authenticated organizers can delete/update players
CREATE POLICY "Organizers can update or delete players" 
  ON public.players FOR ALL 
  TO authenticated 
  USING (true);

-- Profiles Policies:
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- 5. STORAGE BUCKET CONFIGURATION (for player-photos)
-- Run in Supabase SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('player-photos', 'player-photos', true) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Public can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'player-photos');
-- CREATE POLICY "Public can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'player-photos');
