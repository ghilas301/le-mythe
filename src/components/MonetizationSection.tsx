import React, { useState } from 'react';
import { Translations } from '../services/i18n';
import { DollarSign, Calculator, Layers, ShieldAlert, ArrowRight, BarChart3, Settings, Sparkles } from 'lucide-react';
import { AdsterraConfigModal } from './AdsterraConfigModal';

interface MonetizationSectionProps {
  t: Translations;
}

export const MonetizationSection: React.FC<MonetizationSectionProps> = ({ t }) => {
  // Simulator inputs matching the brief's formula
  const [dailySessions, setDailySessions] = useState<number>(10000);
  const [runsPerSession, setRunsPerSession] = useState<number>(3);
  const [cpm, setCpm] = useState<number>(0.80);
  const [fillRate, setFillRate] = useState<number>(100);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Calculations:
  // Total potential ad views = dailySessions * 1 (1 monetized run view per session at end, or runsPerSession)
  // Brief scenario: 1 paid impression per session = 10,000 paid impressions
  const totalPaidImpressions = (dailySessions * (fillRate / 100));
  const dailyRevenue = (totalPaidImpressions / 1000) * cpm;
  const monthlyRevenue = dailyRevenue * 30;
  // Formula: Revenu par 1 000 sessions = (Revenu total / Sessions) * 1000
  const rpm = dailySessions > 0 ? (dailyRevenue / dailySessions) * 1000 : 0;

  return (
    <section id="monetization" className="w-full my-12 p-6 md:p-8 rounded-2xl bg-[#171513] border border-[#332D24] shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C2720]">
        <div>
          <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-500" />
            {t.monetizationTitle}
          </h2>
          <p className="text-xs text-[#9E9383] mt-1">
            {t.monetizationSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsConfigOpen(true)}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-[#25201A] hover:bg-[#332C23] border border-[#443A2D] text-xs font-cinzel font-bold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Configurer Tags Adsterra</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left: Interactive Revenue Calculator */}
        <div className="lg:col-span-7 flex flex-col gap-6 p-6 rounded-xl bg-[#1B1916] border border-[#2E2821]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#2C2720]">
            <Calculator className="w-4 h-4 text-amber-400" />
            <h3 className="font-cinzel text-sm font-bold text-[#E8E2D8] uppercase tracking-wider">
              {t.monetizationCalcTitle}
            </h3>
          </div>

          <div className="p-3 rounded-lg bg-[#141210] border border-[#29241E] font-mono text-xs text-amber-300/90 text-center">
            {t.monetizationFormula}
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Daily Sessions */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A39786]">{t.monetizationSessionsLabel}</span>
                <span className="text-[#F2EDE4] font-bold">{dailySessions.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={dailySessions}
                onChange={(e) => setDailySessions(Number(e.target.value))}
                className="accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Runs per Session */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A39786]">{t.monetizationGamesPerSessionLabel}</span>
                <span className="text-[#F2EDE4] font-bold">{runsPerSession}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={runsPerSession}
                onChange={(e) => setRunsPerSession(Number(e.target.value))}
                className="accent-amber-500 cursor-pointer"
              />
            </div>

            {/* CPM */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A39786]">{t.monetizationCpmLabel}</span>
                <span className="text-[#F2EDE4] font-bold">${cpm.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.20"
                max="5.00"
                step="0.10"
                value={cpm}
                onChange={(e) => setCpm(Number(e.target.value))}
                className="accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Fill Rate */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A39786]">{t.monetizationFillLabel}</span>
                <span className="text-[#F2EDE4] font-bold">{fillRate}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={fillRate}
                onChange={(e) => setFillRate(Number(e.target.value))}
                className="accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Projection Outputs */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#2C2720] text-center">
            <div className="p-3 rounded-lg bg-[#141210] border border-[#2E2822]">
              <span className="text-[10px] uppercase font-mono text-[#8A7E6E]">{t.monetizationDailyRevenue}</span>
              <p className="text-xl font-bold font-mono text-amber-300 mt-1">${dailyRevenue.toFixed(2)}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#141210] border border-[#2E2822]">
              <span className="text-[10px] uppercase font-mono text-[#8A7E6E]">{t.monetizationMonthlyRevenue}</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">${monthlyRevenue.toFixed(0)}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#141210] border border-[#2E2822]">
              <span className="text-[10px] uppercase font-mono text-[#8A7E6E]">{t.monetizationRpm}</span>
              <p className="text-xl font-bold font-mono text-amber-200 mt-1">${rpm.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Right: Adsterra Strategy Architecture */}
        <div className="lg:col-span-5 flex flex-col gap-4 p-6 rounded-xl bg-[#1B1916] border border-[#2E2821]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#2C2720]">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="font-cinzel text-sm font-bold text-[#E8E2D8] uppercase tracking-wider">
              {t.monetizationAdsterraTitle}
            </h3>
          </div>

          <p className="text-xs text-[#B8ADA0] leading-relaxed">
            {t.monetizationAdsterraDesc}
          </p>

          <div className="flex flex-col gap-2.5 text-xs text-[#8E8373] mt-2">
            <div className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">1.</span>
              <span><strong>Placement réservé :</strong> Conteneur dimensionné dès le rendu initial pour garantir un CLS ≤ 0,1.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">2.</span>
              <span><strong>Pas de rechargement artificiel :</strong> L'annonce ne doit pas être ré-invoquée à répétition pour gonfler les métriques.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">3.</span>
              <span><strong>Intégrité du joueur :</strong> Le bouton « Recommencer » est totalement distinct de l'annonce publicitaire.</span>
            </div>
          </div>

          <div className="mt-auto p-3 rounded-lg bg-[#141210] border border-[#2B251E] flex items-center gap-3 text-xs text-[#9E9281]">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Adsterra interdit le trafic incité et les clics forcés. L'audience doit être 100% organique et consentante.</span>
          </div>
        </div>
      </div>

      <AdsterraConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </section>
  );
};
