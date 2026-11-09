import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrutalButton } from '../components/common/BrutalButton';
import { IconLock, IconArrowLeft } from '../components/common/Icons';
import { useToast } from '../components/common/Toast';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!passkey.trim()) {
      setErrorMessage('Please enter the organizer passkey.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(passkey);
      if (res.success) {
        showToast('Organizer authenticated successfully!', 'success');
        navigate('/organizer');
      } else {
        setErrorMessage(res.error || 'Invalid passkey. Access denied.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed.');
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

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
                ORGANIZER PASSKEY
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="ENTER PASSKEY..."
                className="w-full px-4 py-3 bg-cream border-2 border-nearblack font-mono text-base uppercase tracking-widest text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
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
                {loading ? 'VERIFYING PASSKEY...' : 'LOG IN TO DASHBOARD'}
              </BrutalButton>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-nearblack p-4 text-center font-mono text-xs text-nearblack/60">
        ORGANIZER AUTHORIZATION ONLY • STRICT PASSKEY ENFORCEMENT
      </footer>
    </div>
  );
};
