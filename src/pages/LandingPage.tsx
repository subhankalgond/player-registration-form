import React from 'react';
import { Link } from 'react-router-dom';
import { Hero3D } from '../components/landing/Hero3D';
import { SportsShowcase } from '../components/landing/SportsShowcase';
import { BrutalButton } from '../components/common/BrutalButton';
import { IconArrowRight, IconLock, IconShield } from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-cream text-nearblack">
      {/* Top Navigation */}
      <header className="border-b-2 border-nearblack bg-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-nearblack text-cream flex items-center justify-center font-display text-xl border-2 border-nearblack shadow-brutal-sm">
              A
            </div>
            <div>
              <span className="font-display text-xl tracking-tight text-nearblack leading-none block">
                ARENA AUCTIONS
              </span>
              <span className="font-mono text-[10px] font-bold text-orange-accent tracking-widest uppercase block">
                SPORTS ROSTER PLATFORM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/organizer">
                <BrutalButton variant="orange" size="sm">
                  <span>ORGANIZER DASHBOARD</span>
                  <IconArrowRight className="w-4 h-4" />
                </BrutalButton>
              </Link>
            ) : (
              <Link to="/login">
                <BrutalButton variant="nearblack" size="sm">
                  <IconLock className="w-4 h-4" />
                  <span>ORGANIZER LOGIN</span>
                </BrutalButton>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b-2 border-nearblack overflow-hidden bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold px-3 py-1 bg-yellow-accent border-2 border-nearblack shadow-brutal-sm uppercase">
              <span className="w-2 h-2 bg-orange-accent animate-pulse" />
              <span>OFFICIAL TOURNAMENT REGISTRATION ENGINE</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display uppercase tracking-tight text-nearblack leading-[0.9]">
              THREE SPORTS.
              <br />
              <span className="text-orange-accent">ONE ARENA.</span>
            </h1>

            <p className="font-sans text-lg sm:text-xl text-nearblack/80 max-w-xl font-medium leading-relaxed">
              Discover the competition. Register your players. Build your tournament. Direct role assignment, duplicate USN protection, and automated 1080×1350 poster generation.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              {isAuthenticated ? (
                <Link to="/organizer">
                  <BrutalButton variant="orange" size="lg">
                    <span>ENTER ORGANIZER DASHBOARD</span>
                    <IconArrowRight className="w-5 h-5" />
                  </BrutalButton>
                </Link>
              ) : (
                <Link to="/login">
                  <BrutalButton variant="orange" size="lg">
                    <span>ORGANIZER ACCESS</span>
                    <IconArrowRight className="w-5 h-5" />
                  </BrutalButton>
                </Link>
              )}
            </div>

            {/* Quick Badges */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t-2 border-nearblack/20 font-mono text-xs font-bold text-nearblack/70">
              <div>
                <span className="text-orange-accent block text-sm">[01]</span>
                CRICKET
              </div>
              <div>
                <span className="text-blue-cobalt block text-sm">[02]</span>
                VOLLEYBALL
              </div>
              <div>
                <span className="text-red-brick block text-sm">[03]</span>
                KABADDI
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Sports Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full aspect-square border-2 border-nearblack bg-cream shadow-brutal-lg relative overflow-hidden flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 font-mono text-[11px] font-bold text-nearblack/50 z-20">
                [ARENA.3D // COMPOSITION]
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[11px] font-bold text-orange-accent z-20">
                • INTERACTIVE ROTATION
              </div>
              <Hero3D />
            </div>
          </div>
        </div>
      </section>

      {/* Triad of Competition Showcase */}
      <SportsShowcase />

      {/* Editorial Process Section */}
      <section className="py-20 bg-cream-50 border-b-2 border-nearblack">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-xs font-bold text-orange-accent uppercase tracking-widest mb-2">
            [ARCHITECTURE // WORKFLOW]
          </div>
          <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-nearblack mb-12">
            HOW ARENA AUCTIONS OPERATES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-cream border-2 border-nearblack p-6 shadow-brutal flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-bold text-orange-accent mb-4">
                  01 // CREATE
                </div>
                <h3 className="font-display text-xl uppercase tracking-tight text-nearblack mb-2">
                  CONFIGURE COMPETITION
                </h3>
                <p className="font-sans text-sm text-nearblack/80 leading-relaxed">
                  The organizer defines tournament dates, venue, and selects Cricket, Volleyball, or Kabaddi.
                </p>
              </div>
              <div className="font-mono text-xs font-bold text-nearblack/40 mt-6 pt-4 border-t border-nearblack/10">
                ORGANIZER CONTROL
              </div>
            </div>

            <div className="bg-cream border-2 border-nearblack p-6 shadow-brutal flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-bold text-orange-accent mb-4">
                  02 // SHARE
                </div>
                <h3 className="font-display text-xl uppercase tracking-tight text-nearblack mb-2">
                  DEDICATED URLS
                </h3>
                <p className="font-sans text-sm text-nearblack/80 leading-relaxed">
                  Unique public registration links are generated. Players only see their specific sport’s form.
                </p>
              </div>
              <div className="font-mono text-xs font-bold text-nearblack/40 mt-6 pt-4 border-t border-nearblack/10">
                ZERO-COLLISION LINKS
              </div>
            </div>

            <div className="bg-cream border-2 border-nearblack p-6 shadow-brutal flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-bold text-orange-accent mb-4">
                  03 // REGISTER
                </div>
                <h3 className="font-display text-xl uppercase tracking-tight text-nearblack mb-2">
                  INSTANT INTAKE
                </h3>
                <p className="font-sans text-sm text-nearblack/80 leading-relaxed">
                  Athletes upload photographs, enter USN, and select verified playing roles. No signups needed.
                </p>
              </div>
              <div className="font-mono text-xs font-bold text-nearblack/40 mt-6 pt-4 border-t border-nearblack/10">
                DUPLICATE USN GUARD
              </div>
            </div>

            <div className="bg-cream border-2 border-nearblack p-6 shadow-brutal flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-bold text-orange-accent mb-4">
                  04 // POSTERS
                </div>
                <h3 className="font-display text-xl uppercase tracking-tight text-nearblack mb-2">
                  1080×1350 PNG & ZIP
                </h3>
                <p className="font-sans text-sm text-nearblack/80 leading-relaxed">
                  Organizers export diamond-framed player posters individually or batch download all as a ZIP.
                </p>
              </div>
              <div className="font-mono text-xs font-bold text-nearblack/40 mt-6 pt-4 border-t border-nearblack/10">
                ORGANIZER EXCLUSIVE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Brutalist Footer */}
      <footer className="bg-nearblack text-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-accent text-cream flex items-center justify-center font-display text-lg">
              A
            </div>
            <div>
              <span className="font-display text-lg tracking-tight">ARENA AUCTIONS</span>
              <span className="block font-mono text-[10px] text-cream/60">
                COLLEGE SPORTS TOURNAMENT PLATFORM
              </span>
            </div>
          </div>

          <div className="font-mono text-xs text-cream/70 text-center sm:text-right">
            <span>ENGINEERED FOR PRODUCTION • CRICKET • VOLLEYBALL • KABADDI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

