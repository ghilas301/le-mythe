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

### Moteur Sonore Procédural Spectral (`src/services/audio.ts`)
- **Auteur** : Moteur sonore original synthétisé via l'API Web Audio native du navigateur
- **Licence** : Apache License 2.0
- **Composition des timbres** :
  - **Vent de haute montagne** : Bruit blanc généré par buffer de convolution avec filtre passe-bande résonant asservi à l'altitude réelle.
  - **Friction minérale & craquements** : Double oscillateur triangulaire basse fréquence couplé à des impulsions stochastiques de gravier.
  - **Nappe harmonique Dm/Bb/F/Am** : Synthèse additive soustractive multi-oscillateurs avec dérive de phase analogique lente.
  - **Respiration & pulsation cardiaque** : Filtres formants modulés par l'état d'effort et d'épuisement de Sisyphe.
- **Conformité** : Zéro dépendance à des banques de sons tierces restreintes ou protégées par copyright. Fonctionnement 100% autonome et hors-ligne.

---

## 4. Icônes

### Lucide React
- **Projet** : [Lucide Icons](https://lucide.dev/)
- **Licence** : [ISC License](https://github.com/lucide-icons/lucide/blob/main/LICENSE)
- **Droits conférés** : Utilisation, copie, modification et distribution libres avec mention de licence.
