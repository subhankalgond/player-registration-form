import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tournament, Player } from '../types/database';
import { RegistrationForm } from '../components/player/RegistrationForm';
import { ConfirmationScreen } from '../components/player/ConfirmationScreen';
import { IconArrowLeft, IconTrophy } from '../components/common/Icons';
import { db } from '../lib/db';

export const PlayerRegistrationPage: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registeredPlayer, setRegisteredPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTournament() {
      if (!slugOrId) return;
      try {
        setLoading(true);
        setError(null);
        const t = await db.getTournamentByIdOrSlug(slugOrId);
        if (!t) {
          setError('Tournament not found. Please verify the registration link with your organizer.');
        } else {
          setTournament(t);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load tournament information.');
      } finally {
        setLoading(false);
      }
    }

    fetchTournament();
  }, [slugOrId]);

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b-2 border-nearblack bg-cream p-4 sm:p-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-nearblack text-cream flex items-center justify-center font-display text-sm border-2 border-nearblack shadow-brutal-sm group-hover:bg-orange-accent transition-colors">
              A
            </div>
            <div className="font-display text-base tracking-tight text-nearblack">
              ARENA AUCTIONS
            </div>
          </Link>

          <div className="font-mono text-xs font-bold text-orange-accent uppercase hidden sm:block">
            [OFFICIAL ATHLETE REGISTRATION]
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="py-24 text-center font-mono text-xs font-bold text-nearblack/60 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-orange-accent border-t-transparent animate-spin" />
            <span>CONNECTING TO TOURNAMENT REGISTRATION ENGINE...</span>
          </div>
        ) : error || !tournament ? (
          <div className="max-w-md mx-auto my-16 bg-red-brick text-cream border-2 border-nearblack p-8 text-center shadow-brutal font-mono">
            <h2 className="font-display text-2xl uppercase mb-3">LINK INVALID</h2>
            <p className="text-sm opacity-90 mb-6">{error || 'Tournament not found.'}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase px-4 py-2 bg-cream text-nearblack border-2 border-nearblack shadow-brutal-sm hover:bg-cream-200"
            >
              <IconArrowLeft className="w-4 h-4" />
              <span>RETURN TO ARENA AUCTIONS</span>
            </Link>
          </div>
        ) : registeredPlayer ? (
          <ConfirmationScreen
            player={registeredPlayer}
            tournament={tournament}
            onRegisterAnother={() => setRegisteredPlayer(null)}
          />
        ) : (
          <RegistrationForm
            tournament={tournament}
            onSuccess={(player) => setRegisteredPlayer(player)}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t-2 border-nearblack p-4 text-center font-mono text-xs text-nearblack/60 bg-cream">
        COLLEGE SPORTS TOURNAMENT REGISTRATION PLATFORM • STRICT ROSTER VERIFICATION
      </footer>
    </div>
  );
};
