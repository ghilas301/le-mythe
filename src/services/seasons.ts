import { Season, SeasonConfig } from '../types/game';

export const SEASONS_CONFIG: Record<Season, SeasonConfig> = {
  SPRING: {
    season: 'SPRING',
    nameFr: 'Printemps',
    nameEn: 'Spring',
    icon: '🌸',
    terrainEffectFr: 'Pente fertile · Pétales au vent · Adhérence tempérée',
    terrainEffectEn: 'Fertile slope · Petals on the wind · Balanced grip',
    pushSpeedMod: 1.0,
    slipGravityMod: 1.0,
    graceWindowMs: 950,
    windResistance: 0.15,
    particleType: 'PETALS',
    groundColorTint: 'rgba(55, 65, 45, 0.25)'
  },
  SUMMER: {
    season: 'SUMMER',
    nameFr: 'Été',
    nameEn: 'Summer',
    icon: '☀️',
    terrainEffectFr: 'Aridité étouffante · Poussière abrasive · Effort épuisant',
    terrainEffectEn: 'Scorching drought · Abrasive dust · Heavy exertion',
    pushSpeedMod: 0.94,
    slipGravityMod: 1.08,
    graceWindowMs: 890,
    windResistance: 0.25,
    particleType: 'HEAT_DUST',
    groundColorTint: 'rgba(85, 70, 40, 0.3)'
  },
  AUTUMN: {
    season: 'AUTUMN',
    nameFr: 'Automne',
    nameEn: 'Autumn',
    icon: '🍂',
    terrainEffectFr: 'Feuilles détrempées · Bourrasques d’ouest · Sol glissant',
    terrainEffectEn: 'Wet foliage · Strong west squalls · Slippery mud',
    pushSpeedMod: 0.9,
    slipGravityMod: 1.16,
    graceWindowMs: 830,
    windResistance: 0.45,
    particleType: 'AUTUMN_LEAVES',
    groundColorTint: 'rgba(75, 42, 30, 0.35)'
  },
  WINTER: {
    season: 'WINTER',
    nameFr: 'Hiver',
    nameEn: 'Winter',
    icon: '❄️',
    terrainEffectFr: 'Verglas extrême · Blizzard impitoyable · Prise précaire',
    terrainEffectEn: 'Severe black ice · Howling blizzard · Treacherous grip',
    pushSpeedMod: 0.82,
    slipGravityMod: 1.25,
    graceWindowMs: 760,
    windResistance: 0.7,
    particleType: 'SNOWFLAKES',
    groundColorTint: 'rgba(160, 180, 205, 0.4)'
  }
};

const SEASONS_ORDER: Season[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];

export function getSeasonForAttempt(totalAttempts: number, runDistance: number): SeasonConfig {
  // Cycle smoothly across the 4 seasons: changes every 2 games or every 120m
  const seasonIndex = (totalAttempts + Math.floor(runDistance / 100)) % 4;
  const seasonKey = SEASONS_ORDER[seasonIndex];
  return SEASONS_CONFIG[seasonKey];
}
