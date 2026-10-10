import React, { useEffect, useRef, useCallback } from 'react';
import { GameStatus } from '../types/game';
import { soundEngine } from '../services/audio';

interface SisyphusCanvasProps {
  status: GameStatus;
  isPushing: boolean;
  distance: number;
  toleranceRatio: number; // 1.0 (full) to 0.0 (danger)
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

export const SisyphusCanvas: React.FC<SisyphusCanvasProps> = ({
  status,
  isPushing,
  distance,
  toleranceRatio,
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

  // Slope geometry constants
  const SLOPE_ANGLE = 0.44; // ~25.2 degrees in radians
  const BOULDER_RADIUS = 46;

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

      // Ensure crisp high-DPI rendering
      const width = canvas.width;
      const height = canvas.height;

      // Update sound scrape throttling
      if (isPushing && status === 'PUSHING') {
        soundThrottleRef.current += dt;
        if (soundThrottleRef.current > 0.16) {
          soundEngine.playPushScrape(0.9 + Math.random() * 0.2);
          soundThrottleRef.current = 0;
        }
      } else {
        soundThrottleRef.current = 0;
      }

      // Update boulder rotation
      if (status === 'PUSHING') {
        boulderAngleRef.current += dt * 3.8;
      } else if (status === 'SLIPPING') {
        boulderAngleRef.current -= dt * 2.5;
        strainTrembleRef.current = (Math.random() - 0.5) * 4;
      } else if (status === 'CRASHING') {
        boulderAngleRef.current -= dt * 14.0; // Fast rolling backward
        strainTrembleRef.current = (Math.random() - 0.5) * 6;
      } else {
        strainTrembleRef.current = 0;
      }

      // 1. Draw Atmospheric Sky Gradient (antique parchment / dusk)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0F0E0D');
      skyGrad.addColorStop(0.5, '#1B1713');
      skyGrad.addColorStop(0.85, '#2D2319');
      skyGrad.addColorStop(1, '#3D2F20');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Distant mountain peaks (woodcut silhouette parallax)
      const parallaxOffset = (distance * 12) % (width * 1.5);
      
      // Distant mountain layer (subtle hazy charcoal)
      ctx.fillStyle = '#1D1A17';
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
      ctx.fillStyle = '#26221D';
      ctx.beginPath();
      ctx.moveTo(-100, height);
      ctx.lineTo(0, height * 0.65);
      ctx.lineTo(width * 0.35, height * 0.48);
      ctx.lineTo(width * 0.7, height * 0.62);
      ctx.lineTo(width + 100, height * 0.45);
      ctx.lineTo(width + 100, height);
      ctx.closePath();
      ctx.fill();

      // Sun / Eerie Moon Disc over the mountain
      ctx.fillStyle = 'rgba(217, 185, 143, 0.12)';
      ctx.beginPath();
      ctx.arc(width * 0.78, height * 0.25, 48, 0, Math.PI * 2);
      ctx.fill();

      // 3. Slope Setup
      // Slope baseline equation: y = slopeY0 - tan(SLOPE_ANGLE) * x
      // Ground plane passes through (slopeOriginX, slopeOriginY)
      const slopeStartX = -50;
      const slopeStartY = height * 0.82;
      const slopeEndX = width + 50;
      const slopeEndY = slopeStartY - (slopeEndX - slopeStartX) * Math.tan(SLOPE_ANGLE);

      // Draw Main Mountain Mass (Foreground rock)
      ctx.fillStyle = '#161412';
      ctx.beginPath();
      ctx.moveTo(slopeStartX, slopeStartY);
      ctx.lineTo(slopeEndX, slopeEndY);
      ctx.lineTo(slopeEndX, height);
      ctx.lineTo(slopeStartX, height);
      ctx.closePath();
      ctx.fill();

      // Slope Rocky Rim Line & Crosshatch Crags
      ctx.strokeStyle = '#6E6252';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(slopeStartX, slopeStartY);
      ctx.lineTo(slopeEndX, slopeEndY);
      ctx.stroke();

      // Hatching lines along the slope edge (Classical engraving style)
      ctx.strokeStyle = '#38322A';
      ctx.lineWidth = 1;
      const stepHatch = 18;
      for (let hx = slopeStartX + 10; hx < slopeEndX; hx += stepHatch) {
        const hy = slopeStartY - (hx - slopeStartX) * Math.tan(SLOPE_ANGLE);
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx - 14, hy + 22);
        ctx.stroke();
      }

      // Distance milestones carved on stone slope
      // Shift milestone positions based on current distance
      const milestoneSpacing = 160; // pixels per 10m
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
          // Carved milestone slab
          ctx.fillRect(mx - 8, my - 2, 16, 4);
          ctx.fillText(`${markerVal}m`, mx, my + 18);
        }
      }

      // 4. Sisyphus and Boulder coordinates on slope
      // We keep the player centered around 48% of the canvas width
      const playerX = width * 0.42;
      const playerY = slopeStartY - (playerX - slopeStartX) * Math.tan(SLOPE_ANGLE);

      // Boulder center position (touching the ground at tangent point)
      // The contact point is along slope. Normal vector points up-perpendicular to slope.
      const normalX = Math.sin(SLOPE_ANGLE);
      const normalY = -Math.cos(SLOPE_ANGLE);

      const boulderCenterX = playerX + Math.cos(SLOPE_ANGLE) * (BOULDER_RADIUS * 0.95) + normalX * BOULDER_RADIUS + strainTrembleRef.current;
      const boulderCenterY = playerY - Math.sin(SLOPE_ANGLE) * (BOULDER_RADIUS * 0.95) + normalY * BOULDER_RADIUS;

      // Spawn dust at Sisyphus feet when pushing or slipping
      if (status === 'PUSHING' && Math.random() > 0.4) {
        spawnDust(playerX - 20, playerY, 1, false);
      } else if (status === 'SLIPPING') {
        spawnDust(boulderCenterX, boulderCenterY + BOULDER_RADIUS * 0.7, 2, true);
      } else if (status === 'CRASHING') {
        spawnDust(boulderCenterX, boulderCenterY + BOULDER_RADIUS * 0.7, 4, true);
      }

      // 5. Draw Silhouette of Sisyphus
      ctx.save();
      ctx.translate(playerX, playerY);
      ctx.rotate(-SLOPE_ANGLE); // Align with mountain incline

      ctx.fillStyle = '#080807'; // Deep black ink silhouette
      ctx.strokeStyle = '#080807';

      const lean = isPushing ? 0.38 : (status === 'SLIPPING' ? -0.1 : 0.05);

      // Feet & Legs
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

      // Head bowed down in intense physical concentration
      ctx.beginPath();
      ctx.arc(22 + lean * 20, -52, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Arms reaching out and pushing against boulder face
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(14 + lean * 16, -45);
      if (isPushing) {
        // Taut arms extended against the rock
        ctx.lineTo(32, -43);
        ctx.lineTo(44, -38);
      } else if (status === 'SLIPPING') {
        // Struggling / slipping grip
        ctx.lineTo(26, -38);
        ctx.lineTo(38, -30);
      } else {
        // Resting on rock
        ctx.lineTo(24, -36);
        ctx.lineTo(36, -34);
      }
      ctx.stroke();

      ctx.restore();

      // 6. Draw The Boulder (Engraved Granite Stone)
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

      // Boulder body - craggy polygon (never a perfectly smooth sphere)
      const numVertices = 16;
      ctx.beginPath();
      for (let i = 0; i < numVertices; i++) {
        const vAngle = (i / numVertices) * Math.PI * 2;
        // Pseudo-random facet roughness based on vertex index
        const wobble = 1 + Math.sin(i * 3.4) * 0.08 + Math.cos(i * 1.9) * 0.06;
        const rad = BOULDER_RADIUS * wobble;
        const vx = Math.cos(vAngle) * rad;
        const vy = Math.sin(vAngle) * rad;
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();

      // Stone shading: dark granite with parchment rim
      const stoneGrad = ctx.createRadialGradient(-BOULDER_RADIUS * 0.3, -BOULDER_RADIUS * 0.3, 8, 0, 0, BOULDER_RADIUS);
      stoneGrad.addColorStop(0, '#544D42');
      stoneGrad.addColorStop(0.65, '#2B2620');
      stoneGrad.addColorStop(1, '#151310');
      ctx.fillStyle = stoneGrad;
      ctx.fill();

      ctx.strokeStyle = '#100E0C';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Internal Fissures & Engraving Etch Marks
      ctx.strokeStyle = 'rgba(215, 195, 165, 0.28)';
      ctx.lineWidth = 1.5;

      // Fissure 1
      ctx.beginPath();
      ctx.moveTo(-BOULDER_RADIUS * 0.4, -BOULDER_RADIUS * 0.2);
      ctx.lineTo(-10, 5);
      ctx.lineTo(BOULDER_RADIUS * 0.35, 8);
      ctx.stroke();

      // Fissure 2
      ctx.beginPath();
      ctx.moveTo(5, -BOULDER_RADIUS * 0.5);
      ctx.lineTo(12, -10);
      ctx.lineTo(26, -5);
      ctx.stroke();

      // Hatching texture inside boulder
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1;
      for (let line = -25; line <= 25; line += 8) {
        ctx.beginPath();
        ctx.moveTo(line, -15);
        ctx.lineTo(line + 10, 15);
        ctx.stroke();
      }

      ctx.restore();

      // 7. Update and Render Particles
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

      // 8. Warning overlay if slipping
      if (status === 'SLIPPING') {
        const pulse = 0.15 + Math.sin(now * 0.015) * 0.1;
        ctx.fillStyle = `rgba(180, 40, 30, ${pulse})`;
        ctx.fillRect(0, 0, width, height);

        // Warning Text in Canvas
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
  }, [status, isPushing, distance, SLOPE_ANGLE, spawnDust]);

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
    <div className="relative w-full aspect-[16/9] min-h-[300px] max-h-[520px] rounded-xl overflow-hidden border border-[#3A332A] bg-[#121110] shadow-2xl no-select">
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

      {/* Tolerance / Grip Grace Bar at top of canvas */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="text-[11px] font-cinzel uppercase tracking-widest text-amber-200/80">
            {status === 'PUSHING' ? 'MOMENTUM SUSTAINED' : status === 'SLIPPING' ? 'GRACE EXPIRING' : 'READY TO ASCEND'}
          </span>
        </div>
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
