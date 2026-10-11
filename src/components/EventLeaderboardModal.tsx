import React, { useState, useEffect } from 'react';
import { TimedEvent, Language, EventBadge } from '../types/game';
import { getInitialBadges, TIMED_EVENTS } from '../services/events';
import { getLocalRunsByEvent, getAllLocalRuns, LocalRunRecord } from '../services/indexedDb';
import { fetchGlobalLeaderboard, CloudLeaderboardEntry } from '../services/firebase';
import { Trophy, Snowflake, Sun, Hourglass, Award, X, Sparkles, ShieldCheck } from 'lucide-react';

interface EventLeaderboardModalProps {
  initialEvent?: TimedEvent;
  lang: Language;
  onClose: () => void;
}

export const EventLeaderboardModal: React.FC<EventLeaderboardModalProps> = ({
  initialEvent = 'NONE',
  lang,
  onClose
}) => {
  const [selectedTab, setSelectedTab] = useState<TimedEvent>(initialEvent);
  const [badges, setBadges] = useState<Record<string, EventBadge>>({});
  const [localRuns, setLocalRuns] = useState<LocalRunRecord[]>([]);
  const [cloudRuns, setCloudRuns] = useState<CloudLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'LOCAL' | 'CLOUD'>('LOCAL');

  useEffect(() => {
    setBadges(getInitialBadges());
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadData() {
      try {
        if (selectedTab === 'NONE') {
          const allLocal = await getAllLocalRuns();
          if (isMounted) setLocalRuns(allLocal.slice(0, 20));
        } else {
          const filteredLocal = await getLocalRunsByEvent(selectedTab);
          if (isMounted) setLocalRuns(filteredLocal.slice(0, 20));
        }

        const cloud = await fetchGlobalLeaderboard(50);
        if (isMounted) {
          if (selectedTab === 'NONE') {
            setCloudRuns(cloud.slice(0, 20));
          } else {
            setCloudRuns(cloud.filter((r) => r.event === selectedTab).slice(0, 20));
          }
        }
      } catch (err) {
        console.warn('Error loading event leaderboard:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [selectedTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#171513] border border-[#3E362C] p-5 sm:p-6 shadow-2xl text-[#E8E2D8] flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2C251D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-cinzel text-[#F7F3EB] tracking-wide">
                {lang === 'fr' ? 'Classements des Événements & Badges' : 'Event Leaderboards & Badges'}
              </h2>
              <p className="text-xs text-[#9E9484]">
                {lang === 'fr' ? 'Chaque défi temporel possède son propre panthéon' : 'Each timed event features dedicated rankings'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9E9484] hover:text-white hover:bg-[#25201A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Shelf */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#12100E] border border-[#2E271F]">
          <span className="text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            {lang === 'fr' ? 'Badges des Événements' : 'Event Badges'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {Object.values(badges).map((badge) => (
              <div
                key={badge.id}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${
                  badge.unlocked
                    ? 'bg-amber-950/40 border-amber-600/60 shadow-sm'
                    : 'bg-[#181512] border-[#2A231B] opacity-60'
                }`}
              >
                <div className="text-2xl shrink-0 mt-0.5">{badge.icon}</div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-cinzel font-bold text-[#F4EFE6]">
                      {lang === 'fr' ? badge.nameFr : badge.nameEn}
                    </span>
                    {badge.unlocked && <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-[#A69C8D] leading-tight mt-0.5">
                    {lang === 'fr' ? badge.descriptionFr : badge.descriptionEn}
                  </span>
                  <span className={`text-[9px] font-mono mt-1 ${badge.unlocked ? 'text-amber-300 font-bold' : 'text-[#7A7061]'}`}>
                    {badge.unlocked
                      ? (lang === 'fr' ? '✓ DÉBLOQUÉ' : '✓ UNLOCKED')
                      : (lang === 'fr' ? '🔒 À DÉBLOQUER' : '🔒 LOCKED')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Tab Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#12100E] border border-[#2A231B] text-xs">
            <button
              type="button"
              onClick={() => setSelectedTab('NONE')}
              className={`px-3 py-1.5 rounded-md font-cinzel font-semibold transition-all cursor-pointer ${
                selectedTab === 'NONE'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-[#9E9484] hover:text-[#EDE8E0]'
              }`}
            >
              🏛️ {lang === 'fr' ? 'Tous / Standard' : 'All / Standard'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('AVALANCHE')}
              className={`px-3 py-1.5 rounded-md font-cinzel font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedTab === 'AVALANCHE'
                  ? 'bg-blue-900/90 text-blue-200 border border-blue-500/70 shadow-sm'
                  : 'text-[#9E9484] hover:text-blue-300'
              }`}
            >
              <Snowflake className="w-3 h-3" />
              <span>{lang === 'fr' ? "L'Avalanche" : 'The Avalanche'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('MIRAGE')}
              className={`px-3 py-1.5 rounded-md font-cinzel font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedTab === 'MIRAGE'
                  ? 'bg-amber-800/90 text-yellow-200 border border-yellow-500/70 shadow-sm'
                  : 'text-[#9E9484] hover:text-yellow-300'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>{lang === 'fr' ? 'Le Mirage' : 'The Mirage'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('EQUINOX')}
              className={`px-3 py-1.5 rounded-md font-cinzel font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedTab === 'EQUINOX'
                  ? 'bg-purple-900/90 text-purple-200 border border-purple-500/70 shadow-sm'
                  : 'text-[#9E9484] hover:text-purple-300'
              }`}
            >
              <Hourglass className="w-3 h-3" />
              <span>{lang === 'fr' ? 'Équinoxe' : 'Equinox'}</span>
            </button>
          </div>

          {/* Local vs Cloud Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#12100E] border border-[#2A231B] text-xs">
            <button
              type="button"
              onClick={() => setViewMode('LOCAL')}
              className={`px-2.5 py-1 rounded font-mono font-medium transition-all cursor-pointer ${
                viewMode === 'LOCAL'
                  ? 'bg-[#2A231B] text-amber-300'
                  : 'text-[#7D7364] hover:text-[#D1C7B7]'
              }`}
            >
              IndexedDB
            </button>
            <button
              type="button"
              onClick={() => setViewMode('CLOUD')}
              className={`px-2.5 py-1 rounded font-mono font-medium transition-all cursor-pointer ${
                viewMode === 'CLOUD'
                  ? 'bg-amber-900/60 text-amber-300'
                  : 'text-[#7D7364] hover:text-[#D1C7B7]'
              }`}
            >
              Cloud Firebase
            </button>
          </div>
        </div>

        {/* Runs List Table */}
        <div className="flex flex-col gap-1 rounded-xl bg-[#12100E] border border-[#2A231B] p-2 min-h-[220px]">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#8C806F] font-mono animate-pulse">
              {lang === 'fr' ? 'Chargement des ascensions...' : 'Loading ascents...'}
            </div>
          ) : viewMode === 'LOCAL' ? (
            localRuns.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8C806F]">
                {lang === 'fr'
                  ? 'Aucune ascension enregistrée pour cet événement. Poussez le rocher !'
                  : 'No runs recorded yet for this event. Push the boulder!'}
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#221C16]">
                <div className="grid grid-cols-12 text-[10px] font-mono uppercase tracking-wider text-[#7A7061] py-1.5 px-3">
                  <span className="col-span-1">#</span>
                  <span className="col-span-4">{lang === 'fr' ? 'Événement / Date' : 'Event / Date'}</span>
                  <span className="col-span-3 text-right">{lang === 'fr' ? 'Distance' : 'Distance'}</span>
                  <span className="col-span-2 text-right">{lang === 'fr' ? 'Temps' : 'Time'}</span>
                  <span className="col-span-2 text-right">{lang === 'fr' ? 'Effort' : 'Pushes'}</span>
                </div>
                {localRuns.map((run, idx) => (
                  <div key={run.id} className="grid grid-cols-12 text-xs py-2 px-3 items-center hover:bg-[#1C1713] transition-colors">
                    <span className="col-span-1 font-mono font-bold text-amber-500/80">#{idx + 1}</span>
                    <div className="col-span-4 flex flex-col">
                      <span className="font-cinzel text-[#EDE7DE] truncate">
                        {run.event === 'AVALANCHE' ? '❄️ Avalanche' : run.event === 'MIRAGE' ? '☀️ Mirage' : run.event === 'EQUINOX' ? '⚖️ Équinoxe' : '🏛️ Standard'}
                      </span>
                      <span className="text-[10px] text-[#7A7061] font-mono">{run.dateStr}</span>
                    </div>
                    <span className="col-span-3 text-right font-cinzel font-bold text-amber-200">
                      {Number(run.distance || 0).toFixed(1)} m
                    </span>
                    <span className="col-span-2 text-right font-mono text-[#C4B9A9]">
                      {Number(run.time || 0).toFixed(1)} s
                    </span>
                    <span className="col-span-2 text-right font-mono text-[#8C806F]">
                      {run.pushes}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
            cloudRuns.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8C806F]">
                {lang === 'fr'
                  ? 'Aucune ascension cloud pour cet événement. Votre prochaine partie sera synchronisée !'
                  : 'No cloud ascents found for this event. Your next run will sync!'}
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#221C16]">
                <div className="grid grid-cols-12 text-[10px] font-mono uppercase tracking-wider text-[#7A7061] py-1.5 px-3">
                  <span className="col-span-1">#</span>
                  <span className="col-span-4">{lang === 'fr' ? 'Pèlerin' : 'Pilgrim'}</span>
                  <span className="col-span-3 text-right">{lang === 'fr' ? 'Distance' : 'Distance'}</span>
                  <span className="col-span-2 text-right">{lang === 'fr' ? 'Temps' : 'Time'}</span>
                  <span className="col-span-2 text-right">{lang === 'fr' ? 'Événement' : 'Event'}</span>
                </div>
                {cloudRuns.map((run, idx) => (
                  <div key={run.id} className="grid grid-cols-12 text-xs py-2 px-3 items-center hover:bg-[#1C1713] transition-colors">
                    <span className="col-span-1 font-mono font-bold text-amber-500/80">#{idx + 1}</span>
                    <div className="col-span-4 flex flex-col">
                      <span className="font-cinzel text-[#EDE7DE] truncate">{run.playerName || 'Sisyphe'}</span>
                      <span className="text-[10px] text-[#7A7061] font-mono">{run.season}</span>
                    </div>
                    <span className="col-span-3 text-right font-cinzel font-bold text-amber-200">
                      {Number(run.distance || 0).toFixed(1)} m
                    </span>
                    <span className="col-span-2 text-right font-mono text-[#C4B9A9]">
                      {Number(run.time || 0).toFixed(1)} s
                    </span>
                    <span className="col-span-2 text-right font-mono text-[10px] text-amber-400 truncate">
                      {run.event || 'Standard'}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="py-2.5 px-5 rounded-xl bg-[#28231D] hover:bg-[#383129] border border-[#483E31] text-xs font-semibold font-cinzel text-white transition-colors cursor-pointer self-end"
        >
          {lang === 'fr' ? 'Fermer le Panthéon' : 'Close Leaderboard'}
        </button>

      </div>
    </div>
  );
};
