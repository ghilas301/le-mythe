import { Language } from '../types/game';

export interface Translations {
  siteTitle: string;
  heroKicker: string;
  heroH1: string;
  heroSub: string;
  pushAction: string;
  pushInstructionDesktop: string;
  pushInstructionMobile: string;
  gameStatusIdle: string;
  gameStatusPushing: string;
  gameStatusSlipping: string;
  gameStatusCrashed: string;
  gameStatusDescending: string;
  descentTitle: string;
  descentSubtitle: string;
  descentAction: string;
  skipDescentBtn: string;
  cairnPassed: string;
  biomeLabel: string;
  statDistance: string;
  statAltitude: string;
  statTime: string;
  statPushes: string;
  statBest: string;
  statTotalAllTime: string;
  slipWarning: string;
  gameOverTitle: string;
  gameOverSubtitle: string;
  newRecordAlert: string;
  tryAgainBtn: string;
  shareScoreBtn: string;
  shareCardBtn: string;
  copiedToast: string;
  adNotice: string;
  adDisclaimer: string;
  
  // Tabs & Nav
  navGame: string;
  navHowToPlay: string;
  navMyth: string;
  navWhy: string;
  navChecklist: string;
  navMonetization: string;
  navCodex: string;
  downloadAction: string;
  installAppAction: string;

  // Game Modes
  modeAbsurdTitle: string;
  modeAbsurdDesc: string;
  modeZenTitle: string;
  modeZenDesc: string;

  // Sections
  howToPlayTitle: string;
  howToPlayRule1Title: string;
  howToPlayRule1Desc: string;
  howToPlayRule2Title: string;
  howToPlayRule2Desc: string;
  howToPlayRule3Title: string;
  howToPlayRule3Desc: string;
  howToPlayRule4Title: string;
  howToPlayRule4Desc: string;

  mythTitle: string;
  mythLead: string;
  mythP1: string;
  mythP2: string;
  mythCamusQuote: string;
  mythP3: string;

  whyTitle: string;
  whyLead: string;
  whyP1: string;
  whyP2: string;
  whyP3: string;

  faqTitle: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  faqQ4: string;
  faqA4: string;

  checklistTitle: string;
  checklistSubtitle: string;
  checklistProgress: string;
  checklistReset: string;
  checklistCopied: string;
  checklistCopyBtn: string;

  monetizationTitle: string;
  monetizationSubtitle: string;
  monetizationCalcTitle: string;
  monetizationFormula: string;
  monetizationSessionsLabel: string;
  monetizationGamesPerSessionLabel: string;
  monetizationCpmLabel: string;
  monetizationFillLabel: string;
  monetizationDailyRevenue: string;
  monetizationMonthlyRevenue: string;
  monetizationRpm: string;
  monetizationAdsterraTitle: string;
  monetizationAdsterraDesc: string;

  soundToggle: string;
  soundOn: string;
  soundOff: string;
  footerRights: string;
  privacyModalTitle: string;
  privacyModalContent: string;
  closeBtn: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    siteTitle: 'The Eternal Push',
    heroKicker: 'An Absurdist Web Game Inspired by Albert Camus',
    heroH1: 'Push the boulder. See how long you last.',
    heroSub: 'No sign-up. No permanent progress. Just you, the granite, and gravity. Stop pushing, and the stone rolls down to zero.',
    pushAction: 'PUSH',
    pushInstructionDesktop: 'Hold SPACE or Click & Hold to Push',
    pushInstructionMobile: 'Press & Hold to Push',
    gameStatusIdle: 'Ready at the foot of the mountain',
    gameStatusPushing: 'Straining upward...',
    gameStatusSlipping: 'Slipping! Resume pushing!',
    gameStatusCrashed: 'Gravity reclaimed the boulder.',
    gameStatusDescending: 'The conscious walk down...',
    descentTitle: 'The Walk Down',
    descentSubtitle: '“It is during that return, that pause, that Sisyphus interests me.” — Albert Camus',
    descentAction: 'STEP DOWNWARD',
    skipDescentBtn: 'Skip to Summary',
    cairnPassed: 'Cairn Marker Reached',
    biomeLabel: 'Altitude Biome',
    statDistance: 'Distance',
    statAltitude: 'Altitude',
    statTime: 'Endurance',
    statPushes: 'Effort Strokes',
    statBest: 'Personal Best',
    statTotalAllTime: 'Total Lifetime Ascent',
    slipWarning: 'TOLERANCE FADING',
    gameOverTitle: 'The Stone Reaches Zero',
    gameOverSubtitle: 'Another descent completed without grievance.',
    newRecordAlert: '★ NEW PERSONAL RECORD ★',
    tryAgainBtn: 'Embrace the Stone Again',
    shareScoreBtn: 'Share Your Struggle',
    shareCardBtn: 'Generate Engraved Certificate',
    copiedToast: 'Score text copied to clipboard!',
    adNotice: 'Advertisement · Non-intrusive sponsor',
    adDisclaimer: 'Adsterra compliant placement. No forced clicks, zero layout shift (CLS ≤ 0.1).',

    navGame: 'The Mountain',
    navHowToPlay: 'How to Play',
    navMyth: 'The Myth',
    navWhy: 'Why This Exists',
    navChecklist: 'Launch Checklist',
    navMonetization: 'Monetization Architecture',
    navCodex: 'Mountain Codex',
    downloadAction: 'Download',
    installAppAction: 'Install App',

    // Game Modes
    modeAbsurdTitle: 'The Absurd (Classic)',
    modeAbsurdDesc: 'Manual push. Gravity reclaims the stone on release.',
    modeZenTitle: 'Stoic Meditation (Zen)',
    modeZenDesc: 'Peaceful steady stroll. Contemplate the path without loss.',

    howToPlayTitle: 'Rules & Controls of the Absurd',
    howToPlayRule1Title: 'Continuous Exertion',
    howToPlayRule1Desc: 'Hold the Spacebar, click and hold, or press the tactile Push button on mobile. Each push drives the boulder up the 26° granite incline.',
    howToPlayRule2Title: 'The Tolerance Window',
    howToPlayRule2Desc: 'When you release the control, you have a brief grace period (~0.9s). If you do not resume in time, momentum turns backward and the boulder starts sliding.',
    howToPlayRule3Title: 'The Inevitable Descent',
    howToPlayRule3Desc: 'If the boulder slips beyond your recovery reach, Sisyphus loses footing. The stone crashes all the way back to 0 meters. The game never ends with a victory screen.',
    howToPlayRule4Title: 'Zero Accounts, Local Storage',
    howToPlayRule4Desc: 'Your personal best, lifetime meters pushed, and audio settings are preserved safely in your device local storage. No trackers, no passwords.',

    mythTitle: 'The Myth of Sisyphus',
    mythLead: 'From Homeric punishment to Albert Camus’ supreme victory of consciousness.',
    mythP1: 'In Greek antiquity, Sisyphus, founder and king of Corinth, was condemned by Zeus for defying death itself. His eternal sentence in the underworld: to roll an immense rock up a steep hill, only to watch it roll back to the base every time he approached the brow.',
    mythP2: 'In 1942, French philosopher Albert Camus turned this archaic torture on its head in his foundational essay *Le Mythe de Sisyphe*. Rather than seeing Sisyphus as pitiful, Camus analyzed the moment of his descent—when the stone has just escaped him and he walks back down to the plain.',
    mythCamusQuote: '“The struggle itself toward the heights is enough to fill a man’s heart. One must imagine Sisyphus happy.”',
    mythP3: 'By accepting the futile nature of the rock, Sisyphus becomes superior to his fate. His rock is his thing. This game translates that philosophical thesis into pure digital code: an endeavor without finish line, joyful in its sheer repetitive defiance.',

    whyTitle: 'Why This Game Exists',
    whyLead: 'A satirical antidote to modern gamification, endless notifications, and deceptive progress bars.',
    whyP1: 'Modern apps trap attention using artificial streaks, battle passes, fake XP, and deceptive dopamine loops that promise completion while delivering anxiety. They monetize the illusion that "one more level" will satisfy you.',
    whyP2: 'The Eternal Push does the exact opposite. It tells you immediately that there is no level 100, no legendary cosmetic loot box, and no finish line. The rock will roll down every single time.',
    whyP3: 'In doing so, the game offers a rare moment of digital honesty: playing simply for the tactile sensation of pushing, enjoying the crisp mountain silhouette, and laughing at the absurdity of our own thumb-mashing.',

    faqTitle: 'Frequently Asked Questions',
    faqQ1: 'Can I actually reach the top of the mountain?',
    faqA1: 'No. The mountain is mathematically infinite. If you push for 10 kilometers, the slope continues. The summit is not a destination; it is an aesthetic backdrop.',
    faqQ2: 'Does switching tabs cause the stone to roll down?',
    faqA2: 'When you leave the tab or lock your phone, the engine automatically pauses the grace timer so you do not suffer an accidental loss, nor do you accumulate unearned meters.',
    faqQ3: 'How does the monetization work without ruining the game?',
    faqA3: 'Ads are restricted exclusively to the post-run summary screen in a dedicated container with pre-allocated dimensions (preventing layout shift). No mid-game popups, no audio ads, no trick buttons.',
    faqQ4: 'Are my stats shared to a central server?',
    faqA4: 'No. Everything is saved locally on your device in standard browser localStorage. No cookies, no third-party profiling.',

    checklistTitle: 'Pre-Publication Production Checklist',
    checklistSubtitle: '17 architectural requirements for a clean, fast, international, and monetizable web game.',
    checklistProgress: 'Checklist Progress',
    checklistReset: 'Reset Checklist',
    checklistCopied: 'Checklist copied to clipboard!',
    checklistCopyBtn: 'Copy Checklist Markdown',

    monetizationTitle: 'Adsterra & Publisher Revenue Architecture',
    monetizationSubtitle: 'Balancing CPM yield, session frequency, and user goodwill.',
    monetizationCalcTitle: 'Session Revenue Model Calculator',
    monetizationFormula: 'Revenue per 1,000 sessions = (Total Revenue / Total Sessions) × 1,000',
    monetizationSessionsLabel: 'Daily Sessions',
    monetizationGamesPerSessionLabel: 'Runs per Session',
    monetizationCpmLabel: 'Effective CPM ($)',
    monetizationFillLabel: 'Fill Rate (%)',
    monetizationDailyRevenue: 'Estimated Daily Revenue',
    monetizationMonthlyRevenue: 'Estimated 30-Day Revenue',
    monetizationRpm: 'Effective RPM (Revenue / 1k Sessions)',
    monetizationAdsterraTitle: 'Adsterra Integration Guidelines',
    monetizationAdsterraDesc: 'To integrate your real Adsterra zone tag: add a single 300x250 or 728x90 banner banner script inside the designated game over wrapper. Ensure direct human traffic, no incentivized clicks, and proper GDPR/ePrivacy user consent handling.',

    soundToggle: 'Audio Effects',
    soundOn: 'Audio: Enabled',
    soundOff: 'Audio: Muted',
    footerRights: 'The Eternal Push · Free Web Game · Dedicated to Albert Camus & All Relentless Pushers',
    privacyModalTitle: 'Privacy & Data Integrity',
    privacyModalContent: 'This application respects your autonomy. We do not store personal identifiable information, nor do we require an account. Game scores and preferences are saved exclusively in your browser’s localStorage. Advertising components (when active) operate according to standard network compliance without forced clicks or deceptive interactions.',
    closeBtn: 'Close'
  },
  fr: {
    siteTitle: 'The Eternal Push',
    heroKicker: 'Un jeu web absurde inspiré d’Albert Camus',
    heroH1: 'Pousse le rocher. Vois combien de temps tu tiens.',
    heroSub: 'Sans inscription. Sans progrès durable. Juste toi, le granit et la gravité. Si tu cesses de pousser, le rocher retombe à zéro.',
    pushAction: 'POUSSER',
    pushInstructionDesktop: 'Maintiens ESPACE ou Clique & Maintiens pour Pousser',
    pushInstructionMobile: 'Appuie & Maintiens pour Pousser',
    gameStatusIdle: 'Prêt au pied de la montagne',
    gameStatusPushing: 'Effort vers les hauteurs...',
    gameStatusSlipping: 'Ça glisse ! Reprends la poussée !',
    gameStatusCrashed: 'La gravité a repris ses droits.',
    gameStatusDescending: 'La marche lucide de retour...',
    descentTitle: 'La Marche de Descente',
    descentSubtitle: '« C’est pendant ce retour, cette pause, que Sisyphe m’intéresse. » — Albert Camus',
    descentAction: 'DESCENDRE D’UN PAS LOURD',
    skipDescentBtn: 'Passer au bilan',
    cairnPassed: 'Cairn de mémoire franchi',
    biomeLabel: 'Biome d’Altitude',
    statDistance: 'Distance',
    statAltitude: 'Altitude',
    statTime: 'Endurance',
    statPushes: 'Poussées',
    statBest: 'Record Personnel',
    statTotalAllTime: 'Ascension Totale Cumulée',
    slipWarning: 'TOLÉRANCE EN CHUTE',
    gameOverTitle: 'Le Rocher Retombe à Zéro',
    gameOverSubtitle: 'Une autre descente accomplie sans ressentiment.',
    newRecordAlert: '★ NOUVEAU RECORD PERSONNEL ★',
    tryAgainBtn: 'Retrouver le Rocher',
    shareScoreBtn: 'Partager ton Effort',
    shareCardBtn: 'Générer le Certificat Gravé',
    copiedToast: 'Texte du score copié dans le presse-papier !',
    adNotice: 'Espace Publicitaire · Annonce clairement identifiée',
    adDisclaimer: 'Emplacement conforme Adsterra. Aucun clic forcé, zéro décalage de mise en page (CLS ≤ 0,1).',

    navGame: 'La Montagne',
    navHowToPlay: 'Comment Jouer',
    navMyth: 'Le Mythe',
    navWhy: 'Pourquoi ce Jeu',
    navChecklist: 'Checklist de Lancement',
    navMonetization: 'Modèle Économique',
    navCodex: 'Codex de la Montagne',
    downloadAction: 'Télécharger',
    installAppAction: 'Installer l\'App',

    // Game Modes
    modeAbsurdTitle: 'L\'Absurde (Classique)',
    modeAbsurdDesc: 'Poussée manuelle. La gravité réclame la pierre dès l\'arrêt.',
    modeZenTitle: 'Méditation Stoïcienne (Zen)',
    modeZenDesc: 'Marche paisible et contemplative. Pas de chute, juste le sentier et la musique.',

    howToPlayTitle: 'Règles et Commandes de l’Absurde',
    howToPlayRule1Title: 'Effort Continu',
    howToPlayRule1Desc: 'Maintiens la barre d’espace, clique avec la souris ou maintiens le bouton tactile sur mobile. Chaque poussée fait grimper le rocher sur la pente de granit à 26°.',
    howToPlayRule2Title: 'Fenêtre de Tolérance',
    howToPlayRule2Desc: 'Quand tu relâches la commande, tu bénéficies d’un court sursis (~0,9 s). Si aucune action n’est détectée à temps, le rocher commence à glisser en arrière.',
    howToPlayRule3Title: 'La Chute Inévitable',
    howToPlayRule3Desc: 'Si le rocher glisse trop loin, Sisyphe perd pied. La pierre dévale la montagne jusqu’à 0 mètre. Le jeu ne comporte aucun écran de victoire finale.',
    howToPlayRule4Title: 'Sans Compte, Sauvegarde Locale',
    howToPlayRule4Desc: 'Ton record, tes mètres parcourus et tes options sonores sont conservés en toute sécurité dans le localStorage de ton navigateur. Zéro traceur intrusif.',

    mythTitle: 'Le Mythe de Sisyphe',
    mythLead: 'Du châtiment homérique au triomphe de la conscience selon Albert Camus.',
    mythP1: 'Dans la mythologie grecque, Sisyphe, fondateur et roi de Corinthe, défia la mort et trompa les dieux. Son châtiment aux Enfers : faire rouler un énorme rocher jusqu’au sommet d’une montagne, pour le voir immanquablement redescendre dès qu’il touchait au but.',
    mythP2: 'En 1942, dans son essai fondamental *Le Mythe de Sisyphe*, Albert Camus renverse la perspective. Loin d’être une tragédie désespérée, le retour de Sisyphe vers la plaine devient le moment le plus noble de la condition humaine : la pleine conscience de l’absurde.',
    mythCamusQuote: '« La lutte elle-même vers les sommets suffit à remplir un cœur d’homme. Il faut imaginer Sisyphe heureux. »',
    mythP3: 'En acceptant la futilité du rocher, Sisyphe domine son destin. Sa pierre est sa chose. Ce jeu web traduit cette réflexion en code interactif : une expérience immédiate, sans ligne d’arrivée, où la beauté réside dans la répétition.',

    whyTitle: 'Pourquoi ce Jeu Existe',
    whyLead: 'Un antidote satirique aux notifications perpétuelles, aux faux pass de combat et aux boucles de dopamine.',
    whyP1: 'Les jeux et applications modernes capturent notre attention par des barres de progression trompeuses, des récompenses quotidiennes et l’illusion permanente qu’un « dernier niveau » apportera la paix.',
    whyP2: 'The Eternal Push propose l’exact inverse. Il annonce d’emblée la règle : il n’y a pas de niveau 100, pas de boîte surprise, et le rocher retombera à chaque fois.',
    whyP3: 'Cette franchise offre une respiration numérique rare : jouer pour la seule sensation du geste, contempler la silhouette de la montagne et rire de notre propre persévérance.',

    faqTitle: 'Foire Aux Questions',
    faqQ1: 'Peut-on réellement atteindre le sommet ?',
    faqA1: 'Non. La pente est mathématiquement infinie. Si tu pousses sur 10 kilomètres, la montagne continue. Le sommet n’est pas une destination mais un horizon poétique.',
    faqQ2: 'Changer d’onglet fait-il chuter le rocher ?',
    faqA2: 'Non. Lorsque l’onglet perd le focus ou que l’écran se verrouille, le moteur met automatiquement le jeu en pause pour éviter une défaite injuste ou un score artificiel.',
    faqQ3: 'Comment fonctionne la publicité sans nuire au jeu ?',
    faqA3: 'La publicité n’apparaît que sur l’écran de fin de partie dans une zone réservée à taille fixe (évitant tout décalage CLS). Jamais d’interruption pendant la poussée, ni de faux bouton « Recommencer ».',
    faqQ4: 'Mes données personnelles sont-elles collectées ?',
    faqA4: 'Aucune donnée personnelle n’est demandée ni transmise. Tout est stocké localement sur ton appareil via localStorage.',

    checklistTitle: 'Checklist de Contrôle avant Publication',
    checklistSubtitle: '17 vérifications indispensables pour un jeu web absurde, rapide, international et rentable.',
    checklistProgress: 'Progression de la Checklist',
    checklistReset: 'Réinitialiser la Checklist',
    checklistCopied: 'Checklist copiée dans le presse-papier !',
    checklistCopyBtn: 'Copier la Checklist en Markdown',

    monetizationTitle: 'Modèle Économique & Réseau Adsterra',
    monetizationSubtitle: 'Associer revenu effectif par session et respect total du joueur.',
    monetizationCalcTitle: 'Simulateur de Revenu par Session',
    monetizationFormula: 'Revenu par 1 000 sessions = (Revenu total / Sessions) × 1 000',
    monetizationSessionsLabel: 'Sessions par jour',
    monetizationGamesPerSessionLabel: 'Parties par session',
    monetizationCpmLabel: 'eCPM effectif ($)',
    monetizationFillLabel: 'Taux de remplissage (%)',
    monetizationDailyRevenue: 'Revenu journalier estimé',
    monetizationMonthlyRevenue: 'Revenu sur 30 jours',
    monetizationRpm: 'Revenu effectif / 1 000 sessions',
    monetizationAdsterraTitle: 'Bonnes pratiques d’intégration',
    monetizationAdsterraDesc: 'Privilégier un format bannière stable (300x250 ou 728x90) affiché dynamiquement à la défaite sans rechargement abusif d’URL. Veiller à un trafic 100% humain, sans clics incités ni tromperie.',

    soundToggle: 'Effets Sonores',
    soundOn: 'Son : Activé',
    soundOff: 'Son : Muet',
    footerRights: 'The Eternal Push · Jeu Web Indépendant · Dédié à Albert Camus et à tous les pousseurs infatigables',
    privacyModalTitle: 'Confidentialité et Données Locales',
    privacyModalContent: 'Cette application respecte votre vie privée. Aucun compte n’est requis. Les scores, statistiques et réglages sont stockés uniquement dans le localStorage de votre navigateur. Les espaces publicitaires respectent les exigences de non-interférence visuelle et de non-incitation.',
    closeBtn: 'Fermer'
  }
};

/**
 * Returns dynamic absurdist philosophical reflections tailored to the player's final performance
 */
export function getAbsurdRemark(distance: number, time: number, lang: Language): string {
  if (lang === 'fr') {
    if (distance < 15) {
      return "Une tentative brève. Le rocher a peine senti tes mains, mais le néant est déjà satisfait.";
    } else if (distance < 45) {
      return "Une modeste illusion d'élan vers l'avant. La montagne n'a même pas frémi.";
    } else if (distance < 100) {
      return "Tes jointures ont saigné pour une pure abstraction numérique. Bravo.";
    } else if (distance < 200) {
      return "Zeus regarde depuis l'Olympe en bâillant avec distinction. Le rocher est de retour au bas de la pente.";
    } else if (distance < 350) {
      return "La pente se raidissait, l'absurde mûrissait. Tu as presque cru à une fin.";
    } else if (distance < 550) {
      return "Albert Camus esquisse un sourire discret dans la brume. Il faut t'imaginer heureux.";
    } else {
      return `Un monument d'obstination (${Math.round(distance)} m en ${Math.round(time)} s). Le sommet était un mirage, mais ton geste était magnifique.`;
    }
  } else {
    if (distance < 15) {
      return "A fleeting skirmish. The boulder barely registered your palms, yet nothingness is appeased.";
    } else if (distance < 45) {
      return "A modest illusion of forward momentum. The mountain did not even flinch.";
    } else if (distance < 100) {
      return "Your knuckles bled for a fleeting mathematical abstraction. Well pushed.";
    } else if (distance < 200) {
      return "Zeus observes from Mount Olympus, yawning with aristocratic detachment.";
    } else if (distance < 350) {
      return "The slope steepened, absurdity ripened. For a second, you almost believed in a summit.";
    } else if (distance < 550) {
      return "Albert Camus nods softly in the misty distance. One must imagine you joyful.";
    } else {
      return `A colossal monument to sheer stubbornness (${Math.round(distance)} m in ${Math.round(time)} s). The peak was an illusion, but your effort was sublime.`;
    }
  }
}
