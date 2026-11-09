import { supabase, isSupabaseConfigured } from './supabase';
import { Tournament, Player, DashboardStatsData, SportType } from '../types/database';

// IndexedDB Helper for local persistence of images & data
const DB_NAME = 'arena_auctions_local_db';
const DB_VERSION = 1;
const STORE_PLAYERS = 'players';
const STORE_TOURNAMENTS = 'tournaments';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_TOURNAMENTS)) {
        db.createObjectStore(STORE_TOURNAMENTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PLAYERS)) {
        const playerStore = db.createObjectStore(STORE_PLAYERS, { keyPath: 'id' });
        playerStore.createIndex('tournament_id', 'tournament_id', { unique: false });
        playerStore.createIndex('tournament_usn', ['tournament_id', 'usn'], { unique: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generate URL slug from tournament name and unique suffix
export function generateTournamentSlug(name: string, sport: SportType): string {
  const cleanName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const cleanSport = sport.toLowerCase();
  const shortId = Math.random().toString(36).substring(2, 7);
  return `${cleanSport}-${cleanName || 'tournament'}-${shortId}`;
}

export const db = {
  // ================= TOURNAMENTS =================
  async getTournaments(): Promise<Tournament[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Tournament[];
    }

    // Local IndexedDB fallback
    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_TOURNAMENTS, 'readonly');
      const store = tx.objectStore(STORE_TOURNAMENTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result || []) as Tournament[];
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async getTournamentByIdOrSlug(idOrSlug: string): Promise<Tournament | null> {
    if (isSupabaseConfigured() && supabase) {
      // Try ID or slug match
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      return (data as Tournament) || null;
    }

    const tournaments = await this.getTournaments();
    return (
      tournaments.find((t) => t.id === idOrSlug || t.slug === idOrSlug) || null
    );
  },

  async createTournament(
    tournamentData: Omit<Tournament, 'id' | 'slug' | 'created_at'>
  ): Promise<Tournament> {
    const slug = generateTournamentSlug(tournamentData.tournament_name, tournamentData.sport_type);
    const newTournament: Tournament = {
      ...tournamentData,
      id: crypto.randomUUID ? crypto.randomUUID() : 't_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      slug,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('tournaments')
        .insert([newTournament])
        .select()
        .single();
      if (error) throw error;
      return data as Tournament;
    }

    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_TOURNAMENTS, 'readwrite');
      const store = tx.objectStore(STORE_TOURNAMENTS);
      const req = store.add(newTournament);
      req.onsuccess = () => resolve(newTournament);
      req.onerror = () => reject(req.error);
    });
  },

  async updateTournamentStatus(id: string, status: Tournament['registration_status']): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('tournaments')
        .update({ registration_status: status })
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_TOURNAMENTS, 'readwrite');
      const store = tx.objectStore(STORE_TOURNAMENTS);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        if (!getReq.result) return reject(new Error('Tournament not found'));
        const updated = { ...getReq.result, registration_status: status };
        const putReq = store.put(updated);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  },

  // ================= PLAYERS =================
  async getPlayersByTournament(tournamentId: string): Promise<Player[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Player[];
    }

    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_PLAYERS, 'readonly');
      const store = tx.objectStore(STORE_PLAYERS);
      const index = store.index('tournament_id');
      const req = index.getAll(tournamentId);
      req.onsuccess = () => {
        const list = (req.result || []) as Player[];
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async getAllPlayers(): Promise<Player[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Player[];
    }

    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_PLAYERS, 'readonly');
      const store = tx.objectStore(STORE_PLAYERS);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []) as Player[]);
      req.onerror = () => reject(req.error);
    });
  },

  async checkDuplicateUSN(tournamentId: string, usn: string): Promise<boolean> {
    const formattedUsn = usn.trim().toUpperCase();
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('players')
        .select('id')
        .eq('tournament_id', tournamentId)
        .ilike('usn', formattedUsn)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      return Boolean(data);
    }

    const players = await this.getPlayersByTournament(tournamentId);
    return players.some((p) => p.usn.trim().toUpperCase() === formattedUsn);
  },

  async registerPlayer(
    playerData: Omit<Player, 'id' | 'created_at'>
  ): Promise<Player> {
    const tournament = await this.getTournamentByIdOrSlug(playerData.tournament_id);
    if (!tournament) {
      throw new Error('Tournament does not exist.');
    }

    if (tournament.registration_status !== 'Active') {
      throw new Error('Registrations for this tournament are currently closed.');
    }

    const deadline = new Date(tournament.registration_deadline);
    if (new Date() > deadline) {
      throw new Error('The registration deadline for this tournament has passed.');
    }

    // Check duplicate USN
    const isDuplicate = await this.checkDuplicateUSN(playerData.tournament_id, playerData.usn);
    if (isDuplicate) {
      throw new Error(`A player with USN "${playerData.usn.trim().toUpperCase()}" is already registered for this tournament.`);
    }

    const newPlayer: Player = {
      ...playerData,
      usn: playerData.usn.trim().toUpperCase(),
      id: crypto.randomUUID ? crypto.randomUUID() : 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('players')
        .insert([newPlayer])
        .select()
        .single();
      if (error) throw error;
      return data as Player;
    }

    const idb = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_PLAYERS, 'readwrite');
      const store = tx.objectStore(STORE_PLAYERS);
      const req = store.add(newPlayer);
      req.onsuccess = () => resolve(newPlayer);
      req.onerror = () => reject(req.error);
    });
  },

  // ================= DASHBOARD METRICS =================
  async getDashboardStats(): Promise<DashboardStatsData> {
    const tournaments = await this.getTournaments();
    const allPlayers = await this.getAllPlayers();

    let cricket = 0;
    let volleyball = 0;
    let kabaddi = 0;

    // Map tournament id to sport
    const sportMap = new Map<string, SportType>();
    tournaments.forEach((t) => sportMap.set(t.id, t.sport_type));

    allPlayers.forEach((p) => {
      const sport = sportMap.get(p.tournament_id);
      if (sport === 'Cricket') cricket++;
      else if (sport === 'Volleyball') volleyball++;
      else if (sport === 'Kabaddi') kabaddi++;
    });

    return {
      totalTournaments: tournaments.length,
      totalPlayers: allPlayers.length,
      cricketRegistrations: cricket,
      volleyballRegistrations: volleyball,
      kabaddiRegistrations: kabaddi,
    };
  },
};

