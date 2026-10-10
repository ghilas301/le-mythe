export type Language = 'en' | 'fr';

export type GameStatus = 'IDLE' | 'PUSHING' | 'SLIPPING' | 'CRASHING' | 'GAME_OVER';

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';

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
}

export interface RunSummary {
  distance: number;
  altitude: number;
  time: number;
  pushes: number;
  isNewRecord: boolean;
  absurdRemark: string;
  timestamp: number;
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
