/**
 * Living Mountain Encounters Engine — Le Mythe de Sisyphe
 * Enriches the ascent with living creatures, descending wanderers, and silent watchers:
 * 
 * 1. Ravens / Crows: Perched on ancient stones along the trail; tilt heads, then take flight when approached.
 * 2. Descending Souls / Weary Pilgrims: Stickmen wrapped in travel cloaks walking calmly downhill with walking staves.
 * 3. Mountain Ibex / Chamois: Majestic horned creatures perched high on crags observing Sisyphus's struggle.
 * 4. Silent Watchers: Solitary cloaked guardians standing on cliff promontories.
 * 5. Ethereal Mountain Wisps: Luminous spirits floating peacefully at higher altitudes (80m+).
 */

export interface LivingRaven {
  worldDistance: number; // distance in meters where it is located
  perchYOffset: number;
  isFlying: boolean;
  flightTimer: number;
  flightX: number;
  flightY: number;
  flightVx: number;
  flightVy: number;
  wingPhase: number;
  headTilt: number;
}

export interface DescendingWanderer {
  worldDistance: number; // starting distance in meters
  currentWorldDistance: number;
  speed: number; // meters per second walking down
  staffSide: number;
  stridePhase: number;
  quoteFr: string;
  quoteEn: string;
  hasSpoken: boolean;
}

export interface CragIbex {
  worldDistance: number;
  screenYRatio: number; // background height
  lookAngle: number;
  headTurnTimer: number;
  hornCurvature: number;
}

export interface CliffWatcher {
  worldDistance: number;
  heightRatio: number;
  hasStaff: boolean;
  cloakFlutter: number;
}

export interface MountainWisp {
  worldDistance: number;
  baseYOffset: number;
  pulsePhase: number;
  orbitRadius: number;
}

export class LivingWorldSystem {
  private ravens: LivingRaven[] = [];
  private wanderers: DescendingWanderer[] = [];
  private ibexes: CragIbex[] = [];
  private watchers: CliffWatcher[] = [];
  private wisps: MountainWisp[] = [];

  constructor() {
    this.initEncounters();
  }

  private initEncounters() {
    // 1. Ravens perched at various milestones along the ascent
    const ravenDistances = [6, 18, 34, 52, 78, 110, 155, 210];
    this.ravens = ravenDistances.map((dist, idx) => ({
      worldDistance: dist,
      perchYOffset: -12 - (idx % 2) * 6,
      isFlying: false,
      flightTimer: 0,
      flightX: 0,
      flightY: 0,
      flightVx: -1.2 - Math.random() * 0.8,
      flightVy: -0.9 - Math.random() * 0.6,
      wingPhase: Math.random() * Math.PI * 2,
      headTilt: 0
    }));

    // 2. Descending wanderers removed per user preference
    this.wanderers = [];

    // 3. Ibex / Wild mountain goats perched on crags
    const ibexDistances = [28, 65, 105, 160, 225];
    this.ibexes = ibexDistances.map((dist, idx) => ({
      worldDistance: dist,
      screenYRatio: 0.42 + (idx % 3) * 0.08,
      lookAngle: 0,
      headTurnTimer: Math.random() * 5,
      hornCurvature: 12 + (idx % 2) * 4
    }));

    // 4. Silent Watchers on cliff promontories
    const watcherDistances = [45, 85, 130, 190, 260];
    this.watchers = watcherDistances.map((dist, idx) => ({
      worldDistance: dist,
      heightRatio: 0.38 + (idx % 2) * 0.1,
      hasStaff: idx % 2 === 1,
      cloakFlutter: 0
    }));

    // 5. Luminous mountain wisps at higher altitudes (60m+)
    const wispDistances = [62, 74, 98, 125, 145, 175, 205, 235];
    this.wisps = wispDistances.map((dist, idx) => ({
      worldDistance: dist,
      baseYOffset: -35 - (idx % 3) * 15,
      pulsePhase: Math.random() * Math.PI * 2,
      orbitRadius: 10 + (idx % 3) * 8
    }));
  }

  /**
   * Updates state of living entities relative to Sisyphus's current distance
   */
  public update(playerDistance: number, dt: number, now: number) {
    // 1. Update Ravens
    this.ravens.forEach((r) => {
      const distDelta = Math.abs(playerDistance - r.worldDistance);

      // If Sisyphus approaches within 4.5 meters, raven takes flight!
      if (!r.isFlying && distDelta < 4.5 && playerDistance < r.worldDistance + 2) {
        r.isFlying = true;
        r.flightTimer = 0;
      }

      if (r.isFlying) {
        r.flightTimer += dt;
        r.flightX += r.flightVx * (dt * 60);
        r.flightY += r.flightVy * (dt * 60);
        r.wingPhase += 14 * dt;
      } else {
        // Subtle head twitch / preening while perched
        if (Math.sin(now * 0.002 + r.worldDistance) > 0.85) {
          r.headTilt = Math.sin(now * 0.008) * 0.35;
        } else {
          r.headTilt = 0;
        }
      }
    });

    // 2. Update Descending Wanderers
    this.wanderers.forEach((w) => {
      // Walk downhill slowly
      w.currentWorldDistance -= w.speed * dt;
      // Loop around if they reach valley bottom
      if (w.currentWorldDistance < 0) {
        w.currentWorldDistance = w.worldDistance + 30;
      }
      w.stridePhase += w.speed * 4.0 * dt;
    });

    // 3. Update Ibex heads
    this.ibexes.forEach((ibex) => {
      ibex.headTurnTimer += dt;
      if (ibex.headTurnTimer > 4) {
        ibex.lookAngle = (Math.random() - 0.5) * 0.4;
        ibex.headTurnTimer = 0;
      }
    });

    // 4. Update Watchers
    this.watchers.forEach((watcher) => {
      watcher.cloakFlutter = Math.sin(now * 0.004 + watcher.worldDistance) * 2;
    });

    // 5. Update Wisps
    this.wisps.forEach((wisp) => {
      wisp.pulsePhase += dt * 3;
    });
  }

  /**
   * Renders the living encounters on the canvas with correct mountain perspective
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    playerDistance: number,
    getTerrainY: (screenX: number) => number,
    now: number,
    lang: 'fr' | 'en' = 'fr'
  ) {
    ctx.save();
    const screenCenterX = width * 0.42;
    const pixelsPerMeter = 22; // world scale

    // -------------------------------------------------------------
    // A. BACKGROUND & MIDGROUND SILHOUETTES: Ibex on high spires & Watchers
    // -------------------------------------------------------------
    this.ibexes.forEach((ibex) => {
      const distFromPlayer = ibex.worldDistance - playerDistance;
      const ibexScreenX = screenCenterX + distFromPlayer * (pixelsPerMeter * 0.6); // Parallax factor 0.6

      if (ibexScreenX > -50 && ibexScreenX < width + 50) {
        const ibexY = height * ibex.screenYRatio;
        this.renderIbex(ctx, ibexScreenX, ibexY, ibex.lookAngle, ibex.hornCurvature);
      }
    });

    this.watchers.forEach((watcher) => {
      const distFromPlayer = watcher.worldDistance - playerDistance;
      const watcherScreenX = screenCenterX + distFromPlayer * (pixelsPerMeter * 0.7);

      if (watcherScreenX > -50 && watcherScreenX < width + 50) {
        const watcherY = height * watcher.heightRatio;
        this.renderSilentWatcher(ctx, watcherScreenX, watcherY, watcher.hasStaff, watcher.cloakFlutter);
      }
    });

    // -------------------------------------------------------------
    // C. PATH LAYER: Ravens perched on stones or taking flight
    // -------------------------------------------------------------
    this.ravens.forEach((raven) => {
      const distFromPlayer = raven.worldDistance - playerDistance;
      const perchScreenX = screenCenterX + distFromPlayer * pixelsPerMeter;

      if (perchScreenX > -80 && perchScreenX < width + 80) {
        const groundY = getTerrainY(perchScreenX);

        if (!raven.isFlying) {
          // Perched on stone
          this.renderPerchedRaven(ctx, perchScreenX, groundY - 2, raven.headTilt);
        } else {
          // Flying away into the sky
          const flyX = perchScreenX + raven.flightX;
          const flyY = groundY - 14 + raven.flightY;
          this.renderFlyingRaven(ctx, flyX, flyY, raven.wingPhase);
        }
      }
    });

    // -------------------------------------------------------------
    // D. HIGH ALTITUDE: Luminous Mountain Wisps
    // -------------------------------------------------------------
    this.wisps.forEach((wisp) => {
      const distFromPlayer = wisp.worldDistance - playerDistance;
      const wispScreenX = screenCenterX + distFromPlayer * pixelsPerMeter;

      if (wispScreenX > -40 && wispScreenX < width + 40) {
        const groundY = getTerrainY(wispScreenX);
        const floatY = groundY + wisp.baseYOffset + Math.sin(wisp.pulsePhase) * 6;
        this.renderMountainWisp(ctx, wispScreenX, floatY, wisp.pulsePhase);
      }
    });

    ctx.restore();
  }

  /**
   * Draws a Mountain Ibex / Horned Goat silhouette perched on a crag
   */
  private renderIbex(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    lookAngle: number,
    hornCurve: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // Muted atmospheric silhouette
    ctx.fillStyle = '#181519';
    ctx.strokeStyle = '#181519';
    ctx.lineWidth = 2.0;

    // Rocky spire ledge it stands upon
    ctx.beginPath();
    ctx.moveTo(-16, 12);
    ctx.lineTo(14, 12);
    ctx.lineTo(8, 22);
    ctx.lineTo(-12, 28);
    ctx.closePath();
    ctx.fill();

    // Ibex Body (slender mountain goat torso)
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Rump and shoulder
    ctx.beginPath();
    ctx.arc(-8, -1, 4.5, 0, Math.PI * 2);
    ctx.arc(6, -2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Front legs (planted on rock edge)
    ctx.beginPath();
    ctx.moveTo(6, 2);
    ctx.lineTo(7, 12);
    ctx.moveTo(8, 2);
    ctx.lineTo(9, 12);
    // Back legs
    ctx.moveTo(-7, 2);
    ctx.lineTo(-6, 7);
    ctx.lineTo(-5, 12);
    ctx.moveTo(-9, 2);
    ctx.lineTo(-10, 12);
    ctx.stroke();

    // Neck & Head
    ctx.beginPath();
    ctx.moveTo(6, -3);
    ctx.lineTo(10, -10 + lookAngle * 4);
    ctx.lineTo(13, -8 + lookAngle * 4);
    ctx.lineTo(8, -1);
    ctx.closePath();
    ctx.fill();

    // Head muzzle
    ctx.beginPath();
    ctx.arc(12, -9 + lookAngle * 4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Majestic curved horns sweeping back
    ctx.save();
    ctx.strokeStyle = '#221D24';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(11, -11 + lookAngle * 4);
    ctx.quadraticCurveTo(8, -18, 1, -15 - hornCurve * 0.4);
    ctx.moveTo(12, -11 + lookAngle * 4);
    ctx.quadraticCurveTo(9, -19, 3, -17 - hornCurve * 0.4);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * Draws a Silent Watcher / Cloaked Sentinel atop a cliff promontory
   */
  private renderSilentWatcher(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    hasStaff: boolean,
    cloakFlutter: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#151317';
    ctx.strokeStyle = '#151317';

    // Rocky promontory base
    ctx.beginPath();
    ctx.moveTo(-18, 16);
    ctx.lineTo(16, 16);
    ctx.lineTo(10, 32);
    ctx.lineTo(-14, 32);
    ctx.closePath();
    ctx.fill();

    // Flowing Hooded Cloak
    ctx.beginPath();
    ctx.moveTo(-1, -16); // Hood top
    ctx.quadraticCurveTo(5, -6, 7, 16); // Cloak front
    ctx.lineTo(-8 + cloakFlutter, 16); // Cloak hem flutter
    ctx.quadraticCurveTo(-5, 0, -1, -16);
    ctx.closePath();
    ctx.fill();

    // Hood / Head
    ctx.beginPath();
    ctx.arc(-1, -17, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Pilgrim's Staff
    if (hasStaff) {
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(6, -22);
      ctx.lineTo(6, 16);
      ctx.stroke();

      // Top ring on staff
      ctx.beginPath();
      ctx.arc(6, -20, 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draws a Descending Weary Pilgrim / Lost Soul walking casually downhill
   * Facing left (walking downward against Sisyphus's direction)
   */
  private renderDescendingWanderer(
    ctx: CanvasRenderingContext2D,
    x: number,
    groundY: number,
    stride: number,
    staffSide: number,
    isNearPlayer: boolean = false,
    quoteText?: string
  ) {
    ctx.save();
    ctx.translate(x, groundY);

    // Muted ink silhouette (semi-ethereal)
    ctx.fillStyle = '#221F1C';
    ctx.strokeStyle = '#221F1C';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const s = Math.sin(stride);
    const hipBob = Math.abs(Math.sin(stride * 2)) * 1.5;
    const hipY = -24 + hipBob;

    // 1. Far Leg (Walking downhill - facing left)
    ctx.save();
    ctx.strokeStyle = '#38332E';
    ctx.lineWidth = 3.0;
    const leg1FootX = 4 + s * 10;
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(2 + s * 5, hipY + 12);
    ctx.lineTo(leg1FootX, 0);
    ctx.lineTo(leg1FootX - 4, 0); // foot facing downhill
    ctx.stroke();
    ctx.restore();

    // 2. Near Leg
    ctx.lineWidth = 3.4;
    const leg2FootX = -4 - s * 10;
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-2 - s * 5, hipY + 12);
    ctx.lineTo(leg2FootX, 0);
    ctx.lineTo(leg2FootX - 4, 0);
    ctx.stroke();

    // 3. Cloaked Torso & Spine (slight forward tilt going downhill)
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.lineTo(-4, -44);
    ctx.stroke();

    // Cloak fabric hanging down
    ctx.fillStyle = '#26221E';
    ctx.beginPath();
    ctx.moveTo(-4, -44);
    ctx.lineTo(4, hipY + 4);
    ctx.lineTo(-7, hipY + 6);
    ctx.closePath();
    ctx.fill();

    // 4. Head / Hood
    ctx.beginPath();
    ctx.arc(-5, -50, 6, 0, Math.PI * 2);
    ctx.fill();

    // 5. Walking Staff
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#52483D';
    const staffX = -10 + staffSide * 2;
    ctx.beginPath();
    ctx.moveTo(staffX, -52);
    ctx.lineTo(staffX - 2, 0);
    ctx.stroke();

    // Hand gripping staff
    ctx.fillStyle = '#221F1C';
    ctx.beginPath();
    ctx.arc(staffX, -30, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 6. Proximity Whisper Bubble (Philosophical whisper when crossing Sisyphus)
    if (isNearPlayer && quoteText) {
      ctx.save();
      ctx.font = 'italic 11px Newsreader, Georgia, serif';
      const textWidth = ctx.measureText(quoteText).width;
      const bubbleW = textWidth + 18;
      const bubbleH = 22;
      const bubbleX = -bubbleW / 2;
      const bubbleY = -78;

      ctx.fillStyle = 'rgba(20, 18, 15, 0.88)';
      ctx.strokeStyle = 'rgba(217, 180, 110, 0.45)';
      ctx.lineWidth = 1;

      // Rounded speech bubble
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 6);
      ctx.fill();
      ctx.stroke();

      // Little pointer tail toward the wanderer
      ctx.beginPath();
      ctx.moveTo(-2, bubbleY + bubbleH);
      ctx.lineTo(3, bubbleY + bubbleH + 4);
      ctx.lineTo(4, bubbleY + bubbleH);
      ctx.fillStyle = 'rgba(20, 18, 15, 0.88)';
      ctx.fill();

      // Text
      ctx.fillStyle = '#E8DEC8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(quoteText, 0, bubbleY + bubbleH / 2);
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Draws a Raven perched on a boundary stone
   */
  private renderPerchedRaven(
    ctx: CanvasRenderingContext2D,
    x: number,
    groundY: number,
    headTilt: number
  ) {
    ctx.save();
    ctx.translate(x, groundY);

    // Weathered boundary marker stone
    ctx.fillStyle = '#24201B';
    ctx.strokeStyle = '#4A4035';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(-5, -12);
    ctx.lineTo(5, -12);
    ctx.lineTo(6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Raven body
    ctx.fillStyle = '#080809';
    ctx.beginPath();
    ctx.ellipse(0, -18, 5.5, 3.5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Tail feathers pointing down-right
    ctx.beginPath();
    ctx.moveTo(2, -16);
    ctx.lineTo(8, -12);
    ctx.lineTo(6, -18);
    ctx.closePath();
    ctx.fill();

    // Raven Head & Beak
    ctx.save();
    ctx.translate(-4, -20);
    ctx.rotate(headTilt);

    // Head
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Sharp beak pointing left
    ctx.beginPath();
    ctx.moveTo(-2, -1);
    ctx.lineTo(-7, 0.5);
    ctx.lineTo(-2, 1.5);
    ctx.closePath();
    ctx.fill();

    // Tiny glinting eye
    ctx.fillStyle = '#C89B3C';
    ctx.beginPath();
    ctx.arc(-1, -0.5, 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.restore();
  }

  /**
   * Draws a Raven in flight with flapping wings
   */
  private renderFlyingRaven(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    wingPhase: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = '#080809';
    ctx.strokeStyle = '#080809';
    ctx.lineWidth = 1.8;

    const wingSpan = 9;
    const flapY = Math.sin(wingPhase) * 6;

    // Body & Beak
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 2.5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(-4, -1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.beginPath();
    ctx.moveTo(-6, -1);
    ctx.lineTo(-10, -0.5);
    ctx.lineTo(-6, 0.5);
    ctx.closePath();
    ctx.fill();

    // Wings
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-2, -flapY * 0.8, -wingSpan, -flapY);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(2, -flapY * 0.8, wingSpan * 0.8, -flapY * 0.9);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws a luminous Mountain Wisp / Will-o'-the-Wisp with shimmering aura
   */
  private renderMountainWisp(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    pulse: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    const radius = 3.5 + Math.sin(pulse) * 1.2;
    const auraAlpha = 0.35 + Math.sin(pulse * 1.5) * 0.15;

    // Glowing halo
    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, radius * 3.5);
    grad.addColorStop(0, `rgba(217, 180, 110, ${auraAlpha})`);
    grad.addColorStop(0.5, `rgba(180, 150, 90, ${auraAlpha * 0.4})`);
    grad.addColorStop(1, 'rgba(180, 150, 90, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Core bright orb
    ctx.fillStyle = '#FFF8E7';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
