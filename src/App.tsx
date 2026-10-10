/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, GameStats, RunSummary, Language, AdSimulationConfig } from './types/game';
import { translations, getAbsurdRemark } from './services/i18n';
import { soundEngine } from './services/audio';
import { SisyphusCanvas } from './components/SisyphusCanvas';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { ShareCardModal } from './components/ShareCardModal';
import { EditorialSections } from './components/EditorialSections';
import { DownloadModal } from './components/DownloadModal';
import { Volume2, VolumeX, Globe, Shield, Sparkles, Download } from 'lucide-react';

const TOLERANCE_WINDOW_MS = 950; // ~0.95 seconds grace before gravity reclaims boulder

export default function App() {
  // Language & Audio Preferences
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('eternal_push_lang');
      if (savedLang === 'fr' || savedLang === 'en') return savedLang;
      if (typeof navigator !== 'undefined' && navigator.language?.startsWith('fr')) return 'fr';
    } catch {
      // fallback
    }
    return 'en';
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.isMuted);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [activeCertificate, setActiveCertificate] = useState<RunSummary | null>(null);

  // Core Game State
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [currentDistance, setCurrentDistance] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [pushCount, setPushCount] = useState<number>(0);
  const [toleranceRemainingMs, setToleranceRemainingMs] = useState<number>(TOLERANCE_WINDOW_MS);
  const [lastSummary, setLastSummary] = useState<RunSummary | null>(null);

  // Persistent Stats from localStorage
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('eternal_push_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      currentDistance: 0,
      currentAltitude: 0,
      elapsedTime: 0,
      pushCount: 0,
      maxDistance: 0,
      totalDistanceAllTime: 0,
      totalTimeAllTime: 0,
      totalGamesPlayed: 0,
      totalPushesAllTime: 0
    };
  });

  // Monetization Config
  const [adConfig] = useState<AdSimulationConfig>({
    showRealScript: false,
    adsterraZoneId: '',
    adsterraScriptUrl: '',
    format: 'banner_300x250',
    dailySessions: 10000,
    gamesPerSession: 3,
    cpm: 0.80,
    fillRate: 1.0
  });

  const t = translations[lang];

  // Save Stats Helper
  const persistStats = useCallback((updated: GameStats) => {
    setStats(updated);
    try {
      localStorage.setItem('eternal_push_stats', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  // Language Change Helper
  const handleToggleLanguage = () => {
    const nextLang = lang === 'en' ? 'fr' : 'en';
    setLang(nextLang);
    try {
      localStorage.setItem('eternal_push_lang', nextLang);
    } catch {
      // ignore
    }
  };

  // Sound Toggle Helper
  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Refs for animation frame loop
  const isPushingRef = useRef<boolean>(false);
  const statusRef = useRef<GameStatus>('IDLE');
  const distanceRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const pushCountRef = useRef<number>(0);
  const graceRef = useRef<number>(TOLERANCE_WINDOW_MS);
  const lastTickRef = useRef<number>(performance.now());
  const maxDistanceRef = useRef<number>(stats.maxDistance);

  // Sync refs with state
  useEffect(() => {
    isPushingRef.current = isPushing;
    statusRef.current = status;
    distanceRef.current = currentDistance;
    timeRef.current = elapsedTime;
    pushCountRef.current = pushCount;
    maxDistanceRef.current = stats.maxDistance;
  }, [isPushing, status, currentDistance, elapsedTime, pushCount, stats.maxDistance]);

  // Main Physics & Loop Handler
  const triggerCrash = useCallback(() => {
    statusRef.current = 'CRASHING';
    setStatus('CRASHING');
    soundEngine.playCatastrophicRoll();

    const finalDistance = distanceRef.current;
    const finalTime = timeRef.current;
    const finalPushes = pushCountRef.current;
    const isRecord = finalDistance > maxDistanceRef.current && finalDistance > 1;

    const summary: RunSummary = {
      distance: finalDistance,
      altitude: finalDistance * Math.sin(0.44),
      time: finalTime,
      pushes: finalPushes,
      isNewRecord: isRecord,
      absurdRemark: getAbsurdRemark(finalDistance, finalTime, lang),
      timestamp: Date.now()
    };

    // Update cumulative lifetime stats
    const newMax = Math.max(maxDistanceRef.current, finalDistance);
    const updatedStats: GameStats = {
      currentDistance: 0,
      currentAltitude: 0,
      elapsedTime: 0,
      pushCount: 0,
      maxDistance: newMax,
      totalDistanceAllTime: stats.totalDistanceAllTime + finalDistance,
      totalTimeAllTime: stats.totalTimeAllTime + finalTime,
      totalGamesPlayed: stats.totalGamesPlayed + 1,
      totalPushesAllTime: stats.totalPushesAllTime + finalPushes
    };
    persistStats(updatedStats);

    // After brief crash tumble animation, reveal Game Over Modal
    setTimeout(() => {
      setStatus('GAME_OVER');
      statusRef.current = 'GAME_OVER';
      setLastSummary(summary);
      setCurrentDistance(0);
      distanceRef.current = 0;
    }, 900);
  }, [lang, stats, persistStats]);

  // Push Start & End Callbacks
  const handlePushStart = useCallback(() => {
    if (statusRef.current === 'CRASHING' || statusRef.current === 'GAME_OVER') return;

    if (!isPushingRef.current) {
      isPushingRef.current = true;
      setIsPushing(true);
      pushCountRef.current += 1;
      setPushCount((c) => c + 1);

      if (statusRef.current === 'IDLE' || statusRef.current === 'SLIPPING') {
        statusRef.current = 'PUSHING';
        setStatus('PUSHING');
        graceRef.current = TOLERANCE_WINDOW_MS;
        setToleranceRemainingMs(TOLERANCE_WINDOW_MS);
      }
    }
  }, []);

  const handlePushEnd = useCallback(() => {
    if (isPushingRef.current) {
      isPushingRef.current = false;
      setIsPushing(false);
    }
  }, []);

  // Keyboard Spacebar Listener (with strict preventDefault to avoid page scroll)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        // Prevent default spacebar page scrolling
        e.preventDefault();
        handlePushStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePushEnd();
      }
    };

    // Window blur or tab hidden handling
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handlePushEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handlePushStart, handlePushEnd]);

  // Primary Game Physics Animation Timer
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTickRef.current) / 1000, 0.1);
      lastTickRef.current = now;

      if (statusRef.current === 'PUSHING' || statusRef.current === 'SLIPPING') {
        timeRef.current += dt;
        setElapsedTime(timeRef.current);

        if (isPushingRef.current) {
          // Pushing forward at ~4.2 m/s
          const speed = 4.2;
          distanceRef.current += speed * dt;
          setCurrentDistance(distanceRef.current);

          // Replenish grace
          graceRef.current = Math.min(TOLERANCE_WINDOW_MS, graceRef.current + dt * 1500);
          setToleranceRemainingMs(graceRef.current);

          if (statusRef.current === 'SLIPPING') {
            statusRef.current = 'PUSHING';
            setStatus('PUSHING');
          }
        } else {
          // Player released push! Drain grace tolerance window
          graceRef.current -= dt * 1000;
          setToleranceRemainingMs(Math.max(0, graceRef.current));

          if (graceRef.current <= 0) {
            // Grace expired: stone starts slipping backward!
            if (statusRef.current !== 'SLIPPING') {
              statusRef.current = 'SLIPPING';
              setStatus('SLIPPING');
              soundEngine.playSlipWarning();
            }

            // Gravity pulling back
            distanceRef.current -= 6.5 * dt;
            setCurrentDistance(Math.max(0, distanceRef.current));

            // If stone rolls back significantly or reaches 0, catastrophic crash!
            if (distanceRef.current <= 0.1 || graceRef.current <= -900) {
              triggerCrash();
              return;
            }
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    lastTickRef.current = performance.now();
    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [triggerCrash]);

  // Restart Handler
  const handleRestart = () => {
    setStatus('IDLE');
    statusRef.current = 'IDLE';
    setIsPushing(false);
    isPushingRef.current = false;
    setCurrentDistance(0);
    distanceRef.current = 0;
    setElapsedTime(0);
    timeRef.current = 0;
    setPushCount(0);
    pushCountRef.current = 0;
    graceRef.current = TOLERANCE_WINDOW_MS;
    setToleranceRemainingMs(TOLERANCE_WINDOW_MS);
    setLastSummary(null);
    soundEngine.playClick();
  };

  const toleranceRatio = Math.max(0, Math.min(1, toleranceRemainingMs / TOLERANCE_WINDOW_MS));

  return (
    <div className="min-h-screen bg-[#121110] text-[#E8E4DF] flex flex-col items-center">
      
      {/* 1. Header Bar: Brand, Navigation & System Controls */}
      <header className="w-full max-w-5xl px-4 py-4 sm:py-6 flex items-center justify-between border-b border-[#25201A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-500/40 flex items-center justify-center font-cinzel font-black text-white text-base shadow-md">
            Σ
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#F7F2E8]">
              {t.siteTitle}
            </span>
            <span className="text-[10px] text-[#8E8373] tracking-widest uppercase font-mono">
              Sisyphus Absurdist Game
            </span>
          </div>
        </div>

        {/* Global Controls: Download, Audio & Language Switcher */}
        <div className="flex items-center gap-2">
          {/* Download Project / Install App Button */}
          <button
            type="button"
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 border border-amber-500/50 text-xs font-cinzel font-bold text-white shadow-md transition-all cursor-pointer"
            title={t.downloadAction}
          >
            <Download className="w-3.5 h-3.5 text-amber-200" />
            <span>{t.downloadAction}</span>
          </button>

          {/* Audio Mute Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-lg bg-[#1B1815] hover:bg-[#28231E] border border-[#342D24] text-[#A69B8B] hover:text-[#E8E2D8] transition-colors cursor-pointer"
            title={isMuted ? t.soundOff : t.soundOn}
            aria-label={isMuted ? t.soundOff : t.soundOn}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={handleToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B1815] hover:bg-[#28231E] border border-[#342D24] text-xs font-mono text-[#D4CBBF] transition-colors cursor-pointer"
            title="Switch Language (EN / FR)"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold uppercase">{lang}</span>
          </button>
        </div>
      </header>

      {/* 2. Main Game Arena Container */}
      <main className="w-full max-w-4xl px-4 py-6 sm:py-8 flex flex-col items-center">
        
        {/* SEO-Optimized Hero Header */}
        <div className="text-center max-w-2xl mb-6">
          <div className="text-xs uppercase tracking-widest text-amber-500/90 font-mono mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{t.heroKicker}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-cinzel text-[#F7F3EB] tracking-tight leading-tight">
            {t.heroH1}
          </h1>
          <p className="text-xs sm:text-sm text-[#A89D8D] font-editorial mt-2 leading-relaxed">
            {t.heroSub}
          </p>
        </div>

        {/* The Mountain Interactive Canvas */}
        <SisyphusCanvas
          status={status}
          isPushing={isPushing}
          distance={currentDistance}
          toleranceRatio={toleranceRatio}
          onPushStart={handlePushStart}
          onPushEnd={handlePushEnd}
        />

        {/* Live Metrics HUD & Primary Touch Action */}
        <GameHUD
          stats={{
            currentDistance,
            currentAltitude: currentDistance * Math.sin(0.44),
            elapsedTime,
            pushCount,
            maxDistance: stats.maxDistance,
            totalDistanceAllTime: stats.totalDistanceAllTime,
            totalTimeAllTime: stats.totalTimeAllTime,
            totalGamesPlayed: stats.totalGamesPlayed,
            totalPushesAllTime: stats.totalPushesAllTime
          }}
          status={status}
          isPushing={isPushing}
          t={t}
          onPushStart={handlePushStart}
          onPushEnd={handlePushEnd}
        />

        {/* Lifetime Struggle Banner (Clean Unboxed Typography) */}
        <div className="w-full max-w-md mt-6 pt-4 border-t border-[#231F1A] flex items-center justify-between text-xs text-[#827768] font-mono">
          <span>{t.statTotalAllTime}:</span>
          <span className="text-[#C2B7A7] font-semibold">
            {Math.round(stats.totalDistanceAllTime).toLocaleString()} m · {stats.totalGamesPlayed} runs
          </span>
        </div>

        {/* Navigation links for story & rules */}
        <nav aria-label="Page Sections" className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#9E9383] mt-8 pt-4 border-t border-[#221D17]">
          <a href="#how-to-play" className="hover:text-amber-400 transition-colors">{t.navHowToPlay}</a>
          <span>·</span>
          <a href="#myth" className="hover:text-amber-400 transition-colors">{t.navMyth}</a>
          <span>·</span>
          <a href="#why" className="hover:text-amber-400 transition-colors">{t.navWhy}</a>
          <span>·</span>
          <a href="#faq" className="hover:text-amber-400 transition-colors">{t.faqTitle}</a>
        </nav>

        {/* 3. Deep Editorial Sections (SEO & Philosophy) */}
        <EditorialSections t={t} />

      </main>

      {/* 6. Footer */}
      <footer className="w-full border-t border-[#221E19] py-8 px-4 mt-16 text-center text-xs text-[#73695C] flex flex-col items-center gap-3">
        <p>{t.footerRights}</p>
        <div className="flex items-center gap-4 text-xs text-[#8A7F70]">
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="hover:text-amber-400 transition-colors cursor-pointer underline flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.privacyModalTitle}</span>
          </button>
        </div>
      </footer>

      {/* Game Over Modal */}
      {status === 'GAME_OVER' && lastSummary && (
        <GameOverModal
          summary={lastSummary}
          t={t}
          adConfig={adConfig}
          onRestart={handleRestart}
          onOpenCertificate={() => setActiveCertificate(lastSummary)}
        />
      )}

      {/* Shareable Certificate Modal */}
      {activeCertificate && (
        <ShareCardModal
          summary={activeCertificate}
          t={t}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-[#171513] border border-[#3E3529] p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="font-cinzel text-lg font-bold text-[#F4EDE2] flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              {t.privacyModalTitle}
            </h3>
            <p className="text-xs text-[#C4B9A9] leading-relaxed">
              {t.privacyModalContent}
            </p>
            <button
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="mt-2 py-2 px-4 rounded-xl bg-[#28231D] hover:bg-[#383129] border border-[#483E31] text-xs font-semibold text-white transition-colors cursor-pointer self-end"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}

      {/* Download & PWA Modal */}
      {showDownloadModal && (
        <DownloadModal
          t={t}
          lang={lang}
          onClose={() => setShowDownloadModal(false)}
        />
      )}

    </div>
  );
}
