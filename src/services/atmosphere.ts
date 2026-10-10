/**
 * Atmosphere & Environmental Progression Engine
 * - Smooth continuous Day/Night/Dawn/Dusk time transitions (seamless RGB color blending)
 * - Foreground Parallax Foliage: twisted ancient mountain pine trees, rocky thorn bushes, and swaying wild grass
 * - Ambient flying solitary birds
 */

import { Season } from '../types/game';

export type TimeOfDay = 'DAWN' | 'ZENITH' | 'DUSK' | 'NIGHT';

export interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  wingPhase: number;
  wingSpeed: number;
  depth: number;
}

export interface AtmosphereState {
  timeOfDay: TimeOfDay;
  timeNormalized: number; // 0.0 to 1.0 continuous
  skyColors: [string, string, string];
  fogAlpha: number;
  ambientLight: number;
  starAlpha: number;
  sunMoonPos: { xRatio: number; yRatio: number };
  isNight: boolean;
  labelFr: string;
  labelEn: string;
}

// Color utility: parse hex to [r,g,b]
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

// Color utility: lerp two rgb arrays into hex string
function lerpRgb(c1: [number, number, number], c2: [number, number, number], t: number): string {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// Keyframe atmospheres
const SKY_KEYFRAMES: {
  colors: [[number, number, number], [number, number, number], [number, number, number]];
  fog: number;
  light: number;
  stars: number;
  labelFr: string;
  labelEn: string;
}[] = [
  // 0: DAWN (Aube ambre / rose givré)
  {
    colors: [hexToRgb('#161016'), hexToRgb('#2F1C1B'), hexToRgb('#4F3222')],
    fog: 0.28,
    light: 0.65,
    stars: 0.1,
    labelFr: 'Aube silencieuse',
    labelEn: 'Silent Dawn'
  },
  // 1: ZENITH (Zénith minéral pur)
  {
    colors: [hexToRgb('#121517'), hexToRgb('#23282A'), hexToRgb('#3C3A33')],
    fog: 0.12,
    light: 0.95,
    stars: 0.0,
    labelFr: 'Zénith minéral',
    labelEn: 'Mineral Zenith'
  },
  // 2: DUSK (Crépuscule pourpre / Death Stranding golden hour)
  {
    colors: [hexToRgb('#110E17'), hexToRgb('#2C1621'), hexToRgb('#522A1E')],
    fog: 0.22,
    light: 0.6,
    stars: 0.35,
    labelFr: 'Crépuscule pourpre',
    labelEn: 'Purple Dusk'
  },
  // 3: NIGHT (Nuit d’obsidienne étoilée)
  {
    colors: [hexToRgb('#060608'), hexToRgb('#0C0D13'), hexToRgb('#14151F')],
    fog: 0.32,
    light: 0.4,
    stars: 0.92,
    labelFr: 'Nuit d’obsidienne',
    labelEn: 'Obsidian Night'
  }
];

/**
 * Calculates continuous, smooth time-of-day progression.
 * Seamlessly blends between Dawn -> Zenith -> Dusk -> Night -> Dawn
 */
export function getAtmosphereForCycle(totalAttempts: number, runTime: number): AtmosphereState {
  // Cycle continuously: 1 full cycle every 100 seconds of play, offset by attempts
  const cycleDurationSec = 90;
  const rawProgress = (totalAttempts * 0.25 + (runTime / cycleDurationSec)) % 4.0;
  
  const fromIndex = Math.floor(rawProgress) % 4;
  const toIndex = (fromIndex + 1) % 4;
  
  // Smooth cosine easing between keyframes
  const localT = rawProgress - Math.floor(rawProgress);
  const smoothT = 0.5 - 0.5 * Math.cos(localT * Math.PI);

  const kf1 = SKY_KEYFRAMES[fromIndex];
  const kf2 = SKY_KEYFRAMES[toIndex];

  const sky1 = lerpRgb(kf1.colors[0], kf2.colors[0], smoothT);
  const sky2 = lerpRgb(kf1.colors[1], kf2.colors[1], smoothT);
  const sky3 = lerpRgb(kf1.colors[2], kf2.colors[2], smoothT);

  const fogAlpha = kf1.fog + (kf2.fog - kf1.fog) * smoothT;
  const ambientLight = kf1.light + (kf2.light - kf1.light) * smoothT;
  const starAlpha = kf1.stars + (kf2.stars - kf1.stars) * smoothT;

  // Celestial arc position
  const angle = (rawProgress / 4.0) * Math.PI * 2;
  const sunMoonX = 0.5 + Math.sin(angle) * 0.36;
  const sunMoonY = 0.32 - Math.cos(angle) * 0.18;

  const isNight = fromIndex === 3 || (fromIndex === 2 && localT > 0.5);

  let timeOfDay: TimeOfDay = 'DAWN';
  if (fromIndex === 0) timeOfDay = 'DAWN';
  else if (fromIndex === 1) timeOfDay = 'ZENITH';
  else if (fromIndex === 2) timeOfDay = 'DUSK';
  else timeOfDay = 'NIGHT';

  const labelFr = smoothT < 0.5 ? kf1.labelFr : kf2.labelFr;
  const labelEn = smoothT < 0.5 ? kf1.labelEn : kf2.labelEn;

  return {
    timeOfDay,
    timeNormalized: rawProgress / 4.0,
    skyColors: [sky1, sky2, sky3],
    fogAlpha,
    ambientLight,
    starAlpha,
    sunMoonPos: { xRatio: sunMoonX, yRatio: Math.max(0.12, sunMoonY) },
    isNight,
    labelFr,
    labelEn
  };
}

/**
 * Bird System: Solitary mountain birds flying across the sky
 */
export class BirdSystem {
  public birds: Bird[] = [];

  constructor() {
    this.initBirds();
  }

  private initBirds() {
    this.birds = [
      {
        x: -40,
        y: 80,
        vx: 0.85,
        vy: -0.05,
        size: 7,
        wingPhase: 0,
        wingSpeed: 0.08,
        depth: 0.6
      },
      {
        x: -160,
        y: 130,
        vx: 1.1,
        vy: 0.04,
        size: 9,
        wingPhase: 2.1,
        wingSpeed: 0.09,
        depth: 0.9
      }
    ];
  }

  public update(width: number, height: number, dt: number, onBirdCry?: () => void) {
    this.birds.forEach((bird) => {
      bird.x += bird.vx * (dt * 60);
      bird.y += bird.vy * (dt * 60);
      bird.wingPhase += bird.wingSpeed * (dt * 60);

      if (Math.random() < 0.01) {
        bird.vy = (Math.random() - 0.5) * 0.15;
      }

      if (bird.x > width + 60) {
        bird.x = -60 - Math.random() * 80;
        bird.y = height * (0.12 + Math.random() * 0.35);
        bird.vx = 0.7 + Math.random() * 0.6;
        bird.depth = 0.4 + Math.random() * 0.6;
        bird.size = 6 + bird.depth * 4;

        if (onBirdCry && Math.random() > 0.4) {
          onBirdCry();
        }
      }
    });
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.birds.forEach((b) => {
      ctx.save();
      ctx.translate(b.x, b.y);

      ctx.fillStyle = `rgba(12, 11, 10, ${0.4 + b.depth * 0.55})`;
      ctx.strokeStyle = `rgba(12, 11, 10, ${0.4 + b.depth * 0.55})`;
      ctx.lineWidth = 1.6;

      const wingY = Math.sin(b.wingPhase) * (b.size * 0.6);

      ctx.beginPath();
      ctx.moveTo(-b.size, -wingY);
      ctx.quadraticCurveTo(-b.size * 0.4, -wingY * 0.3, 0, 0);
      ctx.quadraticCurveTo(b.size * 0.4, -wingY * 0.3, b.size, -wingY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
    ctx.restore();
  }
}

/**
 * Foreground & Midground Parallax Scenery Engine:
 * Inspired by Limbo, Gris, Inside, and antique copperplate engravings (Gustave Doré / Caspar David Friedrich).
 * Features:
 * - Ancient weathered gnarled pines with flared roots, bark grain etchings, and drooping needle fronds
 * - Skeletal lightning-struck dead trees with jagged bare boughs
 * - Detailed mountain ferns, spiky thistle brambles, and swaying feathery wild grass
 * - Midground atmospheric silhouette trees creating 4-plane parallax depth
 * - Gentle drifting needle particles carried by the alpine wind
 */
export class ForegroundFoliage {
  private driftingParticles: { x: number; y: number; vx: number; vy: number; rot: number; vRot: number; size: number }[] = [];

  constructor() {
    // Initialize drifting needles/leaves
    for (let i = 0; i < 8; i++) {
      this.driftingParticles.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: 0.6 + Math.random() * 0.8,
        vy: 0.2 + Math.random() * 0.4,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05,
        size: 3 + Math.random() * 3
      });
    }
  }

  /**
   * Renders the midground silhouettes (behind player slope, creating intermediate depth)
   */
  public renderMidground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    distance: number,
    time: number
  ) {
    ctx.save();
    const mgScroll = (distance * 14) % (width * 2.2);
    const wind = Math.sin(time * 0.0018) * 3;

    // Midground trees have a muted ink wash tone matching the atmosphere
    ctx.fillStyle = '#161418';
    ctx.strokeStyle = '#161418';

    // Solitary midground pine on a distant ledge
    const mgTree1X = ((width * 0.22 - mgScroll + width * 2) % (width + 240)) - 80;
    this.drawMidgroundTree(ctx, mgTree1X, height * 0.68, 70, wind * 0.6);

    // Second midground tree
    const mgTree2X = ((width * 0.78 - mgScroll + width * 2) % (width + 300)) - 60;
    this.drawMidgroundTree(ctx, mgTree2X, height * 0.58, 85, -wind * 0.5);

    ctx.restore();
  }

  /**
   * Renders the dramatic foreground layer (in front of Sisyphus and camera)
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    distance: number,
    time: number,
    season: Season = 'SPRING'
  ) {
    ctx.save();

    // Foreground parallax moves faster than Sisyphus (1.65x ratio)
    const fgScroll = (distance * 28) % (width * 2.4);
    // Winter blizzard has stronger wind sway
    const windMultiplier = season === 'WINTER' ? 1.6 : season === 'AUTUMN' ? 1.3 : 1.0;
    const windSway = Math.sin(time * 0.0022) * 5 * windMultiplier;

    // 1. Massive Ancient Weathered Pine on Left Frame
    const tree1X = ((width * 0.08 - fgScroll * 0.75 + width * 2.4) % (width + 420)) - 180;
    this.drawAncientPine(ctx, tree1X, height, 180, windSway, season);

    // 2. Dead Skeletal Lightning-Struck Tree (Limbo style) on Right Frame
    const tree2X = ((width * 0.85 - fgScroll * 0.75 + width * 2.4) % (width + 450)) - 120;
    this.drawDeadSkeletalTree(ctx, tree2X, height, 150, -windSway * 0.7, season);

    // 3. Mountain Ferns and Wild Blackberry Brambles along bottom
    const numFerns = 5;
    for (let f = 0; f < numFerns; f++) {
      const fernX = ((f * (width / 3.8) - fgScroll * 1.15) % (width + 160) + (width + 160)) % (width + 160) - 60;
      this.drawMountainFern(ctx, fernX, height, 38 + (f % 3) * 10, windSway * 0.6, season);
    }

    // 4. Thorny Thistle & Bramble bushes
    const numBushes = 4;
    for (let b = 0; b < numBushes; b++) {
      const bx = ((b * (width / 3.2) + 90 - fgScroll * 1.1) % (width + 180) + (width + 180)) % (width + 180) - 50;
      this.drawThornyThistle(ctx, bx, height, 28 + (b % 2) * 12, windSway * 0.4);
    }

    // 5. Wild Mountain Grass & Feathery Reed Plumes along extreme bottom
    ctx.strokeStyle = season === 'WINTER' ? '#E2E8F0' : '#050505';
    ctx.fillStyle = season === 'WINTER' ? '#E2E8F0' : '#050505';
    const grassSpacing = 11;
    for (let gx = -25; gx < width + 25; gx += grassSpacing) {
      const gHeight = 22 + Math.sin(gx * 0.15) * 12 + ((gx % 3) * 6);
      const gSway = Math.sin((time * 0.003) + gx * 0.06) * (6 + (gx % 4)) * windMultiplier;
      
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(gx, height);
      ctx.quadraticCurveTo(gx + gSway * 0.4, height - gHeight * 0.55, gx + gSway, height - gHeight);
      ctx.stroke();

      // Feathery seed plume on taller stems
      if (gx % 22 === 0) {
        ctx.beginPath();
        ctx.ellipse(gx + gSway, height - gHeight - 3, 2, 7, (gSway * 0.08), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 6. Seasonal Weather & Drifting Particles
    // (Spring petals / Summer heat dust / Autumn golden leaves / Winter blizzard snow)
    this.driftingParticles.forEach((p, idx) => {
      // Wind speed varies by season
      const speedX = season === 'WINTER' ? p.vx * 3.2 : season === 'AUTUMN' ? p.vx * 1.8 : p.vx;
      p.x += speedX;
      p.y += p.vy + Math.sin(time * 0.002 + p.x) * 0.4;
      p.rot += p.vRot;

      if (p.x > width + 40 || p.y > height) {
        p.x = -30;
        p.y = height * (0.05 + Math.random() * 0.85);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      if (season === 'SPRING') {
        // Blooming cherry / almond blossom petals (soft pastel pink & white)
        ctx.fillStyle = idx % 2 === 0 ? 'rgba(251, 207, 232, 0.88)' : 'rgba(255, 241, 242, 0.92)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.6, 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (season === 'SUMMER') {
        // Shimmering golden heat dust
        ctx.fillStyle = 'rgba(253, 230, 138, 0.55)';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else if (season === 'AUTUMN') {
        // Fiery golden, amber, and crimson autumn leaves
        ctx.fillStyle = idx % 3 === 0 ? '#DC2626' : idx % 3 === 1 ? '#F97316' : '#D97706';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.7, p.rot, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // WINTER: Crystalline white snowflakes in blizzard
        ctx.fillStyle = 'rgba(241, 245, 249, 0.92)';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.75, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // 7. Ground Vignette Mist (velvety deep fade at bottom edge)
    const mistGrad = ctx.createLinearGradient(0, height - 55, 0, height);
    mistGrad.addColorStop(0, 'rgba(8, 7, 7, 0)');
    mistGrad.addColorStop(0.65, season === 'WINTER' ? 'rgba(200, 215, 230, 0.25)' : 'rgba(6, 5, 5, 0.45)');
    mistGrad.addColorStop(1, season === 'WINTER' ? 'rgba(180, 200, 220, 0.55)' : 'rgba(4, 3, 3, 0.92)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, height - 55, width, 55);

    ctx.restore();
  }

  /**
   * Masterwork Ancient Gnarled Pine:
   * Flared roots, organic tapering trunk, multi-tier sinuous branches, woodcut bark grain,
   * and drooping needle fronds with subtle wind physics.
   */
  private drawAncientPine(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    trunkHeight: number,
    sway: number,
    season: Season = 'SPRING'
  ) {
    ctx.save();
    ctx.translate(x, baseY);

    ctx.fillStyle = '#050505';
    ctx.strokeStyle = '#050505';

    // 1. Flared, gripping roots
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-45, 8);
    ctx.quadraticCurveTo(-22, -12, 0, -35);
    ctx.stroke();

    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(35, 6);
    ctx.quadraticCurveTo(18, -10, 0, -35);
    ctx.stroke();

    // 2. Massive, sinuous tapering trunk with knots
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-24, -trunkHeight * 0.35, -8, -trunkHeight * 0.6);
    ctx.stroke();

    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(-8, -trunkHeight * 0.6);
    ctx.quadraticCurveTo(12 + sway * 0.4, -trunkHeight * 0.8, 18 + sway, -trunkHeight);
    ctx.stroke();

    // Bark crosshatch etchings on trunk
    ctx.strokeStyle = 'rgba(28, 26, 24, 0.85)';
    ctx.lineWidth = 1.2;
    for (let h = 15; h < trunkHeight * 0.7; h += 9) {
      const tx = Math.sin(h * 0.08) * 8 - 4;
      ctx.beginPath();
      ctx.moveTo(tx - 6, -h);
      ctx.lineTo(tx + 4, -h - 4);
      ctx.stroke();
    }

    ctx.strokeStyle = '#050505';

    // 3. Primary Branch Bifurcations
    // Branch A: Left heavy overhang
    const b1Y = -trunkHeight * 0.52;
    this.drawLimb(ctx, -10, b1Y, -68 + sway * 0.5, b1Y - 22, 7, 3);
    this.drawDroopingFrondCluster(ctx, -68 + sway * 0.5, b1Y - 22, 34, sway, season);
    this.drawDroopingFrondCluster(ctx, -42 + sway * 0.3, b1Y - 14, 26, sway * 0.8, season);

    // Branch B: Right upward sweep
    const b2Y = -trunkHeight * 0.72;
    this.drawLimb(ctx, 4, b2Y, 74 + sway * 0.6, b2Y - 30, 8, 3.5);
    this.drawDroopingFrondCluster(ctx, 74 + sway * 0.6, b2Y - 30, 36, -sway * 0.9, season);
    this.drawDroopingFrondCluster(ctx, 48 + sway * 0.4, b2Y - 18, 28, -sway * 0.7, season);

    // Branch C: Crown canopy
    const topX = 18 + sway;
    const topY = -trunkHeight;
    this.drawLimb(ctx, topX, topY, topX - 44 + sway * 0.8, topY - 38, 6, 2.5);
    this.drawLimb(ctx, topX, topY, topX + 52 + sway * 0.8, topY - 26, 6, 2.5);
    this.drawDroopingFrondCluster(ctx, topX - 44 + sway * 0.8, topY - 38, 38, sway, season);
    this.drawDroopingFrondCluster(ctx, topX + 52 + sway * 0.8, topY - 26, 32, -sway, season);
    this.drawDroopingFrondCluster(ctx, topX + sway * 0.5, topY - 16, 30, sway * 0.5, season);

    ctx.restore();
  }

  /**
   * Skeletal Lightning-Struck Dead Tree (Limbo silhouette):
   * Sharp, agonized elbows, jagged broken boughs, fine bare twigs.
   */
  private drawDeadSkeletalTree(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    trunkHeight: number,
    sway: number,
    season: Season = 'SPRING'
  ) {
    ctx.save();
    ctx.translate(x, baseY);

    ctx.fillStyle = '#040404';
    ctx.strokeStyle = '#040404';

    // Crooked root clutch
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(32, 6);
    ctx.quadraticCurveTo(14, -8, 0, -28);
    ctx.stroke();

    // Jagged angled trunk
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, -trunkHeight * 0.4);
    ctx.stroke();

    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-12, -trunkHeight * 0.4);
    ctx.lineTo(8 + sway * 0.5, -trunkHeight * 0.75);
    ctx.stroke();

    // Dead shattered trunk crown (lightning splinter)
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(8 + sway * 0.5, -trunkHeight * 0.75);
    ctx.lineTo(14 + sway, -trunkHeight);
    ctx.lineTo(18 + sway, -trunkHeight + 8);
    ctx.lineTo(10 + sway, -trunkHeight + 14);
    ctx.stroke();

    // Sharp skeletal limbs
    const l1Y = -trunkHeight * 0.48;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-10, l1Y);
    ctx.lineTo(-48 + sway * 0.4, l1Y - 18);
    ctx.lineTo(-65 + sway * 0.6, l1Y - 8);
    ctx.stroke();

    // Bare twig fork
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-48 + sway * 0.4, l1Y - 18);
    ctx.lineTo(-62 + sway * 0.5, l1Y - 32);
    ctx.lineTo(-74 + sway * 0.7, l1Y - 26);
    ctx.stroke();

    // Limb 2: Right jagged bough
    const l2Y = -trunkHeight * 0.65;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(4, l2Y);
    ctx.lineTo(44 + sway * 0.5, l2Y - 22);
    ctx.lineTo(62 + sway * 0.8, l2Y - 42);
    ctx.stroke();

    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(44 + sway * 0.5, l2Y - 22);
    ctx.lineTo(58 + sway * 0.7, l2Y - 12);
    ctx.stroke();

    // In winter, draw frosty ice crust on the dead upper branches
    if (season === 'WINTER') {
      ctx.strokeStyle = 'rgba(235, 245, 255, 0.85)';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-10, l1Y - 3);
      ctx.lineTo(-48 + sway * 0.4, l1Y - 21);
      ctx.moveTo(4, l2Y - 3);
      ctx.lineTo(44 + sway * 0.5, l2Y - 25);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Helper to draw a tapering limb between two points
   */
  private drawLimb(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    w1: number,
    w2: number
  ) {
    ctx.save();
    ctx.lineWidth = (w1 + w2) / 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2 + 6, (y1 + y2) / 2 - 4, x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Drooping needle fronds (Gris / woodcut engraving style)
   */
  private drawDroopingFrondCluster(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    sway: number,
    season: Season = 'SPRING'
  ) {
    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = '#060605';
    ctx.strokeStyle = '#060605';

    // Dense core silhouette
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.45, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Seasonal branch foliage overlay
    if (season === 'WINTER') {
      // Thick snow crust on top of foliage
      ctx.fillStyle = 'rgba(235, 244, 255, 0.94)';
      ctx.beginPath();
      ctx.ellipse(0, -radius * 0.22, radius * 0.95, radius * 0.32, -0.1, Math.PI, 0);
      ctx.fill();
    } else if (season === 'SPRING') {
      // Delicate blooming pink cherry & almond blossom petals
      ctx.fillStyle = '#F472B6';
      for (let b = 0; b < 10; b++) {
        const bx = Math.sin(b * 1.8) * radius * 0.85;
        const by = Math.cos(b * 2.2) * radius * 0.3 - 4;
        ctx.beginPath();
        ctx.arc(bx, by, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FFF1F2';
      for (let b = 0; b < 10; b += 2) {
        const bx = Math.sin(b * 1.8) * radius * 0.85;
        const by = Math.cos(b * 2.2) * radius * 0.3 - 4;
        ctx.beginPath();
        ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (season === 'AUTUMN') {
      // Golden & amber leaf tips
      ctx.fillStyle = '#D97706';
      for (let b = 0; b < 8; b++) {
        const bx = Math.sin(b * 2.1) * radius * 0.75;
        const by = Math.cos(b * 1.7) * radius * 0.35 - 2;
        ctx.beginPath();
        ctx.arc(bx, by, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Hanging drooping fronds along bottom
    const numFronds = 7;
    for (let i = 0; i < numFronds; i++) {
      const fx = -radius * 0.8 + (i / (numFronds - 1)) * radius * 1.6;
      const frondLen = radius * 0.75 + Math.sin(i * 1.8) * 8;
      const fSway = sway * 0.6 + Math.sin(i * 2.1) * 3;

      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(fx, 2);
      ctx.quadraticCurveTo(fx + fSway * 0.4, frondLen * 0.5, fx + fSway, frondLen);
      ctx.stroke();

      // Needle barbs
      ctx.lineWidth = 1.0;
      for (let s = 4; s < frondLen; s += 5) {
        ctx.beginPath();
        ctx.moveTo(fx + (s / frondLen) * fSway, s);
        ctx.lineTo(fx + (s / frondLen) * fSway - 5, s + 3);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * Mountain Fern with natural uncurled pinnules
   */
  private drawMountainFern(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    size: number,
    sway: number
  ) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.strokeStyle = '#050505';

    const numFronds = 5;
    for (let f = 0; f < numFronds; f++) {
      const spread = (f - 2) * 0.32;
      const fLen = size * (0.8 + Math.abs(f - 2) * 0.1);
      const tipX = Math.sin(spread) * fLen + sway * 0.5;
      const tipY = -Math.cos(spread) * fLen;

      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(tipX * 0.4, tipY * 0.7, tipX, tipY);
      ctx.stroke();

      // Side leaves
      ctx.lineWidth = 1.2;
      for (let p = 0.2; p < 0.95; p += 0.12) {
        const px = tipX * p;
        const py = tipY * p;
        const leafLen = (1 - p) * 14;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - leafLen, py - 3);
        ctx.moveTo(px, py);
        ctx.lineTo(px + leafLen, py - 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * Thorny Thistle / Wild Dry Bramble
   */
  private drawThornyThistle(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    radius: number,
    sway: number
  ) {
    ctx.save();
    ctx.translate(x, baseY);
    ctx.strokeStyle = '#060605';
    ctx.fillStyle = '#060605';

    // Tangled spiky arcs
    ctx.lineWidth = 1.8;
    for (let i = -radius; i <= radius; i += 8) {
      const branchHeight = radius * 0.9 + Math.sin(i * 1.9) * 8;
      const bTipX = i + sway + (i > 0 ? 8 : -8);
      const bTipY = -branchHeight;

      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.quadraticCurveTo(i * 0.7, bTipY * 0.5, bTipX, bTipY);
      ctx.stroke();

      // Sharp thorns
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(bTipX * 0.6, bTipY * 0.6);
      ctx.lineTo(bTipX * 0.6 - 4, bTipY * 0.6 - 2);
      ctx.stroke();

      // Seed pods
      if (Math.abs(i) % 16 === 0) {
        ctx.beginPath();
        ctx.arc(bTipX, bTipY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /**
   * Distant Midground Tree (Subtle ink wash silhouette behind slope)
   */
  private drawMidgroundTree(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    height: number,
    sway: number
  ) {
    ctx.save();
    ctx.translate(x, baseY);

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-6, -height * 0.5, sway, -height);
    ctx.stroke();

    // Sinuous side boughs
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(-2, -height * 0.55);
    ctx.lineTo(-24 + sway, -height * 0.65);
    ctx.moveTo(1, -height * 0.75);
    ctx.lineTo(26 + sway, -height * 0.82);
    ctx.stroke();

    // Soft canopy tufts
    const tufts = [
      [-24 + sway, -height * 0.65, 14],
      [26 + sway, -height * 0.82, 12],
      [sway, -height, 16]
    ];
    tufts.forEach(([cx, cy, rad]) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rad, rad * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }
}

