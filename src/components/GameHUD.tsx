import React from 'react';
import { GameStatus, GameStats } from '../types/game';
import { Translations } from '../services/i18n';
import { Trophy, Clock, Mountain, ArrowUpRight, Flame } from 'lucide-react';

interface GameHUDProps {
  stats: GameStats;
  status: GameStatus;
  isPushing: boolean;
  t: Translations;
  onPushStart: () => void;
  onPushEnd: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  status,
  isPushing,
  t,
  onPushStart,
  onPushEnd
}) => {
  return (
    <div className="w-full flex flex-col gap-6 mt-4">
      {/* 1. Live Stat Strip - Clean, unboxed typography with typographic separators per design system */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#1A1815] border border-[#2F2922]">
        {/* Distance */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-[#9E9484] flex items-center gap-1.5 font-medium">
            <Mountain className="w-3.5 h-3.5 text-amber-500" />
            {t.statDistance}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-cinzel text-[#F4EFE6] tracking-tight">
              {stats.currentDistance.toFixed(1)}
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
              {stats.currentAltitude.toFixed(1)}
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
              {stats.elapsedTime.toFixed(1)}
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
              {stats.maxDistance.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#9E9484]">m</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Tactical Action Zone */}
      <div className="flex flex-col items-center justify-center gap-3">
        <button
          type="button"
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
          className={`group relative w-full max-w-md py-5 px-8 rounded-xl font-cinzel font-bold text-xl uppercase tracking-widest transition-all duration-100 cursor-pointer select-none no-select shadow-xl active:scale-[0.98] ${
            isPushing
              ? 'bg-amber-600 text-white shadow-amber-900/40 translate-y-1'
              : 'bg-gradient-to-b from-[#2C261F] to-[#1F1B16] text-[#E8E2D8] border border-[#544839] hover:border-amber-500/60 hover:text-white'
          }`}
          aria-label={t.pushAction}
        >
          <div className="flex items-center justify-center gap-3">
            <Flame className={`w-6 h-6 transition-transform ${isPushing ? 'scale-125 text-amber-200' : 'text-amber-500'}`} />
            <span>{isPushing ? (status === 'SLIPPING' ? t.gameStatusSlipping : t.pushAction) : t.pushAction}</span>
          </div>
        </button>

        {/* Subtle controls hint text without generic pill badge */}
        <p className="text-xs text-[#9E9484] text-center font-medium">
          <span className="hidden sm:inline">{t.pushInstructionDesktop}</span>
          <span className="sm:hidden">{t.pushInstructionMobile}</span>
        </p>
      </div>
    </div>
  );
};
