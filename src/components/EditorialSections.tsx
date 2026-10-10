import React, { useState } from 'react';
import { Translations } from '../services/i18n';
import { BookOpen, HelpCircle, Compass, ChevronDown, ChevronUp, Feather } from 'lucide-react';

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
    { q: t.faqQ2, a: t.faqA2 }
  ];

  return (
    <div className="w-full flex flex-col gap-14 mt-16 max-w-4xl mx-auto">
      {/* 1. How To Play Section */}
      <section id="how-to-play" className="p-6 md:p-8 rounded-2xl bg-[#161412] border border-[#2E2821] shadow-lg">
        <div className="flex items-center gap-2 pb-4 border-b border-[#2C2720] mb-6">
          <Compass className="w-5 h-5 text-amber-500" />
          <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide">
            {t.howToPlayTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#D4C8B8]/70 bg-black/60 px-2 py-0.5 rounded">
            Classical Woodcut & Etching Archive
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm font-editorial text-[#D6CCA] leading-relaxed">
          <p>{t.mythP1}</p>
          <p>{t.mythP2}</p>
          
          <blockquote className="my-3 p-4 border-l-2 border-amber-500 bg-[#1D1A16] italic text-[#EDE4D8] text-base">
            {t.mythCamusQuote}
          </blockquote>

          <p>{t.mythP3}</p>
        </div>
      </section>

      {/* 3. Why This Game Exists */}
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

      {/* 4. FAQ Accordion */}
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
                  <div className="p-4 pt-1 text-xs text-[#B5AAA] leading-relaxed border-t border-[#26211A] bg-[#151311]">
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
