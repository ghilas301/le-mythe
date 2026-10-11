import { TimedEvent, EventBadge } from '../types/game';

export interface TimedEventConfig {
  id: TimedEvent;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  badgeId: string;
  badgeNameFr: string;
  badgeNameEn: string;
  badgeDescFr: string;
  badgeDescEn: string;
  badgeIcon: string;
  thresholdDistance: number;
  timeLimitSeconds?: number;
  badgeColor: string;
  borderColor: string;
  bgGlow: string;
}

export const TIMED_EVENTS: Record<TimedEvent, TimedEventConfig | null> = {
  NONE: null,
  AVALANCHE: {
    id: 'AVALANCHE',
    titleFr: "L'Avalanche",
    titleEn: 'The Avalanche',
    subtitleFr: 'Péril hivernal : secousses & risque de décrochage accrus tous les 20m',
    subtitleEn: 'Winter peril: tremor spikes & slip severity increase every 20m',
    badgeId: 'badge_avalanche_survivor',
    badgeNameFr: "Survivant de l'Avalanche",
    badgeNameEn: 'Avalanche Survivor',
    badgeDescFr: 'A bravé le blizzard et gravi au moins 40m malgré les avalanches',
    badgeDescEn: 'Braved the blizzard and ascended at least 40m despite avalanches',
    badgeIcon: '❄️',
    thresholdDistance: 40,
    badgeColor: '#93C5FD',
    borderColor: 'border-blue-400/50',
    bgGlow: 'bg-blue-950/40'
  },
  MIRAGE: {
    id: 'MIRAGE',
    titleFr: 'Le Mirage',
    titleEn: 'The Mirage',
    subtitleFr: 'Distorsion thermique : la distance affichée ondule et vacille sous le soleil',
    subtitleEn: 'Thermal distortion: displayed distance wavers & shimmers under blazing heat',
    badgeId: 'badge_mirage_sage',
    badgeNameFr: 'Clairvoyant du Mirage',
    badgeNameEn: 'Mirage Clairvoyant',
    badgeDescFr: 'A transcendé l’illusion optique et gravi au moins 50m sous la canicule',
    badgeDescEn: 'Transcended the optical illusion and climbed at least 50m under the heat',
    badgeIcon: '☀️',
    thresholdDistance: 50,
    badgeColor: '#FDE047',
    borderColor: 'border-amber-400/50',
    bgGlow: 'bg-amber-950/40'
  },
  EQUINOX: {
    id: 'EQUINOX',
    titleFr: "Défi de l'Équinoxe",
    titleEn: 'Equinox Challenge',
    subtitleFr: 'Temps cosmique limité : 5 minutes (300s) chrono avant le crépuscule final',
    subtitleEn: 'Cosmic time limit: exactly 5 minutes (300s) before final twilight falls',
    badgeId: 'badge_equinox_master',
    badgeNameFr: "Maître de l'Équinoxe",
    badgeNameEn: 'Master of the Equinox',
    badgeDescFr: 'A atteint au moins 60m avant la fin des 300s de l’équinoxe',
    badgeDescEn: 'Reached at least 60m before the 300s equinox window ended',
    badgeIcon: '⚖️',
    thresholdDistance: 60,
    timeLimitSeconds: 300,
    badgeColor: '#C084FC',
    borderColor: 'border-purple-400/50',
    bgGlow: 'bg-purple-950/40'
  }
};

const BADGES_KEY = 'sisyphus_event_badges';

export function getInitialBadges(): Record<string, EventBadge> {
  const defaults: Record<string, EventBadge> = {
    badge_avalanche_survivor: {
      id: 'badge_avalanche_survivor',
      event: 'AVALANCHE',
      nameFr: "Survivant de l'Avalanche",
      nameEn: 'Avalanche Survivor',
      icon: '❄️',
      descriptionFr: 'Atteindre 40m en mode Avalanche',
      descriptionEn: 'Reach 40m in Avalanche mode',
      unlocked: false
    },
    badge_mirage_sage: {
      id: 'badge_mirage_sage',
      event: 'MIRAGE',
      nameFr: 'Clairvoyant du Mirage',
      nameEn: 'Mirage Clairvoyant',
      icon: '☀️',
      descriptionFr: 'Atteindre 50m en mode Mirage',
      descriptionEn: 'Reach 50m in Mirage mode',
      unlocked: false
    },
    badge_equinox_master: {
      id: 'badge_equinox_master',
      event: 'EQUINOX',
      nameFr: "Maître de l'Équinoxe",
      nameEn: 'Master of the Equinox',
      icon: '⚖️',
      descriptionFr: 'Atteindre 60m en moins de 5 minutes',
      descriptionEn: 'Reach 60m in under 5 minutes',
      unlocked: false
    }
  };

  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function saveBadges(badges: Record<string, EventBadge>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  } catch {}
}

export function checkAndUnlockBadge(
  event: TimedEvent,
  distance: number,
  time: number
): { badge: EventBadge; wasNewlyUnlocked: boolean } | null {
  const config = TIMED_EVENTS[event];
  if (!config) return null;

  const badges = getInitialBadges();
  const current = badges[config.badgeId];
  if (!current) return null;

  let qualified = false;
  if (event === 'AVALANCHE' && distance >= config.thresholdDistance) {
    qualified = true;
  } else if (event === 'MIRAGE' && distance >= config.thresholdDistance) {
    qualified = true;
  } else if (event === 'EQUINOX' && (distance >= config.thresholdDistance || time >= 300)) {
    qualified = true;
  }

  if (qualified && !current.unlocked) {
    current.unlocked = true;
    current.unlockedAt = Date.now();
    badges[config.badgeId] = current;
    saveBadges(badges);
    return { badge: current, wasNewlyUnlocked: true };
  }

  return { badge: current, wasNewlyUnlocked: false };
}

/**
 * Calculates current Avalanche intensity based on distance.
 * Escalates every 20m:
 * 0-20m: level 0 (calm)
 * 20-40m: level 1
 * 40-60m: level 2
 * 60m+: level 3+
 */
export function getAvalancheHazard(distance: number): {
  stage: number;
  tremorIntensity: number;
  slipGravityMultiplier: number;
  graceReductionMs: number;
  isJustTriggered20m: boolean;
} {
  const stage = Math.floor(distance / 20);
  const distanceInCurrentStage = distance % 20;
  // A burst tremor occurs in the first 3 meters of entering a new 20m threshold
  const isJustTriggered20m = stage > 0 && distanceInCurrentStage < 3.2;

  const tremorIntensity = Math.min(1.0, stage * 0.18 + (isJustTriggered20m ? 0.35 : 0.05));
  const slipGravityMultiplier = 1.0 + stage * 0.14;
  const graceReductionMs = Math.min(380, stage * 60);

  return {
    stage,
    tremorIntensity,
    slipGravityMultiplier,
    graceReductionMs,
    isJustTriggered20m
  };
}

/**
 * Generates an optical shimmer for the Mirage challenge.
 * Causes the displayed distance to waver with realistic thermal ripples.
 */
export function getMirageWaveringDistance(actualDistance: number, nowMs: number): {
  displayText: string;
  wavyOffsetPercent: number;
  shimmerActive: boolean;
} {
  if (actualDistance <= 2) {
    return {
      displayText: actualDistance.toFixed(1),
      wavyOffsetPercent: 0,
      shimmerActive: false
    };
  }

  // Multi-frequency thermal oscillation
  const t = nowMs * 0.003;
  const distortion = Math.sin(t * 1.5) * 1.8 + Math.cos(t * 3.2) * 0.9 + Math.sin(t * 5.1) * 0.4;
  const waveringValue = Math.max(0, actualDistance + distortion);

  // Optical mirage notation: adds subtle estimation symbol and shimmer wave
  const wavyOffsetPercent = Math.sin(t * 2.8) * 4;
  const displayText = `~${waveringValue.toFixed(1)}`;

  return {
    displayText,
    wavyOffsetPercent,
    shimmerActive: true
  };
}
