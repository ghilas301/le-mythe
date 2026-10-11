/**
 * Celestial Sky Whale Engine — Le Mythe de Sisyphe
 * A majestic cosmic whale gliding serenely across the upper mountain skies.
 * 
 * Inspired by classic absurdist and surrealist aesthetics (Gris, Gojira, Star Whale).
 * Features:
 * - Fluid undulating spine kinematics (harmonic tail and fluke movement)
 * - Articulated pectoral fins that gently bank and glide
 * - Throat pleats (grooves) and antique woodcut engraving lines
 * - Bioluminescent stardust mist trail drifting from tail flukes
 * - Luminous stardust blowhole spray plumes
 */

interface StardustParticle {
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

export class SkyWhaleSystem {
  // World / Screen positioning
  private x: number = -220;
  private y: number = 90;
  private speed: number = 24; // pixels per second
  private swimPhase: number = 0;
  private blowTimer: number = 0;
  private stardust: StardustParticle[] = [];

  constructor() {
    this.reset();
  }

  public reset(initialX = -200) {
    this.x = initialX;
    this.y = 70 + Math.random() * 50;
    this.swimPhase = Math.random() * Math.PI * 2;
    this.blowTimer = 6 + Math.random() * 8;
  }

  public update(dt: number, width: number, height: number) {
    // Progress horizontal swim across the canvas
    this.x += this.speed * dt;
    this.swimPhase += dt * 1.4; // Graceful, slow tail beat

    // Gentle vertical float bobbing
    const targetY = height * 0.18 + Math.sin(this.swimPhase * 0.6) * 14;
    this.y += (targetY - this.y) * 0.05;

    // Blowhole plume timer
    this.blowTimer -= dt;
    if (this.blowTimer <= 0) {
      this.spawnBlowholePlume();
      this.blowTimer = 14 + Math.random() * 12; // Every 14-26 seconds
    }

    // Spawn subtle stardust trail from tail fluke
    if (Math.random() > 0.4) {
      this.spawnTailStardust();
    }

    // Update stardust particles
    for (let i = this.stardust.length - 1; i >= 0; i--) {
      const p = this.stardust[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life += dt;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) {
        this.stardust.splice(i, 1);
      }
    }

    // Reset when fully flown past the screen
    if (this.x > width + 260) {
      this.x = -260;
      this.y = height * 0.14 + Math.random() * (height * 0.12);
    }
  }

  private spawnBlowholePlume() {
    // Blowhole is located on top of the whale head (~x + 35)
    const blowX = this.x + 32;
    const blowY = this.y - 12;

    for (let i = 0; i < 35; i++) {
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 0.65;
      const speed = 1.2 + Math.random() * 2.8;
      this.stardust.push({
        x: blowX + (Math.random() - 0.5) * 6,
        y: blowY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.5,
        vy: Math.sin(angle) * speed,
        size: 1.0 + Math.random() * 2.2,
        alpha: 0.9,
        color: Math.random() > 0.4 ? '#E0F2FE' : '#FDE68A',
        life: 0,
        maxLife: 1.8 + Math.random() * 1.4
      });
    }
  }

  private spawnTailStardust() {
    // Tail is trailing behind at the left of the whale (~x - 90)
    const tailX = this.x - 88;
    const tailY = this.y + Math.sin(this.swimPhase - 1.2) * 16;

    this.stardust.push({
      x: tailX + (Math.random() - 0.5) * 12,
      y: tailY + (Math.random() - 0.5) * 8,
      vx: -0.4 - Math.random() * 0.6,
      vy: (Math.random() - 0.5) * 0.4,
      size: 0.8 + Math.random() * 1.8,
      alpha: 0.7,
      color: Math.random() > 0.5 ? '#93C5FD' : '#FDE047',
      life: 0,
      maxLife: 2.2 + Math.random() * 1.5
    });
  }

  /**
   * Renders the Celestial Sky Whale with ethereal illumination and antique engraving lines
   */
  public render(ctx: CanvasRenderingContext2D, isNight: boolean) {
    ctx.save();

    // 1. Draw Stardust Particles
    for (const p of this.stardust) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Whale Body Kinematics
    const cx = this.x;
    const cy = this.y;
    const phase = this.swimPhase;

    // Spine displacement points (swimming wave propagates down the body)
    const headWave = Math.sin(phase) * 3;
    const midWave = Math.sin(phase - 0.6) * 6;
    const tailWave = Math.sin(phase - 1.3) * 15;
    const flukeAngle = Math.cos(phase - 1.3) * 0.35;
    const finFlap = Math.sin(phase * 0.9) * 0.25;

    ctx.translate(cx, cy);

    // Ethereal outer glow aura
    ctx.save();
    const auraGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, 95);
    auraGrad.addColorStop(0, isNight ? 'rgba(147, 197, 253, 0.18)' : 'rgba(251, 191, 36, 0.14)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 105, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --------------------------------------------------------
    // Far Pectoral Fin (Behind body)
    // --------------------------------------------------------
    ctx.save();
    ctx.translate(10, 4);
    ctx.rotate(-0.35 + finFlap * 0.6);
    ctx.fillStyle = isNight ? '#161F2E' : '#231E18';
    ctx.strokeStyle = isNight ? 'rgba(125, 161, 209, 0.4)' : 'rgba(180, 150, 110, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(8, 12, 18, 32, 28, 42);
    ctx.bezierCurveTo(18, 42, 6, 26, -4, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // --------------------------------------------------------
    // Whale Main Torso (Belly and Arched Back)
    // --------------------------------------------------------
    ctx.save();
    ctx.beginPath();
    // Head snout (Facing right)
    const snoutX = 72;
    const snoutY = headWave * 0.5;

    ctx.moveTo(snoutX, snoutY);

    // Top dorsal curve from snout to tail
    // Snout -> Crown / Blowhole -> Dorsal hump -> Tail stock
    ctx.bezierCurveTo(55, -16 + headWave, 25, -22 + midWave, -15, -18 + midWave);
    // Dorsal fin ridge
    ctx.lineTo(-32, -22 + midWave);
    ctx.lineTo(-36, -16 + midWave);
    ctx.bezierCurveTo(-52, -12 + midWave, -70, -6 + tailWave, -92, tailWave);

    // Tail Flukes (Tail fins at the back)
    const flukeBaseX = -92;
    const flukeBaseY = tailWave;

    // Bottom belly curve from tail stock back to jaw
    ctx.bezierCurveTo(-72, 6 + tailWave, -45, 18 + midWave, -15, 20 + midWave);
    // Lower jaw & belly curve
    ctx.bezierCurveTo(20, 22 + midWave, 52, 14 + headWave, snoutX, snoutY);
    ctx.closePath();

    // Body shading gradient: deep cosmic blue-black with celestial highlights
    const bodyGrad = ctx.createLinearGradient(0, -25, 0, 25);
    if (isNight) {
      bodyGrad.addColorStop(0, '#1E293B'); // Slate star blue
      bodyGrad.addColorStop(0.5, '#0F172A');
      bodyGrad.addColorStop(1, '#080E1A');
    } else {
      bodyGrad.addColorStop(0, '#383025'); // Antique engraved sepia
      bodyGrad.addColorStop(0.5, '#1E1914');
      bodyGrad.addColorStop(1, '#110E0B');
    }
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Body engraved contour outline
    ctx.strokeStyle = isNight ? 'rgba(186, 215, 255, 0.75)' : 'rgba(217, 180, 130, 0.75)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // --------------------------------------------------------
    // Antique Ventral Throat Grooves (Engraved Whale Belly Pleats)
    // --------------------------------------------------------
    ctx.strokeStyle = isNight ? 'rgba(147, 197, 253, 0.35)' : 'rgba(196, 160, 115, 0.35)';
    ctx.lineWidth = 1.0;
    const pleatStartY = 6;
    for (let pl = 0; pl < 5; pl++) {
      ctx.beginPath();
      const py = pleatStartY + pl * 3.2;
      ctx.moveTo(snoutX - 16, snoutY + 4 + pl * 1.5);
      ctx.bezierCurveTo(40, py + 4 + headWave, 10, py + 5 + midWave, -18, py - 2 + midWave);
      ctx.stroke();
    }

    // Small starlight eye
    ctx.fillStyle = isNight ? '#FDE047' : '#F59E0B';
    ctx.beginPath();
    ctx.arc(46, -3 + headWave * 0.8, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Star freckles on whale flank
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(8, -4 + midWave, 1.2, 0, Math.PI * 2);
    ctx.arc(-12, -2 + midWave, 1.0, 0, Math.PI * 2);
    ctx.arc(-28, -6 + midWave, 1.3, 0, Math.PI * 2);
    ctx.arc(22, -8 + headWave, 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // --------------------------------------------------------
    // Near Pectoral Fin (Graceful massive wing in foreground)
    // --------------------------------------------------------
    ctx.save();
    ctx.translate(14, 6 + midWave);
    ctx.rotate(0.25 + finFlap);
    ctx.fillStyle = isNight ? '#253347' : '#2D261E';
    ctx.strokeStyle = isNight ? 'rgba(191, 219, 254, 0.75)' : 'rgba(225, 190, 140, 0.75)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(12, 14, 26, 36, 42, 48);
    ctx.bezierCurveTo(28, 48, 10, 32, -6, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Fin engraving ridges
    ctx.strokeStyle = isNight ? 'rgba(147, 197, 253, 0.35)' : 'rgba(180, 150, 110, 0.35)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(8, 10);
    ctx.lineTo(24, 34);
    ctx.moveTo(14, 16);
    ctx.lineTo(34, 42);
    ctx.stroke();
    ctx.restore();

    // --------------------------------------------------------
    // Tail Flukes (Wide horizontal caudal fin)
    // --------------------------------------------------------
    ctx.save();
    ctx.translate(flukeBaseX, flukeBaseY);
    ctx.rotate(flukeAngle);
    ctx.fillStyle = isNight ? '#222E42' : '#29221B';
    ctx.strokeStyle = isNight ? 'rgba(186, 215, 255, 0.75)' : 'rgba(217, 180, 130, 0.75)';
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Upper lobe
    ctx.bezierCurveTo(-14, -14, -28, -26, -34, -28);
    ctx.bezierCurveTo(-30, -18, -22, -6, -14, -1);
    // Lower lobe
    ctx.bezierCurveTo(-22, 6, -30, 18, -34, 28);
    ctx.bezierCurveTo(-28, 26, -14, 14, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
}
