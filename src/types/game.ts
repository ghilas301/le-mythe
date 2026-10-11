export type Language = 'en' | 'fr';

export type GameMode = 'ABSURD' | 'ZEN';

export type TimedEvent = 'NONE' | 'AVALANCHE' | 'MIRAGE' | 'EQUINOX';

export type WatcherTier = 'DISTANT_SHADOW' | 'APPROACHING_PILGRIM' | 'SEATED_SAGE';

export interface EventBadge {
  id: string;
  event: TimedEvent;
  nameFr: string;
  nameEn: string;
  icon: string;
  descriptionFr: string;
  descriptionEn: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export type GameStatus = 'IDLE' | 'PUSHING' | 'SLIPPING' | 'CRASHING' | 'DESCENDING' | 'GAME_OVER';

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';

export type BiomeType = 'VALLEY_SHADOWS' | 'WINDSWEPT_CRAG' | 'VERGLAS_WALL' | 'OLYMPUS_ETHER';

export interface BiomeConfig {
  type: BiomeType;
  minDist: number;
  maxDist: number;
  nameFr: string;
  nameEn: string;
  subtitleFr: string;
  subtitleEn: string;
  mistDensity: number;
  lightFactor: number;
  tintRgb: string;
}

export interface SeasonConfig {
  season: Season;
  nameFr: string;
  nameEn: string;
  icon: string;
  terrainEffectFr: string;
  terrainEffectEn: string;
  pushSpeedMod: number;
  slipGravityMod: number;
  graceWindowMs: number;
  windResistance: number;
  particleType: 'PETALS' | 'HEAT_DUST' | 'AUTUMN_LEAVES' | 'SNOWFLAKES';
  groundColorTint: string;
}

export interface CairnMarker {
  id: string;
  distance: number;
  labelFr: string;
  labelEn: string;
  attemptsAtPoint: number;
  timestamp: number;
}

export interface GameStats {
  currentDistance: number; // in meters
  currentAltitude: number; // in meters
  elapsedTime: number; // in seconds
  pushCount: number;
  maxDistance: number;
  totalDistanceAllTime: number;
  totalTimeAllTime: number;
  totalGamesPlayed: number;
  totalPushesAllTime: number;
  cairns?: CairnMarker[];
}

export interface RunSummary {
  distance: number;
  altitude: number;
  time: number;
  pushes: number;
  isNewRecord: boolean;
  absurdRemark: string;
  timestamp: number;
  biomeReached?: string;
  event?: TimedEvent;
}

export interface AdSimulationConfig {
  showRealScript: boolean;
  adsterraZoneId: string;
  adsterraScriptUrl: string;
  format: 'banner_300x250' | 'banner_728x90';
  dailySessions: number;
  gamesPerSession: number;
  cpm: number;
  fillRate: number; // 0 to 1
}

export interface ChecklistState {
  // Product (4)
  noAccountLaunch: boolean;
  scoreAndLossWorking: boolean;
  bestScoreSaved: boolean;
  restartWorksEverywhere: boolean;

  // Technical (4)
  httpsAndCanonical: boolean;
  noHorizontalOverflow: boolean;
  noJsErrors: boolean;
  stableAdZoneNoCLS: boolean;

  // SEO (5)
  uniqueTitleAndH1: boolean;
  semanticHtmlText: boolean;
  sitemapAndRobots: boolean;
  searchConsoleReady: boolean;
  internalLinksTested: boolean;

  // Monetization & Privacy (4)
  adCodeApproved: boolean;
  noForcedClicks: boolean;
  privacyPolicyPublished: boolean;
  consentAndScriptsCompliant: boolean;
}
