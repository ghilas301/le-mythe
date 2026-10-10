import { Language } from '../types/game';

export interface SolitaryThought {
  id: string;
  triggerDistance?: number;
  triggerAttempts?: number;
  triggerCondition?: 'PUSHING' | 'SLIPPING' | 'CRASH' | 'REST';
  textFr: string;
  textEn: string;
}

export const MONOLOGUES: SolitaryThought[] = [
  // Early thoughts / Routine
  {
    id: 'step_one',
    triggerCondition: 'PUSHING',
    textFr: 'Encore un pas. C’est tout ce qui existe.',
    textEn: 'One more step. That is all that exists.'
  },
  {
    id: 'the_weight',
    triggerCondition: 'PUSHING',
    textFr: 'Ce n’est pas la pierre qui pèse... c’est l’espoir d’en finir.',
    textEn: 'It is not the stone that weighs... it is the hope of an end.'
  },
  {
    id: 'legs_burning',
    triggerCondition: 'PUSHING',
    textFr: 'Mes mollets brûlent. C’est la preuve que je suis vivant.',
    textEn: 'My calves burn. That is the proof that I am alive.'
  },
  {
    id: 'clouds_above',
    triggerDistance: 40,
    textFr: 'Regarde ce ciel. Les dieux ne pourront jamais me l’enlever.',
    textEn: 'Look at that sky. The gods can never take it from me.'
  },
  {
    id: 'season_spring',
    triggerCondition: 'PUSHING',
    textFr: 'Des fleurs sauvages s’accrochent aux failles. Nous sommes faits de la même roche.',
    textEn: 'Wild blossoms cling to the fractures. We are made of the same stone.'
  },
  {
    id: 'season_summer',
    triggerCondition: 'PUSHING',
    textFr: 'La roche est brûlante sous mes paumes. Pousse à travers le feu.',
    textEn: 'The rock burns hot beneath my palms. Push through the fire.'
  },
  {
    id: 'season_autumn',
    triggerCondition: 'PUSHING',
    textFr: 'Les feuilles d’or s’envolent dans la tourmente. L’effort seul demeure.',
    textEn: 'Golden leaves scatter in the gale. The effort alone endures.'
  },
  {
    id: 'season_winter',
    triggerCondition: 'PUSHING',
    textFr: 'Le blizzard hurle sur le verglas... Mais mes mains refusent de céder.',
    textEn: 'The blizzard howls over black ice... Yet my hands refuse to yield.'
  },
  {
    id: 'no_one_waiting',
    triggerDistance: 80,
    textFr: 'Personne ne m’attend là-haut. Personne en bas. Quel luxe silencieux.',
    textEn: 'No one waits for me at the peak. No one below. What silent luxury.'
  },
  {
    id: 'the_mirage',
    triggerDistance: 150,
    textFr: 'Le sommet recule avec l’horizon. Il a raison.',
    textEn: 'The summit recedes with the horizon. It is right to do so.'
  },
  {
    id: 'slip_mercy',
    triggerCondition: 'SLIPPING',
    textFr: 'Elle résiste... Ne lâche pas maintenant.',
    textEn: 'It fights back... Do not yield now.'
  },
  {
    id: 'gravity_laughs',
    triggerCondition: 'SLIPPING',
    textFr: 'La gravité réclame sa part. Reprends la prise !',
    textEn: 'Gravity claims its tribute. Regain the grip!'
  },
  {
    id: 'after_fall',
    triggerCondition: 'CRASH',
    textFr: 'La pierre est retombée. Le chemin demeure.',
    textEn: 'The stone has fallen. The path remains.'
  },
  {
    id: 'camus_smile',
    triggerDistance: 250,
    textFr: 'Ils voulaient une punition. Ils m’ont offert un royaume de granit.',
    textEn: 'They intended a punishment. They gifted me a granite kingdom.'
  },
  {
    id: 'pure_presence',
    triggerDistance: 400,
    textFr: 'Rien avant. Rien après. Seulement le grain de la roche sous mes paumes.',
    textEn: 'Nothing before. Nothing after. Only the grain of rock beneath my palms.'
  }
];

class MonologueEngine {
  private activeThought: string | null = null;
  private thoughtAlpha: number = 0;
  private thoughtTimer: number = 0;
  private lastTriggerTime: number = 0;
  private triggeredIds: Set<string> = new Set();

  public getActiveThought(): { text: string; alpha: number } | null {
    if (!this.activeThought || this.thoughtAlpha <= 0) return null;
    return { text: this.activeThought, alpha: this.thoughtAlpha };
  }

  public checkTriggers(
    distance: number,
    status: string,
    lang: Language,
    dt: number
  ) {
    // Fade in / out logic
    if (this.thoughtTimer > 0) {
      this.thoughtTimer -= dt;
      if (this.thoughtTimer > 1.0) {
        this.thoughtAlpha = Math.min(1.0, this.thoughtAlpha + dt * 2.0);
      } else {
        this.thoughtAlpha = Math.max(0.0, this.thoughtAlpha - dt * 1.5);
        if (this.thoughtAlpha <= 0) {
          this.activeThought = null;
        }
      }
      return;
    }

    const now = performance.now();
    // Only trigger a new thought every 14-25 seconds minimum to keep it rare, poetic, and non-intrusive
    if (now - this.lastTriggerTime < 14000) return;

    // Filter available thoughts
    const candidates = MONOLOGUES.filter((m) => {
      if (this.triggeredIds.has(m.id)) return false;
      if (m.triggerCondition && m.triggerCondition !== status) return false;
      if (m.triggerDistance && distance < m.triggerDistance) return false;
      return true;
    });

    if (candidates.length > 0 && Math.random() < 0.35) {
      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      this.activeThought = lang === 'fr' ? selected.textFr : selected.textEn;
      this.thoughtAlpha = 0;
      this.thoughtTimer = 5.5; // Displays for 5.5s
      this.lastTriggerTime = now;
      this.triggeredIds.add(selected.id);

      // Reset triggered set if getting exhausted
      if (this.triggeredIds.size > 8) {
        this.triggeredIds.clear();
      }
    }
  }

  public triggerDirectThought(textFr: string, textEn: string, lang: Language) {
    this.activeThought = lang === 'fr' ? textFr : textEn;
    this.thoughtAlpha = 0;
    this.thoughtTimer = 5.0;
    this.lastTriggerTime = performance.now();
  }
}

export const monologueEngine = new MonologueEngine();
