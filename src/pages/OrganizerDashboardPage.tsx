import React, { useState, useEffect, useCallback } from 'react';
import { OrganizerNavbar } from '../components/organizer/OrganizerNavbar';
import { DashboardStats } from '../components/organizer/DashboardStats';
import { TournamentList } from '../components/organizer/TournamentList';
import { CreateTournamentModal } from '../components/organizer/CreateTournamentModal';
import { BrutalButton } from '../components/common/BrutalButton';
import { IconPlus } from '../components/common/Icons';
import { Tournament, DashboardStatsData } from '../types/database';
import { db } from '../lib/db';

export const OrganizerDashboardPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<DashboardStatsData>({
    totalTournaments: 0,
    totalPlayers: 0,
    cricketRegistrations: 0,
    volleyballRegistrations: 0,
    kabaddiRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [tList, st] = await Promise.all([
        db.getTournaments(),
        db.getDashboardStats(),
      ]);
      setTournaments(tList);
      setStats(st);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <OrganizerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title & Create Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-nearblack">
          <div>
            <div className="font-mono text-xs font-bold text-orange-accent uppercase tracking-widest mb-1">
              [MANAGEMENT // OVERVIEW]
            </div>
            <h1 className="text-3xl sm:text-5xl font-display uppercase tracking-tight text-nearblack">
              ORGANIZER DASHBOARD
            </h1>
          </div>

          <BrutalButton
            variant="orange"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0"
          >
            <IconPlus className="w-5 h-5" />
            <span>CREATE TOURNAMENT</span>
          </BrutalButton>
        </div>

        {/* Real Metrics Cards */}
        <DashboardStats stats={stats} />

        {/* Tournaments List Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between pb-4 border-b-2 border-nearblack">
            <div>
              <div className="font-mono text-xs font-bold text-nearblack/60 uppercase">
                [ACTIVE COMPETITIONS]
              </div>
              <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-nearblack">
                TOURNAMENT ROSTERS ({tournaments.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center font-mono text-xs font-bold text-nearblack/60 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-orange-accent border-t-transparent animate-spin" />
              <span>SYNCING TOURNAMENTS FROM DATABASE...</span>
            </div>
          ) : (
            <TournamentList tournaments={tournaments} onRefresh={loadData} />
          )}
        </div>
      </main>

      <CreateTournamentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={loadData}
      />
    </div>
  );
};
