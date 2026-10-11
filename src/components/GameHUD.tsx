import React from 'react';
import { GameStatus, GameStats, GameMode, TimedEvent, WatcherTier } from '../types/game';
import { Translations } from '../services/i18n';
import { Language } from '../types/game';
import { Trophy, Clock, Mountain, ArrowUpRight, Flame, Footprints, SkipForward, Music, Sparkles, Snowflake, Sun, Hourglass, Eye, Quote } from 'lucide-react';
import { getAvalancheHazard, getMirageWaveringDistance, TIMED_EVENTS } from '../services/events';
import { silentWatcherEngine } from '../services/watcher';

interface GameHUDProps {
  stats: GameStats;
  status: GameStatus;
  isPushing: boolean;
  gameMode?: GameMode;
  onSelectMode?: (mode: GameMode) => void;
  event?: TimedEvent;
  onSelectEvent?: (event: TimedEvent) => void;
  t: Translations;
  lang?: Language;
  isMusicOn?: boolean;
  onToggleMusic?: () => void;
  onPushStart: () => void;
  onPushEnd: () => void;
  onSkipDescent?: () => void;
  onTriggerWatcher?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  status,
  isPushing,
  gameMode = 'ABSURD',
  onSelectMode,
  event = 'NONE',
  onSelectEvent,
  t,
  lang = 'fr',
  isMusicOn = true,
  onToggleMusic,
  onPushStart,
  onPushEnd,
  onSkipDescent,
  onTriggerWatcher
}) => {
  // Mirage optical shimmer computation
  const mirageData = event === 'MIRAGE' ? getMirageWaveringDistance(stats.currentDistance, performance.now()) : null;
  // Avalanche danger computation
  const avalancheData = event === 'AVALANCHE' ? getAvalancheHazard(stats.currentDistance) : null;
  // Equinox time remaining (300s limit)
  const equinoxRemaining = event === 'EQUINOX' ? Math.max(0, 300 - stats.elapsedTime) : 0;
  const equinoxMin = Math.floor(equinoxRemaining / 60);
  const equinoxSec = Math.floor(equinoxRemaining % 60);

  // Watcher Info
  const watcherInfo = silentWatcherEngine.getTierTitle(stats.totalGamesPlayed, lang);
  const currentQuote = silentWatcherEngine.currentQuote;

  return (
    <div className="w-full flex flex-col gap-4 mt-3">
      {/* 1. Live Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#1A1815] border border-[#2F2922]">
        {/* Distance - with Mirage distortion effect if active */}
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#9E9484] flex items-center gap-1.5 font-medium">
            <Mountain className={`w-3.5 h-3.5 ${event === 'MIRAGE' ? 'text-yellow-400 animate-pulse' : 'text-amber-500'}`} />
            {t.statDistance}
            {event === 'MIRAGE' && <span className="text-[9px] text-yellow-400 font-mono">[Mirage]</span>}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className={`text-3xl font-bold font-cinzel tracking-tight transition-all ${
                event === 'MIRAGE'
                  ? 'text-yellow-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-[#F4EFE6]'
              }`}
            >
              {event === 'MIRAGE' && mirageData
                ? mirageData.displayText
                : Number(stats.currentDistance || 0).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#9E9484]">m</span>
          </div>
        </div>

        {/* Altitude */}
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#9E9484] flex items-center gap-1.5 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            {t.statAltitude}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-cinzel text-[#F4EFE6] tracking-tight">
              {Number(stats.currentAltitude || 0).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#9E9484]">m</span>
          </div>
        </div>

        {/* Endurance / Time - or Equinox 5:00 countdown */}
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#9E9484] flex items-center gap-1.5 font-medium">
            {event === 'EQUINOX' ? (
              <Hourglass className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            )}
            {event === 'EQUINOX' ? (lang === 'fr' ? 'Compte à rebours' : 'Countdown') : t.statTime}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            {event === 'EQUINOX' ? (
              <span className={`text-3xl font-bold font-mono tracking-tight ${equinoxRemaining < 60 ? 'text-red-400 animate-pulse' : 'text-purple-300'}`}>
                {String(equinoxMin).padStart(2, '0')}:{String(equinoxSec).padStart(2, '0')}
              </span>
            ) : (
              <>
                <span className="text-3xl font-bold font-mono text-[#F4EFE6] tracking-tight">
                  {Number(stats.elapsedTime || 0).toFixed(1)}
                </span>
                <span className="text-xs font-mono text-[#9E9484]">s</span>
              </>
            )}
          </div>
        </div>

        {/* Personal Best */}
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-[#9E9484] flex items-center gap-1.5 font-medium">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            {t.statBest}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-cinzel text-amber-300 tracking-tight">
              {Number(stats.maxDistance || 0).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#9E9484]">m</span>
          </div>
        </div>
      </div>

      {/* 2. Événements Limités Temporels (Timed Events Switcher) */}
      {onSelectEvent && (
        <div className="w-full flex flex-col gap-2 p-3 rounded-xl bg-[#161412] border border-[#312B23]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-cinzel font-bold text-[#C7BCAB] uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span> {lang === 'fr' ? 'Événements & Défis Temporaires' : 'Timed Events & Challenges'}
            </span>
            <span className="text-[10px] text-[#8C806F]">
              {lang === 'fr' ? 'Chaque défi = Badge & Leaderboard dédié' : 'Each challenge = Badge & Dedicated Leaderboard'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Standard */}
            <button
              type="button"
              onClick={() => onSelectEvent('NONE')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition-all cursor-pointer border ${
                event === 'NONE'
                  ? 'bg-amber-600/90 text-white border-amber-500 shadow-md'
                  : 'bg-[#1E1A16] text-[#A69A89] border-[#362E25] hover:text-[#EDE7DE] hover:border-[#4E4234]'
              }`}
            >
              <span>🏛️</span>
              <span className="truncate">{lang === 'fr' ? 'Classique' : 'Standard'}</span>
            </button>

            {/* Avalanche */}
            <button
              type="button"
              onClick={() => onSelectEvent('AVALANCHE')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition-all cursor-pointer border ${
                event === 'AVALANCHE'
                  ? 'bg-blue-900/80 text-blue-200 border-blue-500/80 shadow-md'
                  : 'bg-[#1E1A16] text-[#A69A89] border-[#362E25] hover:text-blue-300 hover:border-blue-700/50'
              }`}
              title={TIMED_EVENTS.AVALANCHE?.subtitleFr}
            >
              <Snowflake className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{lang === 'fr' ? "L'Avalanche" : 'The Avalanche'}</span>
            </button>

            {/* Mirage */}
            <button
              type="button"
              onClick={() => onSelectEvent('MIRAGE')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition-all cursor-pointer border ${
                event === 'MIRAGE'
                  ? 'bg-amber-700/80 text-yellow-200 border-yellow-500/80 shadow-md'
                  : 'bg-[#1E1A16] text-[#A69A89] border-[#362E25] hover:text-yellow-300 hover:border-yellow-700/50'
              }`}
              title={TIMED_EVENTS.MIRAGE?.subtitleFr}
            >
              <Sun className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="truncate">{lang === 'fr' ? 'Le Mirage' : 'The Mirage'}</span>
            </button>

            {/* Equinox */}
            <button
              type="button"
              onClick={() => onSelectEvent('EQUINOX')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition-all cursor-pointer border ${
                event === 'EQUINOX'
                  ? 'bg-purple-900/80 text-purple-200 border-purple-500/80 shadow-md'
                  : 'bg-[#1E1A16] text-[#A69A89] border-[#362E25] hover:text-purple-300 hover:border-purple-700/50'
              }`}
              title={TIMED_EVENTS.EQUINOX?.subtitleFr}
            >
              <Hourglass className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{lang === 'fr' ? 'Équinoxe (5m)' : 'Equinox (5m)'}</span>
            </button>
          </div>

          {/* Event description badge banner */}
          {event !== 'NONE' && (
            <div className="flex items-center justify-between text-[11px] px-2.5 py-1 rounded bg-[#1F1B17] border border-[#3A3227] text-[#D8CEBF]">
              <span>
                {event === 'AVALANCHE' && (
                  <span>
                    ❄️ {lang === 'fr' ? "Secousses & risque de chute tous les 20m. Palier actuel : " : "Tremors & slip risk surge every 20m. Current tier: "}
                    <strong className="text-blue-300">{avalancheData?.stage || 0}</strong>
                  </span>
                )}
                {event === 'MIRAGE' && (
                  <span>
                    ☀️ {lang === 'fr' ? "Distorsion thermique : la distance affichée ondule et vacille !" : "Thermal mirage: displayed distance wavers & shimmers!"}
                  </span>
                )}
                {event === 'EQUINOX' && (
                  <span>
                    ⚖️ {lang === 'fr' ? "Gravir la plus haute distance avant la fin des 300 secondes !" : "Reach maximum distance before 300 seconds elapse!"}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3. L'Observateur Muet - Narrative & Philosophical Presence Bar */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#141210] border border-[#2B241C] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#221C16] border border-[#3E3326] text-amber-400 text-sm">
            {watcherInfo.icon}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-bold text-[11px] text-[#EDE8E0]">
                {lang === 'fr' ? "L'Observateur Muet" : 'The Silent Watcher'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                {watcherInfo.title}
              </span>
            </div>
            <span className="text-[10px] text-[#8C806F]">
              {watcherInfo.desc}
            </span>
          </div>
        </div>

        {/* Interaction with Watcher (Tier 3 quote trigger or meditative reflection) */}
        <button
          type="button"
          onClick={() => {
            if (stats.totalGamesPlayed >= 50) {
              silentWatcherEngine.triggerQuote('CONTEMPLATION');
            }
            onTriggerWatcher?.();
          }}
          className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg font-cinzel text-xs transition-all border cursor-pointer ${
            stats.totalGamesPlayed >= 50
              ? 'bg-amber-950/80 border-amber-700/60 text-amber-200 hover:bg-amber-900/90'
              : 'bg-[#1C1814] border-[#332A20] text-[#7A7061] hover:text-[#C5B9A8]'
          }`}
          title={stats.totalGamesPlayed >= 50 ? (lang === 'fr' ? 'Écouter la sagesse du Sage' : 'Listen to the Sage') : (lang === 'fr' ? 'L’Observateur reste muet pour le moment' : 'The Watcher remains silent for now')}
        >
          <Quote className="w-3 h-3 text-amber-400" />
          <span>
            {stats.totalGamesPlayed >= 50
              ? (lang === 'fr' ? 'Consulter le Sage' : 'Consult Sage')
              : (lang === 'fr' ? `${stats.totalGamesPlayed}/50 runs pour lui parler` : `${stats.totalGamesPlayed}/50 runs to speak`)}
          </span>
        </button>
      </div>

      {/* Mode Selector & Ambient Soundscape Strip */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl bg-[#151311] border border-[#2B251E] text-xs">
        {onSelectMode && (
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#1C1814] border border-[#302820]">
            <button
              type="button"
              onClick={() => onSelectMode('ABSURD')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-cinzel font-bold transition-all cursor-pointer ${
                gameMode === 'ABSURD'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-[#A09586] hover:text-[#E8E2D8]'
              }`}
              title={t.modeAbsurdDesc}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? "L'Absurde" : 'The Absurd'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode('ZEN')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-cinzel font-bold transition-all cursor-pointer ${
                gameMode === 'ZEN'
                  ? 'bg-amber-800/80 text-amber-200 border border-amber-500/50 shadow-sm'
                  : 'text-[#A09586] hover:text-[#E8E2D8]'
              }`}
              title={t.modeZenDesc}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'fr' ? 'Méditation Stoïcienne' : 'Stoic Zen'}</span>
            </button>
          </div>
        )}

        {/* 432 Hz Music Control */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-[#B8AEA0]">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-6 h-6 rounded-md bg-[#241F1A] border border-[#3A3228]">
              <Music className={`w-3.5 h-3.5 ${isMusicOn ? 'text-amber-400' : 'text-[#696155]'}`} />
              {isMusicOn && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel font-bold text-[11px] text-[#EAE4D9]">
                {lang === 'fr' ? 'Méditation 432 Hz' : '432 Hz Drone'}
              </span>
              <span className="text-[9px] text-[#7A7163]">
                {lang === 'fr' ? 'Bols tibétains & vent' : 'Bowls & mountain wind'}
              </span>
            </div>
          </div>

          {onToggleMusic && (
            <button
              type="button"
              onClick={onToggleMusic}
              className={`px-2.5 py-1 rounded-lg text-xs font-cinzel font-semibold transition-all cursor-pointer border ${
                isMusicOn
                  ? 'bg-amber-950/60 border-amber-700/60 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-[#1D1915] border-[#362D23] text-[#7E7465] hover:text-[#EDE8E0] hover:border-[#4D4133]'
              }`}
            >
              {isMusicOn ? (lang === 'fr' ? 'Actif' : 'On') : (lang === 'fr' ? 'Activer' : 'Off')}
            </button>
          )}
        </div>
      </div>

      {/* 4. Primary Tactical Action Zone */}
      <div className="flex flex-col items-center justify-center gap-3">
        {status === 'DESCENDING' ? (
          <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
            <button
              type="button"
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
              className="flex-1 py-4 px-6 rounded-xl font-cinzel font-bold text-base uppercase tracking-wider bg-gradient-to-b from-[#2E2820] to-[#1C1814] text-amber-200 border border-amber-600/50 hover:border-amber-400 hover:text-white transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 select-none touch-none"
            >
              <Footprints className="w-5 h-5 text-amber-400" />
              <span>{t.descentAction}</span>
            </button>
            {onSkipDescent && (
              <button
                type="button"
                onClick={onSkipDescent}
                className="py-4 px-4 rounded-xl font-cinzel text-xs font-semibold uppercase tracking-wider bg-amber-950/70 text-amber-300 border border-amber-600/50 hover:bg-amber-900/80 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'fr' ? 'Recommencer' : 'Restart'}</span>
                <SkipForward className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            disabled={status === 'CRASHING'}
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
            className={`group relative w-full max-w-md py-5 px-8 rounded-xl font-cinzel font-bold text-xl uppercase tracking-widest transition-all duration-100 cursor-pointer select-none no-select shadow-xl active:scale-[0.98] touch-none ${
              status === 'CRASHING'
                ? 'bg-[#1C1A18] text-[#736A5E] border border-[#2F2923] cursor-not-allowed'
                : isPushing
                ? 'bg-amber-600 text-white shadow-amber-900/40 translate-y-1'
                : 'bg-gradient-to-b from-[#2C261F] to-[#1F1B16] text-[#E8E2D8] border border-[#544839] hover:border-amber-500/60 hover:text-white'
            }`}
            aria-label={t.pushAction}
          >
            <div className="flex items-center justify-center gap-3">
              <Flame className={`w-6 h-6 transition-transform ${isPushing ? 'scale-125 text-amber-200' : 'text-amber-500'}`} />
              <span>
                {status === 'CRASHING'
                  ? (t.gameStatusCrashed)
                  : isPushing
                  ? (status === 'SLIPPING' ? t.gameStatusSlipping : t.pushAction)
                  : t.pushAction}
              </span>
            </div>
          </button>
        )}

        {/* Subtle controls hint text */}
        <p className="text-xs text-[#9E9484] text-center font-medium">
          {status === 'DESCENDING' ? (
            <span>{t.descentSubtitle}</span>
          ) : (
            <>
              <span className="hidden sm:inline">{t.pushInstructionDesktop}</span>
              <span className="sm:hidden">{t.pushInstructionMobile}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

