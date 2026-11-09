import JSZip from 'jszip';
import { Player, Tournament } from '../types/database';
import { generatePlayerCardCanvas } from './cardGenerator';

export async function downloadAllPlayerCardsZIP(
  players: Player[],
  tournament: Tournament,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  if (!players || players.length === 0) {
    throw new Error('No players found in this tournament to download.');
  }

  const zip = new JSZip();
  const folderName = `${tournament.tournament_name.replace(/[^a-zA-Z0-9-_]+/g, '_')}_PlayerCards`;
  const folder = zip.folder(folderName) || zip;

  const total = players.length;
  const usedFilenames = new Set<string>();

  for (let i = 0; i < total; i++) {
    const player = players[i];
    if (onProgress) {
      onProgress(i + 1, total);
    }

    try {
      const canvas = await generatePlayerCardCanvas(player, tournament.sport_type);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png', 1.0);
      });

      if (blob) {
        let baseName = `${player.full_name.trim().replace(/[^a-zA-Z0-9]+/g, '_')}_${tournament.sport_type}`;
        if (usedFilenames.has(baseName)) {
          baseName = `${baseName}_${player.usn.replace(/[^a-zA-Z0-9]+/g, '_')}`;
        }
        usedFilenames.add(baseName);

        const filename = `${baseName}.png`;
        folder.file(filename, blob);
      }
    } catch (err) {
      console.error(`Failed to generate card for player ${player.full_name}:`, err);
    }
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

