# Registre des Ressources & Licences — Le Mythe de Sisyphe

Ce document inventorie l'ensemble des ressources externes, typographies et architectures sonores utilisées dans l'application, en conformité avec les exigences de traçabilité légale et de licences libres.

---

## 1. Typographies

### Cinzel
- **Auteur / Fonderie** : Natanael Gama
- **Source officielle** : [Google Fonts - Cinzel](https://fonts.google.com/specimen/Cinzel)
- **Licence** : [SIL Open Font License, Version 1.1 (OFL-1.1)](https://openfontlicense.org/)
- **Usage dans l'application** : Titres monumentaux, chiffres romains, gravure lapidaire des jalons de distance.
- **Droits conférés** : Utilisation commerciale et non commerciale libre, modification autorisée, redistribution autorisée sous la même licence.

### Newsreader
- **Auteur / Fonderie** : Production Type (Florian Runge, Lucas Sharp)
- **Source officielle** : [Google Fonts - Newsreader](https://fonts.google.com/specimen/Newsreader)
- **Licence** : [SIL Open Font License, Version 1.1 (OFL-1.1)](https://openfontlicense.org/)
- **Usage dans l'application** : Typographie littéraire pour les monologues intérieurs de Sisyphe, les citations d'Albert Camus et le contenu philosophique.
- **Droits conférés** : Libre pour tout usage commercial ou personnel.

### Plus Jakarta Sans
- **Auteur / Fonderie** : Tokotype (Ghaith Cahyadi)
- **Source officielle** : [Google Fonts - Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Licence** : [SIL Open Font License, Version 1.1 (OFL-1.1)](https://openfontlicense.org/)
- **Usage dans l'application** : Interface utilisateur, métriques en temps réel, commandes et navigation.
- **Droits conférés** : Libre d'utilisation commerciale et personnelle.

---

## 2. Conception Visuelle & Graphique

### Moteur de Rendu Vectoriel & Estampe (Procédural Canvas 2D)
- **Auteur** : Original développé pour *Le Mythe de Sisyphe*
- **Licence** : Apache License 2.0
- **Technique** : Algorithmes vectoriels mathématiques simulant l'eau-forte, le grain du papier vergé, la brume volumétrique, la physique de silhouette et les particules de roche.
- **Avantages** : Zéro requête HTTP bloquante, poids nul sur le bundle, fluidité 60 FPS garantie sur mobile et desktop, adaptation instantanée à la résolution Retina (Hi-DPI).

### Illustration Gravure Historique (`sisyphus_engraving_1791642616125.jpg`)
- **Sujet** : Sisyphe et son rocher dans le style de la gravure classique / eau-forte du XIXe siècle.
- **Statut** : Œuvre graphique générée et optimisée pour le domaine public / libre d'utilisation dans le cadre du projet.

---

## 3. Conception Sonore (Web Audio API)

### Moteur Sonore & Musique de Méditation Procédurale 432 Hz (`src/services/audio.ts`)
- **Auteur** : Moteur sonore et composition méditative originale développés pour *Le Mythe de Sisyphe*
- **Licence** : Apache License 2.0 / CC0 Public Domain Dedication (100% Libre de droit, royalty-free)
- **Composition des timbres & paysage méditatif** :
  - **Musique de Méditation 432 Hz** : Nappes harmoniques pures accordées sur la fréquence de résonance 432 Hz (La de Verdi / diapason pythagoricien), enchaînements d'accords contemplatifs de sérénité (Am9, Fmaj7add9, Cmaj9, Dsus).
  - **Bols Tibétains Résonants** : Synthèse d'harmoniques inharmoniques (ratios 1.0, 2.76, 5.40, 8.93) avec battement lent et décroissance exponentielle sur 9 secondes.
  - **Carillons Zen (Koshi Chimes)** : Partiels cristallins haute fréquence (864 Hz, 1296 Hz, 2160 Hz) évoquant la brise sur les pierres de prière.
  - **Vent de haute montagne** : Bruit blanc généré par buffer de convolution avec filtre passe-bande résonant asservi à l'altitude réelle.
  - **Friction minérale & craquements** : Double oscillateur triangulaire basse fréquence couplé à des impulsions stochastiques de gravier.
  - **Respiration & pas physiques** : Filtres formants d'effort humain et impacts de semelle sur le roc.
- **Conformité légale** : Zéro dépendance à des banques de sons tierces restreintes ou protégées par copyright. Fonctionnement 100% autonome, infini, sans coupure et libre de droit.

---

## 4. Icônes

### Lucide React
- **Projet** : [Lucide Icons](https://lucide.dev/)
- **Licence** : [ISC License](https://github.com/lucide-icons/lucide/blob/main/LICENSE)
- **Droits conférés** : Utilisation, copie, modification et distribution libres avec mention de licence.
