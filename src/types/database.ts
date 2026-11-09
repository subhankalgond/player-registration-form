export type SportType = 'Cricket' | 'Volleyball' | 'Kabaddi';

export type CricketRole = 'Batsman' | 'All-rounder' | 'Bowler';
export type VolleyballRole = 'Setter' | 'Spiker' | 'Libero' | 'Blocker' | 'All-rounder';
export type KabaddiRole = 'Raider' | 'Defender' | 'All-rounder';

export type PlayingRole = CricketRole | VolleyballRole | KabaddiRole;

export type RegistrationStatus = 'Active' | 'Closed' | 'Completed';

export interface Tournament {
  id: string;
  slug: string;
  tournament_name: string;
  sport_type: SportType;
  tournament_date: string;
  registration_deadline: string;
  location: string;
  description: string;
  registration_status: RegistrationStatus;
  created_at: string;
}

export interface Player {
  id: string;
  tournament_id: string;
  full_name: string;
  class: string;
  usn: string;
  phone_number: string;
  profile_image_url: string; // Base64 or Supabase Storage URL
  playing_role: PlayingRole;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'organizer' | 'admin';
  created_at: string;
}

export interface DashboardStatsData {
  totalTournaments: number;
  totalPlayers: number;
  cricketRegistrations: number;
  volleyballRegistrations: number;
  kabaddiRegistrations: number;
}

export const SPORT_ROLES: Record<SportType, readonly string[]> = {
  Cricket: ['Batsman', 'All-rounder', 'Bowler'],
  Volleyball: ['Setter', 'Spiker', 'Libero', 'Blocker', 'All-rounder'],
  Kabaddi: ['Raider', 'Defender', 'All-rounder'],
} as const;
