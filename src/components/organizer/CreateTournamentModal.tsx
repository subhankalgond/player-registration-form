import React, { useState } from 'react';
import { SportType } from '../../types/database';
import { BrutalButton } from '../common/BrutalButton';
import { IconClose, IconCricket, IconVolleyball, IconKabaddi } from '../common/Icons';
import { useToast } from '../common/Toast';
import { db } from '../../lib/db';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [sport, setSport] = useState<SportType>('Cricket');
  const [date, setDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Tournament name is required.');
      return;
    }
    if (!date) {
      setErrorMessage('Tournament date is required.');
      return;
    }
    if (!deadline) {
      setErrorMessage('Registration deadline is required.');
      return;
    }
    if (!location.trim()) {
      setErrorMessage('Tournament location is required.');
      return;
    }

    // Validate deadline before tournament date
    if (new Date(deadline) > new Date(date + 'T23:59:59')) {
      setErrorMessage('Registration deadline cannot be after the tournament date.');
      return;
    }

    try {
      setLoading(true);
      await db.createTournament({
        tournament_name: name.trim(),
        sport_type: sport,
        tournament_date: date,
        registration_deadline: new Date(deadline).toISOString(),
        location: location.trim(),
        description: description.trim(),
        registration_status: 'Active',
      });

      showToast(`Tournament "${name}" created successfully!`, 'success');
      onCreated();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create tournament.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nearblack/75 backdrop-blur-none animate-in fade-in">
      <div className="bg-cream border-2 border-nearblack shadow-brutal-lg max-w-xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-nearblack mb-6">
          <div>
            <div className="font-mono text-xs font-bold text-orange-accent uppercase tracking-wider">
              [NEW COMPETITION CONFIG]
            </div>
            <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-nearblack">
              CREATE TOURNAMENT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 border-2 border-nearblack bg-cream hover:bg-cream-200 cursor-pointer"
            aria-label="Close modal"
          >
            <IconClose className="w-5 h-5 text-nearblack" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-brick text-cream border-2 border-nearblack font-mono text-xs font-bold">
            ERROR: {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tournament Name */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
              1. TOURNAMENT NAME *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Inter-Collegiate Premier League 2026"
              className="w-full px-4 py-3 bg-cream-50 border-2 border-nearblack font-sans text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
            />
          </div>

          {/* Sport Selection */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
              2. SELECT SPORT *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Cricket', 'Volleyball', 'Kabaddi'] as SportType[]).map((s) => {
                const isSelected = sport === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSport(s)}
                    className={`py-3 px-3 border-2 border-nearblack font-display text-sm uppercase flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-nearblack text-cream shadow-brutal-sm'
                        : 'bg-cream-50 text-nearblack hover:bg-cream-200'
                    }`}
                  >
                    {s === 'Cricket' && <IconCricket className="w-5 h-5" />}
                    {s === 'Volleyball' && <IconVolleyball className="w-5 h-5" />}
                    {s === 'Kabaddi' && <IconKabaddi className="w-5 h-5" />}
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates: Tournament Date & Registration Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
                3. TOURNAMENT DATE *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-cream-50 border-2 border-nearblack font-mono text-sm text-nearblack focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
                4. REGISTRATION DEADLINE *
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 bg-cream-50 border-2 border-nearblack font-mono text-sm text-nearblack focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
              5. TOURNAMENT LOCATION *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. University Sports Complex, Main Grounds"
              className="w-full px-4 py-3 bg-cream-50 border-2 border-nearblack font-sans text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-nearblack mb-2">
              6. SHORT DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tournament format, eligibility requirements, rules..."
              className="w-full px-4 py-3 bg-cream-50 border-2 border-nearblack font-sans text-sm text-nearblack placeholder:text-nearblack/40 focus:outline-none focus:bg-white resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-nearblack">
            <BrutalButton
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              CANCEL
            </BrutalButton>
            <BrutalButton
              type="submit"
              variant="orange"
              size="md"
              disabled={loading}
            >
              {loading ? 'CREATING...' : 'PUBLISH TOURNAMENT'}
            </BrutalButton>
          </div>
        </form>
      </div>
    </div>
  );
};
