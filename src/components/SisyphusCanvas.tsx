import React, { useEffect, useRef, useCallback } from 'react';
import { GameStatus, Language, Season, SeasonConfig, CairnMarker } from '../types/game';
import { soundEngine } from '../services/audio';
import { BirdSystem, ForegroundFoliage, getAtmosphereForCycle } from '../services/atmosphere';
import { monologueEngine } from '../services/monologue';
import { getBiomeForDistance } from '../services/biomes';
import { MountainTerrain } from '../services/terrain';
import { LivingWorldSystem } from '../services/livingWorld';
import { StickmanRenderer } from '../services/stickmanRenderer';
import { SkyWhaleSystem } from '../services/skyWhale';

interface SisyphusCanvasProps {
  status: GameStatus;
  isPushing: boolean;
  distance: number;
  runTime: number;
  totalAttempts: number;
  toleranceRatio: number;
  season: Season;
  seasonConfig: SeasonConfig;
  lang: Language;
  maxDistance?: number;
  cairns?: CairnMarker[];
  descendDistance?: number;
  onPushStart: () => void;
  onPushEnd: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
}

export const SisyphusCanvas: React.FC<SisyphusCanvasProps> = ({
  status,
  isPushing,
  distance,
  runTime,
  totalAttempts,
  toleranceRatio,
  season,
  seasonConfig,
  lang,
  maxDistance = 0,
  cairns = [],
  descendDistance = 0,
  onPushStart,
  onPushEnd
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const boulderAngleRef = useRef<number>(0);
  const strainTrembleRef = useRef<number>(0);
  const crashRollOffsetRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const soundThrottleRef = useRef<number>(0);
  const lastStepPhaseRef = useRef<number>(0);

  // Atmospheric & Living Systems
  const birdSystemRef = useRef<BirdSystem>(new BirdSystem());
  const skyWhaleRef = useRef<SkyWhaleSystem>(new SkyWhaleSystem());
  const foregroundFoliageRef = useRef<ForegroundFoliage>(new ForegroundFoliage());
  const livingWorldRef = useRef<LivingWorldSystem>(new LivingWorldSystem());
  const starsRef = useRef<Star[]>([]);

  // Slope geometry constants
  const SLOPE_ANGLE = 0.44; // ~25.2 degrees in radians
  const BOULDER_RADIUS = 46;

  // Initialize stars once
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.55,
        size: 0.8 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.02 + Math.random() * 0.04
      });
    }
    starsRef.current = stars;
  }, []);

  // Add dust, stone flakes, and mineral friction sparks
  const spawnDust = useCallback((x: number, y: number, count = 3, isSevere = false, isSpark = false) => {
    for (let i = 0; i < count; i++) {
      const angle = SLOPE_ANGLE + Math.PI + (Math.random() - 0.5) * 1.1;
      const speed = isSpark
        ? 3.5 + Math.random() * 4.5
        : isSevere
        ? 2.5 + Math.random() * 4
        : 1.2 + Math.random() * 2;
      
      const color = isSpark
        ? Math.random() > 0.5 ? '#FBBF24' : '#F59E0B' // amber/gold mineral friction sparks
        : Math.random() > 0.4 ? '#8C8273' : '#3D372F';

      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: isSpark ? 1.0 + Math.random() * 1.5 : isSevere ? 2.2 + Math.random() * 3.2 : 1.4 + Math.random() * 2.2,
        alpha: isSpark ? 1.0 : 0.85,
        color,
        life: 0,
        maxLife: isSpark ? 12 + Math.random() * 10 : isSevere ? 36 + Math.random() * 25 : 22 + Math.random() * 18
      });
    }
  }, []);

  // Primary animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const width = canvas.width;
      const height = canvas.height;

      // Active display distance
      const activeDist = status === 'DESCENDING' ? descendDistance : distance;
      const biome = getBiomeForDistance(activeDist);

      // Update atmospheric state
      const atmosphere = getAtmosphereForCycle(totalAttempts, runTime);

      // Check interior thoughts
      monologueEngine.checkTriggers(activeDist, status, lang, dt);

      // Sound update: footstep sync & friction
      if (status === 'PUSHING' && isPushing) {
        soundThrottleRef.current += dt;
        if (soundThrottleRef.current > 0.18) {
          soundEngine.playPushScrape(0.9 + Math.random() * 0.2);
          soundThrottleRef.current = 0;
        }

        // Footstep timing based on cadence
        const stridePhase = (activeDist * 3.4) % Math.PI;
        if (stridePhase < lastStepPhaseRef.current) {
          soundEngine.playFootstep(Math.random() > 0.5);
          if (Math.random() > 0.65) {
            soundEngine.playExertionBreath();
          }
        }
        lastStepPhaseRef.current = stridePhase;
      } else if (status === 'DESCENDING') {
        const stridePhase = (descendDistance * 2.4) % Math.PI;
        if (stridePhase < lastStepPhaseRef.current) {
          soundEngine.playFootstep(false);
        }
        lastStepPhaseRef.current = stridePhase;
      } else {
        soundThrottleRef.current = 0;
      }

      // Update altitude wind audio with seasonal weather squalls & biome height
      const altitude = activeDist * Math.sin(SLOPE_ANGLE);
      const seasonWindFactor = (season === 'WINTER' ? 1.7 : season === 'AUTUMN' ? 1.35 : 1.0) * (biome.mistDensity + 0.8);
      soundEngine.updateAmbientWind(altitude, isPushing && status === 'PUSHING', seasonWindFactor);

      // Update birds
      birdSystemRef.current.update(width, height, dt, () => {
        soundEngine.playDistantBird();
      });

      // Update living encounters (ravens, wanderers, ibex, watchers, wisps)
      livingWorldRef.current.update(activeDist, dt, now);

      // Update boulder rotation & crash tumbling
      if (status === 'PUSHING') {
        boulderAngleRef.current += dt * 3.8 * seasonConfig.pushSpeedMod;
        crashRollOffsetRef.current = 0;
      } else if (status === 'SLIPPING') {
        boulderAngleRef.current -= dt * 4.2;
        strainTrembleRef.current = (Math.random() - 0.5) * 4;
        crashRollOffsetRef.current = 0;
      } else if (status === 'CRASHING') {
        boulderAngleRef.current -= dt * 18.0;
        strainTrembleRef.current = (Math.random() - 0.5) * 6;
        crashRollOffsetRef.current += dt * 340;
      } else {
        strainTrembleRef.current = 0;
        crashRollOffsetRef.current = 0;
      }

      // 1. Draw Atmospheric Sky Gradient with Biome Color Modulation
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, atmosphere.skyColors[0]);
      skyGrad.addColorStop(0.5, atmosphere.skyColors[1]);
      skyGrad.addColorStop(1, atmosphere.skyColors[2]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Biome Ambient Mist Tint
      if (biome.type === 'VERGLAS_WALL') {
        ctx.fillStyle = 'rgba(28, 42, 60, 0.22)';
        ctx.fillRect(0, 0, width, height);
      } else if (biome.type === 'OLYMPUS_ETHER') {
        ctx.fillStyle = 'rgba(65, 45, 18, 0.18)';
        ctx.fillRect(0, 0, width, height);
      }

      // 1b. Stars field during Night / Dusk
      if (atmosphere.starAlpha > 0.05) {
        ctx.save();
        starsRef.current.forEach((s) => {
          const twinkle = 0.5 + Math.sin(now * s.twinkleSpeed) * 0.5;
          ctx.fillStyle = `rgba(240, 235, 225, ${s.alpha * twinkle * atmosphere.starAlpha})`;
          ctx.beginPath();
          ctx.arc(s.x * width, s.y * height, s.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 1c. Sun or Moon Disc
      const celestialX = width * atmosphere.sunMoonPos.xRatio;
      const celestialY = height * atmosphere.sunMoonPos.yRatio;
      ctx.save();
      if (atmosphere.timeOfDay === 'NIGHT') {
        // Cold crescent moon
        ctx.fillStyle = 'rgba(235, 232, 222, 0.75)';
        ctx.beginPath();
        ctx.arc(celestialX, celestialY, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = atmosphere.skyColors[0];
        ctx.beginPath();
        ctx.arc(celestialX + 9, celestialY - 4, 22, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Atmospheric Sun
        const sunGlow = ctx.createRadialGradient(celestialX, celestialY, 10, celestialX, celestialY, 70);
        sunGlow.addColorStop(0, 'rgba(245, 220, 185, 0.45)');
        sunGlow.addColorStop(0.6, 'rgba(235, 215, 185, 0.12)');
        sunGlow.addColorStop(1, 'rgba(235, 215, 185, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(celestialX, celestialY, 70, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 2. Solitary Passing Birds
      birdSystemRef.current.render(ctx);

      // 2b. Majestic Celestial Sky Whale gliding peacefully across the upper clouds
      skyWhaleRef.current.update(dt, width, height);
      skyWhaleRef.current.render(ctx, atmosphere.isNight);

      // 3. Distant mountain peaks (woodcut silhouette parallax)
      const distLight = Math.round(24 * atmosphere.ambientLight * biome.lightFactor);
      ctx.fillStyle = `rgb(${distLight}, ${distLight}, ${Math.round(distLight * 1.05)})`;
      ctx.beginPath();
      ctx.moveTo(-100, height);
      ctx.lineTo(-50, height * 0.44);
      ctx.lineTo(width * 0.25, height * 0.54);
      ctx.lineTo(width * 0.55, height * 0.36);
      ctx.lineTo(width * 0.85, height * 0.50);
      ctx.lineTo(width + 100, height * 0.34);
      ctx.lineTo(width + 100, height);
      ctx.closePath();
      ctx.fill();

      // Mid-distance rugged crag with etching crosshatches
      const midLight = Math.round(32 * atmosphere.ambientLight * biome.lightFactor);
      ctx.fillStyle = `rgb(${midLight}, ${Math.round(midLight * 0.95)}, ${Math.round(midLight * 0.88)})`;
      ctx.beginPath();
      ctx.moveTo(-100, height);
      ctx.lineTo(0, height * 0.64);
      ctx.lineTo(width * 0.35, height * 0.47);
      ctx.lineTo(width * 0.7, height * 0.60);
      ctx.lineTo(width + 100, height * 0.44);
      ctx.lineTo(width + 100, height);
      ctx.closePath();
      ctx.fill();

      // 3b. Midground Silhouettes (Ledges, distant pines)
      foregroundFoliageRef.current.renderMidground(ctx, width, height, activeDist, now);

      // 4. Slope Geometry & Living Mountain Terrain
      const slopeStartX = -50;
      const slopeStartY = height * 0.82;
      const scrollOffset = activeDist * 22;

      // Draw Main Mountain Mass with stepped stone flags & Doré copperplate crosshatching
      MountainTerrain.renderTerrain(
        ctx,
        width,
        height,
        slopeStartX,
        slopeStartY,
        scrollOffset,
        atmosphere.isNight,
        seasonConfig.groundColorTint
      );

      // Helper function to query organic terrain height at any screen X
      const getTerrainY = (screenX: number) =>
        MountainTerrain.getScreenTerrainY(screenX, slopeStartY, slopeStartX, scrollOffset);

      // Dynamic Weather & Seasonal Overlays on the rocky path
      if (season === 'WINTER' || biome.type === 'VERGLAS_WALL') {
        ctx.strokeStyle = 'rgba(235, 245, 255, 0.85)';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        for (let ic = -30; ic < width + 30; ic += 12) {
          const icY = getTerrainY(ic);
          if (ic === -30) ctx.moveTo(ic, icY - 1);
          else ctx.lineTo(ic, icY - 1);
        }
        ctx.stroke();

        // Stalactites / Icicles
        ctx.fillStyle = 'rgba(235, 245, 255, 0.8)';
        for (let ic = 25; ic < width; ic += 44) {
          const icY = getTerrainY(ic);
          ctx.beginPath();
          ctx.moveTo(ic, icY);
          ctx.lineTo(ic + 2.5, icY + 12);
          ctx.lineTo(ic + 5, icY);
          ctx.fill();
        }
      } else if (season === 'AUTUMN') {
        for (let l = 0; l < 14; l++) {
          const lx = (l * 65 + (activeDist * 14)) % (width + 50);
          const ly = getTerrainY(lx) + 2;
          ctx.fillStyle = l % 2 === 0 ? '#B45309' : '#D97706';
          ctx.fillRect(lx, ly, 4.5, 2.2);
        }
      } else if (season === 'SPRING') {
        for (let f = 0; f < 12; f++) {
          const fx = (f * 70) % (width + 40);
          const fy = getTerrainY(fx) + 3;
          ctx.fillStyle = f % 2 === 0 ? '#4ADE80' : '#F472B6';
          ctx.beginPath();
          ctx.arc(fx, fy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Traces of past attempts (grooves on the rock)
      const numScuffs = Math.min(22, 6 + totalAttempts * 2);
      ctx.strokeStyle = 'rgba(40, 36, 32, 0.65)';
      ctx.lineWidth = 2;
      for (let s = 0; s < numScuffs; s++) {
        const scuffX = (s * 45) % (width + 60);
        const scuffY = getTerrainY(scuffX) + 8;
        ctx.beginPath();
        ctx.moveTo(scuffX, scuffY);
        ctx.lineTo(scuffX - 12, scuffY + 6);
        ctx.stroke();
      }

      // Distance milestones carved on stone slope
      const milestoneSpacing = 160;
      const pixelOffset = (activeDist * 16) % milestoneSpacing;
      const baseMarkerMeters = Math.floor(activeDist / 10) * 10;

      ctx.font = '11px Cinzel, serif';
      ctx.fillStyle = 'rgba(196, 179, 155, 0.45)';
      ctx.textAlign = 'center';

      for (let m = -1; m <= 3; m++) {
        const mx = width * 0.45 + m * milestoneSpacing - pixelOffset;
        const my = getTerrainY(mx);
        const markerVal = baseMarkerMeters + m * 10;
        if (markerVal >= 0 && mx > 30 && mx < width - 30) {
          ctx.fillRect(mx - 8, my - 2, 16, 4);
          ctx.fillText(`${markerVal}m`, mx, my + 18);
        }
      }

      // 4b. Memorial Cairns on the Slope (Piles of stones commemorating previous marks)
      const visibleCairns = [
        ...cairns,
        ...(maxDistance > 5 ? [{ id: 'pb', distance: maxDistance, labelFr: 'Record', labelEn: 'Record', attemptsAtPoint: 1, timestamp: 0 }] : [])
      ];

      visibleCairns.forEach((cairn) => {
        const cairnPixelX = width * 0.45 + (cairn.distance - activeDist) * 16;
        if (cairnPixelX > -40 && cairnPixelX < width + 40) {
          const cairnY = getTerrainY(cairnPixelX);
          ctx.save();
          ctx.translate(cairnPixelX, cairnY);
          // Draw stacked stones cairn
          ctx.fillStyle = '#26221D';
          ctx.strokeStyle = '#5E5445';
          ctx.lineWidth = 1.2;

          // Base stone
          ctx.beginPath();
          ctx.ellipse(0, -3, 11, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Mid stone
          ctx.beginPath();
          ctx.ellipse(1, -9, 8, 3.5, 0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Top stone
          ctx.beginPath();
          ctx.ellipse(-0.5, -14, 5.5, 3, -0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Capstone pebble
          ctx.beginPath();
          ctx.arc(0, -18, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Small text tag
          ctx.font = '9px Cinzel, serif';
          ctx.fillStyle = 'rgba(217, 119, 6, 0.75)';
          ctx.textAlign = 'center';
          ctx.fillText(`${Math.round(cairn.distance)}m`, 0, -23);
          ctx.restore();
        }
      });

      // 4c. Living Mountain Encounters (Ravens, descending pilgrims, ibex on crags, watchers, wisps)
      livingWorldRef.current.render(ctx, width, height, activeDist, getTerrainY, now, lang);

      // 5. Sisyphus and Boulder coordinates on organic terrain
      const playerX = width * 0.42;
      const playerY = getTerrainY(playerX);

      const normalX = Math.sin(SLOPE_ANGLE);
      const normalY = -Math.cos(SLOPE_ANGLE);

      const crashOffset = status === 'CRASHING' ? -crashRollOffsetRef.current : 0;
      const boulderContactX = playerX + Math.cos(SLOPE_ANGLE) * (BOULDER_RADIUS * 0.95) + crashOffset;
      const boulderGroundY = getTerrainY(boulderContactX);

      const boulderCenterX = boulderContactX + normalX * BOULDER_RADIUS + strainTrembleRef.current;
      const boulderCenterY = boulderGroundY + normalY * BOULDER_RADIUS;

      // Realistic Rock-to-Ground Compression & Dust/Sparks at Boulder Contact
      if (status === 'PUSHING' && Math.random() > 0.25) {
        // Heel dust
        spawnDust(playerX - 22, playerY, 1, false);
        // Heavy ground crush dust at exact boulder contact point
        spawnDust(boulderContactX, boulderGroundY, 2, false);
        // High-pressure mineral friction sparks (showing immense boulder weight)
        if (Math.random() > 0.65) {
          spawnDust(boulderContactX, boulderGroundY, 2, false, true);
        }
      } else if (status === 'SLIPPING') {
        spawnDust(boulderContactX, boulderGroundY, 3, true);
        spawnDust(boulderContactX, boulderGroundY, 2, true, true);
      } else if (status === 'CRASHING') {
        spawnDust(boulderCenterX, boulderCenterY + BOULDER_RADIUS * 0.7, 4, true);
        spawnDust(boulderContactX, boulderGroundY, 3, true, true);
      }

      // Ground Ambient Occlusion at exact boulder foot contact
      ctx.save();
      ctx.fillStyle = 'rgba(12, 10, 8, 0.65)';
      ctx.beginPath();
      ctx.ellipse(boulderContactX, boulderGroundY + 1, BOULDER_RADIUS * 0.42, 4.5, -SLOPE_ANGLE, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 6. Draw Sisyphus as Classic Articulated IK Stickman Pushing the Boulder
      ctx.save();
      ctx.translate(playerX, playerY);
      ctx.rotate(-SLOPE_ANGLE);

      StickmanRenderer.renderStickman(
        ctx,
        status,
        isPushing,
        activeDist,
        now,
        BOULDER_RADIUS
      );

      ctx.restore();

      // 7. Draw The Boulder (Craggy Granite Stone with Etching Detail)
      // Note: If DESCENDING, boulder is resting down in the valley mist at slope base
      if (status !== 'DESCENDING') {
        ctx.save();
        ctx.translate(boulderCenterX, boulderCenterY);
        ctx.rotate(boulderAngleRef.current);

        // Drop shadow on ground
        ctx.save();
        ctx.rotate(-boulderAngleRef.current);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, BOULDER_RADIUS * 0.9, BOULDER_RADIUS * 0.95, 12, -SLOPE_ANGLE, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Boulder body - craggy polygon
        const numVertices = 18;
        ctx.beginPath();
        for (let i = 0; i < numVertices; i++) {
          const vAngle = (i / numVertices) * Math.PI * 2;
          const wobble = 1 + Math.sin(i * 3.4) * 0.08 + Math.cos(i * 1.9) * 0.06;
          const rad = BOULDER_RADIUS * wobble;
          const vx = Math.cos(vAngle) * rad;
          const vy = Math.sin(vAngle) * rad;
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();

        const stoneGrad = ctx.createRadialGradient(-BOULDER_RADIUS * 0.3, -BOULDER_RADIUS * 0.3, 8, 0, 0, BOULDER_RADIUS);
        stoneGrad.addColorStop(0, '#564E43');
        stoneGrad.addColorStop(0.65, '#2C2720');
        stoneGrad.addColorStop(1, '#161310');
        ctx.fillStyle = stoneGrad;
        ctx.fill();

        ctx.strokeStyle = '#100E0C';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Internal Woodcut Fissures & Chisel marks
        ctx.strokeStyle = 'rgba(215, 195, 165, 0.28)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-BOULDER_RADIUS * 0.4, -BOULDER_RADIUS * 0.2);
        ctx.lineTo(-10, 5);
        ctx.lineTo(BOULDER_RADIUS * 0.35, 8);
        ctx.moveTo(0, -BOULDER_RADIUS * 0.5);
        ctx.lineTo(12, -10);
        ctx.stroke();

        ctx.restore();
      } else {
        // In Descent state, draw distant resting stone at the bottom of the slope
        const valleyStoneX = width * 0.12;
        const valleyStoneY = slopeStartY - (valleyStoneX - slopeStartX) * Math.tan(SLOPE_ANGLE) - 18;
        ctx.save();
        ctx.fillStyle = '#1D1A16';
        ctx.beginPath();
        ctx.ellipse(valleyStoneX, valleyStoneY, 28, 22, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(60, 50, 40, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // 8. Update and Render Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // 9. Foreground Foliage Layer (Twisted Pines, Thorn Bushes, Wild Grass with Deep Parallax)
      foregroundFoliageRef.current.render(ctx, width, height, activeDist, now, season);

      // 10. Floating Philosophical Monologue Banner
      const thought = monologueEngine.getActiveThought();
      if (thought) {
        ctx.save();
        const maxTextWidth = Math.max(240, width - 80);
        const fontSize = width < 500 ? 12 : 14;
        ctx.font = `italic ${fontSize}px Newsreader, Georgia, serif`;
        ctx.textAlign = 'center';

        // Word wrap to support multi-line philosophical citations cleanly
        const words = thought.text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
          const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
          const testMetrics = ctx.measureText(testLine);
          if (testMetrics.width > maxTextWidth && currentLine) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);

        const lineHeight = fontSize * 1.35;
        const totalTextHeight = lines.length * lineHeight;
        const maxMeasuredLineWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));
        const boxWidth = Math.min(width - 24, maxMeasuredLineWidth + 34);
        const boxHeight = totalTextHeight + 14;
        const boxY = height * 0.16;

        ctx.fillStyle = `rgba(10, 9, 8, ${thought.alpha * 0.85})`;
        ctx.fillRect(width / 2 - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight);

        ctx.strokeStyle = `rgba(180, 140, 70, ${thought.alpha * 0.45})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(width / 2 - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight);

        ctx.fillStyle = `rgba(242, 235, 224, ${thought.alpha})`;
        const startY = boxY - totalTextHeight / 2 + fontSize * 0.82;
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], width / 2, startY + i * lineHeight);
        }
        ctx.restore();
      }

      // 11. Warning overlay if slipping
      if (status === 'SLIPPING') {
        const pulse = 0.14 + Math.sin(now * 0.015) * 0.08;
        ctx.fillStyle = `rgba(180, 40, 30, ${pulse})`;
        ctx.fillRect(0, 0, width, height);

        ctx.font = '700 13px Cinzel, serif';
        ctx.fillStyle = '#EF4444';
        ctx.textAlign = 'center';
        ctx.fillText(lang === 'fr' ? 'LA GRAVITÉ REPREND SES DROITS · POUSSEZ !' : 'GRAVITY PULLING BACK · RESUME PUSHING', width / 2, 42);
      }

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [status, isPushing, distance, runTime, totalAttempts, lang, season, seasonConfig, maxDistance, cairns, descendDistance, SLOPE_ANGLE, spawnDust]);

  // Adjust canvas size to match container with crisp Hi-DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] min-h-[320px] max-h-[540px] rounded-xl overflow-hidden border border-[#3A332A] bg-[#121110] shadow-2xl no-select">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer touch-none select-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          onPushStart();
        }}
        onPointerUp={(e) => {
          try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
          onPushEnd();
        }}
        onPointerCancel={(e) => {
          try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch {}
          onPushEnd();
        }}
        aria-label="Sisyphus Mountain Interactive Canvas"
      />

      {/* Descent Mode Indicator */}
      {status === 'DESCENDING' && (
        <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2 bg-amber-950/70 border border-amber-600/60 px-3 py-1 rounded-lg">
          <span className="text-[10px] font-cinzel uppercase tracking-widest text-amber-200 font-bold">
            {lang === 'fr' ? 'La Descente Lucide' : 'The Conscious Descent'}
          </span>
        </div>
      )}
    </div>
  );
};
