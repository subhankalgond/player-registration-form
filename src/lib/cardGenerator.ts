import { Player, SportType } from '../types/database';

export interface CardGenerationOptions {
  player: Player;
  sport: SportType;
}

/**
 * Loads an image from a URL or base64 string
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));
    img.src = src;
  });
}

/**
 * Ensures custom fonts are loaded in document before rendering to canvas
 */
async function ensureFontsLoaded(): Promise<void> {
  try {
    if (document.fonts) {
      await Promise.all([
        document.fonts.load('bold 64px "Caveat"'),
        document.fonts.load('bold 48px "Archivo Black"'),
        document.fonts.load('bold 36px "Space Mono"'),
        document.fonts.load('bold 40px "IBM Plex Sans"'),
      ]);
    }
  } catch (e) {
    console.warn('Font loading check skipped:', e);
  }
}

/**
 * Generates the 1080 x 1350 sports poster player card onto an HTMLCanvasElement
 */
export async function generatePlayerCardCanvas(
  player: Player,
  sport: SportType
): Promise<HTMLCanvasElement> {
  await ensureFontsLoaded();

  const width = 1080;
  const height = 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // ==========================================
  // 1. DISTRESSED CONCRETE BACKGROUND
  // ==========================================
  // Base concrete grey gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#2D3033');
  bgGrad.addColorStop(0.5, '#222527');
  bgGrad.addColorStop(1, '#17191A');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Concrete texture simulation: procedural grit, speckles, and brush scratches
  ctx.save();
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 60000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const sz = Math.random() * 2 + 0.5;
    ctx.fillStyle = Math.random() > 0.5 ? '#FFFFFF' : '#000000';
    ctx.fillRect(x, y, sz, sz);
  }

  // Concrete scratches / diagonal distress strokes
  ctx.globalAlpha = 0.04;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#FFFFFF';
  for (let i = 0; i < 45; i++) {
    ctx.beginPath();
    const sx = Math.random() * width;
    const sy = Math.random() * height;
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + (Math.random() - 0.5) * 200, sy + (Math.random() - 0.5) * 200);
    ctx.stroke();
  }
  ctx.restore();

  // Athletic vignette shadow
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, width * 0.25,
    width / 2, height / 2, width * 0.8
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(10,12,14,0.85)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // ==========================================
  // 2. SPORT-SPECIFIC BACKGROUND GRAPHICS
  // ==========================================
  ctx.save();
  if (sport === 'Cricket') {
    // Cricket themed graphics: seam textures, ball arc, bat silhouettes
    ctx.strokeStyle = 'rgba(230, 106, 50, 0.18)'; // Orange/sports red
    ctx.lineWidth = 4;
    // Ball arc
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.22, 220, 0, Math.PI * 2);
    ctx.stroke();

    // Seam curve
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.ellipse(width * 0.85, height * 0.22, 220, 90, Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Stumps / crease geometric lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(100, height - 160);
    ctx.lineTo(width - 100, height - 160);
    ctx.moveTo(220, height - 120);
    ctx.lineTo(width - 220, height - 120);
    ctx.stroke();

    // Subtle cricket bat silhouette in background
    ctx.save();
    ctx.translate(140, 320);
    ctx.rotate((-28 * Math.PI) / 180);
    ctx.fillStyle = 'rgba(244, 216, 90, 0.06)';
    ctx.fillRect(0, 0, 70, 480);
    ctx.fillStyle = 'rgba(230, 106, 50, 0.08)';
    ctx.fillRect(18, -140, 34, 150);
    ctx.restore();

  } else if (sport === 'Volleyball') {
    // Volleyball court grid & ball rotation curves
    ctx.strokeStyle = 'rgba(49, 91, 214, 0.2)'; // Cobalt accent
    ctx.lineWidth = 3;
    // Net grid lines in background
    for (let y = 140; y <= 380; y += 40) {
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(width - 60, y);
      ctx.stroke();
    }
    for (let x = 60; x <= width - 60; x += 55) {
      ctx.beginPath();
      ctx.moveTo(x, 140);
      ctx.lineTo(x, 380);
      ctx.stroke();
    }

    // Dynamic Volleyball arcs
    ctx.strokeStyle = 'rgba(244, 216, 90, 0.15)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.78, 260, 0, Math.PI * 2);
    ctx.stroke();

    // Diagonal court attack line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.65);
    ctx.lineTo(width, height * 0.45);
    ctx.stroke();

  } else if (sport === 'Kabaddi') {
    // Kabaddi baulk line, bonus line, court boundaries
    ctx.strokeStyle = 'rgba(230, 106, 50, 0.25)';
    ctx.lineWidth = 8;
    // Midline
    ctx.beginPath();
    ctx.moveTo(0, height * 0.35);
    ctx.lineTo(width, height * 0.35);
    ctx.stroke();

    // Baulk line
    ctx.strokeStyle = 'rgba(244, 216, 90, 0.2)';
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(0, height * 0.44);
    ctx.lineTo(width, height * 0.44);
    ctx.stroke();
    ctx.setLineDash([]);

    // Bonus line
    ctx.strokeStyle = 'rgba(180, 60, 50, 0.35)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.52);
    ctx.lineTo(width, height * 0.52);
    ctx.stroke();

    // High energy diagonal cuts
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 4;
    for (let i = -200; i < width + 400; i += 120) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 300, height);
      ctx.stroke();
    }
  }
  ctx.restore();

  // ==========================================
  // 3. STRONG RED AND WHITE DIAGONAL GEOMETRY
  // ==========================================
  ctx.save();
  // Upper-left high-energy diagonal wedge
  ctx.fillStyle = '#B43C32'; // Brick red
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(480, 0);
  ctx.lineTo(0, 360);
  ctx.closePath();
  ctx.fill();

  // Crisp white diagonal accent stripe
  ctx.fillStyle = '#F1EFE8'; // Warm cream/white
  ctx.beginPath();
  ctx.moveTo(480, 0);
  ctx.lineTo(540, 0);
  ctx.lineTo(0, 405);
  ctx.lineTo(0, 360);
  ctx.closePath();
  ctx.fill();

  // Thin orange highlight accent
  ctx.fillStyle = '#E66A32';
  ctx.beginPath();
  ctx.moveTo(540, 0);
  ctx.lineTo(565, 0);
  ctx.lineTo(0, 425);
  ctx.lineTo(0, 405);
  ctx.closePath();
  ctx.fill();

  // Bottom-right energetic diagonal cuts
  ctx.fillStyle = '#17191A';
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.lineTo(width - 550, height);
  ctx.lineTo(width, height - 420);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#B43C32';
  ctx.beginPath();
  ctx.moveTo(width, height - 380);
  ctx.lineTo(width - 490, height);
  ctx.lineTo(width - 530, height);
  ctx.lineTo(width, height - 410);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F1EFE8';
  ctx.beginPath();
  ctx.moveTo(width, height - 340);
  ctx.lineTo(width - 440, height);
  ctx.lineTo(width - 470, height);
  ctx.lineTo(width, height - 365);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // ==========================================
  // 4. PLAYER NAME IN HANDWRITTEN / SIGNATURE STYLE (TOP)
  // ==========================================
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Dynamic tournament header tag
  ctx.font = '700 24px "Space Mono", monospace';
  ctx.fillStyle = '#F4D85A'; // Pale yellow
  ctx.letterSpacing = '6px';
  ctx.fillText(`ARENA AUCTIONS • ${sport.toUpperCase()}`, width / 2, 85);

  // Handwritten player name at top
  // Draw stroke shadow first for strong contrast against grey & geometric shapes
  const displayName = player.full_name.trim();
  const fontSize = displayName.length > 18 ? 82 : displayName.length > 12 ? 96 : 112;
  ctx.font = `700 ${fontSize}px "Caveat", "Permanent Marker", cursive`;

  // Subtle angle tilt for energetic signature look (-3 deg)
  ctx.translate(width / 2, 175);
  ctx.rotate((-3.5 * Math.PI) / 180);

  // Dark drop shadow
  ctx.strokeStyle = '#17191A';
  ctx.lineWidth = 14;
  ctx.lineJoin = 'miter';
  ctx.strokeText(displayName, 0, 4);

  // Pure warm white handwritten signature text
  ctx.fillStyle = '#FAF8F4';
  ctx.fillText(displayName, 0, 0);

  ctx.restore();

  // ==========================================
  // 5. LARGE CENTRAL DIAMOND-SHAPED PLAYER PHOTOGRAPH
  // ==========================================
  const centerX = width / 2;
  const centerY = 575; // Perfectly balanced in center-upper canvas
  const diamondRadius = 310; // Half diagonal width/height (approx 620x620)

  // Outer framing diamond: Heavy Red Accent Diamond
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - diamondRadius - 28);
  ctx.lineTo(centerX + diamondRadius + 28, centerY);
  ctx.lineTo(centerX, centerY + diamondRadius + 28);
  ctx.lineTo(centerX - diamondRadius - 28, centerY);
  ctx.closePath();
  ctx.fillStyle = '#B43C32'; // Brick red
  ctx.fill();

  // Middle framing diamond: Crisp White Border
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - diamondRadius - 12);
  ctx.lineTo(centerX + diamondRadius + 12, centerY);
  ctx.lineTo(centerX, centerY + diamondRadius + 12);
  ctx.lineTo(centerX - diamondRadius - 12, centerY);
  ctx.closePath();
  ctx.fillStyle = '#F1EFE8'; // Crisp warm white
  ctx.fill();

  // Inner black background for image clip
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - diamondRadius);
  ctx.lineTo(centerX + diamondRadius, centerY);
  ctx.lineTo(centerX, centerY + diamondRadius);
  ctx.lineTo(centerX - diamondRadius, centerY);
  ctx.closePath();
  ctx.fillStyle = '#17191A';
  ctx.fill();

  // Clip into Diamond shape for Player Photo
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - diamondRadius);
  ctx.lineTo(centerX + diamondRadius, centerY);
  ctx.lineTo(centerX, centerY + diamondRadius);
  ctx.lineTo(centerX - diamondRadius, centerY);
  ctx.closePath();
  ctx.clip();

  // Load and draw actual player image
  try {
    const playerImg = await loadImage(player.profile_image_url);
    // Calculate aspect ratio cover inside the diamond bounding box
    const boxSize = diamondRadius * 2;
    const imgRatio = playerImg.width / playerImg.height;
    let renderW = boxSize;
    let renderH = boxSize;

    if (imgRatio > 1) {
      renderH = boxSize;
      renderW = boxSize * imgRatio;
    } else {
      renderW = boxSize;
      renderH = boxSize / imgRatio;
    }

    // Zoom slightly (~1.15) to ensure full diamond coverage without blank corners
    renderW *= 1.15;
    renderH *= 1.15;

    const renderX = centerX - renderW / 2;
    // Bias slightly higher to center human faces/busts
    const renderY = centerY - renderH / 2 - 20;

    ctx.drawImage(playerImg, renderX, renderY, renderW, renderH);
  } catch (err) {
    console.error('Failed to draw player image in diamond:', err);
    // Clean fallback geometric avatar if image failed to load
    ctx.fillStyle = '#2D3033';
    ctx.fillRect(centerX - diamondRadius, centerY - diamondRadius, diamondRadius * 2, diamondRadius * 2);
    ctx.fillStyle = '#F1EFE8';
    ctx.font = 'bold 72px "Archivo Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PLAYER', centerX, centerY);
  }
  ctx.restore(); // Restore clip
  ctx.restore(); // Restore outer frame

  // ==========================================
  // 6. RED DIAGONAL INFORMATION STRIP
  // ==========================================
  // Slanted diagonal banner across the lower section
  const stripY = 990;
  const stripAngle = (-5.5 * Math.PI) / 180;
  const stripHeight = 175;

  ctx.save();
  ctx.translate(0, stripY);
  ctx.rotate(stripAngle);

  // Drop shadow of strip
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(-150, 12, width + 300, stripHeight);

  // White background accent backing
  ctx.fillStyle = '#F1EFE8';
  ctx.fillRect(-150, -8, width + 300, stripHeight + 16);

  // Main Brick Red Strip
  ctx.fillStyle = '#B43C32';
  ctx.fillRect(-150, 0, width + 300, stripHeight);

  // Yellow accent edge stripe along the top of the red strip
  ctx.fillStyle = '#F4D85A';
  ctx.fillRect(-150, 0, width + 300, 10);

  // Content on the Red Strip:
  // Left: PLAYING ROLE
  // Right: PHONE NUMBER
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Role Label
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.fillStyle = '#F4D85A'; // Pale yellow label
  ctx.fillText('PLAYING ROLE', 140, 28);

  // Actual Role Value
  ctx.font = '900 52px "Archivo Black", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(player.playing_role.toUpperCase(), 140, 56);

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(610, 24);
  ctx.lineTo(610, 145);
  ctx.stroke();

  // Phone Number Label
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.fillStyle = '#F4D85A';
  ctx.fillText('CONTACT NUMBER', 650, 28);

  // Actual Phone Number Value
  ctx.font = '700 46px "Space Mono", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(player.phone_number, 650, 62);

  ctx.restore();

  // ==========================================
  // 7. BOTTOM ATHLETIC BRANDING & BORDER
  // ==========================================
  // Outer poster border (brutalist frame)
  ctx.strokeStyle = '#17191A';
  ctx.lineWidth = 24;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // Inner thin border
  ctx.strokeStyle = 'rgba(241, 239, 232, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Corner sports brackets
  const bracketSize = 40;
  ctx.strokeStyle = '#E66A32';
  ctx.lineWidth = 6;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(40, 40 + bracketSize);
  ctx.lineTo(40, 40);
  ctx.lineTo(40 + bracketSize, 40);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(width - 40 - bracketSize, 40);
  ctx.lineTo(width - 40, 40);
  ctx.lineTo(width - 40, 40 + bracketSize);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(40, height - 40 - bracketSize);
  ctx.lineTo(40, height - 40);
  ctx.lineTo(40 + bracketSize, height - 40);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(width - 40 - bracketSize, height - 40);
  ctx.lineTo(width - 40, height - 40);
  ctx.lineTo(width - 40, height - 40 - bracketSize);
  ctx.stroke();

  // Subtle bottom footer text
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.fillStyle = 'rgba(241, 239, 232, 0.7)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('COLLEGE SPORTS TOURNAMENT ROSTER • OFFICIAL PLAYER CARD', width / 2, height - 42);

  return canvas;
}

/**
 * Downloads a single player's card as a high-quality 1080x1350 PNG file
 */
export async function downloadPlayerCardPNG(
  player: Player,
  sport: SportType
): Promise<void> {
  const canvas = await generatePlayerCardCanvas(player, sport);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(new Error('Failed to generate PNG blob from canvas'));
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const cleanName = player.full_name.trim().replace(/[^a-zA-Z0-9]+/g, '_');
        a.href = url;
        a.download = `${cleanName}_${sport}_PlayerCard.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      },
      'image/png',
      1.0
    );
  });
}

