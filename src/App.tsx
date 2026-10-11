/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, GameStats, RunSummary, Language, GameMode, AdSimulationConfig, TimedEvent, EventBadge } from './types/game';
import { getSeasonForAttempt } from './services/seasons';
import { translations, getAbsurdRemark } from './services/i18n';
import { soundEngine } from './services/audio';
import { SisyphusCanvas } from './components/SisyphusCanvas';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { ShareCardModal } from './components/ShareCardModal';
import { EditorialSections } from './components/EditorialSections';
import { CodexSection } from './components/CodexSection';
import { DownloadModal } from './components/DownloadModal';
import { EventLeaderboardModal } from './components/EventLeaderboardModal';
import { checkAndUnlockBadge, getAvalancheHazard } from './services/events';
import { silentWatcherEngine } from './services/watcher';
import { saveLocalRun } from './services/indexedDb';
import { submitRunToCloud, getOrCreateDeviceId } from './services/firebase';
import { triggerRestartAds } from './services/adManager';
import { Volume2, VolumeX, Globe, Shield, Sparkles, Download, Music, Footprints, Trophy } from 'lucide-react';

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
  const [isMusicOn, setIsMusicOn] = useState<boolean>(() => soundEngine.musicEnabled);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [activeCertificate, setActiveCertificate] = useState<RunSummary | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('ABSURD');
  const [currentEvent, setCurrentEvent] = useState<TimedEvent>('NONE');
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<EventBadge | null>(null);
  const [showEventLeaderboard, setShowEventLeaderboard] = useState<boolean>(false);

  // Core Game State
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [currentDistance, setCurrentDistance] = useState<number>(0);
  const [descendDistance, setDescendDistance] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [pushCount, setPushCount] = useState<number>(0);
  const [toleranceRemainingMs, setToleranceRemainingMs] = useState<number>(TOLERANCE_WINDOW_MS);
  const [lastSummary, setLastSummary] = useState<RunSummary | null>(null);

  // Persistent Stats from localStorage with bulletproof parsing
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('eternal_push_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            currentDistance: Number(parsed.currentDistance) || 0,
            currentAltitude: Number(parsed.currentAltitude) || 0,
            elapsedTime: Number(parsed.elapsedTime) || 0,
            pushCount: Number(parsed.pushCount) || 0,
            maxDistance: Number(parsed.maxDistance) || 0,
            totalDistanceAllTime: Number(parsed.totalDistanceAllTime) || 0,
            totalTimeAllTime: Number(parsed.totalTimeAllTime) || 0,
            totalGamesPlayed: Number(parsed.totalGamesPlayed) || 0,
            totalPushesAllTime: Number(parsed.totalPushesAllTime) || 0,
            cairns: Array.isArray(parsed.cairns) ? parsed.cairns : []
          };
        }
      }
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
      totalPushesAllTime: 0,
      cairns: []
    };
  });

  // Monetization Config (clean compliance)
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

  // Active Season Configuration
  const seasonConfig = getSeasonForAttempt(stats.totalGamesPlayed, currentDistance);

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

  // Music Toggle Helper
  const handleToggleMusic = () => {
    const on = soundEngine.toggleMusic();
    setIsMusicOn(on);
  };

  // Mark app as mounted to dismiss preloader
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.getElementById('root')?.setAttribute('data-mounted', 'true');
    }
  }, []);

  // Refs for animation frame loop
  const isPushingRef = useRef<boolean>(false);
  const statusRef = useRef<GameStatus>('IDLE');
  const distanceRef = useRef<number>(0);
  const descendDistanceRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const pushCountRef = useRef<number>(0);
  const graceRef = useRef<number>(TOLERANCE_WINDOW_MS);
  const lastTickRef = useRef<number>(performance.now());
  const maxDistanceRef = useRef<number>(stats.maxDistance);
  const gameModeRef = useRef<GameMode>('ABSURD');
  const eventRef = useRef<TimedEvent>('NONE');
  const pushPulseUntilRef = useRef<number>(0);

  // Sync refs with state
  useEffect(() => {
    isPushingRef.current = isPushing;
    statusRef.current = status;
    distanceRef.current = currentDistance;
    timeRef.current = elapsedTime;
    pushCountRef.current = pushCount;
    maxDistanceRef.current = stats.maxDistance;
    gameModeRef.current = gameMode;
    eventRef.current = currentEvent;
  }, [isPushing, status, currentDistance, elapsedTime, pushCount, stats.maxDistance, gameMode, currentEvent]);

  // Restart Handler
  const handleRestart = useCallback(() => {
    if (statusRef.current === 'GAME_OVER') {
      triggerRestartAds();
    }
    setStatus('IDLE');
    statusRef.current = 'IDLE';
    setIsPushing(false);
    isPushingRef.current = false;
    pushPulseUntilRef.current = 0;
    setCurrentDistance(0);
    distanceRef.current = 0;
    setDescendDistance(0);
    descendDistanceRef.current = 0;
    setElapsedTime(0);
    timeRef.current = 0;
    setPushCount(0);
    pushCountRef.current = 0;
    graceRef.current = seasonConfig.graceWindowMs;
    setToleranceRemainingMs(seasonConfig.graceWindowMs);
    setLastSummary(null);
    soundEngine.startAmbientMusic(false);
    soundEngine.playClick();
  }, [seasonConfig.graceWindowMs]);

  // Main Physics & Loop Handler
  const triggerCrash = useCallback(() => {
    statusRef.current = 'CRASHING';
    setStatus('CRASHING');
    isPushingRef.current = false;
    setIsPushing(false);
    pushPulseUntilRef.current = 0;
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
      timestamp: Date.now(),
      event: eventRef.current
    };

    // Check and unlock timed event badges
    const badgeUnlock = checkAndUnlockBadge(eventRef.current, finalDistance, finalTime);
    if (badgeUnlock && badgeUnlock.wasNewlyUnlocked) {
      setNewlyUnlockedBadge(badgeUnlock.badge);
    } else {
      setNewlyUnlockedBadge(null);
    }

    // Save run in local IndexedDB
    saveLocalRun({
      distance: finalDistance,
      altitude: finalDistance * Math.sin(0.44),
      time: finalTime,
      pushes: finalPushes,
      season: seasonConfig.season,
      gameMode: gameModeRef.current,
      event: eventRef.current,
      isNewRecord: isRecord,
      timestamp: Date.now()
    }).catch(() => {});

    // Sync run to Cloud Firebase Leaderboard
    submitRunToCloud({
      deviceId: getOrCreateDeviceId(),
      playerName: 'Sisyphe',
      distance: finalDistance,
      altitude: finalDistance * Math.sin(0.44),
      time: finalTime,
      pushes: finalPushes,
      season: seasonConfig.season,
      gameMode: gameModeRef.current,
      event: eventRef.current,
      timestamp: Date.now()
    }).catch(() => {});

    // Update memorial cairns on the mountain
    const updatedCairns = stats.cairns ? [...stats.cairns] : [];
    if (finalDistance >= 15 && !updatedCairns.some(c => Math.abs(c.distance - finalDistance) < 6)) {
      updatedCairns.push({
        id: `cairn_${Date.now()}`,
        distance: finalDistance,
        labelFr: `Chute à ${Math.round(finalDistance)}m`,
        labelEn: `Fell at ${Math.round(finalDistance)}m`,
        attemptsAtPoint: 1,
        timestamp: Date.now()
      });
      if (updatedCairns.length > 8) {
        updatedCairns.sort((a, b) => b.distance - a.distance);
        updatedCairns.length = 8;
      }
    }

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
      totalPushesAllTime: stats.totalPushesAllTime + finalPushes,
      cairns: updatedCairns
    };
    persistStats(updatedStats);

    // Immediate graceful transition to Game Over after boulder tumble
    setTimeout(() => {
      setStatus('GAME_OVER');
      statusRef.current = 'GAME_OVER';
      setLastSummary(summary);
      setCurrentDistance(0);
      distanceRef.current = 0;
    }, 850);
  }, [lang, stats, persistStats]);

  // Push Start & End Callbacks (Unified for Mouse, Pointer, Touch, and Taps)
  const handlePushStart = useCallback(() => {
    if (statusRef.current === 'CRASHING') return;

    // Start ambient score upon player interaction if enabled
    if (soundEngine.musicEnabled && !soundEngine.isMuted) {
      soundEngine.startAmbientMusic(statusRef.current === 'DESCENDING');
    }

    if (statusRef.current === 'GAME_OVER') {
      handleRestart();
      return;
    }

    if (statusRef.current === 'DESCENDING') {
      // Step briskly downward on tap/hold
      soundEngine.playFootstep(false);
      descendDistanceRef.current = Math.max(0, descendDistanceRef.current - 1.5);
      setDescendDistance(descendDistanceRef.current);
      if (descendDistanceRef.current <= 0.1) {
        setStatus('GAME_OVER');
        statusRef.current = 'GAME_OVER';
        soundEngine.startAmbientMusic(false);
      }
      return;
    }

    // Pushing / Starting / Slipping:
    isPushingRef.current = true;
    setIsPushing(true);

    if (statusRef.current === 'IDLE' || statusRef.current === 'SLIPPING') {
      statusRef.current = 'PUSHING';
      setStatus('PUSHING');
    }

    // Immediate tap impulse so every single tap/click produces instant kinetic motion!
    const impulse = 0.55 * seasonConfig.pushSpeedMod;
    distanceRef.current += impulse;
    setCurrentDistance(distanceRef.current);

    pushCountRef.current += 1;
    setPushCount(pushCountRef.current);

    // Refill tolerance window
    graceRef.current = Math.min(seasonConfig.graceWindowMs, Math.max(graceRef.current, 0) + 450);
    setToleranceRemainingMs(graceRef.current);

    // Keep visual push stride active for at least 260ms so quick taps show full step motion
    pushPulseUntilRef.current = performance.now() + 260;

    soundEngine.playPushScrape(0.85);
    soundEngine.playFootstep(true);
  }, [seasonConfig, handleRestart]);

  const handlePushEnd = useCallback(() => {
    isPushingRef.current = false;
    if (performance.now() >= pushPulseUntilRef.current) {
      setIsPushing(false);
    }
  }, []);

  const handleSkipDescent = useCallback(() => {
    handleRestart();
  }, [handleRestart]);

  // Keyboard Spacebar Listener (with strict preventDefault to avoid page scroll)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
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

        // Equinox Challenge: strict 5 minutes (300 seconds) cosmic session limit!
        if (eventRef.current === 'EQUINOX' && timeRef.current >= 300) {
          triggerCrash();
          return;
        }

        const isActivelyPushing = isPushingRef.current || performance.now() < pushPulseUntilRef.current;

        if (isActivelyPushing) {
          const speed = 4.2 * seasonConfig.pushSpeedMod;
          distanceRef.current += speed * dt;
          setCurrentDistance(distanceRef.current);

          graceRef.current = Math.min(seasonConfig.graceWindowMs, graceRef.current + dt * 1500);
          setToleranceRemainingMs(graceRef.current);

          if (statusRef.current === 'SLIPPING') {
            statusRef.current = 'PUSHING';
            setStatus('PUSHING');
          }
        } else {
          // If in ZEN meditation mode, releasing does not crash: the stone remains peacefully braced
          if (gameModeRef.current === 'ZEN') {
            graceRef.current = seasonConfig.graceWindowMs;
            setToleranceRemainingMs(seasonConfig.graceWindowMs);
            if (statusRef.current === 'SLIPPING') {
              statusRef.current = 'PUSHING';
              setStatus('PUSHING');
            }
          } else {
            graceRef.current -= dt * 1000;
            setToleranceRemainingMs(Math.max(0, graceRef.current));

            if (graceRef.current <= 0) {
              if (statusRef.current !== 'SLIPPING') {
                statusRef.current = 'SLIPPING';
                setStatus('SLIPPING');
                soundEngine.playSlipWarning();
              }

              // Avalanche hazard escalates slip gravity every 20m!
              const avalancheHazard = eventRef.current === 'AVALANCHE' ? getAvalancheHazard(distanceRef.current) : null;
              const avalancheGravityMult = avalancheHazard ? avalancheHazard.slipGravityMultiplier : 1.0;

              const gravitySpeed = 6.5 * seasonConfig.slipGravityMod * avalancheGravityMult;
              distanceRef.current -= gravitySpeed * dt;
              setCurrentDistance(Math.max(0, distanceRef.current));

              if (distanceRef.current <= 0.1 || graceRef.current <= -900) {
                triggerCrash();
                return;
              }
            }
          }
        }
      } else if (statusRef.current === 'DESCENDING') {
        // Sisyphus walks down the mountain in contemplation
        const isActivelyStepping = isPushingRef.current || performance.now() < pushPulseUntilRef.current;
        const descendSpeed = isActivelyStepping ? 16 : 5.2;
        descendDistanceRef.current = Math.max(0, descendDistanceRef.current - descendSpeed * dt);
        setDescendDistance(descendDistanceRef.current);

        if (descendDistanceRef.current <= 0.1) {
          setStatus('GAME_OVER');
          statusRef.current = 'GAME_OVER';
          soundEngine.startAmbientMusic(false);
          return;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    lastTickRef.current = performance.now();
    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [triggerCrash, seasonConfig]);

  const toleranceRatio = Math.max(0, Math.min(1, toleranceRemainingMs / seasonConfig.graceWindowMs));

  return (
    <div className="min-h-screen bg-[#121110] text-[#E8E4DF] flex flex-col items-center">
      
      {/* 1. Header Bar: Brand & System Controls */}
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
              {lang === 'fr' ? 'Le Mythe de Sisyphe · Jeu Web' : 'Sisyphus Absurdist Game'}
            </span>
          </div>
        </div>

        {/* Global Controls: Audio & Language */}
        <div className="flex items-center gap-2">
          {/* Panthéon / Event Leaderboards Button */}
          <button
            type="button"
            onClick={() => setShowEventLeaderboard(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F1B16] hover:bg-[#2A241E] border border-amber-600/50 text-xs font-cinzel font-semibold text-amber-300 shadow-sm transition-all cursor-pointer"
            title={lang === 'fr' ? 'Classements et Badges des Événements' : 'Event Leaderboards & Badges'}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{lang === 'fr' ? 'Panthéon' : 'Leaderboard'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F1B16] hover:bg-[#2A241E] border border-[#3A3226] text-xs font-cinzel font-semibold text-[#D4C8B8] shadow-sm transition-all cursor-pointer"
            title={t.downloadAction}
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">{t.downloadAction}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              isMusicOn
                ? 'bg-amber-950/40 border-amber-700/60 text-amber-300'
                : 'bg-[#181614] border-[#2E2820] text-[#696155] hover:text-[#A89E8F]'
            }`}
            title={lang === 'fr' ? 'Musique de Méditation 432 Hz (Libre de droit)' : '432 Hz Meditative Music (Royalty-free)'}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="text-[11px] font-cinzel font-medium hidden sm:inline">
              {lang === 'fr' ? (isMusicOn ? 'Méditation 432Hz' : 'Musique Off') : (isMusicOn ? 'Meditation 432Hz' : 'Music Off')}
            </span>
          </button>

          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              !isMuted
                ? 'bg-amber-950/40 border-amber-700/60 text-amber-300'
                : 'bg-[#181614] border-[#2E2820] text-[#696155] hover:text-[#A89E8F]'
            }`}
            title={isMuted ? t.soundOff : t.soundOn}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181614] hover:bg-[#24201B] border border-[#2E2820] text-xs font-mono text-[#D4C8B8] transition-colors cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold uppercase">{lang}</span>
          </button>
        </div>
      </header>

      {/* 2. Main Game Arena Container */}
      <main className="w-full max-w-4xl px-4 py-6 sm:py-8 flex flex-col items-center">
        
        {/* Hero Header */}
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
          runTime={elapsedTime}
          totalAttempts={stats.totalGamesPlayed}
          toleranceRatio={toleranceRatio}
          season={seasonConfig.season}
          seasonConfig={seasonConfig}
          lang={lang}
          maxDistance={stats.maxDistance}
          cairns={stats.cairns}
          descendDistance={descendDistance}
          event={currentEvent}
          onPushStart={handlePushStart}
          onPushEnd={handlePushEnd}
        />

        {/* Live Metrics HUD & Primary Tactical Action */}
        <GameHUD
          stats={{
            currentDistance: status === 'DESCENDING' ? descendDistance : currentDistance,
            currentAltitude: (status === 'DESCENDING' ? descendDistance : currentDistance) * Math.sin(0.44),
            elapsedTime,
            pushCount,
            maxDistance: stats.maxDistance,
            totalDistanceAllTime: stats.totalDistanceAllTime,
            totalTimeAllTime: stats.totalTimeAllTime,
            totalGamesPlayed: stats.totalGamesPlayed,
            totalPushesAllTime: stats.totalPushesAllTime,
            cairns: stats.cairns
          }}
          status={status}
          isPushing={isPushing}
          gameMode={gameMode}
          onSelectMode={(m) => setGameMode(m)}
          event={currentEvent}
          onSelectEvent={(evt) => {
            setCurrentEvent(evt);
            handleRestart();
          }}
          onTriggerWatcher={() => {
            silentWatcherEngine.triggerQuote('CONTEMPLATION');
          }}
          t={t}
          lang={lang}
          isMusicOn={isMusicOn}
          onToggleMusic={handleToggleMusic}
          onPushStart={handlePushStart}
          onPushEnd={handlePushEnd}
          onSkipDescent={handleSkipDescent}
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
          <a href="#codex" className="hover:text-amber-400 transition-colors">{t.navCodex}</a>
          <span>·</span>
          <a href="#myth" className="hover:text-amber-400 transition-colors">{t.navMyth}</a>
          <span>·</span>
          <a href="#why" className="hover:text-amber-400 transition-colors">{t.navWhy}</a>
          <span>·</span>
          <a href="#faq" className="hover:text-amber-400 transition-colors">{t.faqTitle}</a>
        </nav>

        {/* 3. Mountain Codex (Living Encounters & Spirits) */}
        <CodexSection t={t} lang={lang} />

        {/* 4. Deep Editorial & Philosophical Sections */}
        <EditorialSections t={t} />

      </main>

      {/* Footer */}
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
          unlockedBadge={newlyUnlockedBadge}
          onRestart={handleRestart}
          onOpenCertificate={() => setActiveCertificate(lastSummary)}
          onOpenEventLeaderboard={() => setShowEventLeaderboard(true)}
        />
      )}

      {/* Event Leaderboards & Badges Modal */}
      {showEventLeaderboard && (
        <EventLeaderboardModal
          initialEvent={currentEvent}
          lang={lang}
          onClose={() => setShowEventLeaderboard(false)}
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
