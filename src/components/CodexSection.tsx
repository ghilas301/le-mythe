import React from 'react';
import { Language } from '../types/game';
import { Translations } from '../services/i18n';
import { Bird, Footprints, Mountain, Eye, Sparkles, BookOpen } from 'lucide-react';

interface CodexSectionProps {
  t: Translations;
  lang: Language;
}

export const CodexSection: React.FC<CodexSectionProps> = ({ lang }) => {
  const isFr = lang === 'fr';

  const encounters = [
    {
      id: 'raven',
      name: isFr ? "Corbeaux d'Hermès" : "Ravens of Hermes",
      role: isFr ? "Messagers de la Rupture" : "Messengers of Rupture",
      altitude: isFr ? "Dès 6 mètres" : "From 6 meters",
      icon: Bird,
      color: "text-amber-400",
      bgBorder: "border-amber-900/30",
      desc: isFr
        ? "Perchés sur les bornes millénaires bordant le sentier. Ils inclinent la tête pour jauger la folie de l'homme, puis prennent leur envol silencieux au passage de Sisyphe."
        : "Perched on ancient boundary cairns. They cock their heads observing mortal stubbornness, then take flight into the misty sky as Sisyphus draws near."
    },
    {
      id: 'pilgrim',
      name: isFr ? "Pèlerins Descendants" : "Descending Wanderers",
      role: isFr ? "Les Âmes Apaisées" : "The Calmed Souls",
      altitude: isFr ? "De 24m à 240m" : "From 24m to 240m",
      icon: Footprints,
      color: "text-stone-300",
      bgBorder: "border-stone-700/40",
      desc: isFr
        ? "Des voyageurs vêtus de capes de bure et munis d'un bâton de marche. Ils descendent la montagne à pas lents et murmurent un mot de courage à Sisyphe lorsqu'ils se croisent."
        : "Weary travelers wrapped in travelers' cloaks with walking staves. They stroll downhill with serene steps, whispering fragments of timeless courage as they pass Sisyphus."
    },
    {
      id: 'ibex',
      name: isFr ? "Bouquetins du Crêt" : "Crag Ibex of the Peaks",
      role: isFr ? "Témoins Stoïciens" : "Stoic Witnesses",
      altitude: isFr ? "Dès 28 mètres" : "From 28 meters",
      icon: Mountain,
      color: "text-emerald-400",
      bgBorder: "border-emerald-900/30",
      desc: isFr
        ? "Fiers mammifères alpins aux cornes annelées, immobiles sur des éperons de marbre vertigineux. Ils incarnent l'indifférence majestueuse de la nature face au drame humain."
        : "Majestic alpine creatures with sweeping curved horns, standing motionless on sheer vertical spires. They embody nature's indifferent grandeur before human toil."
    },
    {
      id: 'watcher',
      name: isFr ? "L'Observateur Muet" : "The Silent Watcher",
      role: isFr ? "La Présence Progressive" : "The Progressive Presence",
      altitude: isFr ? "0 à 50+ ascensions" : "0 to 50+ runs",
      icon: Eye,
      color: "text-amber-400",
      bgBorder: "border-amber-900/40",
      desc: isFr
        ? "Une figure mystique qui se rapproche au fil de vos tentatives. De 0 à 9 parties, c'est une silhouette lointaine sur la cime. De 10 à 49 parties, il descend à mi-pente avec sa lanterne. À 50+ parties, il s'assied au bord du chemin et murmure de profondes citations philosophiques (Camus, Nietzsche, Cioran, Sénèque)."
        : "A mysterious figure that draws nearer with each attempt. From 0-9 runs, he is a distant silhouette on the peaks. From 10-49 runs, he descends to mid-slope with lantern and staff. At 50+ runs, he sits by the trailside and speaks profound philosophical quotes (Camus, Nietzsche, Cioran, Seneca)."
    },
    {
      id: 'wisp',
      name: isFr ? "Feux Follets de l'Éther" : "Ethereal Mountain Wisps",
      role: isFr ? "Lueurs de Conscience" : "Sparks of Consciousness",
      altitude: isFr ? "Au-delà de 60 mètres" : "Beyond 60 meters",
      icon: Sparkles,
      color: "text-yellow-300",
      bgBorder: "border-yellow-900/30",
      desc: isFr
        ? "Sphères de lumière dorée palpitant dans les hauteurs glacées. Elles symbolisent les pensées éveillées d'Albert Camus : la joie lucide au sein du froid absolu."
        : "Golden luminous orbs pulsing softly in the frigid upper heights. They symbolize Albert Camus's lucidity: sovereign joy amidst absolute cold."
    }
  ];

  return (
    <section id="codex" className="p-6 md:p-8 rounded-2xl bg-[#161412] border border-[#2E2821] shadow-lg mt-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-[#2C2720] mb-6">
        <BookOpen className="w-5 h-5 text-amber-500" />
        <div>
          <h2 className="text-2xl font-bold font-cinzel text-[#F5EDE1] tracking-wide">
            {isFr ? "Codex de la Montagne & Rencontres Vivantes" : "Mountain Codex & Living Encounters"}
          </h2>
          <p className="text-xs text-[#A89E90] mt-0.5">
            {isFr
              ? "Les bêtes, les âmes et les veilleurs qui accompagnent l'ascension de Sisyphe au fil de l'altitude."
              : "The creatures, wanderers, and watchers encountered along Sisyphus's eternal ascent."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {encounters.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl bg-[#1B1916] border ${item.bgBorder} flex flex-col justify-between hover:border-amber-600/50 transition-colors`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#12100E] border border-[#2E2821]">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-cinzel font-bold text-[#F5EDE1]">
                        {item.name}
                      </h3>
                      <span className="text-[10px] text-amber-400/90 font-medium tracking-wide">
                        {item.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#12100E] border border-[#2A251F] text-[#BCB1A3]">
                    {item.altitude}
                  </span>
                </div>

                <p className="text-xs text-[#B5A99B] leading-relaxed mt-2 font-serif">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
