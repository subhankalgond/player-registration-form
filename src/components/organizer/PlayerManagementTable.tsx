import React, { useState, useMemo } from 'react';
import { Player, Tournament, SPORT_ROLES } from '../../types/database';
import { BrutalButton } from '../common/BrutalButton';
import {
  IconSearch,
  IconDownload,
  IconEye,
  IconUsers,
} from '../common/Icons';
import { useToast } from '../common/Toast';
import { downloadPlayerCardPNG } from '../../lib/cardGenerator';
import { downloadAllPlayerCardsZIP } from '../../lib/zipDownloader';
import { PlayerCardPreviewModal } from './PlayerCardPreviewModal';

interface PlayerManagementTableProps {
  tournament: Tournament;
  players: Player[];
  onRefresh: () => void;
}

export const PlayerManagementTable: React.FC<PlayerManagementTableProps> = ({
  tournament,
  players,
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [downloadingSingleId, setDownloadingSingleId] = useState<string | null>(null);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number } | null>(null);

  // Selected player for preview modal
  const [previewPlayer, setPreviewPlayer] = useState<Player | null>(null);

  // Filter players based on search and role
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        player.full_name.toLowerCase().includes(q) ||
        player.usn.toLowerCase().includes(q) ||
        player.phone_number.toLowerCase().includes(q);

      const matchesRole = selectedRole === 'ALL' || player.playing_role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [players, searchQuery, selectedRole]);

  // Single card download handler
  const handleDownloadSingle = async (player: Player) => {
    try {
      setDownloadingSingleId(player.id);
      await downloadPlayerCardPNG(player, tournament.sport_type);
      showToast(`Card for ${player.full_name} downloaded!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Download failed.', 'error');
    } finally {
      setDownloadingSingleId(null);
    }
  };

  // Bulk ZIP download handler
  const handleDownloadBulk = async () => {
    if (players.length === 0) {
      showToast('No players to download.', 'error');
      return;
    }

    try {
      setBulkDownloading(true);
      setBulkProgress({ current: 0, total: players.length });

      await downloadAllPlayerCardsZIP(players, tournament, (current, total) => {
        setBulkProgress({ current, total });
      });

      showToast(`All ${players.length} player cards packaged into ZIP!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Bulk download failed.', 'error');
    } finally {
      setBulkDownloading(false);
      setBulkProgress(null);
    }
  };

  const availableRoles = SPORT_ROLES[tournament.sport_type] || [];

  return (
    <div className="space-y-6">
      {/* Top Action Bar: Search, Role Filter, Bulk Download Button */}
      <div className="bg-cream-50 border-2 border-nearblack p-4 sm:p-6 shadow-brutal flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-nearblack/50">
              <IconSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, USN, or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-cream border-2 border-nearblack font-mono text-xs sm:text-sm text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <label className="font-mono text-xs font-bold uppercase text-nearblack/70 whitespace-nowrap">
              Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-cream border-2 border-nearblack font-mono text-xs font-bold py-2 px-3 text-nearblack focus:outline-none cursor-pointer"
            >
              <option value="ALL">ALL ROLES ({players.length})</option>
              {availableRoles.map((role) => {
                const count = players.filter((p) => p.playing_role === role).length;
                return (
                  <option key={role} value={role}>
                    {role.toUpperCase()} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Bulk Download Action */}
        <div className="flex items-center gap-3">
          <BrutalButton
            variant="orange"
            size="md"
            onClick={handleDownloadBulk}
            disabled={bulkDownloading || players.length === 0}
            className="w-full lg:w-auto"
          >
            <IconDownload className="w-5 h-5" />
            <span>
              {bulkDownloading
                ? `PACKAGING (${bulkProgress?.current || 0}/${bulkProgress?.total || 0})...`
                : `DOWNLOAD ALL CARDS (${players.length} ZIP)`}
            </span>
          </BrutalButton>
        </div>
      </div>

      {/* Roster Table */}
      {filteredPlayers.length === 0 ? (
        <div className="bg-cream-50 border-2 border-nearblack p-12 text-center shadow-brutal">
          <div className="font-mono text-xs font-bold text-nearblack/60 uppercase mb-2">
            [ROSTER EMPTY]
          </div>
          <h4 className="font-display text-2xl uppercase tracking-tight text-nearblack mb-2">
            {players.length === 0 ? 'NO PLAYERS REGISTERED YET' : 'NO MATCHING PLAYERS'}
          </h4>
          <p className="font-sans text-sm text-nearblack/70 max-w-md mx-auto">
            {players.length === 0
              ? 'Share the unique registration link with participants to collect player entries.'
              : 'Try adjusting your search criteria or role filter.'}
          </p>
        </div>
      ) : (
        <div className="border-2 border-nearblack shadow-brutal bg-cream overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-nearblack text-cream font-mono text-xs uppercase tracking-wider border-b-2 border-nearblack">
                  <th className="py-3 px-4">PHOTO</th>
                  <th className="py-3 px-4">PLAYER NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">USN</th>
                  <th className="py-3 px-4">PHONE NUMBER</th>
                  <th className="py-3 px-4">ROLE</th>
                  <th className="py-3 px-4">REGISTERED</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-nearblack/10 font-sans text-sm">
                {filteredPlayers.map((player) => (
                  <tr key={player.id} className="hover:bg-cream-100 transition-colors">
                    {/* Photograph thumbnail */}
                    <td className="py-3 px-4">
                      <div
                        onClick={() => setPreviewPlayer(player)}
                        className="w-12 h-12 bg-nearblack border-2 border-nearblack overflow-hidden cursor-pointer hover:border-orange-accent transition-colors shadow-brutal-sm"
                        title="Click to preview poster card"
                      >
                        <img
                          src={player.profile_image_url}
                          alt={player.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-bold text-nearblack">
                      {player.full_name}
                    </td>

                    {/* Class */}
                    <td className="py-3 px-4 font-mono text-xs text-nearblack/80">
                      {player.class}
                    </td>

                    {/* USN */}
                    <td className="py-3 px-4 font-mono text-xs font-bold text-nearblack">
                      <span className="bg-cream-200 px-2 py-0.5 border border-nearblack/30">
                        {player.usn}
                      </span>
                    </td>

                    {/* Phone Number */}
                    <td className="py-3 px-4 font-mono text-xs text-nearblack/80">
                      {player.phone_number}
                    </td>

                    {/* Playing Role */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 bg-yellow-accent text-nearblack border border-nearblack">
                        {player.playing_role}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 font-mono text-xs text-nearblack/60">
                      {new Date(player.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewPlayer(player)}
                          className="p-1.5 bg-cream border border-nearblack hover:bg-cream-200 cursor-pointer shadow-brutal-sm"
                          title="Preview Card"
                        >
                          <IconEye className="w-4 h-4 text-nearblack" />
                        </button>

                        <button
                          onClick={() => handleDownloadSingle(player)}
                          disabled={downloadingSingleId === player.id}
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase py-1.5 px-3 bg-orange-accent text-cream border-2 border-nearblack shadow-brutal-sm hover:bg-orange-600 cursor-pointer active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50"
                        >
                          <IconDownload className="w-3.5 h-3.5" />
                          <span>
                            {downloadingSingleId === player.id ? 'GENERATING...' : 'CARD PNG'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y-2 divide-nearblack/10">
            {filteredPlayers.map((player) => (
              <div key={player.id} className="p-4 bg-cream-50 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setPreviewPlayer(player)}
                    className="w-14 h-14 bg-nearblack border-2 border-nearblack overflow-hidden flex-shrink-0 cursor-pointer shadow-brutal-sm"
                  >
                    <img
                      src={player.profile_image_url}
                      alt={player.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-nearblack text-base truncate">
                      {player.full_name}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs mt-0.5">
                      <span className="font-bold bg-cream-200 px-1.5 py-0.5 border border-nearblack/30">
                        {player.usn}
                      </span>
                      <span className="text-nearblack/70">{player.class}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-1 bg-yellow-accent text-nearblack border border-nearblack flex-shrink-0">
                    {player.playing_role}
                  </span>
                </div>

                <div className="flex items-center justify-between font-mono text-xs text-nearblack/70 pt-2 border-t border-nearblack/10">
                  <span>PHONE: {player.phone_number}</span>
                  <span>{new Date(player.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setPreviewPlayer(player)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 font-mono text-xs font-bold uppercase py-2 bg-cream border-2 border-nearblack shadow-brutal-sm hover:bg-cream-200 cursor-pointer"
                  >
                    <IconEye className="w-4 h-4" />
                    <span>PREVIEW</span>
                  </button>
                  <button
                    onClick={() => handleDownloadSingle(player)}
                    disabled={downloadingSingleId === player.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 font-mono text-xs font-bold uppercase py-2 bg-orange-accent text-cream border-2 border-nearblack shadow-brutal-sm hover:bg-orange-600 cursor-pointer disabled:opacity-50"
                  >
                    <IconDownload className="w-4 h-4" />
                    <span>
                      {downloadingSingleId === player.id ? 'GENERATING...' : 'CARD PNG'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Preview Modal */}
      <PlayerCardPreviewModal
        player={previewPlayer}
        sport={tournament.sport_type}
        isOpen={Boolean(previewPlayer)}
        onClose={() => setPreviewPlayer(null)}
      />
    </div>
  );
};

