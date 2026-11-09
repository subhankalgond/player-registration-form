import React, { useState } from 'react';
import { Tournament, PlayingRole, SPORT_ROLES, Player } from '../../types/database';
import { PhotoUploader } from './PhotoUploader';
import { BrutalButton } from '../common/BrutalButton';
import { IconCalendar, IconLocation, IconLock, IconShield } from '../common/Icons';
import { Badge } from '../common/Badge';
import { db } from '../../lib/db';
import { useToast } from '../common/Toast';

interface RegistrationFormProps {
  tournament: Tournament;
  onSuccess: (player: Player) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  tournament,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [photo, setPhoto] = useState('');
  const [fullName, setFullName] = useState('');
  const [playerClass, setPlayerClass] = useState('');
  const [usn, setUsn] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<PlayingRole | ''>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check if tournament is active and not expired
  const isDeadlinePassed = new Date() > new Date(tournament.registration_deadline);
  const isClosed = tournament.registration_status !== 'Active' || isDeadlinePassed;

  const sportRoles = SPORT_ROLES[tournament.sport_type] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isClosed) {
      setErrorMessage('Registrations for this tournament are currently closed.');
      return;
    }

    if (!photo) {
      setErrorMessage('Please upload your photograph.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!playerClass.trim()) {
      setErrorMessage('Please enter your class/department.');
      return;
    }

    if (!usn.trim()) {
      setErrorMessage('Please enter your University Serial Number (USN).');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    if (!role) {
      setErrorMessage('Please select your playing role.');
      return;
    }

    try {
      setLoading(true);

      const registered = await db.registerPlayer({
        tournament_id: tournament.id,
        full_name: fullName.trim(),
        class: playerClass.trim(),
        usn: usn.trim(),
        phone_number: phone.trim(),
        profile_image_url: photo,
        playing_role: role as PlayingRole,
      });

      showToast('Registration submitted successfully!', 'success');
      onSuccess(registered);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      {/* Tournament Heading Banner */}
      <div className="bg-cream-50 border-2 border-nearblack p-6 sm:p-8 shadow-brutal mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Badge sport={tournament.sport_type} />
          <Badge status={isClosed ? 'Closed' : 'Active'} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-nearblack mb-3">
          {tournament.tournament_name}
        </h1>

        {tournament.description && (
          <p className="font-sans text-sm text-nearblack/80 mb-6 leading-relaxed">
            {tournament.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 font-mono text-xs font-bold text-nearblack/80 pt-4 border-t-2 border-nearblack/10">
          <div className="flex items-center gap-1.5 bg-cream px-3 py-1.5 border border-nearblack">
            <IconCalendar className="w-4 h-4 text-orange-accent" />
            <span>EVENT: {new Date(tournament.tournament_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-cream px-3 py-1.5 border border-nearblack">
            <IconCalendar className="w-4 h-4 text-red-brick" />
            <span>DEADLINE: {new Date(tournament.registration_deadline).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-cream px-3 py-1.5 border border-nearblack">
            <IconLocation className="w-4 h-4 text-blue-cobalt" />
            <span>{tournament.location}</span>
          </div>
        </div>
      </div>

      {/* Closed Notice or Form */}
      {isClosed ? (
        <div className="bg-red-brick text-cream border-2 border-nearblack p-8 text-center shadow-brutal font-mono">
          <IconLock className="w-8 h-8 mx-auto mb-3" />
          <h3 className="font-display text-2xl uppercase tracking-tight mb-2">
            REGISTRATIONS ARE CLOSED
          </h3>
          <p className="text-sm opacity-90 max-w-md mx-auto">
            {isDeadlinePassed
              ? 'The deadline for this tournament has passed. No further entries are being accepted.'
              : 'The tournament organizer has closed registrations for this competition.'}
          </p>
        </div>
      ) : (
        <div className="bg-cream-50 border-2 border-nearblack p-6 sm:p-8 shadow-brutal">
          <div className="flex items-center justify-between pb-4 border-b-2 border-nearblack mb-6">
            <div>
              <div className="font-mono text-xs font-bold text-orange-accent uppercase tracking-wider">
                [PLAYER ROSTER ENTRY]
              </div>
              <h2 className="text-2xl font-display uppercase tracking-tight text-nearblack">
                {tournament.sport_type} REGISTRATION
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-1 font-mono text-xs font-bold text-green-deep">
              <IconShield className="w-4 h-4" />
              <span>OFFICIAL ROSTER</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-brick text-cream border-2 border-nearblack font-mono text-xs font-bold animate-in fade-in">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Photograph Upload */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
                1. PLAYER PHOTOGRAPH *
              </label>
              <PhotoUploader value={photo} onChange={setPhoto} />
            </div>

            {/* Field 2: Full Name */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
                2. FULL NAME *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3 bg-cream border-2 border-nearblack font-sans text-base text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Field 3 & 4: Class & USN in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
                  3. CLASS / DEPARTMENT *
                </label>
                <input
                  type="text"
                  required
                  value={playerClass}
                  onChange={(e) => setPlayerClass(e.target.value)}
                  placeholder="e.g. 6th Sem CSE / Mechanical"
                  className="w-full px-4 py-3 bg-cream border-2 border-nearblack font-sans text-base text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
                  4. USN (COLLEGE ID) *
                </label>
                <input
                  type="text"
                  required
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  placeholder="e.g. 1RV22CS045"
                  className="w-full px-4 py-3 bg-cream border-2 border-nearblack font-mono text-base uppercase text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
                />
                <span className="block font-mono text-[11px] text-nearblack/60 mt-1">
                  Duplicate USN within this tournament will be rejected.
                </span>
              </div>
            </div>

            {/* Field 5: Phone Number */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
                5. PHONE NUMBER *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-3 bg-cream border-2 border-nearblack font-mono text-base text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Field 6: Sport-Specific Playing Role Selection */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
                6. SELECT PLAYING ROLE ({tournament.sport_type.toUpperCase()}) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sportRoles.map((r) => {
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r as PlayingRole)}
                      className={`py-3 px-4 border-2 border-nearblack font-mono text-xs sm:text-sm font-bold uppercase text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-nearblack text-cream shadow-brutal-sm scale-[1.02]'
                          : 'bg-cream text-nearblack hover:bg-cream-200'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t-2 border-nearblack">
              <BrutalButton
                type="submit"
                variant="orange"
                size="lg"
                fullWidth
                disabled={loading}
              >
                {loading ? 'VERIFYING & SUBMITTING...' : 'SUBMIT REGISTRATION'}
              </BrutalButton>
              <div className="font-mono text-center text-xs text-nearblack/60 mt-3">
                Your entry will be validated and forwarded to the tournament organizer.
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

