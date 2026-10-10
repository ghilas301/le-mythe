import { Language } from '../types/game';

export interface SolitaryThought {
  id: string;
  triggerDistance?: number;
  triggerAttempts?: number;
  triggerCondition?: 'PUSHING' | 'SLIPPING' | 'CRASH' | 'DESCENDING' | 'REST';
  textFr: string;
  textEn: string;
}

export const MONOLOGUES: SolitaryThought[] = [
  // 1. PUSHING — The visceral labor
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
    id: 'calves_living',
    triggerCondition: 'PUSHING',
    textFr: 'Mes mollets brûlent sous l’effort. C’est la preuve irréfutable que je vis.',
    textEn: 'My calves burn under the strain. Irrefutable proof that I live.'
  },
  {
    id: 'clouds_above',
    triggerDistance: 35,
    triggerCondition: 'PUSHING',
    textFr: 'Regarde ce ciel déchiré. Les dieux ne pourront jamais me l’enlever.',
    textEn: 'Look at that torn sky. The gods can never tear it from me.'
  },
  {
    id: 'season_spring',
    triggerCondition: 'PUSHING',
    textFr: 'Des fleurs sauvages s’accrochent aux failles. Nous sommes faits de la même roche.',
    textEn: 'Wild blossoms cling to the fractures. We are sculpted from the same rock.'
  },
  {
    id: 'season_summer',
    triggerCondition: 'PUSHING',
    textFr: 'La roche est brûlante sous mes paumes. Pousse à travers le feu.',
    textEn: 'The rock burns hot beneath my palms. Push through the flame.'
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
    id: 'biome_crag',
    triggerDistance: 70,
    triggerCondition: 'PUSHING',
    textFr: 'La pente se cabre. Le vent déchire le silence.',
    textEn: 'The slope steepens. The wind tears through the silence.'
  },
  {
    id: 'biome_verglas',
    triggerDistance: 160,
    triggerCondition: 'PUSHING',
    textFr: 'Le givre mord la chair. L’abîme attend sous mes talons.',
    textEn: 'Frost bites into flesh. The abyss waits beneath my heels.'
  },
  {
    id: 'biome_olympus',
    triggerDistance: 300,
    triggerCondition: 'PUSHING',
    textFr: 'Le sommet se dérobe dans l’éther. Il n’y a jamais eu de sommet.',
    textEn: 'The summit dissolves into the ether. There never was a summit.'
  },

  // 2. SLIPPING — The crisis
  {
    id: 'slip_mercy',
    triggerCondition: 'SLIPPING',
    textFr: 'Elle m’échappe... Bloque des deux talons !',
    textEn: 'It slips away... Dig in both heels!'
  },
  {
    id: 'gravity_claims',
    triggerCondition: 'SLIPPING',
    textFr: 'La gravité réclame son dû. Tiens bon l’arc du dos !',
    textEn: 'Gravity claims its tribute. Arch the spine, hold fast!'
  },

  // 3. CRASH — The fall
  {
    id: 'after_fall',
    triggerCondition: 'CRASH',
    textFr: 'La pierre roule vers la nuit. Le chemin, lui, ne bouge pas.',
    textEn: 'The stone rolls toward night. The path itself remains unbroken.'
  },

  // 4. DESCENDING — The Camusian Summit: Consciousness & Joy
  {
    id: 'descend_pause',
    triggerCondition: 'DESCENDING',
    textFr: '« C’est pendant ce retour, cette pause, que Sisyphe m’intéresse. »',
    textEn: '“It is during that return, that pause, that Sisyphus interests me.”'
  },
  {
    id: 'descend_face',
    triggerCondition: 'DESCENDING',
    textFr: '« Un visage qui peine si près des pierres est déjà pierre lui-même. »',
    textEn: '“A face that toils so close to stones is already stone itself.”'
  },
  {
    id: 'descend_contempt',
    triggerCondition: 'DESCENDING',
    textFr: '« Il n’est pas de destin qui ne se surmonte par le mépris. »',
    textEn: '“There is no fate that cannot be surmounted by scorn.”'
  },
  {
    id: 'descend_universe',
    triggerCondition: 'DESCENDING',
    textFr: '« Cet univers désormais sans maître ne lui paraît ni stérile ni futile. »',
    textEn: '“This universe henceforth without a master seems to him neither sterile nor futile.”'
  },
  {
    id: 'descend_happy',
    triggerCondition: 'DESCENDING',
    textFr: '« La lutte elle-même vers les sommets suffit à remplir un cœur d’homme. Il faut imaginer Sisyphe heureux. »',
    textEn: '“The struggle itself toward the heights is enough to fill a man’s heart. One must imagine Sisyphus happy.”'
  },
  {
    id: 'descend_silence',
    triggerCondition: 'DESCENDING',
    textFr: 'Je redescends d’un pas lourd mais égal vers mon tourment.',
    textEn: 'I walk back down with heavy yet steady steps toward my torment.'
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
        this.thoughtAlpha = Math.min(1.0, this.thoughtAlpha + dt * 2.5);
      } else {
        this.thoughtAlpha = Math.max(0.0, this.thoughtAlpha - dt * 1.8);
        if (this.thoughtAlpha <= 0) {
          this.activeThought = null;
        }
      }
      return;
    }

    const now = performance.now();
    // Frequency: during descent, thoughts flow more poetically (every 5-8s), during struggle every 12-18s
    const cooldown = status === 'DESCENDING' ? 5500 : 12000;
    if (now - this.lastTriggerTime < cooldown) return;

    // Filter available thoughts
    const candidates = MONOLOGUES.filter((m) => {
      if (this.triggeredIds.has(m.id)) return false;
      if (m.triggerCondition && m.triggerCondition !== status) return false;
      if (m.triggerDistance && distance < m.triggerDistance) return false;
      return true;
    });

    if (candidates.length > 0) {
      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      this.activeThought = lang === 'fr' ? selected.textFr : selected.textEn;
      this.thoughtAlpha = 0;
      this.thoughtTimer = status === 'DESCENDING' ? 6.5 : 5.0;
      this.lastTriggerTime = now;
      this.triggeredIds.add(selected.id);

      if (this.triggeredIds.size > 14) {
        this.triggeredIds.clear();
      }
    }
  }

  public triggerDirectThought(textFr: string, textEn: string, lang: Language) {
    this.activeThought = lang === 'fr' ? textFr : textEn;
    this.thoughtAlpha = 0;
    this.thoughtTimer = 6.0;
    this.lastTriggerTime = performance.now();
  }

  public reset() {
    this.activeThought = null;
    this.thoughtAlpha = 0;
    this.thoughtTimer = 0;
    this.lastTriggerTime = 0;
  }
}

export const monologueEngine = new MonologueEngine();
