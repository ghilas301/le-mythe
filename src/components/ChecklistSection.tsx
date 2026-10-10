import React, { useState, useEffect } from 'react';
import { ChecklistState, Language } from '../types/game';
import { Translations } from '../services/i18n';
import { CheckSquare, Square, RotateCcw, Copy, Check, ShieldCheck, Cpu, Search, DollarSign } from 'lucide-react';

interface ChecklistSectionProps {
  t: Translations;
  lang: Language;
}

const DEFAULT_CHECKLIST: ChecklistState = {
  noAccountLaunch: true,
  scoreAndLossWorking: true,
  bestScoreSaved: true,
  restartWorksEverywhere: true,
  httpsAndCanonical: true,
  noHorizontalOverflow: true,
  noJsErrors: true,
  stableAdZoneNoCLS: true,
  uniqueTitleAndH1: true,
  semanticHtmlText: true,
  sitemapAndRobots: true,
  searchConsoleReady: false,
  internalLinksTested: true,
  adCodeApproved: false,
  noForcedClicks: true,
  privacyPolicyPublished: true,
  consentAndScriptsCompliant: true
};

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({ t, lang }) => {
  const [checklist, setChecklist] = useState<ChecklistState>(() => {
    try {
      const saved = localStorage.getItem('sisyphus_checklist_state');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CHECKLIST;
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('sisyphus_checklist_state', JSON.stringify(checklist));
    } catch {
      // fallback
    }
  }, [checklist]);

  const toggleItem = (key: keyof ChecklistState) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReset = () => {
    setChecklist({
      noAccountLaunch: false,
      scoreAndLossWorking: false,
      bestScoreSaved: false,
      restartWorksEverywhere: false,
      httpsAndCanonical: false,
      noHorizontalOverflow: false,
      noJsErrors: false,
      stableAdZoneNoCLS: false,
      uniqueTitleAndH1: false,
      semanticHtmlText: false,
      sitemapAndRobots: false,
      searchConsoleReady: false,
      internalLinksTested: false,
      adCodeApproved: false,
      noForcedClicks: false,
      privacyPolicyPublished: false,
      consentAndScriptsCompliant: false
    });
  };

  const totalKeys = Object.keys(checklist) as (keyof ChecklistState)[];
  const checkedCount = totalKeys.filter((k) => checklist[k]).length;
  const progressPercent = Math.round((checkedCount / totalKeys.length) * 100);

  const checklistItems = [
    {
      category: lang === 'fr' ? 'Produit' : 'Product',
      icon: ShieldCheck,
      color: 'text-amber-400',
      items: [
        {
          key: 'noAccountLaunch' as keyof ChecklistState,
          text: lang === 'fr' ? 'Le jeu démarre sans compte ni installation' : 'Game launches instantly without sign-up or app install'
        },
        {
          key: 'scoreAndLossWorking' as keyof ChecklistState,
          text: lang === 'fr' ? 'Le score et la défaite fonctionnent correctement' : 'Scoring engine and descent loss trigger accurately'
        },
        {
          key: 'bestScoreSaved' as keyof ChecklistState,
          text: lang === 'fr' ? 'Le meilleur score reste enregistré localement' : 'Personal best is saved persistently in localStorage'
        },
        {
          key: 'restartWorksEverywhere' as keyof ChecklistState,
          text: lang === 'fr' ? 'Le bouton de redémarrage fonctionne sur tous les appareils' : 'Immediate restart button verified on mobile and desktop'
        }
      ]
    },
    {
      category: lang === 'fr' ? 'Technique & Performance' : 'Technical & Performance',
      icon: Cpu,
      color: 'text-cyan-400',
      items: [
        {
          key: 'httpsAndCanonical' as keyof ChecklistState,
          text: lang === 'fr' ? 'HTTPS, domaine et redirections canoniques vérifiés' : 'HTTPS and canonical URL properly configured'
        },
        {
          key: 'noHorizontalOverflow' as keyof ChecklistState,
          text: lang === 'fr' ? 'Aucun débordement horizontal sur mobile (320px–390px)' : 'Zero horizontal overflow across all mobile viewports'
        },
        {
          key: 'noJsErrors' as keyof ChecklistState,
          text: lang === 'fr' ? 'Pas d’erreur JavaScript ni de boucle coûteuse' : 'Zero console errors; 60fps requestAnimationFrame loop'
        },
        {
          key: 'stableAdZoneNoCLS' as keyof ChecklistState,
          text: lang === 'fr' ? 'Zone publicitaire dimensionnée pour limiter les décalages (CLS ≤ 0.1)' : 'Pre-allocated ad container strictly prevents layout shifts (CLS ≤ 0.1)'
        }
      ]
    },
    {
      category: lang === 'fr' ? 'SEO & Indexation' : 'SEO & Indexability',
      icon: Search,
      color: 'text-emerald-400',
      items: [
        {
          key: 'uniqueTitleAndH1' as keyof ChecklistState,
          text: lang === 'fr' ? 'Titre, H1 et méta-description uniques et descriptifs' : 'Unique Title, semantic H1, and descriptive Meta tags'
        },
        {
          key: 'semanticHtmlText' as keyof ChecklistState,
          text: lang === 'fr' ? 'Contenu textuel utile disponible dans le HTML (non dessiné dans Canvas)' : 'Rich explanatory content rendered in HTML for web crawlers'
        },
        {
          key: 'sitemapAndRobots' as keyof ChecklistState,
          text: lang === 'fr' ? 'Sitemap XML et robots.txt vérifiés' : 'XML Sitemap and robots.txt ready for search crawlers'
        },
        {
          key: 'searchConsoleReady' as keyof ChecklistState,
          text: lang === 'fr' ? 'Google Search Console configurée et inspection effectuée' : 'Google Search Console configured and URL inspection verified'
        },
        {
          key: 'internalLinksTested' as keyof ChecklistState,
          text: lang === 'fr' ? 'Liens internes et métadonnées OpenGraph / Twitter testées' : 'OpenGraph social cards and structured JSON-LD tested'
        }
      ]
    },
    {
      category: lang === 'fr' ? 'Monétisation & Confidentialité' : 'Monetization & Privacy',
      icon: DollarSign,
      color: 'text-purple-400',
      items: [
        {
          key: 'adCodeApproved' as keyof ChecklistState,
          text: lang === 'fr' ? 'Code publicitaire approuvé et conforme au format choisi' : 'Adsterra approved unit tested without page reloading spam'
        },
        {
          key: 'noForcedClicks' as keyof ChecklistState,
          text: lang === 'fr' ? 'Aucun clic publicitaire imposé ni impression artificielle' : 'Zero deceptive buttons; restart and gameplay are 100% free'
        },
        {
          key: 'privacyPolicyPublished' as keyof ChecklistState,
          text: lang === 'fr' ? 'Politique de confidentialité publiée et accessible' : 'Transparent Privacy Policy and local storage terms published'
        },
        {
          key: 'consentAndScriptsCompliant' as keyof ChecklistState,
          text: lang === 'fr' ? 'Consentement et paramètres des scripts vérifiés selon les règles' : 'GDPR / ePrivacy consent framework verified for ads'
        }
      ]
    }
  ];

  const handleCopyMarkdown = async () => {
    let md = `# ${t.checklistTitle} (${checkedCount}/17)\n\n`;
    checklistItems.forEach((cat) => {
      md += `### ${cat.category}\n`;
      cat.items.forEach((it) => {
        md += `- [${checklist[it.key] ? 'x' : ' '}] ${it.text}\n`;
      });
      md += '\n';
    });

    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section id="checklist" className="w-full my-12 p-6 md:p-8 rounded-2xl bg-[#171513] border border-[#332D24] shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C2720]">
        <div>
          <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide">
            {t.checklistTitle}
          </h2>
          <p className="text-xs text-[#9E9383] mt-1">
            {t.checklistSubtitle}
          </p>
        </div>

        {/* Counter and actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1 font-mono text-lg font-bold text-amber-400 bg-[#221E19] px-3 py-1.5 rounded-lg border border-[#3D352B]">
            <span>{checkedCount}</span>
            <span className="text-xs text-[#8C8070]">/ 17</span>
          </div>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="py-2 px-3 rounded-lg text-xs font-medium text-[#CFC4B4] bg-[#24201A] hover:bg-[#322C24] border border-[#40382E] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? t.checklistCopied : t.checklistCopyBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg text-xs text-[#8C8070] hover:text-[#CFC4B4] hover:bg-[#24201A] transition-colors cursor-pointer"
            title={t.checklistReset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#201D19] h-2 rounded-full overflow-hidden my-6">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {checklistItems.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="p-5 rounded-xl bg-[#1C1916] border border-[#2B2620] flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#2C2721]">
                <Icon className={`w-4 h-4 ${cat.color}`} />
                <h3 className="font-cinzel text-sm font-bold text-[#E8E2D8] uppercase tracking-wider">
                  {cat.category}
                </h3>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                {cat.items.map((item) => {
                  const isChecked = checklist[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleItem(item.key)}
                      className="group flex items-start gap-3 text-left cursor-pointer p-1.5 rounded-lg hover:bg-[#25211B] transition-colors"
                    >
                      <div className="mt-0.5 shrink-0 text-amber-500">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4 text-[#5E5547] group-hover:text-[#8A7D69]" />
                        )}
                      </div>
                      <span className={`text-xs leading-relaxed transition-colors ${
                        isChecked ? 'text-[#8E8474] line-through' : 'text-[#D9D0C3]'
                      }`}>
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
