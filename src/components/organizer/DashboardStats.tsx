import React from 'react';
import { DashboardStatsData } from '../../types/database';
import { IconTrophy, IconUsers, IconCricket, IconVolleyball, IconKabaddi } from '../common/Icons';

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'TOTAL TOURNAMENTS',
      value: stats.totalTournaments,
      subtext: 'Configured competitions',
      icon: <IconTrophy className="w-5 h-5 text-cream" />,
      bgIcon: 'bg-nearblack',
      borderAccent: 'border-nearblack',
    },
    {
      label: 'REGISTERED PLAYERS',
      value: stats.totalPlayers,
      subtext: 'Roster entries across all sports',
      icon: <IconUsers className="w-5 h-5 text-cream" />,
      bgIcon: 'bg-orange-accent',
      borderAccent: 'border-orange-accent',
    },
    {
      label: 'CRICKET PLAYERS',
      value: stats.cricketRegistrations,
      subtext: 'Batsmen, bowlers & all-rounders',
      icon: <IconCricket className="w-5 h-5 text-cream" />,
      bgIcon: 'bg-orange-accent',
      borderAccent: 'border-orange-accent',
    },
    {
      label: 'VOLLEYBALL PLAYERS',
      value: stats.volleyballRegistrations,
      subtext: 'Setters, spikers & defense',
      icon: <IconVolleyball className="w-5 h-5 text-cream" />,
      bgIcon: 'bg-blue-cobalt',
      borderAccent: 'border-blue-cobalt',
    },
    {
      label: 'KABADDI PLAYERS',
      value: stats.kabaddiRegistrations,
      subtext: 'Raiders & defensive corners',
      icon: <IconKabaddi className="w-5 h-5 text-cream" />,
      bgIcon: 'bg-red-brick',
      borderAccent: 'border-red-brick',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-cream-50 border-2 border-nearblack p-5 shadow-brutal flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold text-nearblack/70 tracking-wider">
              {card.label}
            </span>
            <div className={`p-2 ${card.bgIcon} border border-nearblack`}>
              {card.icon}
            </div>
          </div>
          <div>
            <div className="font-display text-4xl text-nearblack tracking-tight leading-none mb-1">
              {card.value}
            </div>
            <div className="font-mono text-[11px] text-nearblack/60 truncate">
              {card.subtext}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
