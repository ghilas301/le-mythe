/**
 * Living Mountain World Engine — Le Mythe de Sisyphe
 * - Procedural Rugged Mountain Terrain with rock ledges, steps, and undulating contours
 * - Descending Wanderers (Stick figure wanderers walking down in contemplation)
 * - Mountain Spirits & Creatures (Curious shadow sprites with blinking eyes, mountain ravens, cliff watchers)
 * - Ledges, shrines, and stone relics along the path
 */

export interface Wanderer {
  id: string;
  worldDist: number; // distance along mountain
  speed: number;
  direction: 'DOWN';
  hasStaff: boolean;
  cloakColor: string;
  walkPhase: number;
  pauseTimer: number; // momentarily pauses to watch Sisyphus
}

export interface MountainSpirit {
  id: string;
  worldDist: number;
  type: 'SHADOW_SPRITE' | 'RAVEN' | 'CLIFF_WATCHER' | 'ETHER_WISP';
  blinkTimer: number;
  hopPhase: number;
  lookAtPlayer: boolean;
  offsetX: number;
  offsetY: number;
  scale: number;
}

export interface TerrainSample {
  y: number; // screen Y coordinate
  slopeAngle: number; // local angle in radians
  isLedge: boolean;
  rockTextureSeed: number;
}

class MountainWorldEngine {
  private wanderers: Wanderer[] = [];
  private spirits: MountainSpirit[] = [];
  private nextSpawnDist: number = 25;
  private nextSpiritDist: number = 12;

  constructor() {
    this.seedInitialWorld();
  }

  private seedInitialWorld() {
    // Seed initial wanderers and spirits along the mountain
    this.wanderers = [
      {
        id: 'w_init_1',
        worldDist: 35,
        speed: 1.8,
        direction: 'DOWN',
        hasStaff: true,
        cloakColor: '#1A1815',
        walkPhase: 0.2,
        pauseTimer: 0
      },
      {
        id: 'w_init_2',
        worldDist: 90,
        speed: 2.1,
        direction: 'DOWN',
        hasStaff: false,
        cloakColor: '#25211B',
        walkPhase: 0.8,
        pauseTimer: 0
      }
    ];

    this.spirits = [
      {
        id: 's_1',
        worldDist: 18,
        type: 'SHADOW_SPRITE',
        blinkTimer: 2.0,
        hopPhase: 0,
        lookAtPlayer: true,
        offsetX: 0,
        offsetY: -6,
        scale: 1.0
      },
      {
        id: 's_2',
        worldDist: 48,
        type: 'RAVEN',
        blinkTimer: 4.5,
        hopPhase: 0,
        lookAtPlayer: true,
        offsetX: 0,
        offsetY: -14,
        scale: 1.1
      },
      {
        id: 's_3',
        worldDist: 75,
        type: 'SHADOW_SPRITE',
        blinkTimer: 1.5,
        hopPhase: 0,
        lookAtPlayer: true,
        offsetX: 0,
        offsetY: -6,
        scale: 0.9
      },
      {
        id: 's_4',
        worldDist: 120,
        type: 'CLIFF_WATCHER',
        blinkTimer: 5.0,
        hopPhase: 0,
        lookAtPlayer: true,
        offsetX: 0,
        offsetY: -22,
        scale: 1.2
      }
    ];
  }

  /**
   * Procedural Elevation Profile:
   * Replaces the flat diagonal line with an organic, sculpted mountain path:
   * - Natural undulations, rocky ledges, stone steps, scree bumps
   */
  public getTerrainHeight(
    screenX: number,
    playerDistance: number,
    baseStartY: number,
    baseStartX: number,
    baseAngle: number
  ): TerrainSample {
    // World coordinate along the slope
    const worldDist = playerDistance + (screenX - baseStartX) * 0.055;

    // Linear base incline
    const linearY = baseStartY - (screenX - baseStartX) * Math.tan(baseAngle);

    // Organic mountain contour harmonics:
    // 1. Long rolling mountain ridges (wavelength ~80m)
    const longRidge = Math.sin(worldDist * 0.08) * 12;

    // 2. Medium rocky outcrops and ledges (wavelength ~22m)
    const midCrag = Math.sin(worldDist * 0.28) * 6 + Math.cos(worldDist * 0.15) * 4;

    // 3. Step/Ledge function (terraces where path flattens for a few meters then climbs)
    const stepSaw = (Math.sin(worldDist * 0.12) * 5);

    // 4. Fine rock texture & gravel noise (wavelength ~3m)
    const fineRock = Math.sin(worldDist * 1.8) * 1.6 + Math.cos(worldDist * 3.4) * 0.8;

    const totalOffset = longRidge + midCrag + stepSaw + fineRock;
    const finalY = linearY + totalOffset;

    // Numerical slope derivative (tangent angle for physics & alignment)
    const delta = 2.0;
    const nextY = linearY - delta * Math.tan(baseAngle) +
      Math.sin((worldDist + delta * 0.055) * 0.08) * 12 +
      Math.sin((worldDist + delta * 0.055) * 0.28) * 6 +
      Math.cos((worldDist + delta * 0.055) * 0.15) * 4 +
      Math.sin((worldDist + delta * 0.055) * 0.12) * 5 +
      Math.sin((worldDist + delta * 0.055) * 1.8) * 1.6;

    const localAngle = Math.atan2(nextY - finalY, delta);

    return {
      y: finalY,
      slopeAngle: localAngle,
      isLedge: Math.abs(localAngle) < 0.18,
      rockTextureSeed: Math.floor(worldDist * 0.5)
    };
  }

  /**
   * Update living world: spawn and advance wanderers and spirits
   */
  public update(playerDistance: number, dt: number) {
    // 1. Advance descending wanderers
    for (let i = this.wanderers.length - 1; i >= 0; i--) {
      const w = this.wanderers[i];

      // Check proximity to player: pause to observe Sisyphus
      const distToPlayer = Math.abs(w.worldDist - playerDistance);
      if (distToPlayer < 4.0 && w.pauseTimer <= 0 && Math.random() < 0.05) {
        w.pauseTimer = 3.5; // Pauses 3.5s to watch Sisyphus in solemn respect
      }

      if (w.pauseTimer > 0) {
        w.pauseTimer -= dt;
      } else {
        w.worldDist -= w.speed * dt;
        w.walkPhase += dt * 3.5;
      }

      // Remove wanderers that have walked far below the valley
      if (w.worldDist < -10 || w.worldDist < playerDistance - 40) {
        this.wanderers.splice(i, 1);
      }
    }

    // Spawn new wanderer as player climbs
    if (playerDistance + 50 > this.nextSpawnDist) {
      this.wanderers.push({
        id: `w_${Date.now()}_${Math.random()}`,
        worldDist: playerDistance + 45 + Math.random() * 20,
        speed: 1.6 + Math.random() * 0.8,
        direction: 'DOWN',
        hasStaff: Math.random() > 0.35,
        cloakColor: Math.random() > 0.5 ? '#1C1A17' : '#2A241E',
        walkPhase: Math.random() * Math.PI * 2,
        pauseTimer: 0
      });
      this.nextSpawnDist = playerDistance + 35 + Math.random() * 30;
    }

    // 2. Update Spirits (blinking & hopping)
    this.spirits.forEach((s) => {
      s.blinkTimer -= dt;
      if (s.blinkTimer <= 0) {
        s.blinkTimer = 2.5 + Math.random() * 4.0;
      }

      if (s.type === 'SHADOW_SPRITE') {
        s.hopPhase += dt * 4.0;
      }
    });

    // Spawn new spirits along the path
    if (playerDistance + 60 > this.nextSpiritDist) {
      const types: MountainSpirit['type'][] = ['SHADOW_SPRITE', 'SHADOW_SPRITE', 'RAVEN', 'CLIFF_WATCHER'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      this.spirits.push({
        id: `s_${Date.now()}`,
        worldDist: playerDistance + 50 + Math.random() * 25,
        type: chosenType,
        blinkTimer: 2.0 + Math.random() * 3.0,
        hopPhase: Math.random() * Math.PI,
        lookAtPlayer: true,
        offsetX: (Math.random() - 0.5) * 8,
        offsetY: chosenType === 'RAVEN' ? -14 : chosenType === 'CLIFF_WATCHER' ? -26 : -6,
        scale: 0.9 + Math.random() * 0.3
      });
      this.nextSpiritDist = playerDistance + 28 + Math.random() * 25;
    }
  }

  public getWanderers(): Wanderer[] {
    return this.wanderers;
  }

  public getSpirits(): MountainSpirit[] {
    return this.spirits;
  }
}

export const mountainWorld = new MountainWorldEngine();
