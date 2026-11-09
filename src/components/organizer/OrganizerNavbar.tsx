import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconLogout, IconTrophy, IconShield } from '../common/Icons';

export const OrganizerNavbar: React.FC = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-cream border-b-2 border-nearblack sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/organizer" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-nearblack text-cream flex items-center justify-center font-display text-xl border-2 border-nearblack shadow-brutal-sm group-hover:bg-orange-accent transition-colors">
            A
          </div>
          <div>
            <div className="font-display text-lg tracking-tight text-nearblack leading-none">
              ARENA AUCTIONS
            </div>
            <div className="font-mono text-xs font-bold text-orange-accent uppercase tracking-wider">
              ORGANIZER COMMAND
            </div>
          </div>
        </Link>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs font-bold bg-yellow-accent px-3 py-1.5 border-2 border-nearblack shadow-brutal-sm">
            <IconShield className="w-4 h-4 text-nearblack" />
            <span>{userEmail || 'ORGANIZER'}</span>
          </div>

          <Link
            to="/organizer"
            className="hidden md:inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase px-3 py-2 border-2 border-nearblack bg-cream hover:bg-cream-200"
          >
            <IconTrophy className="w-4 h-4" />
            <span>TOURNAMENTS</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase px-3 py-2 bg-red-brick text-cream border-2 border-nearblack shadow-brutal-sm hover:bg-red-700 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
            title="Log Out"
          >
            <IconLogout className="w-4 h-4" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </div>
    </header>
  );
};
