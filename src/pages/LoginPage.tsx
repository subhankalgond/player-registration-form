import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrutalButton } from '../components/common/BrutalButton';
import { IconLock, IconShield, IconArrowLeft } from '../components/common/Icons';
import { useToast } from '../components/common/Toast';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('organizer@arena.edu');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        showToast('Authorized organizer login successful!', 'success');
        navigate('/organizer');
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      {/* Top Bar */}
      <header className="border-b-2 border-nearblack bg-cream p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase hover:text-orange-accent">
            <IconArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </Link>
          <div className="font-display text-sm tracking-tight text-nearblack">
            ARENA AUCTIONS
          </div>
        </div>
      </header>

      {/* Main Login Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-cream-50 border-2 border-nearblack shadow-brutal-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-nearblack text-cream flex items-center justify-center border-2 border-nearblack shadow-brutal-sm">
              <IconLock className="w-6 h-6" />
            </div>
            <div className="font-mono text-xs font-bold text-orange-accent uppercase tracking-wider mb-1">
              [COMMAND RESTRICTED]
            </div>
            <h1 className="text-3xl font-display uppercase tracking-tight text-nearblack">
              ORGANIZER ACCESS
            </h1>
            <p className="font-sans text-xs text-nearblack/70 mt-1">
              Protected administrative portal for tournament management & roster exports.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-brick text-cream border-2 border-nearblack font-mono text-xs font-bold animate-in fade-in">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-1.5">
                ORGANIZER EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@arena.edu"
                className="w-full px-4 py-2.5 bg-cream border-2 border-nearblack font-sans text-sm text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-cream border-2 border-nearblack font-mono text-sm text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
              />
            </div>

            <div className="pt-2">
              <BrutalButton
                type="submit"
                variant="orange"
                size="md"
                fullWidth
                disabled={loading}
              >
                {loading ? 'AUTHENTICATING...' : 'LOG IN TO DASHBOARD'}
              </BrutalButton>
            </div>
          </form>

          {/* Organizer Credentials Hint */}
          <div className="mt-6 pt-4 border-t-2 border-nearblack/10 bg-cream p-3 border border-nearblack font-mono text-[11px] text-nearblack/80 space-y-1">
            <div className="flex items-center gap-1 font-bold text-nearblack">
              <IconShield className="w-3.5 h-3.5 text-orange-accent" />
              <span>DEFAULT AUTHORIZED ORGANIZER CREDENTIALS:</span>
            </div>
            <div>Email: <span className="font-bold text-nearblack">organizer@arena.edu</span></div>
            <div>Password: <span className="font-bold text-nearblack">Admin@123</span></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-nearblack p-4 text-center font-mono text-xs text-nearblack/60">
        NO PUBLIC REGISTRATION ALLOWED • ORGANIZER ACCOUNTS ONLY
      </footer>
    </div>
  );
};
