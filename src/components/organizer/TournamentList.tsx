import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tournament, RegistrationStatus } from '../../types/database';
import { Badge } from '../common/Badge';
import { BrutalButton } from '../common/BrutalButton';
import {
  IconCopy,
  IconShare,
  IconUsers,
  IconCalendar,
  IconLocation,
  IconCheck,
} from '../common/Icons';
import { useToast } from '../common/Toast';
import { db } from '../../lib/db';

interface TournamentListProps {
  tournaments: Tournament[];
  onRefresh: () => void;
}

export const TournamentList: React.FC<TournamentListProps> = ({ tournaments, onRefresh }) => {
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playerCounts, setPlayerCounts] = useState<Record<string, number>>({});
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  // Load player counts for each tournament from the real database
  useEffect(() => {
    async function loadCounts() {
      const counts: Record<string, number> = {};
      for (const t of tournaments) {
        try {
          const players = await db.getPlayersByTournament(t.id);
          counts[t.id] = players.length;
        } catch {
          counts[t.id] = 0;
        }
      }
      setPlayerCounts(counts);
    }
    if (tournaments.length > 0) {
      loadCounts();
    }
  }, [tournaments]);

  const getFullRegistrationUrl = (t: Tournament) => {
    return `${window.location.origin}/register/${t.slug || t.id}`;
  };

  const handleCopyLink = async (t: Tournament) => {
    const url = getFullRegistrationUrl(t);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(t.id);
      showToast('Registration link copied to clipboard!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  const handleShareLink = async (t: Tournament) => {
    const url = getFullRegistrationUrl(t);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t.tournament_name} Registration`,
          text: `Register now for ${t.tournament_name} (${t.sport_type}) on ARENA AUCTIONS!`,
          url: url,
        });
        showToast('Shared successfully!', 'success');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyLink(t);
        }
      }
    } else {
      // Fallback to copy link
      handleCopyLink(t);
    }
  };

  const handleStatusChange = async (t: Tournament, newStatus: RegistrationStatus) => {
    try {
      setStatusUpdating(t.id);
      await db.updateTournamentStatus(t.id, newStatus);
      showToast(`Tournament status updated to ${newStatus}`, 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setStatusUpdating(null);
    }
  };

  if (tournaments.length === 0) {
    return (
      <div className="bg-cream-50 border-2 border-nearblack p-12 text-center shadow-brutal my-6">
        <div className="font-mono text-sm text-nearblack/60 uppercase mb-2">
          [NO TOURNAMENTS CONFIGURED]
        </div>
        <h3 className="font-display text-2xl uppercase tracking-tight text-nearblack mb-4">
          START YOUR FIRST TOURNAMENT
        </h3>
        <p className="font-sans text-sm text-nearblack/70 max-w-md mx-auto mb-6">
          Create a tournament for Cricket, Volleyball or Kabaddi to generate unique registration links and begin player intake.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-6">
      {tournaments.map((t) => {
        const count = playerCounts[t.id] ?? 0;
        const regUrl = getFullRegistrationUrl(t);

        return (
          <div
            key={t.id}
            className="bg-cream-50 border-2 border-nearblack p-6 sm:p-8 shadow-brutal transition-all hover:border-nearblack"
          >
            {/* Top row: Sport badge, Status badge, Date info */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b-2 border-nearblack/20">
              <div className="flex flex-wrap items-center gap-2">
                <Badge sport={t.sport_type} />
                <Badge status={t.registration_status} />
                <span className="font-mono text-xs font-bold text-nearblack/60 ml-2">
                  ID: {t.id.slice(0, 8)}
                </span>
              </div>

              {/* Status Changer Toggle */}
              <div className="flex items-center gap-2">
                <label className="font-mono text-xs font-bold uppercase text-nearblack/70 hidden sm:inline">
                  Status:
                </label>
                <select
                  disabled={statusUpdating === t.id}
                  value={t.registration_status}
                  onChange={(e) => handleStatusChange(t, e.target.value as RegistrationStatus)}
                  className="bg-cream border-2 border-nearblack font-mono text-xs font-bold py-1 px-2 cursor-pointer focus:outline-none"
                >
                  <option value="Active">Active (Open)</option>
                  <option value="Closed">Closed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Main Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <h3 className="font-display text-2xl sm:text-3xl text-nearblack uppercase tracking-tight mb-3">
                  {t.tournament_name}
                </h3>
                {t.description && (
                  <p className="font-sans text-sm text-nearblack/80 line-clamp-2 mb-4">
                    {t.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-xs font-mono font-bold text-nearblack/70">
                  <div className="flex items-center gap-1.5 bg-cream px-2.5 py-1 border border-nearblack">
                    <IconCalendar className="w-3.5 h-3.5 text-orange-accent" />
                    <span>EVENT: {new Date(t.tournament_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-cream px-2.5 py-1 border border-nearblack">
                    <IconCalendar className="w-3.5 h-3.5 text-red-brick" />
                    <span>DEADLINE: {new Date(t.registration_deadline).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-cream px-2.5 py-1 border border-nearblack">
                    <IconLocation className="w-3.5 h-3.5 text-blue-cobalt" />
                    <span>{t.location}</span>
                  </div>
                </div>
              </div>

              {/* Roster Metric Card */}
              <div className="bg-cream border-2 border-nearblack p-4 flex flex-col justify-between shadow-brutal-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-nearblack/70">
                    REGISTERED PLAYERS
                  </span>
                  <IconUsers className="w-4 h-4 text-orange-accent" />
                </div>
                <div className="font-display text-4xl text-nearblack my-2">
                  {count}
                </div>
                <Link
                  to={`/organizer/tournaments/${t.id}/players`}
                  className="font-mono text-xs font-bold uppercase py-2 px-3 bg-nearblack text-cream hover:bg-orange-accent transition-colors text-center border border-nearblack"
                >
                  MANAGE ROSTER ({count}) →
                </Link>
              </div>
            </div>

            {/* Public Registration Link Bar */}
            <div className="bg-cream border-2 border-nearblack p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-auto truncate font-mono text-xs">
                <span className="font-bold text-nearblack uppercase mr-2">[PUBLIC LINK]:</span>
                <span className="text-orange-accent select-all bg-cream-50 px-2 py-0.5 border border-nearblack/30">
                  {regUrl}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleCopyLink(t)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 font-mono text-xs font-bold uppercase px-3 py-2 bg-yellow-accent text-nearblack border-2 border-nearblack shadow-brutal-sm hover:bg-yellow-400 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                  title="Copy Registration Link"
                >
                  {copiedId === t.id ? (
                    <>
                      <IconCheck className="w-4 h-4" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="w-4 h-4" />
                      <span>COPY LINK</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleShareLink(t)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 font-mono text-xs font-bold uppercase px-3 py-2 bg-cream text-nearblack border-2 border-nearblack shadow-brutal-sm hover:bg-cream-200 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                  title="Share Registration Link"
                >
                  <IconShare className="w-4 h-4" />
                  <span>SHARE</span>
                </button>

                <a
                  href={`/register/${t.slug || t.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 font-mono text-xs font-bold uppercase px-3 py-2 bg-orange-accent text-cream border-2 border-nearblack shadow-brutal-sm hover:bg-orange-600 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                  title="Open Registration Page"
                >
                  <span>TEST FORM ↗</span>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
