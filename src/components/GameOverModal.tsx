import React, { useState } from 'react';
import { RunSummary, AdSimulationConfig, EventBadge } from '../types/game';
import { Translations } from '../services/i18n';
import { RotateCcw, Share2, Award, Check, ExternalLink, Trophy, ShieldCheck } from 'lucide-react';
import { TIMED_EVENTS } from '../services/events';
import { triggerRestartAds } from '../services/adManager';

interface GameOverModalProps {
  summary: RunSummary;
  t: Translations;
  adConfig: AdSimulationConfig;
  unlockedBadge?: EventBadge | null;
  onRestart: () => void;
  onOpenCertificate: () => void;
  onOpenEventLeaderboard?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  summary,
  t,
  adConfig,
  unlockedBadge,
  onRestart,
  onOpenCertificate,
  onOpenEventLeaderboard
}) => {
  const [copied, setCopied] = useState(false);
  const eventConfig = summary.event ? TIMED_EVENTS[summary.event] : null;

  const handleShareText = async () => {
    const eventText = eventConfig ? ` [Défi: ${eventConfig.titleFr}]` : '';
    const textToShare = `🏛️ The Eternal Push (Sisyphus Game)${eventText}\n` +
      `I pushed the boulder for ${summary.distance.toFixed(1)}m uphill (${summary.time.toFixed(1)}s, ${summary.pushes} pushes).\n` +
      `Result: 0 meters. Pure absurdity.\n` +
      `"${summary.absurdRemark}"\n` +
      `Try your fate: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Eternal Push - My Sisyphus Score',
          text: textToShare,
          url: window.location.origin
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#171513] border border-[#3E362C] p-6 shadow-2xl text-[#E8E2D8] flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Record Alert if achieved */}
        {summary.isNewRecord && (
          <div className="py-1 px-3 rounded text-center text-xs font-bold tracking-widest uppercase bg-amber-950/70 text-amber-300 border border-amber-600/50">
            {t.newRecordAlert}
          </div>
        )}

        {/* Newly Unlocked Badge Banner */}
        {unlockedBadge && (
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/70 flex items-center gap-3 animate-bounce">
            <span className="text-3xl">{unlockedBadge.icon}</span>
            <div className="flex flex-col">
              <span className="text-xs font-cinzel font-bold text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> NOUVEAU BADGE DÉBLOQUÉ !
              </span>
              <span className="text-sm font-cinzel font-bold text-white">{unlockedBadge.nameFr}</span>
              <span className="text-[10px] text-[#D8CEBF]">{unlockedBadge.descriptionFr}</span>
            </div>
          </div>
        )}

        {/* Title & Philosophical Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            {eventConfig && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-700/50 font-cinzel uppercase font-bold">
                {eventConfig.badgeIcon} {eventConfig.titleFr}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold font-cinzel text-[#F7F3EB] tracking-wide">
            {t.gameOverTitle}
          </h2>
          <p className="text-xs text-[#9E9484] mt-1">
            {t.gameOverSubtitle}
          </p>
        </div>

        {/* Absurd Remark Box */}
        <div className="p-4 rounded-xl bg-[#201D19] border-l-2 border-amber-500 text-sm font-editorial italic text-[#D8CEBF] leading-relaxed">
          “{summary.absurdRemark}”
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#121110] border border-[#2E2821] text-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-[#8C8273]">{t.statDistance}</span>
            <span className="text-xl font-bold font-cinzel text-amber-200 mt-0.5">
              {Number(summary.distance || 0).toFixed(1)} <span className="text-xs font-normal">m</span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-[#8C8273]">{t.statTime}</span>
            <span className="text-xl font-bold font-mono text-[#F0EBE1] mt-0.5">
              {Number(summary.time || 0).toFixed(1)} <span className="text-xs font-normal">s</span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-[#8C8273]">{t.statPushes}</span>
            <span className="text-xl font-bold font-mono text-[#F0EBE1] mt-0.5">
              {summary.pushes}
            </span>
          </div>
        </div>

        {/* Dedicated, Strictly Dimensioned Adsterra / Sponsored Slot (CLS <= 0.1) */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between text-[10px] text-[#786E60] uppercase tracking-wider font-mono px-1">
            <span>{t.adNotice}</span>
            <span className="text-[9px]">300×250 Banner Slot</span>
          </div>

          <div className="w-full h-[140px] rounded-lg bg-[#0F0E0C] border border-dashed border-[#3D352A] flex flex-col items-center justify-center p-3 text-center relative overflow-hidden group">
            <div className="flex flex-col items-center gap-1.5 z-10 max-w-xs">
              <span className="text-xs font-cinzel tracking-widest text-[#B5A997] font-semibold">
                HERACLES COURIER · ATHENS
              </span>
              <p className="text-[11px] text-[#857B6D] leading-snug">
                “Heavy load transport since 450 BCE. We do not drop your cargo. Ever.”
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-500/90 font-mono underline">
                Simulated Partner Network <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <div className="absolute bottom-1 right-2 text-[9px] text-[#4A4338] font-mono">
              Adsterra Compliant Display
            </div>
          </div>
          <p className="text-[10px] text-[#635B4F] text-center italic">
            {t.adDisclaimer}
          </p>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-1">
          {/* Main Restart Button (Prominent, unhindered) */}
          <button
            type="button"
            onClick={() => {
              triggerRestartAds();
              onRestart();
            }}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl font-cinzel font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.tryAgainBtn}</span>
          </button>

          {/* Leaderboard button */}
          {onOpenEventLeaderboard && (
            <button
              type="button"
              onClick={onOpenEventLeaderboard}
              className="w-full sm:w-auto py-3 px-3.5 rounded-xl font-sans font-medium text-xs text-[#D8CEBF] bg-[#24201A] hover:bg-[#312B24] border border-[#453D32] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Classements et Badges"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Panthéon</span>
            </button>
          )}

          {/* Share score */}
          <button
            type="button"
            onClick={handleShareText}
            className="w-full sm:w-auto py-3 px-4 rounded-xl font-sans font-medium text-xs text-[#D8CEBF] bg-[#24201A] hover:bg-[#312B24] border border-[#453D32] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? t.copiedToast : t.shareScoreBtn}</span>
          </button>

          {/* Certificate Badge Modal */}
          <button
            type="button"
            onClick={onOpenCertificate}
            className="w-full sm:w-auto py-3 px-3.5 rounded-xl font-sans font-medium text-xs text-[#D8CEBF] bg-[#24201A] hover:bg-[#312B24] border border-[#453D32] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title={t.shareCardBtn}
          >
            <Award className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </div>
  );
};
