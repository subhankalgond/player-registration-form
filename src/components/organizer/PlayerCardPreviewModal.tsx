import React, { useEffect, useRef, useState } from 'react';
import { Player, SportType } from '../../types/database';
import { generatePlayerCardCanvas, downloadPlayerCardPNG } from '../../lib/cardGenerator';
import { BrutalButton } from '../common/BrutalButton';
import { IconClose, IconDownload } from '../common/Icons';
import { useToast } from '../common/Toast';

interface PlayerCardPreviewModalProps {
  player: Player | null;
  sport: SportType;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerCardPreviewModal: React.FC<PlayerCardPreviewModalProps> = ({
  player,
  sport,
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !player) {
      setPreviewDataUrl(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    generatePlayerCardCanvas(player, sport)
      .then((canvas) => {
        if (isMounted) {
          setPreviewDataUrl(canvas.toDataURL('image/png'));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error generating card preview:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, player, sport]);

  if (!isOpen || !player) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadPlayerCardPNG(player, sport);
      showToast(`Card for ${player.full_name} downloaded!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Download failed.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Subtle 3D tilt interaction on mouse move over the card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;
    cardContainerRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardContainerRef.current) return;
    cardContainerRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nearblack/80 backdrop-blur-none animate-in fade-in">
      <div className="bg-cream border-2 border-nearblack shadow-brutal-lg max-w-2xl w-full p-6 max-h-[95vh] overflow-y-auto flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b-2 border-nearblack mb-4">
          <div>
            <div className="font-mono text-xs font-bold text-orange-accent uppercase tracking-wider">
              [AUCTION POSTER PREVIEW]
            </div>
            <h3 className="font-display text-2xl uppercase tracking-tight text-nearblack">
              {player.full_name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-nearblack bg-cream hover:bg-cream-200 cursor-pointer"
            aria-label="Close"
          >
            <IconClose className="w-5 h-5 text-nearblack" />
          </button>
        </div>

        {/* Card Viewport with 3D Tilt */}
        <div
          ref={cardContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative transition-transform duration-100 ease-out flex items-center justify-center my-2 max-w-xs sm:max-w-sm"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {loading ? (
            <div className="w-72 h-[360px] bg-cream-50 border-2 border-nearblack flex flex-col items-center justify-center font-mono text-xs font-bold gap-3">
              <div className="w-8 h-8 border-4 border-orange-accent border-t-transparent animate-spin" />
              <span>RENDERING 1080×1350 POSTER...</span>
            </div>
          ) : previewDataUrl ? (
            <img
              src={previewDataUrl}
              alt={`${player.full_name} Card`}
              className="w-full border-2 border-nearblack shadow-brutal"
            />
          ) : (
            <div className="text-red-brick font-mono text-sm">Failed to generate card.</div>
          )}
        </div>

        {/* Info Note & Actions */}
        <div className="w-full mt-4 pt-4 border-t-2 border-nearblack flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-xs text-nearblack/70">
            Target Resolution: <span className="font-bold text-nearblack">1080 × 1350 px (PNG)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <BrutalButton
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              CLOSE
            </BrutalButton>
            <BrutalButton
              variant="orange"
              size="sm"
              onClick={handleDownload}
              disabled={loading || downloading}
            >
              <IconDownload className="w-4 h-4" />
              <span>{downloading ? 'GENERATING...' : 'DOWNLOAD PNG'}</span>
            </BrutalButton>
          </div>
        </div>
      </div>
    </div>
  );
};

