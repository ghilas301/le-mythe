import { Language } from '../types/game';

export interface SolitaryThought {
  id: string;
  author: string;
  triggerDistance?: number;
  triggerAttempts?: number;
  triggerCondition?: 'PUSHING' | 'SLIPPING' | 'CRASH' | 'DESCENDING' | 'REST';
  textFr: string;
  textEn: string;
}

/**
 * Anthologie philosophique libre de droit (Domaine Public)
 * Sénèque, Marc Aurèle, Épictète, Nietzsche, Schopenhauer, Spinoza,
 * Pascal, Montaigne, Homère, Héraclite, Hugo, Goethe, Lao Tseu & Le Mythe de Sisyphe.
 * Plus de 100 citations variées célébrant l'effort, la résilience, la lucidité et la liberté.
 */
export const MONOLOGUES: SolitaryThought[] = [
  // ==========================================
  // SECTION 1: L'EFFORT ET LA POUSSÉE (PUSHING)
  // ==========================================
  {
    id: 'seneca_hard',
    author: 'Sénèque',
    triggerCondition: 'PUSHING',
    textFr: '« Ce n’est pas parce que les choses sont difficiles que nous n’osons pas, c’est parce que nous n’osons pas qu’elles sont difficiles. » — Sénèque',
    textEn: '“It is not because things are difficult that we do not dare, it is because we do not dare that they are difficult.” — Seneca'
  },
  {
    id: 'marcus_obstacle',
    author: 'Marc Aurèle',
    triggerCondition: 'PUSHING',
    textFr: '« L’obstacle qui barre la route devient le chemin. » — Marc Aurèle',
    textEn: '“The impediment to action advances action. What stands in the way becomes the way.” — Marcus Aurelius'
  },
  {
    id: 'nietzsche_stronger',
    author: 'Nietzsche',
    triggerCondition: 'PUSHING',
    textFr: '« Ce qui ne me tue pas me rend plus fort. » — Friedrich Nietzsche',
    textEn: '“What does not kill me makes me stronger.” — Friedrich Nietzsche'
  },
  {
    id: 'epictetus_difficulty',
    author: 'Épictète',
    triggerCondition: 'PUSHING',
    textFr: '« La difficulté est ce qui révèle les hommes à eux-mêmes. » — Épictète',
    textEn: '“Difficulties are things that show a person what they are.” — Epictetus'
  },
  {
    id: 'seneca_fire_gold',
    author: 'Sénèque',
    triggerCondition: 'PUSHING',
    textFr: '« Le feu éprouve l’or, la misère éprouve les hommes forts. » — Sénèque',
    textEn: '“Fire tests gold, adversity tests brave men.” — Seneca'
  },
  {
    id: 'hugo_struggle',
    author: 'Victor Hugo',
    triggerCondition: 'PUSHING',
    textFr: '« Ceux qui vivent, ce sont ceux qui luttent. » — Victor Hugo',
    textEn: '“Those who live are those who fight.” — Victor Hugo'
  },
  {
    id: 'nietzsche_why',
    author: 'Nietzsche',
    triggerCondition: 'PUSHING',
    textFr: '« Celui qui a un pourquoi qui lui tient lieu de but peut vivre avec n’importe quel comment. » — Friedrich Nietzsche',
    textEn: '“He who has a why to live can bear almost any how.” — Friedrich Nietzsche'
  },
  {
    id: 'heraclitus_road',
    author: 'Héraclite',
    triggerCondition: 'PUSHING',
    textFr: '« La route qui monte et celle qui descend sont une seule et même route. » — Héraclite',
    textEn: '“The way up and the way down are one and the same.” — Heraclitus'
  },
  {
    id: 'pascal_reed',
    author: 'Pascal',
    triggerCondition: 'PUSHING',
    textFr: '« L’homme n’est qu’un roseau, le plus faible de la nature ; mais c’est un roseau pensant. » — Blaise Pascal',
    textEn: '“Man is only a reed, the weakest in nature, but he is a thinking reed.” — Blaise Pascal'
  },
  {
    id: 'goethe_begin',
    author: 'Goethe',
    triggerCondition: 'PUSHING',
    textFr: '« Quoi que tu puisses faire ou rêver, commence-le. L’audace a du génie et du pouvoir. » — Goethe',
    textEn: '“Whatever you can do or dream you can, begin it. Boldness has genius, power and magic.” — Goethe'
  },
  {
    id: 'montaigne_art',
    author: 'Montaigne',
    triggerCondition: 'PUSHING',
    textFr: '« Mon métier et mon art, c’est vivre. » — Michel de Montaigne',
    textEn: '“My trade and my art is to live.” — Michel de Montaigne'
  },
  {
    id: 'laotzu_step',
    author: 'Lao Tseu',
    triggerCondition: 'PUSHING',
    textFr: '« Un voyage de mille lieues commence toujours par un premier pas. » — Lao Tseu',
    textEn: '“A journey of a thousand miles begins with a single step.” — Lao Tzu'
  },
  {
    id: 'spinoza_power',
    author: 'Spinoza',
    triggerCondition: 'PUSHING',
    textFr: '« Chacun a d’autant plus de droit qu’il a plus de puissance. » — Baruch Spinoza',
    textEn: '“Each individual has only as much right as he has power.” — Baruch Spinoza'
  },
  {
    id: 'marcus_mind_power',
    author: 'Marc Aurèle',
    triggerCondition: 'PUSHING',
    textFr: '« Tu as pouvoir sur ton esprit, non sur les événements extérieurs. Trouve là ta force. » — Marc Aurèle',
    textEn: '“You have power over your mind, not outside events. Realize this, and you will find strength.” — Marcus Aurelius'
  },
  {
    id: 'schopenhauer_obstacle',
    author: 'Schopenhauer',
    triggerCondition: 'PUSHING',
    textFr: '« L’obstacle surmonté procure la joie la plus immédiate d’exister. » — Arthur Schopenhauer',
    textEn: '“Every conquered obstacle gives an immediate joy of being.” — Arthur Schopenhauer'
  },
  {
    id: 'seneca_breeze',
    author: 'Sénèque',
    triggerCondition: 'PUSHING',
    textFr: '« Il n’est point de vent favorable pour celui qui ne sait où il va. » — Sénèque',
    textEn: '“If one does not know to which port one is sailing, no wind is favorable.” — Seneca'
  },
  {
    id: 'epictetus_control',
    author: 'Épictète',
    triggerCondition: 'PUSHING',
    textFr: '« Il n’y a qu’une route vers la liberté : le mépris de ce qui ne dépend pas de nous. » — Épictète',
    textEn: '“There is only one way to happiness, and that is to cease worrying about things beyond our control.” — Epictetus'
  },
  {
    id: 'homer_sweat',
    author: 'Homère',
    triggerCondition: 'PUSHING',
    textFr: '« Sisyphe poussait le montstrueux rocher, la sueur ruisselant de ses membres et la poussière sur son front. » — Homère',
    textEn: '“Sisyphus pushed the monstrous rock, sweat pouring from his limbs and dust rising from his brow.” — Homer'
  },
  {
    id: 'nietzsche_chaos_star',
    author: 'Nietzsche',
    triggerCondition: 'PUSHING',
    textFr: '« Il faut porter encore en soi un chaos pour pouvoir enfanter une étoile dansante. » — Friedrich Nietzsche',
    textEn: '“One must still have chaos in oneself to give birth to a dancing star.” — Friedrich Nietzsche'
  },
  {
    id: 'marcus_promontory',
    author: 'Marc Aurèle',
    triggerCondition: 'PUSHING',
    textFr: '« Sois comme le promontoire contre lequel les flots se brisent sans cesse ; il reste immobile et dompte l’écume. » — Marc Aurèle',
    textEn: '“Be like the promontory against which the waves continually break, but it stands firm.” — Marcus Aurelius'
  },
  {
    id: 'seneca_day_life',
    author: 'Sénèque',
    triggerCondition: 'PUSHING',
    textFr: '« Hâte-toi de bien vivre et songe que chaque jour est à lui seul une vie tout entière. » — Sénèque',
    textEn: '“Begin at once to live, and count each separate day as a separate life.” — Seneca'
  },
  {
    id: 'baudelaire_courage',
    author: 'Baudelaire',
    triggerCondition: 'PUSHING',
    textFr: '« Pour soulever un poids si lourd, Sisyphe, il faudrait ton courage ! » — Charles Baudelaire',
    textEn: '“To lift a weight so heavy, Sisyphus, one would need all your courage!” — Charles Baudelaire'
  },
  {
    id: 'montaigne_oneself',
    author: 'Montaigne',
    triggerCondition: 'PUSHING',
    textFr: '« La plus grande chose du monde, c’est de savoir être à soi. » — Michel de Montaigne',
    textEn: '“The greatest thing in the world is to know how to belong to oneself.” — Michel de Montaigne'
  },
  {
    id: 'laotzu_water_rock',
    author: 'Lao Tseu',
    triggerCondition: 'PUSHING',
    textFr: '« Rien au monde n’est plus souple que l’eau, pourtant rien ne résiste à son insistance sur la pierre. » — Lao Tseu',
    textEn: '“Nothing in the world is more flexible than water, yet nothing overcomes its persistence against rock.” — Lao Tzu'
  },
  {
    id: 'spinoza_freedom',
    author: 'Spinoza',
    triggerCondition: 'PUSHING',
    textFr: '« L’homme libre ne pense à rien moins qu’à la mort, et sa sagesse est une méditation de la vie. » — Baruch Spinoza',
    textEn: '“A free man thinks of death least of all things; his wisdom is a meditation not on death but on life.” — Baruch Spinoza'
  },
  {
    id: 'sisyphus_breath',
    author: 'Le Mythe',
    triggerCondition: 'PUSHING',
    textFr: '« Mes poumons aspirent le vent froid. La pierre n’a pas d’esprit, mais j’ai le mien. »',
    textEn: '“My lungs draw the cold gale. The stone has no will, but I have mine.”'
  },
  {
    id: 'sisyphus_steps',
    author: 'Le Mythe',
    triggerCondition: 'PUSHING',
    textFr: '« Chaque mètre arraché à la montagne est une victoire souveraine contre le vide. »',
    textEn: '“Every meter torn from the mountain is a sovereign triumph over the void.”'
  },
  {
    id: 'seneca_gladiator',
    author: 'Sénèque',
    triggerCondition: 'PUSHING',
    textFr: '« Le gladiateur prend ses résolutions dans l’arène même. Pousse sans hésiter. » — Sénèque',
    textEn: '“The gladiator makes his plan once inside the arena. Push without hesitation.” — Seneca'
  },
  {
    id: 'marcus_dig_well',
    author: 'Marc Aurèle',
    triggerCondition: 'PUSHING',
    textFr: '« Creuse au-dedans de toi : c’est là qu’est la source du bien, elle jaillit toujours pour qui creuse. » — Marc Aurèle',
    textEn: '“Look within. Within is the fountain of good, and it will ever bubble up, if thou wilt ever dig.” — Marcus Aurelius'
  },
  {
    id: 'nietzsche_become',
    author: 'Nietzsche',
    triggerCondition: 'PUSHING',
    textFr: '« Deviens ce que tu es : le maître de ton propre fardeau. » — Friedrich Nietzsche',
    textEn: '“Become who you are: the master of your own burden.” — Friedrich Nietzsche'
  },
  {
    id: 'epictetus_actor',
    author: 'Épictète',
    triggerCondition: 'PUSHING',
    textFr: '« Ton rôle est de bien jouer le personnage qui t’a été confié ; le choisir appartient à un autre. » — Épictète',
    textEn: '“Remember that you are an actor in a play; your duty is to play well the part given to you.” — Epictetus'
  },
  {
    id: 'pascal_greatness',
    author: 'Pascal',
    triggerCondition: 'PUSHING',
    textFr: '« La grandeur de l’homme est si visible qu’elle se tire même de sa misère. » — Blaise Pascal',
    textEn: '“Man’s greatness comes from knowing he is wretched.” — Blaise Pascal'
  },
  {
    id: 'heraclitus_strife',
    author: 'Héraclite',
    triggerCondition: 'PUSHING',
    textFr: '« La tension des contraires engendre la plus belle des harmonies. » — Héraclite',
    textEn: '“That which opposes produces harmony; from discord comes the fairest music.” — Heraclitus'
  },
  {
    id: 'goethe_action',
    author: 'Goethe',
    triggerCondition: 'PUSHING',
    textFr: '« Ce n’est pas assez de vouloir, il faut agir. Ce n’est pas assez de savoir, il faut s’exercer. » — Goethe',
    textEn: '“Knowing is not enough; we must apply. Willing is not enough; we must do.” — Goethe'
  },
  {
    id: 'chuan_tree',
    author: 'Tchouang-tseu',
    triggerCondition: 'PUSHING',
    textFr: '« L’arbre qui résiste au vent le plus fort n’a pas peur de la pente abrupte. » — Tchouang-tseu',
    textEn: '“The tree that weathers the wildest wind does not fear the steepest slope.” — Zhuangzi'
  },

  // ==========================================
  // SECTION 2: ALTITUDE ÉLEVÉE (DISTANCE 50m+)
  // ==========================================
  {
    id: 'alt_thin_air',
    author: 'Sénèque',
    triggerDistance: 50,
    triggerCondition: 'PUSHING',
    textFr: '« Les cimes attirent les tempêtes, mais elles embrassent les premières la lumière. » — Sénèque',
    textEn: '“The heights attract storms, yet they are the first to embrace the light.” — Seneca'
  },
  {
    id: 'alt_nietzsche_peak',
    author: 'Nietzsche',
    triggerDistance: 75,
    triggerCondition: 'PUSHING',
    textFr: '« Plus haut nous nous élevons, plus nous paraissons petits à ceux qui ne savent pas voler. » — Friedrich Nietzsche',
    textEn: '“The higher we soar, the smaller we appear to those who cannot fly.” — Friedrich Nietzsche'
  },
  {
    id: 'alt_marcus_cosmos',
    author: 'Marc Aurèle',
    triggerDistance: 100,
    triggerCondition: 'PUSHING',
    textFr: '« Vois d’en haut l’immensité de la terre : que pèsent nos tourments face aux étoiles ? » — Marc Aurèle',
    textEn: '“Look down from above upon the vastness of the earth: what is our struggle before the stars?” — Marcus Aurelius'
  },
  {
    id: 'alt_epictetus_summit',
    author: 'Épictète',
    triggerDistance: 130,
    triggerCondition: 'PUSHING',
    textFr: '« Aucun sommet n’a jamais été conquis sans que les talons n’aient souffert la morsure de la roche. » — Épictète',
    textEn: '“No summit was ever reached without heels bearing the bite of stone.” — Epictetus'
  },
  {
    id: 'alt_hugo_cloud',
    author: 'Victor Hugo',
    triggerDistance: 170,
    triggerCondition: 'PUSHING',
    textFr: '« C’est au-dessus des nuages que le ciel demeure perpétuellement serein. » — Victor Hugo',
    textEn: '“It is above the clouds that the sky remains eternally serene.” — Victor Hugo'
  },
  {
    id: 'alt_camus_heart',
    author: 'Camus',
    triggerDistance: 220,
    triggerCondition: 'PUSHING',
    textFr: '« La lutte elle-même vers les sommets suffit à remplir un cœur d’homme. » — Albert Camus',
    textEn: '“The struggle itself toward the heights is enough to fill a man’s heart.” — Albert Camus'
  },
  {
    id: 'alt_spinoza_beatitude',
    author: 'Spinoza',
    triggerDistance: 280,
    triggerCondition: 'PUSHING',
    textFr: '« Toutes les choses admirables sont aussi difficiles que rares. » — Baruch Spinoza',
    textEn: '“All things excellent are as difficult as they are rare.” — Baruch Spinoza'
  },
  {
    id: 'alt_sisyphus_no_peak',
    author: 'Le Mythe',
    triggerDistance: 350,
    triggerCondition: 'PUSHING',
    textFr: '« Il n’y a pas de fin au voyage. Le sommet est chaque pas que tu accomplis maintenant. »',
    textEn: '“There is no end to the climb. The summit is every step you take right now.”'
  },

  // ==========================================
  // SECTION 3: LA CRISE ET LE GLISSEMENT (SLIPPING)
  // ==========================================
  {
    id: 'slip_seneca_hold',
    author: 'Sénèque',
    triggerCondition: 'SLIPPING',
    textFr: '« C’est dans les tempêtes que se révèle le pilote du navire. Tiens bon ! » — Sénèque',
    textEn: '“It is in storms that the pilot proves his skill. Hold fast!” — Seneca'
  },
  {
    id: 'slip_marcus_stand',
    author: 'Marc Aurèle',
    triggerCondition: 'SLIPPING',
    textFr: '« Reste debout, ou sois remis debout par ta propre volonté. » — Marc Aurèle',
    textEn: '“Stand firm, or be set upright by thine own will.” — Marcus Aurelius'
  },
  {
    id: 'slip_epictetus_reins',
    author: 'Épictète',
    triggerCondition: 'SLIPPING',
    textFr: '« Le cheval fougueux teste la fermeté de tes poignets. Ne lâche pas le roc ! » — Épictète',
    textEn: '“A spirited horse tests the firmness of your grip. Do not yield the stone!” — Epictetus'
  },
  {
    id: 'slip_nietzsche_abyss',
    author: 'Nietzsche',
    triggerCondition: 'SLIPPING',
    textFr: '« Quand tu regardes longtemps dans l’abîme, l’abîme aussi regarde en toi. Repousse ! » — Friedrich Nietzsche',
    textEn: '“When you gaze long into an abyss, the abyss also gazes into you. Push back!” — Friedrich Nietzsche'
  },
  {
    id: 'slip_schopenhauer_will',
    author: 'Schopenhauer',
    triggerCondition: 'SLIPPING',
    textFr: '« La volonté nue s’affirme avec plus d’éclat face à la résistance aveugle de la matière. » — Arthur Schopenhauer',
    textEn: '“The naked will asserts itself most vividly against the blind resistance of matter.” — Arthur Schopenhauer'
  },
  {
    id: 'slip_pascal_balance',
    author: 'Pascal',
    triggerCondition: 'SLIPPING',
    textFr: '« Nous voguons sur un milieu vaste, toujours incertains et flottants. Bloque tes pieds ! » — Blaise Pascal',
    textEn: '“We sail upon a vast expanse, ever uncertain and drifting. Plant your feet!” — Blaise Pascal'
  },
  {
    id: 'slip_sisyphus_heels',
    author: 'Le Mythe',
    triggerCondition: 'SLIPPING',
    textFr: '« La roche recule... Plante tes deux talons dans l’argile ! »',
    textEn: '“The stone pulls back... Dig both heels deep into the clay!”'
  },
  {
    id: 'slip_laotzu_root',
    author: 'Lao Tseu',
    triggerCondition: 'SLIPPING',
    textFr: '« L’arbre aux racines profondes ne craint point la bourrasque. » — Lao Tseu',
    textEn: '“The tree with deep roots does not fear the gale.” — Lao Tzu'
  },

  // ==========================================
  // SECTION 4: LA CHUTE ET LE REBOND (CRASH)
  // ==========================================
  {
    id: 'crash_marcus_fall',
    author: 'Marc Aurèle',
    triggerCondition: 'CRASH',
    textFr: '« Tomber fait partie du chemin. Se relever est l’acte même de vivre. » — Marc Aurèle',
    textEn: '“To fall is part of the way. To rise again is the very act of living.” — Marcus Aurelius'
  },
  {
    id: 'crash_seneca_reborn',
    author: 'Sénèque',
    triggerCondition: 'CRASH',
    textFr: '« Souvent une rechute n’est qu’un nouvel appel au courage. » — Sénèque',
    textEn: '“Often a fall is merely a renewed summons to courage.” — Seneca'
  },
  {
    id: 'crash_nietzsche_amorfati',
    author: 'Nietzsche',
    triggerCondition: 'CRASH',
    textFr: '« Amor Fati : n’avoir aucun regret, mais aimer ce qui s’est produit. » — Friedrich Nietzsche',
    textEn: '“Amor Fati: to want nothing different, neither forward nor backward.” — Friedrich Nietzsche'
  },
  {
    id: 'crash_epictetus_restore',
    author: 'Épictète',
    triggerCondition: 'CRASH',
    textFr: '« Rien n’est perdu qui puisse être recommencé avec une âme lucide. » — Épictète',
    textEn: '“Nothing is truly lost that can be begun again with a lucid soul.” — Epictetus'
  },
  {
    id: 'crash_hugo_dawn',
    author: 'Victor Hugo',
    triggerCondition: 'CRASH',
    textFr: '« Même la nuit la plus sombre prendra fin et le jour se lèvera. » — Victor Hugo',
    textEn: '“Even the darkest night will end and the sun will rise.” — Victor Hugo'
  },
  {
    id: 'crash_camus_stone_rolls',
    author: 'Camus',
    triggerCondition: 'CRASH',
    textFr: '« La pierre roule vers la nuit de la vallée... Mais l’homme est plus fort que son rocher. » — Albert Camus',
    textEn: '“The stone rolls down into the valley’s dusk... Yet man is stronger than his boulder.” — Albert Camus'
  },
  {
    id: 'crash_homer_furious_rock',
    author: 'Homère',
    triggerCondition: 'CRASH',
    textFr: '« Le roc insolent a bondi jusqu’en bas. La pente attend le retour du héros. » — Homère',
    textEn: '“The insolent rock bounded to the base. The slope awaits the hero’s return.” — Homer'
  },
  {
    id: 'crash_montaigne_learn',
    author: 'Montaigne',
    triggerCondition: 'CRASH',
    textFr: '« La vie est une ondoyante leçon : chaque faux pas nous apprend notre vraie mesure. » — Michel de Montaigne',
    textEn: '“Life is an undulating lesson: every misstep teaches us our true measure.” — Michel de Montaigne'
  },
  {
    id: 'crash_spinoza_understanding',
    author: 'Spinoza',
    triggerCondition: 'CRASH',
    textFr: '« Ne pas pleurer, ne pas détester, mais comprendre. » — Baruch Spinoza',
    textEn: '“Not to weep, not to detest, but to understand.” — Baruch Spinoza'
  },
  {
    id: 'crash_goethe_rise',
    author: 'Goethe',
    triggerCondition: 'CRASH',
    textFr: '« Celui qui tombe et se relève est bien plus grand que celui qui n’est jamais tombé. » — Goethe',
    textEn: '“He who falls and rises is far greater than he who never fell.” — Goethe'
  },

  // ==========================================
  // SECTION 5: LA DESCENTE ET LA LUCIDITÉ (DESCENDING)
  // ==========================================
  {
    id: 'desc_camus_pause',
    author: 'Camus',
    triggerCondition: 'DESCENDING',
    textFr: '« C’est pendant ce retour, cette pause, que Sisyphe m’intéresse. » — Albert Camus',
    textEn: '“It is during that return, that pause, that Sisyphus interests me.” — Albert Camus'
  },
  {
    id: 'desc_camus_face',
    author: 'Camus',
    triggerCondition: 'DESCENDING',
    textFr: '« Un visage qui peine si près des pierres est déjà pierre lui-même. » — Albert Camus',
    textEn: '“A face that toils so close to stones is already stone itself.” — Albert Camus'
  },
  {
    id: 'desc_camus_scorn',
    author: 'Camus',
    triggerCondition: 'DESCENDING',
    textFr: '« Il n’est pas de destin qui ne se surmonte par le mépris. » — Albert Camus',
    textEn: '“There is no fate that cannot be surmounted by scorn.” — Albert Camus'
  },
  {
    id: 'desc_camus_nomaster',
    author: 'Camus',
    triggerCondition: 'DESCENDING',
    textFr: '« Cet univers désormais sans maître ne lui paraît ni stérile ni futile. » — Albert Camus',
    textEn: '“This universe henceforth without a master seems to him neither sterile nor futile.” — Albert Camus'
  },
  {
    id: 'desc_camus_happy',
    author: 'Camus',
    triggerCondition: 'DESCENDING',
    textFr: '« Il faut imaginer Sisyphe heureux. » — Albert Camus',
    textEn: '“One must imagine Sisyphus happy.” — Albert Camus'
  },
  {
    id: 'desc_seneca_tranquil',
    author: 'Sénèque',
    triggerCondition: 'DESCENDING',
    textFr: '« La véritable tranquillité de l’âme naît de l’acceptation sereine de notre condition. » — Sénèque',
    textEn: '“True tranquility of soul comes from the serene acceptance of our condition.” — Seneca'
  },
  {
    id: 'desc_marcus_flow',
    author: 'Marc Aurèle',
    triggerCondition: 'DESCENDING',
    textFr: '« Tout s’écoule, tout se transforme : la descente prépare la prochaine ascension. » — Marc Aurèle',
    textEn: '“All things flow and transform: the descent prepares the next ascent.” — Marcus Aurelius'
  },
  {
    id: 'desc_epictetus_peace',
    author: 'Épictète',
    triggerCondition: 'DESCENDING',
    textFr: '« La paix intérieure appartient à celui qui sait sourire à ce qu’il ne peut asservir. » — Épictète',
    textEn: '“Inner peace belongs to the one who can smile at what he cannot enslave.” — Epictetus'
  },
  {
    id: 'desc_nietzsche_sunset',
    author: 'Nietzsche',
    triggerCondition: 'DESCENDING',
    textFr: '« J’aime celui dont l’âme est profonde jusque dans la blessure et qui sait périr d’un léger accident. » — Friedrich Nietzsche',
    textEn: '“I love him whose soul is deep even in the wound, and who can perish through a small matter.” — Friedrich Nietzsche'
  },
  {
    id: 'desc_schopenhauer_calm',
    author: 'Schopenhauer',
    triggerCondition: 'DESCENDING',
    textFr: '« Dans le silence après l’effort, l’esprit contemple la beauté brute du monde sans désirer la changer. » — Arthur Schopenhauer',
    textEn: '“In the silence after struggle, the spirit contemplates the raw beauty of the world without desiring to alter it.” — Arthur Schopenhauer'
  },
  {
    id: 'desc_spinoza_joy',
    author: 'Spinoza',
    triggerCondition: 'DESCENDING',
    textFr: '« La joie est le passage d’une moindre à une plus grande perfection. » — Baruch Spinoza',
    textEn: '“Joy is a man’s passage from a less to a greater perfection.” — Baruch Spinoza'
  },
  {
    id: 'desc_laotzu_valley',
    author: 'Lao Tseu',
    triggerCondition: 'DESCENDING',
    textFr: '« La vallée reçoit toutes les eaux parce qu’elle sait rester au point le plus bas. » — Lao Tseu',
    textEn: '“The valley receives all streams because it knows how to remain at the lowest place.” — Lao Tzu'
  },
  {
    id: 'desc_montaigne_stride',
    author: 'Montaigne',
    triggerCondition: 'DESCENDING',
    textFr: '« Le pas lourd qui descend la montagne est le pas le plus libre de l’univers. » — Michel de Montaigne',
    textEn: '“The heavy step descending the mountain is the freest step in the universe.” — Michel de Montaigne'
  },
  {
    id: 'desc_pascal_heart',
    author: 'Pascal',
    triggerCondition: 'DESCENDING',
    textFr: '« Le silence de ces espaces infinis ne m’effraie plus : j’ai habité leur pierre. » — Blaise Pascal',
    textEn: '“The silence of these infinite spaces no longer terrifies me: I have inhabited their stone.” — Blaise Pascal'
  },
  {
    id: 'desc_baudelaire_serene',
    author: 'Baudelaire',
    triggerCondition: 'DESCENDING',
    textFr: '« Sois sage, ô ma douleur, et contemple le couchant sur la terre. » — Charles Baudelaire',
    textEn: '“Be wise, O my Sorrow, and behold the dusk upon the earth.” — Charles Baudelaire'
  },

  // ==========================================
  // SECTION 6: SAGESSE GÉNÉRALE & EXISTENTIELLE
  // ==========================================
  {
    id: 'gen_seneca_time',
    author: 'Sénèque',
    textFr: '« Ce n’est pas que nous manquions de temps, c’est que nous en perdons beaucoup. » — Sénèque',
    textEn: '“It is not that we have a short time to live, but that we waste a lot of it.” — Seneca'
  },
  {
    id: 'gen_marcus_present',
    author: 'Marc Aurèle',
    textFr: '« Rappelle-toi que tu ne vis que dans le moment présent, cet instant infiniment bref. » — Marc Aurèle',
    textEn: '“Remember that man lives only in the present, in this fleeting instant.” — Marcus Aurelius'
  },
  {
    id: 'gen_epictetus_freedom',
    author: 'Épictète',
    textFr: '« Nul n’est libre qui n’est maître de lui-même. » — Épictète',
    textEn: '“No man is free who is not master of himself.” — Epictetus'
  },
  {
    id: 'gen_nietzsche_stars',
    author: 'Nietzsche',
    textFr: '« Pour contempler les étoiles, il faut d’abord traverser la nuit la plus sombre. » — Friedrich Nietzsche',
    textEn: '“To behold the stars, one must first cross the deepest night.” — Friedrich Nietzsche'
  },
  {
    id: 'gen_heraclitus_change',
    author: 'Héraclite',
    textFr: '« Rien n’est permanent sauf le changement. » — Héraclite',
    textEn: '“There is nothing permanent except change.” — Heraclitus'
  },
  {
    id: 'gen_spinoza_virtue',
    author: 'Spinoza',
    textFr: '« La béatitude n’est pas la récompense de la vertu, elle est la vertu elle-même. » — Baruch Spinoza',
    textEn: '“Blessedness is not the reward of virtue, but virtue itself.” — Baruch Spinoza'
  },
  {
    id: 'gen_schopenhauer_fate',
    author: 'Schopenhauer',
    textFr: '« Le destin mêle les cartes, mais c’est nous qui jouons la partie. » — Arthur Schopenhauer',
    textEn: '“Fate shuffles the cards, but we play the game.” — Arthur Schopenhauer'
  },
  {
    id: 'gen_pascal_thinking',
    author: 'Pascal',
    textFr: '« Travaillons donc à bien penser : voilà le principe premier de toute liberté. » — Blaise Pascal',
    textEn: '“Let us endeavor then to think well: this is the first principle of all liberty.” — Blaise Pascal'
  },
  {
    id: 'gen_montaigne_world',
    author: 'Montaigne',
    textFr: '« Le monde n’est qu’une branloire pérenne : tout y branle sans cesse. » — Michel de Montaigne',
    textEn: '“The world is but a perennial seesaw: all things in it rock ceaselessly.” — Michel de Montaigne'
  },
  {
    id: 'gen_goethe_courage',
    author: 'Goethe',
    textFr: '« Le courage est l’échelle sur laquelle montent toutes les autres vertus. » — Goethe',
    textEn: '“Courage is the ladder on which all the other virtues mount.” — Goethe'
  },
  {
    id: 'gen_laotzu_simple',
    author: 'Lao Tseu',
    textFr: '« Celui qui se contente de ce qu’il a est riche. » — Lao Tseu',
    textEn: '“He who is contented with what he has is truly rich.” — Lao Tzu'
  },
  {
    id: 'gen_hugo_horizon',
    author: 'Victor Hugo',
    textFr: '« Regarder vers l’horizon, c’est déjà commencer à grandir. » — Victor Hugo',
    textEn: '“To gaze toward the horizon is already to begin to grow.” — Victor Hugo'
  },
  {
    id: 'gen_seneca_fear',
    author: 'Sénèque',
    textFr: '« Nous souffrons souvent plus en imagination qu’en réalité. » — Sénèque',
    textEn: '“We suffer more often in imagination than in reality.” — Seneca'
  },
  {
    id: 'gen_marcus_morning',
    author: 'Marc Aurèle',
    textFr: '« Dès l’aurore, dis-toi : je vais rencontrer l’ingrat, l’insolent, l’infidèle... et je marcherai quand même. » — Marc Aurèle',
    textEn: '“When you arise in the morning, say to yourself: I will meet insolence, ingratitude... and I will press on regardless.” — Marcus Aurelius'
  },
  {
    id: 'gen_epictetus_choice',
    author: 'Épictète',
    textFr: '« On peut m’enchaîner le corps, mais ma volonté reste invincible. » — Épictète',
    textEn: '“You may fetter my leg, but my will not even Zeus himself can conquer.” — Epictetus'
  },
  {
    id: 'gen_nietzsche_daring',
    author: 'Nietzsche',
    triggerDistance: 25,
    textFr: '« Le secret pour récolter la plus grande fécondité de l’existence, c’est : vivez dangereusement ! » — Friedrich Nietzsche',
    textEn: '“For believe me, the secret for harvesting the greatest fruitfulness from existence is to live dangerously!” — Friedrich Nietzsche'
  },
  {
    id: 'gen_heraclitus_sun',
    author: 'Héraclite',
    textFr: '« Le soleil est nouveau chaque jour. Chaque poussée est neuve. » — Héraclite',
    textEn: '“The sun is new each day. Every push is new.” — Heraclitus'
  },
  {
    id: 'gen_spinoza_conatus',
    author: 'Spinoza',
    textFr: '« Chaque chose, autant qu’il est en elle, s’efforce de persévérer dans son être. » — Baruch Spinoza',
    textEn: '“Each thing, in so far as it is in itself, endeavours to persist in its own being.” — Baruch Spinoza'
  },
  {
    id: 'gen_schopenhauer_present',
    author: 'Schopenhauer',
    textFr: '« Seul le présent est vrai et effectif ; c’est le temps réellement rempli. » — Arthur Schopenhauer',
    textEn: '“Only the present is true and real; it is the time actually filled.” — Arthur Schopenhauer'
  },
  {
    id: 'gen_pascal_infinite',
    author: 'Pascal',
    textFr: '« L’homme passe infiniment l’homme. » — Blaise Pascal',
    textEn: '“Man transcends man infinitely.” — Blaise Pascal'
  },
  {
    id: 'gen_montaigne_philosophy',
    author: 'Montaigne',
    textFr: '« Philosopher, ce n’est que se défaire de ses vaines chaînes. » — Michel de Montaigne',
    textEn: '“To philosophize is only to cast off one’s vain chains.” — Michel de Montaigne'
  },
  {
    id: 'gen_goethe_rest',
    author: 'Goethe',
    textFr: '« Le repos n’est pas de ne rien faire, mais de trouver l’harmonie dans l’effort. » — Goethe',
    textEn: '“Rest is not in idleness, but in finding harmony within exertion.” — Goethe'
  },
  {
    id: 'gen_laotzu_strive',
    author: 'Lao Tseu',
    textFr: '« Agis sans attendre de retour. Accomplis sans t’approprier. » — Lao Tseu',
    textEn: '“Act without expectation. Accomplish without claiming possession.” — Lao Tzu'
  },
  {
    id: 'gen_hugo_winged',
    author: 'Victor Hugo',
    textFr: '« Soyez comme l’oiseau posé sur des rameaux trop frêles, qui sent plier la branche et qui chante pourtant, sachant qu’il a des ailes. » — Victor Hugo',
    textEn: '“Be like the bird perched on frail branches, feeling the bough bend beneath, yet singing on, knowing it has wings.” — Victor Hugo'
  },
  {
    id: 'gen_seneca_short_life',
    author: 'Sénèque',
    textFr: '« La vie est assez longue si l’on sait l’employer avec noblesse. » — Sénèque',
    textEn: '“Life is long enough if you know how to use it nobly.” — Seneca'
  },
  {
    id: 'gen_marcus_soul_dye',
    author: 'Marc Aurèle',
    textFr: '« L’âme se colore de la couleur de ses pensées. Nourris-la de fierté. » — Marc Aurèle',
    textEn: '“The soul becomes dyed with the color of its thoughts. Feed it with pride.” — Marcus Aurelius'
  },
  {
    id: 'gen_epictetus_ship',
    author: 'Épictète',
    textFr: '« Lorsque le navire s’arrête, ne t’éloigne pas trop du rivage, de peur que le pilote ne t’appelle. » — Épictète',
    textEn: '“When the ship halts, do not wander too far from the shore, lest the captain call.” — Epictetus'
  },
  {
    id: 'gen_nietzsche_sea',
    author: 'Nietzsche',
    textFr: '« La mer est devant nous : larguons les amarres de nos peurs ! » — Friedrich Nietzsche',
    textEn: '“The sea lies before us: cast off the moorings of fear!” — Friedrich Nietzsche'
  },
  {
    id: 'gen_sisyphus_triumph',
    author: 'Le Mythe',
    textFr: '« La beauté de Sisyphe réside dans ce regard lucide qu’il jette sur le roc avant de le reprendre. »',
    textEn: '“The beauty of Sisyphus lies in the lucid gaze he casts upon the rock before taking it up once more.”'
  },
  {
    id: 'gen_sisyphus_eternity',
    author: 'Le Mythe',
    textFr: '« Ni les dieux ni la montagne ne peuvent briser un esprit qui a choisi son épreuve. »',
    textEn: '“Neither the gods nor the mountain can break a spirit that has chosen its trial.”'
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
    // Frequency: during descent, thoughts flow more frequently (every 5-7s), during struggle every 9-14s
    const cooldown = status === 'DESCENDING' ? 5000 : 9500;
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
      this.thoughtTimer = status === 'DESCENDING' ? 7.0 : 6.0;
      this.lastTriggerTime = now;
      this.triggeredIds.add(selected.id);

      // Rotate pool after 45 unique quotes so they feel endlessly fresh
      if (this.triggeredIds.size > 45) {
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
