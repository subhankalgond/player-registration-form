import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player, Tournament } from '../../types/database';
import { IconCheck, IconTrophy, IconCalendar, IconLocation } from '../common/Icons';
import { Badge } from '../common/Badge';

interface ConfirmationScreenProps {
  player: Player;
  tournament: Tournament;
  onRegisterAnother?: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  player,
  tournament,
  onRegisterAnother,
}) => {
  useEffect(() => {
    // Athletic celebration confetti explosion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E66A32', '#F4D85A', '#B43C32', '#17191A', '#F1EFE8'],
      });
    } catch {
      // Ignored if canvas-confetti is not loaded
    }
  }, []);

  return (
    <div className="bg-cream-50 border-2 border-nearblack p-8 sm:p-12 shadow-brutal-lg max-w-2xl mx-auto my-8 text-center animate-in fade-in">
      {/* Success Badge */}
      <div className="w-16 h-16 mx-auto mb-6 bg-green-deep text-cream flex items-center justify-center border-2 border-nearblack shadow-brutal">
        <IconCheck className="w-10 h-10" />
      </div>

      <div className="font-mono text-xs font-bold text-orange-accent uppercase tracking-widest mb-2">
        [VERIFIED ENTRY SUBMISSION]
      </div>

      <h2 className="text-3xl sm:text-5xl font-display uppercase tracking-tight text-nearblack mb-4">
        REGISTRATION SUCCESSFUL!
      </h2>

      <p className="font-sans text-base text-nearblack/80 max-w-md mx-auto mb-8 leading-relaxed">
        Your registration has been submitted successfully. Thank you for participating in the tournament roster.
      </p>

      {/* Verified Details Card */}
      <div className="bg-cream border-2 border-nearblack p-6 text-left shadow-brutal-sm space-y-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-nearblack">
          <div>
            <div className="font-mono text-xs text-nearblack/60 uppercase">Tournament:</div>
            <div className="font-display text-lg text-nearblack uppercase">
              {tournament.tournament_name}
            </div>
          </div>
          <Badge sport={tournament.sport_type} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-2">
          <div>
            <div className="text-nearblack/60 uppercase">Player Name:</div>
            <div className="font-bold text-nearblack text-sm">{player.full_name}</div>
          </div>
          <div>
            <div className="text-nearblack/60 uppercase">Playing Role:</div>
            <div className="font-bold text-orange-accent text-sm">{player.playing_role}</div>
          </div>
          <div>
            <div className="text-nearblack/60 uppercase">USN:</div>
            <div className="font-bold text-nearblack text-sm">{player.usn}</div>
          </div>
          <div>
            <div className="text-nearblack/60 uppercase">Class:</div>
            <div className="font-bold text-nearblack text-sm">{player.class}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs font-mono text-nearblack/70 pt-2 border-t border-nearblack/10">
          <div className="flex items-center gap-1.5">
            <IconCalendar className="w-3.5 h-3.5" />
            <span>Event Date: {new Date(tournament.tournament_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconLocation className="w-3.5 h-3.5" />
            <span>{tournament.location}</span>
          </div>
        </div>
      </div>

      <div className="font-mono text-xs text-nearblack/60 max-w-sm mx-auto mb-6">
        Official player cards and auction roster portfolios will be generated directly by the tournament organizers.
      </div>

      {onRegisterAnother && (
        <button
          onClick={onRegisterAnother}
          className="font-mono text-xs font-bold uppercase py-2.5 px-6 bg-cream border-2 border-nearblack hover:bg-cream-200 cursor-pointer shadow-brutal-sm"
        >
          Submit Another Registration
        </button>
      )}
    </div>
  );
};

