import { GameStatus, GameStats, GameMode } from '../types/game';
import { Translations } from '../services/i18n';
import { Language } from '../types/game';
import { Trophy, Clock, Mountain, ArrowUpRight, Flame, Footprints, SkipForward, Music, Compass, Sparkles } from 'lucide-react';

interface GameHUDProps {
  stats: GameStats;
  status: GameStatus;
  isPushing: boolean;
  gameMode?: GameMode;
  onSelectMode?: (mode: GameMode) => void;
  t: Translations;
  lang?: Language;
  isMusicOn?: boolean;
  onToggleMusic?: () => void;
  onPushStart: () => void;
  onPushEnd: () => void;
  onSkipDescent?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  status,
  isPushing,
  gameMode = 'ABSURD',
  onSelectMode,
  t,
  lang = 'fr',
  isMusicOn = true,
  onToggleMusic,
  onPushStart,
  onPushEnd,
  onSkipDescent
}) => {
  return (
    <div className="w-full flex flex-col gap-5 mt-4">
      {/* 1. Live Stat Strip - Clean, unboxed typography with typographic separators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#1A1815] border border-[#2F2922]">
        {/* Distance */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-[#9E9484] flex items-center gap-1.5 font-medium">
            <Mountain className="w-3.5 h-3.5 text-amber-500" />
            {t.statDistance}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-cinzel text-[#F4EFE6] tracking-tight">
              {Number(stats.currentDistance || 0).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#9E9484]">m</span>
          </div>
        </div>

        {/* Altitude */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-[#9E9484] flex items-center gap-1.5 font-medium">
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

        {/* Endurance / Time */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-[#9E9484] flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            {t.statTime}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-[#F4EFE6] tracking-tight">
              {Number(stats.elapsedTime || 0).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#9E9484]">s</span>
          </div>
        </div>

        {/* Personal Best */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-[#9E9484] flex items-center gap-1.5 font-medium">
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

      {/* Mode Selector & Meditative Ambient Soundscape Strip */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#151311] border border-[#2B251E] text-xs shadow-inner">
        {/* Game Mode Selector (Absurde vs Zen) */}
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
              <span>{lang === 'fr' ? 'L\'Absurde' : 'The Absurd'}</span>
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
              title={lang === 'fr' ? 'Activer/Désactiver la musique de méditation' : 'Toggle meditation soundtrack'}
            >
              {isMusicOn ? (lang === 'fr' ? 'Actif' : 'On') : (lang === 'fr' ? 'Activer' : 'Off')}
            </button>
          )}
        </div>
      </div>

      {/* 2. Primary Tactical Action Zone */}
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
