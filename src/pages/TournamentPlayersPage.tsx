import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tournament, Player } from '../types/database';
import { OrganizerNavbar } from '../components/organizer/OrganizerNavbar';
import { PlayerManagementTable } from '../components/organizer/PlayerManagementTable';
import { Badge } from '../components/common/Badge';
import { IconArrowLeft, IconCalendar, IconLocation, IconShare } from '../components/common/Icons';
import { db } from '../lib/db';
import { useToast } from '../components/common/Toast';

export const TournamentPlayersPage: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const { showToast } = useToast();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTournamentAndPlayers = useCallback(async () => {
    if (!tournamentId) return;
    try {
      setLoading(true);
      setError(null);

      const t = await db.getTournamentByIdOrSlug(tournamentId);
      if (!t) {
        setError('Tournament not found in database.');
        return;
      }
      setTournament(t);

      const pList = await db.getPlayersByTournament(t.id);
      setPlayers(pList);
    } catch (err: any) {
      setError(err.message || 'Failed to load tournament roster.');
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    loadTournamentAndPlayers();
  }, [loadTournamentAndPlayers]);

  const handleShareLink = async () => {
    if (!tournament) return;
    const url = `${window.location.origin}/register/${tournament.slug || tournament.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: tournament.tournament_name,
          text: `Register for ${tournament.tournament_name}`,
          url,
        });
      } catch {
        // Fallback
        await navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard!', 'success');
      }
    } else {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <OrganizerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/organizer"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-nearblack hover:text-orange-accent"
          >
            <IconArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL TOURNAMENTS</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center font-mono text-xs font-bold text-nearblack/60 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-orange-accent border-t-transparent animate-spin" />
            <span>LOADING TOURNAMENT ROSTER...</span>
          </div>
        ) : error || !tournament ? (
          <div className="bg-red-brick text-cream border-2 border-nearblack p-8 text-center shadow-brutal font-mono">
            <h3 className="font-display text-2xl uppercase mb-2">ERROR</h3>
            <p>{error || 'Tournament not found'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tournament Header Bar */}
            <div className="bg-cream-50 border-2 border-nearblack p-6 sm:p-8 shadow-brutal">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Badge sport={tournament.sport_type} />
                  <Badge status={tournament.registration_status} />
                  <span className="font-mono text-xs font-bold text-nearblack/60 ml-2">
                    ID: {tournament.id.slice(0, 8)}
                  </span>
                </div>

                <button
                  onClick={handleShareLink}
                  className="font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream border-2 border-nearblack shadow-brutal-sm hover:bg-cream-200 cursor-pointer"
                >
                  <IconShare className="w-4 h-4" />
                  <span>SHARE REGISTRATION LINK</span>
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-nearblack mb-3">
                {tournament.tournament_name}
              </h1>

              {tournament.description && (
                <p className="font-sans text-sm text-nearblack/80 mb-4 max-w-3xl">
                  {tournament.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-xs font-mono font-bold text-nearblack/70 pt-4 border-t-2 border-nearblack/10">
                <div className="flex items-center gap-1.5 bg-cream px-2.5 py-1 border border-nearblack">
                  <IconCalendar className="w-3.5 h-3.5 text-orange-accent" />
                  <span>DATE: {new Date(tournament.tournament_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-cream px-2.5 py-1 border border-nearblack">
                  <IconCalendar className="w-3.5 h-3.5 text-red-brick" />
                  <span>DEADLINE: {new Date(tournament.registration_deadline).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-cream px-2.5 py-1 border border-nearblack">
                  <IconLocation className="w-3.5 h-3.5 text-blue-cobalt" />
                  <span>{tournament.location}</span>
                </div>
              </div>
            </div>

            {/* Roster and Card Operations */}
            <PlayerManagementTable
              tournament={tournament}
              players={players}
              onRefresh={loadTournamentAndPlayers}
            />
          </div>
        )}
      </main>
    </div>
  );
};
