import React, { useState } from 'react';
import { Translations } from '../services/i18n';
import { BookOpen, HelpCircle, Compass, ChevronDown, ChevronUp, Feather, Footprints, Layers } from 'lucide-react';
import { BIOMES } from '../services/biomes';

// Import generated woodcut engraving
import engravingImg from '../assets/images/sisyphus_engraving_1791642616125.jpg';

interface EditorialSectionsProps {
  t: Translations;
}

export const EditorialSections: React.FC<EditorialSectionsProps> = ({ t }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 }
  ];

  return (
    <div className="w-full flex flex-col gap-12 mt-16 max-w-4xl mx-auto">
      
      {/* 1. How To Play Section */}
      <section id="how-to-play" className="p-6 md:p-8 rounded-2xl bg-[#161412] border border-[#2E2821] shadow-lg">
        <div className="flex items-center gap-2 pb-4 border-b border-[#2C2720] mb-6">
          <Compass className="w-5 h-5 text-amber-500" />
          <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide">
            {t.howToPlayTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl bg-[#1B1916] border border-[#2A251F]">
            <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-wider block mb-1">
              01 · {t.howToPlayRule1Title}
            </span>
            <p className="text-xs text-[#BCB1A3] leading-relaxed">
              {t.howToPlayRule1Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1B1916] border border-[#2A251F]">
            <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-wider block mb-1">
              02 · {t.howToPlayRule2Title}
            </span>
            <p className="text-xs text-[#BCB1A3] leading-relaxed">
              {t.howToPlayRule2Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1B1916] border border-[#2A251F]">
            <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-wider block mb-1">
              03 · {t.howToPlayRule3Title}
            </span>
            <p className="text-xs text-[#BCB1A3] leading-relaxed">
              {t.howToPlayRule3Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1B1916] border border-[#2A251F]">
            <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-wider block mb-1">
              04 · {t.howToPlayRule4Title}
            </span>
            <p className="text-xs text-[#BCB1A3] leading-relaxed">
              {t.howToPlayRule4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 2. The Myth of Sisyphus & Camus (Illustrated) */}
      <section id="myth" className="p-6 md:p-8 rounded-2xl bg-[#161412] border border-[#2E2821] shadow-lg">
        <div className="flex items-center gap-2 pb-4 border-b border-[#2C2720] mb-6">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide">
              {t.mythTitle}
            </h2>
            <p className="text-xs text-[#9E9383] mt-0.5">
              {t.mythLead}
            </p>
          </div>
        </div>

        {/* Engraving Artwork Banner */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6 border border-[#3E3529] shadow-2xl bg-black">
          <img
            src={engravingImg}
            alt="Woodcut engraving of Sisyphus pushing the granite stone uphill"
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#D4C8B8]/80 bg-black/70 px-2.5 py-1 rounded">
            Collection Classique · Gravure sur Bois & Eau-Forte
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm font-editorial text-[#D6CCA8] leading-relaxed">
          <p>{t.mythP1}</p>
          <p>{t.mythP2}</p>
          
          <blockquote className="my-3 p-4 border-l-2 border-amber-500 bg-[#1D1A16] italic text-[#EDE4D8] text-base">
            {t.mythCamusQuote}
          </blockquote>

          <p>{t.mythP3}</p>
        </div>
      </section>

      {/* 3. The Walk Down: Philosophy of the Descent */}
      <section className="p-6 md:p-8 rounded-2xl bg-[#161412] border border-[#2E2821] shadow-lg">
        <div className="flex items-center gap-2 pb-4 border-b border-[#2C2720] mb-6">
          <Footprints className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide">
              La Marche de Descente : Le Cœur Secret de Sisyphe
            </h2>
            <p className="text-xs text-[#9E9383] mt-0.5">
              Quand le rocher a fini de rouler, commence la vraie liberté.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm font-editorial text-[#D6CCA8] leading-relaxed">
          <p>
            La plupart des représentations populaires de Sisyphe s’arrêtent à l’effort : la sueur, les muscles noués, la veine gonflée au front. Pourtant, Albert Camus consacre la page la plus célèbre de son essai à un instant où Sisyphe ne pousse rien : <em>sa descente</em>.
          </p>
          <blockquote className="my-2 p-4 border-l-2 border-amber-600/70 bg-[#1B1814] italic text-[#F2EAE0]">
            « C'est pendant ce retour, cette pause, que Sisyphe m'intéresse. [...] Je vois cet homme redescendre d'un pas lourd mais égal vers le tourment dont il ne connaîtra pas la fin. Cette heure qui est comme une respiration et qui revient aussi sûrement que son malheur, cette heure est celle de la conscience. »
          </blockquote>
          <p>
            Dans <em>The Eternal Push</em>, lorsque votre rocher s’échappe et retombe dans la gorge de la montagne, la partie ne s’arrête pas sur un écran d’échec brutal. Sisyphe se redresse, regarde la vallée dans la brume, et commence sa marche de retour d’un pas égal. Ce temps suspendu, sans urgence ni rancœur, est l’expérience même de la lucidité absurde.
          </p>
        </div>
      </section>

      {/* 4. The 4 Mountain Biomes (Altitude Stratigraphy) */}
      <section className="p-6 md:p-8 rounded-2xl bg-[#161412] border border-[#2E2821] shadow-lg">
        <div className="flex items-center gap-2 pb-4 border-b border-[#2C2720] mb-6">
          <Layers className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide">
              Les Strates de la Montagne
            </h2>
            <p className="text-xs text-[#9E9383] mt-0.5">
              Quatre biomes géologiques sculptés par le vent et les saisons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BIOMES.map((b, i) => (
            <div key={b.type} className="p-4 rounded-xl bg-[#1B1916] border border-[#2A251F] flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between text-xs font-cinzel">
                <span className="font-bold text-amber-400 uppercase tracking-wider">
                  0{i + 1} · {b.nameFr}
                </span>
                <span className="font-mono text-[#8C8070] text-[11px]">
                  {b.minDist}m {b.maxDist === Infinity ? '+' : `– ${b.maxDist}m`}
                </span>
              </div>
              <p className="text-xs text-[#BCB1A3] font-editorial leading-relaxed">
                {b.subtitleFr}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why This Game Exists */}
      <section id="why" className="p-6 md:p-8 rounded-2xl bg-[#161412] border border-[#2E2821] shadow-lg">
        <div className="flex items-center gap-2 pb-4 border-b border-[#2C2720] mb-6">
          <Feather className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide">
              {t.whyTitle}
            </h2>
            <p className="text-xs text-[#9E9383] mt-0.5">
              {t.whyLead}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm text-[#CFC4B6] leading-relaxed">
          <p>{t.whyP1}</p>
          <p>{t.whyP2}</p>
          <p>{t.whyP3}</p>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section id="faq" className="p-6 md:p-8 rounded-2xl bg-[#161412] border border-[#2E2821] shadow-lg">
        <div className="flex items-center gap-2 pb-4 border-b border-[#2C2720] mb-6">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide">
            {t.faqTitle}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#2B251E] bg-[#1B1916] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#231F1A] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-cinzel text-sm font-semibold text-[#EDE4D8]">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A7061] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 text-xs text-[#B5AAA0] leading-relaxed border-t border-[#26211A] bg-[#151311]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
