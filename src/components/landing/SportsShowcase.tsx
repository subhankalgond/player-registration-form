import React from 'react';
import { IconCricket, IconVolleyball, IconKabaddi } from '../common/Icons';

export const SportsShowcase: React.FC = () => {
  const sports = [
    {
      id: '01',
      name: 'CRICKET',
      tagline: 'STRATEGY • POWER • PRECISION',
      roles: ['Batsman', 'All-rounder', 'Bowler'],
      accentColor: 'bg-orange-accent',
      accentBorder: 'border-orange-accent',
      icon: <IconCricket className="w-8 h-8 text-cream" />,
      description:
        'From explosive power hitting to disciplined swing bowling. Manage comprehensive cricket rosters with role-specific verification and diamond-crease poster cards.',
      accentBadge: 'OVAL & PITCH',
    },
    {
      id: '02',
      name: 'VOLLEYBALL',
      tagline: 'VELOCITY • VERTICAL • DEFENSE',
      roles: ['Setter', 'Spiker', 'Libero', 'Blocker', 'All-rounder'],
      accentColor: 'bg-blue-cobalt',
      accentBorder: 'border-blue-cobalt',
      icon: <IconVolleyball className="w-8 h-8 text-cream" />,
      description:
        'Fast-paced aerial combat on the hardwood. Register setters, spikers, and defensive liberis with immediate court role assignment and high-resolution player badges.',
      accentBadge: 'HARDWOOD & NET',
    },
    {
      id: '03',
      name: 'KABADDI',
      tagline: 'STRENGTH • AGILITY • TENACITY',
      roles: ['Raider', 'Defender', 'All-rounder'],
      accentColor: 'bg-red-brick',
      accentBorder: 'border-red-brick',
      icon: <IconKabaddi className="w-8 h-8 text-cream" />,
      description:
        'Raw athletic combat on the mat. Process raiders and defensive corner chains with anti-duplicate USN verification and distressed combat-ready auction cards.',
      accentBadge: 'BAULK & MAT',
    },
  ];

  return (
    <section className="py-20 border-t-2 border-nearblack bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="font-mono text-xs font-bold text-orange-accent tracking-widest uppercase mb-2">
              [DISCIPLINES // 03 FORMATS]
            </div>
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight text-nearblack leading-none">
              THE TRIAD OF COMPETITION
            </h2>
          </div>
          <p className="font-mono text-sm max-w-md text-nearblack/80">
            Dedicated registration mechanics engineered specifically for each sport’s positional architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sports.map((sport) => (
            <div
              key={sport.id}
              className="bg-cream-50 border-2 border-nearblack p-8 shadow-brutal flex flex-col justify-between relative group hover:-translate-y-1 transition-transform duration-200"
            >
              {/* Sport Number and Badge */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-bold text-nearblack">
                    [{sport.id}]
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-1 bg-nearblack text-cream uppercase">
                    {sport.accentBadge}
                  </span>
                </div>

                {/* Sport Icon Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 ${sport.accentColor} border-2 border-nearblack shadow-brutal-sm`}>
                    {sport.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-3xl uppercase tracking-tight text-nearblack">
                      {sport.name}
                    </h3>
                    <div className="font-mono text-xs font-bold text-nearblack/60 tracking-wider">
                      {sport.tagline}
                    </div>
                  </div>
                </div>

                <p className="text-sm font-sans text-nearblack/80 my-6 leading-relaxed">
                  {sport.description}
                </p>
              </div>

              {/* Roles Section */}
              <div className="pt-6 border-t-2 border-nearblack/20">
                <div className="font-mono text-xs font-bold uppercase text-nearblack/60 mb-3">
                  Verified Playing Roles:
                </div>
                <div className="flex flex-wrap gap-2">
                  {sport.roles.map((role) => (
                    <span
                      key={role}
                      className="font-mono text-xs font-bold px-2.5 py-1 bg-cream border border-nearblack text-nearblack"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

