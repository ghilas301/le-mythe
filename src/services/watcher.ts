import { Language, WatcherTier } from '../types/game';

export interface WatcherQuote {
  fr: string;
  en: string;
  author: string;
  context: 'PUSHING' | 'SLIPPING' | 'RECORD' | 'CONTEMPLATION';
}

export const WATCHER_QUOTES: WatcherQuote[] = [
  // Camus
  {
    fr: "La lutte elle-même vers les sommets suffit à remplir un cœur d'homme. Il faut imaginer Sisyphe heureux.",
    en: "The struggle itself toward the heights is enough to fill a man's heart. One must imagine Sisyphus happy.",
    author: "Albert Camus",
    context: 'PUSHING'
  },
  {
    fr: "Il n'y a pas de destin qui ne se surmonte par le mépris.",
    en: "There is no destiny that cannot be surmounted by contempt.",
    author: "Albert Camus",
    context: 'SLIPPING'
  },
  {
    fr: "L'absurde naît de cette confrontation entre l'appel humain et le silence déraisonnable du monde.",
    en: "The absurd is born of this confrontation between the human need and the unreasonable silence of the world.",
    author: "Albert Camus",
    context: 'CONTEMPLATION'
  },
  {
    fr: "Chacun des grains de cette pierre, chaque éclat minéral de cette montagne pleine de nuit, forme un monde.",
    en: "Each atom of that stone, each mineral flake of that night-filled mountain, in itself forms a world.",
    author: "Albert Camus",
    context: 'CONTEMPLATION'
  },
  {
    fr: "Ce rocher est sa chose. Sa ruine est son triomphe.",
    en: "This stone is his thing. His ruin is his triumph.",
    author: "Albert Camus",
    context: 'RECORD'
  },
  {
    fr: "Vivre, c'est faire vivre l'absurde. Le faire vivre, c'est avant tout le regarder.",
    en: "To live is to keep the absurd alive. To keep it alive is, above all, to contemplate it.",
    author: "Albert Camus",
    context: 'PUSHING'
  },

  // Nietzsche
  {
    fr: "Ce qui ne me tue pas me rend plus fort, ô voyageur de l'abîme.",
    en: "What does not kill me makes me stronger, traveler of the abyss.",
    author: "Friedrich Nietzsche",
    context: 'PUSHING'
  },
  {
    fr: "Celui qui a un pourquoi qui lui tient lieu de but peut supporter presque n'importe quel comment.",
    en: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    context: 'PUSHING'
  },
  {
    fr: "Amor Fati : n'avoir rien voulu d'autre, ni en avant, ni en arrière, ni dans tous les siècles des siècles.",
    en: "Amor Fati: want nothing to be different, neither in the past nor in the future nor through all eternity.",
    author: "Friedrich Nietzsche",
    context: 'CONTEMPLATION'
  },
  {
    fr: "Quand tu regardes longuement dans l'abîme, l'abîme aussi regarde en toi.",
    en: "When you gaze long into an abyss, the abyss also gazes into you.",
    author: "Friedrich Nietzsche",
    context: 'SLIPPING'
  },
  {
    fr: "Il faut avoir encore du chaos en soi pour pouvoir enfanter une étoile dansante.",
    en: "One must still have chaos in oneself to give birth to a dancing star.",
    author: "Friedrich Nietzsche",
    context: 'RECORD'
  },

  // Cioran
  {
    fr: "Toute tentative de remonter la pente est un acte héroïque de défiance envers le néant.",
    en: "Every attempt to climb back up is a heroic act of defiance against the void.",
    author: "Emil Cioran",
    context: 'PUSHING'
  },
  {
    fr: "L'échec répété n'est pas une honte ; c'est la seule preuve irréfutable de notre lucidité.",
    en: "Repeated failure is not shame; it is the sole undeniable proof of our lucidity.",
    author: "Emil Cioran",
    context: 'SLIPPING'
  },
  {
    fr: "Seuls les obstinés sans espoir comprennent la véritable volupté de l'effort.",
    en: "Only the hopeless stubborn truly grasp the raw pleasure of relentless effort.",
    author: "Emil Cioran",
    context: 'CONTEMPLATION'
  },
  {
    fr: "Nous ne courons pas après un sommet, nous célébrons la beauté stérile de la persistance.",
    en: "We do not chase a summit; we celebrate the austere beauty of persistence.",
    author: "Emil Cioran",
    context: 'CONTEMPLATION'
  },

  // Sénèque & Marc Aurèle
  {
    fr: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles.",
    en: "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.",
    author: "Sénèque",
    context: 'PUSHING'
  },
  {
    fr: "L'obstacle est le chemin. Ce qui fait barrage à l'action fait avancer l'action.",
    en: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marc Aurèle",
    context: 'PUSHING'
  },
  {
    fr: "Ne cherche pas à ce que les événements arrivent comme tu le veux, mais veuille qu'ils arrivent comme ils arrivent.",
    en: "Do not seek for things to happen the way you wish, but rather wish for them to happen as they do.",
    author: "Épictète",
    context: 'SLIPPING'
  },
  {
    fr: "Un grand esprit se mesure à sa patience face à la chute de son propre labeur.",
    en: "A noble spirit is measured by its calm patience before the collapse of its own labor.",
    author: "Sénèque",
    context: 'SLIPPING'
  },

  // Kafka & Kierkegaard
  {
    fr: "Il y a un but, mais pas de chemin ; ce que nous appelons chemin n'est que notre hésitation.",
    en: "There is a goal, but no way; what we call the way is merely our hesitation.",
    author: "Franz Kafka",
    context: 'CONTEMPLATION'
  },
  {
    fr: "La vie ne peut être comprise qu'en regardant en arrière, mais elle doit être vécue en regardant vers l'avant.",
    en: "Life can only be understood backwards, but it must be lived forwards.",
    author: "Søren Kierkegaard",
    context: 'RECORD'
  }
];

export class SilentWatcherSystem {
  public tier: WatcherTier = 'DISTANT_SHADOW';
  public currentQuote: WatcherQuote | null = null;
  public quoteTimer = 0; // seconds remaining to show quote
  public quoteOpacity = 0;
  private quoteCooldown = 0;
  private lanternPulse = 0;
  private headTurnAngle = 0;

  constructor() {}

  public getTier(totalRuns: number): WatcherTier {
    if (totalRuns < 10) return 'DISTANT_SHADOW';
    if (totalRuns < 50) return 'APPROACHING_PILGRIM';
    return 'SEATED_SAGE';
  }

  public getTierTitle(totalRuns: number, lang: Language): { title: string; desc: string; icon: string } {
    if (totalRuns < 10) {
      return {
        title: lang === 'fr' ? 'Silhouette Lointaine' : 'Distant Silhouette',
        desc: lang === 'fr' ? 'Une ombre solitaire observe la cime (0-9 tentatives)' : 'A solitary shadow gazes from the crags (0-9 runs)',
        icon: '👁️'
      };
    }
    if (totalRuns < 50) {
      return {
        title: lang === 'fr' ? "Le Veilleur en Approche" : 'Approaching Watcher',
        desc: lang === 'fr' ? 'Il est descendu à mi-pente avec sa lanterne (10-49 tentatives)' : 'He descends to mid-slope with lantern in hand (10-49 runs)',
        icon: '🕯️'
      };
    }
    return {
      title: lang === 'fr' ? 'Le Sage du Sentier' : 'The Trailside Sage',
      desc: lang === 'fr' ? 'Installé au bord du chemin, il murmure la sagesse de l’absurde (50+ tentatives)' : 'Seated by the wayside, sharing philosophical wisdom (50+ runs)',
      icon: '📜'
    };
  }

  public update(
    totalRuns: number,
    playerDistance: number,
    gameStatus: string,
    isPushing: boolean,
    dt: number
  ) {
    this.tier = this.getTier(totalRuns);
    this.lanternPulse += dt * 3.5;
    this.quoteCooldown = Math.max(0, this.quoteCooldown - dt);

    if (this.quoteTimer > 0) {
      this.quoteTimer -= dt;
      this.quoteOpacity = Math.min(1, this.quoteOpacity + dt * 2.5);
      if (this.quoteTimer <= 0) {
        this.quoteOpacity = 0;
        this.currentQuote = null;
      }
    } else {
      this.quoteOpacity = Math.max(0, this.quoteOpacity - dt * 2);
    }

    // Only Tier 3 (50+ runs) speaks
    if (this.tier === 'SEATED_SAGE' && this.quoteCooldown <= 0) {
      // Trigger quotes based on gameplay moments
      if (gameStatus === 'SLIPPING' && Math.random() < 0.28) {
        this.triggerQuote('SLIPPING');
      } else if (gameStatus === 'PUSHING' && isPushing && playerDistance > 15 && Math.random() < 0.15) {
        this.triggerQuote('PUSHING');
      } else if (playerDistance > 50 && Math.random() < 0.12) {
        this.triggerQuote('RECORD');
      } else if (Math.random() < 0.04) {
        this.triggerQuote('CONTEMPLATION');
      }
    }
  }

  public triggerQuote(context: 'PUSHING' | 'SLIPPING' | 'RECORD' | 'CONTEMPLATION') {
    const matching = WATCHER_QUOTES.filter((q) => q.context === context);
    const pool = matching.length > 0 ? matching : WATCHER_QUOTES;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    this.currentQuote = picked;
    this.quoteTimer = 8.5; // display for 8.5 seconds
    this.quoteCooldown = 18; // wait at least 18s before next spontaneous quote
    this.quoteOpacity = 0.05;
  }

  /**
   * Renders the Silent Watcher on the canvas depending on the active tier.
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    playerDistance: number,
    getTerrainY: (screenX: number) => number,
    now: number,
    lang: Language
  ) {
    ctx.save();
    const screenCenterX = width * 0.42;
    const pixelsPerMeter = 22;

    if (this.tier === 'DISTANT_SHADOW') {
      // TIER 1: 0-9 RUNS -> DISTANT SILHOUETTE ON HIGH PEAK
      // Located at fixed world distance around 38m
      const watcherWorldDist = 38;
      const distDelta = watcherWorldDist - playerDistance;
      const screenX = screenCenterX + distDelta * (pixelsPerMeter * 0.45);

      if (screenX > -40 && screenX < width + 40) {
        // High rocky outcrop in background
        const groundY = getTerrainY(screenX);
        const cragY = groundY - 140;

        ctx.save();
        ctx.globalAlpha = 0.65;
        // Distant rock spur
        ctx.fillStyle = '#181512';
        ctx.beginPath();
        ctx.moveTo(screenX - 25, cragY + 30);
        ctx.lineTo(screenX, cragY);
        ctx.lineTo(screenX + 22, cragY + 35);
        ctx.lineTo(screenX, cragY + 50);
        ctx.fill();

        // Cloaked tall figure
        ctx.fillStyle = '#0D0B0A';
        // Head / hood
        ctx.beginPath();
        ctx.arc(screenX, cragY - 26, 4.5, 0, Math.PI * 2);
        ctx.fill();
        // Cloak draped
        ctx.beginPath();
        ctx.moveTo(screenX - 2, cragY - 24);
        ctx.lineTo(screenX + 2, cragY - 24);
        ctx.lineTo(screenX + 6, cragY);
        ctx.lineTo(screenX - 7, cragY);
        ctx.closePath();
        ctx.fill();

        // Subtle wind flutter
        const flutter = Math.sin(now * 0.003) * 2;
        ctx.beginPath();
        ctx.moveTo(screenX - 7, cragY - 5);
        ctx.lineTo(screenX - 10 + flutter, cragY);
        ctx.lineTo(screenX - 5, cragY);
        ctx.fill();

        // Faint mysterious mist around him
        const mistGrad = ctx.createRadialGradient(screenX, cragY - 15, 2, screenX, cragY - 15, 28);
        mistGrad.addColorStop(0, 'rgba(210, 195, 175, 0.12)');
        mistGrad.addColorStop(1, 'rgba(210, 195, 175, 0)');
        ctx.fillStyle = mistGrad;
        ctx.beginPath();
        ctx.arc(screenX, cragY - 15, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (this.tier === 'APPROACHING_PILGRIM') {
      // TIER 2: 10-49 RUNS -> APPROACHING PILGRIM AT MID-DISTANCE WITH LANTERN & STAFF
      const watcherWorldDist = 24;
      const distDelta = watcherWorldDist - playerDistance;
      const screenX = screenCenterX + distDelta * (pixelsPerMeter * 0.75);

      if (screenX > -50 && screenX < width + 50) {
        const groundY = getTerrainY(screenX);
        const standY = groundY - 22;

        ctx.save();
        // 1. Lantern Amber Glow
        const flicker = Math.sin(this.lanternPulse) * 0.12 + Math.cos(this.lanternPulse * 2.3) * 0.08;
        const lanternX = screenX + 14;
        const lanternY = standY - 26;

        const glow = ctx.createRadialGradient(lanternX, lanternY, 3, lanternX, lanternY, 48);
        glow.addColorStop(0, `rgba(245, 158, 11, ${0.45 + flicker})`);
        glow.addColorStop(0.5, `rgba(217, 119, 6, ${0.15 + flicker * 0.5})`);
        glow.addColorStop(1, 'rgba(217, 119, 6, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(lanternX, lanternY, 48, 0, Math.PI * 2);
        ctx.fill();

        // 2. Pilgrim staff
        ctx.strokeStyle = '#3C3024';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(screenX + 12, standY);
        ctx.lineTo(screenX + 12, standY - 42);
        ctx.stroke();

        // Small brass lantern
        ctx.fillStyle = '#D97706';
        ctx.fillRect(lanternX - 3.5, lanternY - 4, 7, 9);
        ctx.fillStyle = '#FEF3C7';
        ctx.fillRect(lanternX - 2, lanternY - 2, 4, 5);

        // 3. Cloaked Figure Body
        ctx.fillStyle = '#1C1814';
        // Head and hood
        ctx.beginPath();
        ctx.arc(screenX, standY - 35, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Flowing mantle
        ctx.beginPath();
        ctx.moveTo(screenX - 4, standY - 32);
        ctx.lineTo(screenX + 4, standY - 32);
        ctx.lineTo(screenX + 9, standY);
        ctx.lineTo(screenX - 10, standY);
        ctx.closePath();
        ctx.fill();

        // Head looking slightly toward player
        ctx.fillStyle = '#0A0806';
        ctx.beginPath();
        ctx.arc(screenX - 1.5, standY - 35, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pilgrim cowl back fold
        ctx.strokeStyle = '#2D251D';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(screenX - 6, standY - 30);
        ctx.lineTo(screenX - 9, standY - 14);
        ctx.stroke();

        ctx.restore();
      }
    } else {
      // TIER 3: 50+ RUNS -> SEATED SAGE RIGHT BESIDE TRAIL, SPEAKS QUOTES
      const watcherWorldDist = 14;
      const distDelta = watcherWorldDist - playerDistance;
      const screenX = screenCenterX + distDelta * pixelsPerMeter;

      if (screenX > -80 && screenX < width + 80) {
        const groundY = getTerrainY(screenX);
        const standY = groundY - 4;

        ctx.save();
        // 1. Warm lantern on the stone beside him
        const lanternX = screenX - 18;
        const lanternY = standY - 8;
        const flicker = Math.sin(this.lanternPulse * 1.2) * 0.15 + Math.cos(this.lanternPulse * 2.8) * 0.08;

        const lanternGlow = ctx.createRadialGradient(lanternX, lanternY, 4, lanternX, lanternY, 65);
        lanternGlow.addColorStop(0, `rgba(251, 191, 36, ${0.55 + flicker})`);
        lanternGlow.addColorStop(0.4, `rgba(217, 119, 6, ${0.22 + flicker * 0.4})`);
        lanternGlow.addColorStop(1, 'rgba(180, 83, 9, 0)');
        ctx.fillStyle = lanternGlow;
        ctx.beginPath();
        ctx.arc(lanternX, lanternY, 65, 0, Math.PI * 2);
        ctx.fill();

        // Lantern cage
        ctx.fillStyle = '#451A03';
        ctx.fillRect(lanternX - 4, lanternY - 6, 8, 12);
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(lanternX - 2.5, lanternY - 4, 5, 8);

        // 2. Seated wayside stone
        ctx.fillStyle = '#26201B';
        ctx.beginPath();
        ctx.ellipse(screenX, standY, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. Seated Sage Figure
        ctx.fillStyle = '#1A1613';
        // Head / hood
        ctx.beginPath();
        ctx.arc(screenX + 2, standY - 28, 7.5, 0, Math.PI * 2);
        ctx.fill();

        // Shadow inside hood
        ctx.fillStyle = '#060504';
        ctx.beginPath();
        ctx.arc(screenX, standY - 28, 5, 0, Math.PI * 2);
        ctx.fill();

        // Folded ancient robes
        ctx.fillStyle = '#1D1814';
        ctx.beginPath();
        ctx.moveTo(screenX - 3, standY - 24);
        ctx.lineTo(screenX + 7, standY - 24);
        ctx.lineTo(screenX + 16, standY);
        ctx.lineTo(screenX - 14, standY);
        ctx.closePath();
        ctx.fill();

        // Folded hands in contemplation
        ctx.fillStyle = '#A38F78';
        ctx.beginPath();
        ctx.arc(screenX + 1, standY - 14, 3, 0, Math.PI * 2);
        ctx.fill();

        // Wooden staff leaning against stone
        ctx.strokeStyle = '#4A3B2C';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(screenX + 18, standY);
        ctx.lineTo(screenX + 12, standY - 38);
        ctx.stroke();

        // Small indicator above head: "Observateur" icon
        ctx.fillStyle = '#D97706';
        ctx.font = '11px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏛️', screenX + 2, standY - 42);

        // 4. Philosophical Speech Bubble (if active)
        if (this.currentQuote && this.quoteOpacity > 0.05) {
          const quoteText = lang === 'fr' ? this.currentQuote.fr : this.currentQuote.en;
          const authorText = `— ${this.currentQuote.author}`;

          ctx.save();
          ctx.globalAlpha = this.quoteOpacity;

          // Box coordinates
          const bubbleW = Math.min(320, width * 0.75);
          const bubbleH = 68;
          const bubbleX = Math.max(10, Math.min(width - bubbleW - 10, screenX - bubbleW * 0.5));
          const bubbleY = standY - 125;

          // Box background
          ctx.fillStyle = 'rgba(18, 15, 13, 0.94)';
          ctx.strokeStyle = '#785A34';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8);
          ctx.fill();
          ctx.stroke();

          // Small bottom arrow pointing to sage
          ctx.beginPath();
          ctx.moveTo(screenX - 6, bubbleY + bubbleH);
          ctx.lineTo(screenX, bubbleY + bubbleH + 8);
          ctx.lineTo(screenX + 6, bubbleY + bubbleH);
          ctx.fillStyle = 'rgba(18, 15, 13, 0.94)';
          ctx.fill();

          // Quote text (word wrapped if needed)
          ctx.fillStyle = '#F4EFE6';
          ctx.font = 'italic 11px Cinzel, Georgia, serif';
          ctx.textAlign = 'center';

          // Simple 2-line break if text is long
          if (quoteText.length > 55) {
            const splitIdx = quoteText.lastIndexOf(' ', 50);
            const line1 = quoteText.substring(0, splitIdx > 0 ? splitIdx : 50);
            const line2 = quoteText.substring(splitIdx > 0 ? splitIdx + 1 : 50);
            ctx.fillText(`“${line1}`, bubbleX + bubbleW / 2, bubbleY + 22);
            ctx.fillText(`${line2}”`, bubbleX + bubbleW / 2, bubbleY + 38);
          } else {
            ctx.fillText(`“${quoteText}”`, bubbleX + bubbleW / 2, bubbleY + 28);
          }

          // Author citation
          ctx.fillStyle = '#D97706';
          ctx.font = 'bold 9.5px Cinzel, sans-serif';
          ctx.fillText(authorText, bubbleX + bubbleW / 2, bubbleY + 56);

          ctx.restore();
        }

        ctx.restore();
      }
    }

    ctx.restore();
  }
}

export const silentWatcherEngine = new SilentWatcherSystem();
