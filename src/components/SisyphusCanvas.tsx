import React, { useEffect, useRef, useCallback } from 'react';
import { GameStatus, Language, Season, SeasonConfig } from '../types/game';
import { soundEngine } from '../services/audio';
import { BirdSystem, ForegroundFoliage, getAtmosphereForCycle } from '../services/atmosphere';
import { monologueEngine } from '../services/monologue';

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
  onPushStart,
  onPushEnd
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const boulderAngleRef = useRef<number>(0);
  const strainTrembleRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const soundThrottleRef = useRef<number>(0);

  // Atmospheric Systems
  const birdSystemRef = useRef<BirdSystem>(new BirdSystem());
  const foregroundFoliageRef = useRef<ForegroundFoliage>(new ForegroundFoliage());
  const starsRef = useRef<Star[]>([]);

  // Slope geometry constants
  const SLOPE_ANGLE = 0.44; // ~25.2 degrees in radians
  const BOULDER_RADIUS = 46;

  // Initialize stars once
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 45; i++) {
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

  // Add dust particles
  const spawnDust = useCallback((x: number, y: number, count = 3, isSevere = false) => {
    for (let i = 0; i < count; i++) {
      const angle = SLOPE_ANGLE + Math.PI + (Math.random() - 0.5) * 0.8;
      const speed = isSevere ? 2.5 + Math.random() * 4 : 1.2 + Math.random() * 2;
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: isSevere ? 2.5 + Math.random() * 3.5 : 1.5 + Math.random() * 2.5,
        alpha: 0.8,
        color: Math.random() > 0.4 ? '#8C8273' : '#4A433A',
        life: 0,
        maxLife: isSevere ? 35 + Math.random() * 25 : 20 + Math.random() * 20
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

      // Update atmospheric state
      const atmosphere = getAtmosphereForCycle(totalAttempts, runTime);

      // Check interior thoughts
      monologueEngine.checkTriggers(distance, status, lang, dt);

      // Update sound scrape throttling and wind
      if (isPushing && status === 'PUSHING') {
        soundThrottleRef.current += dt;
        if (soundThrottleRef.current > 0.16) {
          soundEngine.playPushScrape(0.9 + Math.random() * 0.2);
          soundThrottleRef.current = 0;
        }
      } else {
        soundThrottleRef.current = 0;
      }

      // Update altitude wind audio with seasonal weather squalls
      const altitude = distance * Math.sin(SLOPE_ANGLE);
      const seasonWindFactor = season === 'WINTER' ? 1.7 : season === 'AUTUMN' ? 1.35 : 1.0;
      soundEngine.updateAmbientWind(altitude, isPushing && status === 'PUSHING', seasonWindFactor);

      // Update birds
      birdSystemRef.current.update(width, height, dt, () => {
        soundEngine.playDistantBird();
      });

      // Update boulder rotation
      if (status === 'PUSHING') {
        boulderAngleRef.current += dt * 3.8;
      } else if (status === 'SLIPPING') {
        boulderAngleRef.current -= dt * 2.5;
        strainTrembleRef.current = (Math.random() - 0.5) * 4;
      } else if (status === 'CRASHING') {
        boulderAngleRef.current -= dt * 14.0;
        strainTrembleRef.current = (Math.random() - 0.5) * 6;
      } else {
        strainTrembleRef.current = 0;
      }

      // 1. Draw Atmospheric Sky Gradient (Dynamic Day/Night Cycle)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, atmosphere.skyColors[0]);
      skyGrad.addColorStop(0.5, atmosphere.skyColors[1]);
      skyGrad.addColorStop(1, atmosphere.skyColors[2]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

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
        // Moon crater shadow
        ctx.fillStyle = atmosphere.skyColors[0];
        ctx.beginPath();
        ctx.arc(celestialX + 9, celestialY - 4, 22, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sun halo / disc
        const sunGlow = ctx.createRadialGradient(celestialX, celestialY, 10, celestialX, celestialY, 60);
        sunGlow.addColorStop(0, 'rgba(235, 215, 185, 0.45)');
        sunGlow.addColorStop(0.6, 'rgba(235, 215, 185, 0.12)');
        sunGlow.addColorStop(1, 'rgba(235, 215, 185, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(celestialX, celestialY, 60, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 2. Solitary Passing Birds
      birdSystemRef.current.render(ctx);

      // 3. Distant mountain peaks (woodcut silhouette parallax)
      const parallaxOffset = (distance * 12) % (width * 1.5);
      
      // Distant mountain layer
      const distLight = Math.round(24 * atmosphere.ambientLight);
      ctx.fillStyle = `rgb(${distLight}, ${distLight}, ${Math.round(distLight * 1.05)})`;
      ctx.beginPath();
      ctx.moveTo(-100, height);
      ctx.lineTo(-50, height * 0.45);
      ctx.lineTo(width * 0.25, height * 0.55);
      ctx.lineTo(width * 0.55, height * 0.38);
      ctx.lineTo(width * 0.85, height * 0.52);
      ctx.lineTo(width + 100, height * 0.35);
      ctx.lineTo(width + 100, height);
      ctx.closePath();
      ctx.fill();

      // Mid-distance rugged crag with etching crosshatches
      const midLight = Math.round(32 * atmosphere.ambientLight);
      ctx.fillStyle = `rgb(${midLight}, ${Math.round(midLight * 0.95)}, ${Math.round(midLight * 0.88)})`;
      ctx.beginPath();
      ctx.moveTo(-100, height);
      ctx.lineTo(0, height * 0.65);
      ctx.lineTo(width * 0.35, height * 0.48);
      ctx.lineTo(width * 0.7, height * 0.62);
      ctx.lineTo(width + 100, height * 0.45);
      ctx.lineTo(width + 100, height);
      ctx.closePath();
      ctx.fill();

      // 3b. Midground Silhouettes (Ledges, distant pines)
      foregroundFoliageRef.current.renderMidground(ctx, width, height, distance, now);

      // 4. Slope Setup
      const slopeStartX = -50;
      const slopeStartY = height * 0.82;
      const slopeEndX = width + 50;
      const slopeEndY = slopeStartY - (slopeEndX - slopeStartX) * Math.tan(SLOPE_ANGLE);

      // Draw Main Mountain Mass
      ctx.fillStyle = atmosphere.timeOfDay === 'NIGHT' ? '#0E0D10' : '#151311';
      ctx.beginPath();
      ctx.moveTo(slopeStartX, slopeStartY);
      ctx.lineTo(slopeEndX, slopeEndY);
      ctx.lineTo(slopeEndX, height);
      ctx.lineTo(slopeStartX, height);
      ctx.closePath();
      ctx.fill();

      // Slope Rocky Rim Line & Crosshatch Crags
      ctx.strokeStyle = atmosphere.timeOfDay === 'NIGHT' ? '#4A4852' : '#6A5E50';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(slopeStartX, slopeStartY);
      ctx.lineTo(slopeEndX, slopeEndY);
      ctx.stroke();

      // Seasonal Terrain Slope Modifications
      if (season === 'WINTER') {
        // Glistening Verglas / Black Ice on the granite slope
        ctx.strokeStyle = 'rgba(235, 245, 255, 0.88)';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(slopeStartX, slopeStartY - 1);
        ctx.lineTo(slopeEndX, slopeEndY - 1);
        ctx.stroke();

        // Stalactites / Icicles hanging from the slope edge
        ctx.fillStyle = 'rgba(235, 245, 255, 0.8)';
        for (let ic = 20; ic < width; ic += 48) {
          const icX = ic;
          const icY = slopeStartY - (icX - slopeStartX) * Math.tan(SLOPE_ANGLE);
          ctx.beginPath();
          ctx.moveTo(icX, icY);
          ctx.lineTo(icX + 2.5, icY + 11);
          ctx.lineTo(icX + 5, icY);
          ctx.fill();
        }
      } else if (season === 'AUTUMN') {
        // Wet slippery fallen leaves scattered on the stone path
        for (let l = 0; l < 14; l++) {
          const lx = (l * 65 + (distance * 14)) % (width + 50);
          const ly = slopeStartY - (lx - slopeStartX) * Math.tan(SLOPE_ANGLE) + 2;
          ctx.fillStyle = l % 2 === 0 ? '#B45309' : '#D97706';
          ctx.fillRect(lx, ly, 4.5, 2.2);
        }
      } else if (season === 'SPRING') {
        // Spring alpine moss and tiny wildflower buds on rock fissures
        for (let f = 0; f < 12; f++) {
          const fx = (f * 70) % (width + 40);
          const fy = slopeStartY - (fx - slopeStartX) * Math.tan(SLOPE_ANGLE) + 3;
          ctx.fillStyle = f % 2 === 0 ? '#4ADE80' : '#F472B6';
          ctx.beginPath();
          ctx.arc(fx, fy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Traces of past attempts (grooves on the rock)
      const numScuffs = Math.min(18, 4 + totalAttempts * 2);
      ctx.strokeStyle = 'rgba(40, 36, 32, 0.65)';
      ctx.lineWidth = 2;
      for (let s = 0; s < numScuffs; s++) {
        const scuffX = (s * 47) % (width + 60);
        const scuffY = slopeStartY - (scuffX - slopeStartX) * Math.tan(SLOPE_ANGLE) + 8;
        ctx.beginPath();
        ctx.moveTo(scuffX, scuffY);
        ctx.lineTo(scuffX - 12, scuffY + 6);
        ctx.stroke();
      }

      // Distance milestones carved on stone slope
      const milestoneSpacing = 160;
      const pixelOffset = (distance * 16) % milestoneSpacing;
      const baseMarkerMeters = Math.floor(distance / 10) * 10;

      ctx.font = '11px Cinzel, serif';
      ctx.fillStyle = 'rgba(196, 179, 155, 0.45)';
      ctx.textAlign = 'center';

      for (let m = -1; m <= 3; m++) {
        const mx = width * 0.45 + m * milestoneSpacing - pixelOffset;
        const my = slopeStartY - (mx - slopeStartX) * Math.tan(SLOPE_ANGLE);
        const markerVal = baseMarkerMeters + m * 10;
        if (markerVal >= 0 && mx > 30 && mx < width - 30) {
          ctx.fillRect(mx - 8, my - 2, 16, 4);
          ctx.fillText(`${markerVal}m`, mx, my + 18);
        }
      }

      // 5. Sisyphus and Boulder coordinates on slope
      const playerX = width * 0.42;
      const playerY = slopeStartY - (playerX - slopeStartX) * Math.tan(SLOPE_ANGLE);

      const normalX = Math.sin(SLOPE_ANGLE);
      const normalY = -Math.cos(SLOPE_ANGLE);

      const boulderCenterX = playerX + Math.cos(SLOPE_ANGLE) * (BOULDER_RADIUS * 0.95) + normalX * BOULDER_RADIUS + strainTrembleRef.current;
      const boulderCenterY = playerY - Math.sin(SLOPE_ANGLE) * (BOULDER_RADIUS * 0.95) + normalY * BOULDER_RADIUS;

      // Dust & particles
      if (status === 'PUSHING' && Math.random() > 0.4) {
        spawnDust(playerX - 20, playerY, 1, false);
      } else if (status === 'SLIPPING') {
        spawnDust(boulderCenterX, boulderCenterY + BOULDER_RADIUS * 0.7, 2, true);
      } else if (status === 'CRASHING') {
        spawnDust(boulderCenterX, boulderCenterY + BOULDER_RADIUS * 0.7, 4, true);
      }

      // 6. Draw Silhouette of Sisyphus
      ctx.save();
      ctx.translate(playerX, playerY);
      ctx.rotate(-SLOPE_ANGLE);

      ctx.fillStyle = '#060606';
      ctx.strokeStyle = '#060606';

      const lean = isPushing ? 0.38 : (status === 'SLIPPING' ? -0.1 : 0.05);

      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Back leg driving into earth
      ctx.beginPath();
      ctx.moveTo(-32, -2);
      ctx.lineTo(-20, -18);
      ctx.lineTo(-8, -32);
      ctx.stroke();

      // Front leg bent powerfully
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.lineTo(8, -20);
      ctx.lineTo(-4, -32);
      ctx.stroke();

      // Torso leaning into the boulder
      ctx.beginPath();
      ctx.moveTo(-6, -32);
      ctx.lineTo(16 + lean * 18, -48);
      ctx.lineWidth = 11;
      ctx.stroke();

      // Head bowed down
      ctx.beginPath();
      ctx.arc(22 + lean * 20, -52, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Arms reaching out
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(14 + lean * 16, -45);
      if (isPushing) {
        ctx.lineTo(32, -43);
        ctx.lineTo(44, -38);
      } else if (status === 'SLIPPING') {
        ctx.lineTo(26, -38);
        ctx.lineTo(38, -30);
      } else {
        ctx.lineTo(24, -36);
        ctx.lineTo(36, -34);
      }
      ctx.stroke();

      ctx.restore();

      // 7. Draw The Boulder (Engraved Granite Stone)
      ctx.save();
      ctx.translate(boulderCenterX, boulderCenterY);
      ctx.rotate(boulderAngleRef.current);

      // Drop shadow on ground
      ctx.save();
      ctx.rotate(-boulderAngleRef.current);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, BOULDER_RADIUS * 0.9, BOULDER_RADIUS * 0.95, 12, -SLOPE_ANGLE, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Boulder body - craggy polygon
      const numVertices = 16;
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
      stoneGrad.addColorStop(0, '#544D42');
      stoneGrad.addColorStop(0.65, '#2B2620');
      stoneGrad.addColorStop(1, '#151310');
      ctx.fillStyle = stoneGrad;
      ctx.fill();

      ctx.strokeStyle = '#100E0C';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Fissures
      ctx.strokeStyle = 'rgba(215, 195, 165, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-BOULDER_RADIUS * 0.4, -BOULDER_RADIUS * 0.2);
      ctx.lineTo(-10, 5);
      ctx.lineTo(BOULDER_RADIUS * 0.35, 8);
      ctx.stroke();

      ctx.restore();

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
      foregroundFoliageRef.current.render(ctx, width, height, distance, now, season);

      // 10. Floating Death Stranding style Interior Monologue
      const thought = monologueEngine.getActiveThought();
      if (thought) {
        ctx.save();
        ctx.font = 'italic 15px Newsreader, Georgia, serif';
        ctx.textAlign = 'center';
        // Subtle dark translucent banner
        const textMetrics = ctx.measureText(thought.text);
        const boxWidth = textMetrics.width + 36;
        const boxY = height * 0.18;

        ctx.fillStyle = `rgba(10, 9, 8, ${thought.alpha * 0.72})`;
        ctx.fillRect(width / 2 - boxWidth / 2, boxY - 18, boxWidth, 32);

        ctx.strokeStyle = `rgba(80, 72, 60, ${thought.alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(width / 2 - boxWidth / 2, boxY - 18, boxWidth, 32);

        ctx.fillStyle = `rgba(238, 230, 218, ${thought.alpha})`;
        ctx.fillText(thought.text, width / 2, boxY + 4);
        ctx.restore();
      }

      // 10. Warning overlay if slipping
      if (status === 'SLIPPING') {
        const pulse = 0.15 + Math.sin(now * 0.015) * 0.1;
        ctx.fillStyle = `rgba(180, 40, 30, ${pulse})`;
        ctx.fillRect(0, 0, width, height);

        ctx.font = '700 13px Cinzel, serif';
        ctx.fillStyle = '#EF4444';
        ctx.textAlign = 'center';
        ctx.fillText('GRAVITY PULLING BACK · RESUME PUSHING', width / 2, 42);
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
  }, [status, isPushing, distance, runTime, totalAttempts, lang, SLOPE_ANGLE, spawnDust]);

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

  const atmosphere = getAtmosphereForCycle(totalAttempts, runTime);

  return (
    <div className="relative w-full aspect-[16/9] min-h-[320px] max-h-[540px] rounded-xl overflow-hidden border border-[#3A332A] bg-[#121110] shadow-2xl no-select">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer touch-none"
        onMouseDown={onPushStart}
        onMouseUp={onPushEnd}
        onMouseLeave={onPushEnd}
        onTouchStart={(e) => {
          e.preventDefault();
          onPushStart();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onPushEnd();
        }}
        onTouchCancel={onPushEnd}
        aria-label="Sisyphus Mountain Interactive Canvas"
      />

      {/* Atmospheric Header: Season & Time of Day */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#3C342A]">
          <span className="text-xs">{seasonConfig.icon}</span>
          <span className="text-[11px] font-cinzel uppercase tracking-widest text-amber-200/90 font-bold">
            {lang === 'fr' ? seasonConfig.nameFr : seasonConfig.nameEn}
          </span>
          <span className="text-[10px] text-[#8C8070] font-mono">·</span>
          <span className="text-[10px] font-mono text-[#C4B9AA]">
            {lang === 'fr' ? atmosphere.labelFr : atmosphere.labelEn}
          </span>
        </div>
        
        {/* Grip / Inertia Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#A69B8D] font-mono">
            {Math.round(toleranceRatio * 100)}%
          </span>
          <div className="w-28 h-1.5 bg-[#25201A] rounded-full overflow-hidden border border-[#453D32]">
            <div
              className={`h-full transition-all duration-75 ${
                toleranceRatio > 0.45 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, toleranceRatio * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
