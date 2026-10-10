# The Eternal Push – Sisyphus Game (Jeu de Sisyphe)

Un jeu web absurde, rapide, international et rentable inspiré du mythe de Sisyphe et de la philosophie d'Albert Camus (*Le Mythe de Sisyphe*, 1942).

---

## 🐙 Comment Publier le Jeu sur GitHub ?

### Étape 1 : Créer un nouveau dépôt sur GitHub
1. Connectez-vous sur votre compte [GitHub](https://github.com).
2. Cliquez sur le bouton vert **« New »** (ou rendez-vous sur [github.com/new](https://github.com/new)).
3. Nommez votre projet, par exemple : `the-eternal-push` ou `sisyphus-game`.
4. Laissez le dépôt en **Public** (recommandé) ou **Private**.
5. Ne cochez **pas** « Add a README file » (le projet a déjà le sien).
6. Cliquez sur **« Create repository »**.

---

### Étape 2 : Envoyer le code depuis votre terminal
Dans le dossier du projet décompressé, ouvrez votre terminal et exécutez ces 5 commandes :

\`\`\`bash
# 1. Initialiser le dépôt git local
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Créer le premier commit
git commit -m "Initial commit: The Eternal Push (Sisyphus Game)"

# 4. Définir la branche principale
git branch -M main

# 5. Lier à votre dépôt GitHub distant
git remote add origin https://github.com/ghilas301/sisyphus.git

# 6. Envoyer le code sur GitHub
git push -u origin main
\`\`\`

Votre code est maintenant sauvegardé sur GitHub !

---

### Étape 3 : Déployer en ligne en 1 Clic depuis GitHub

Une fois sur GitHub, la mise en ligne est automatique et gratuite :

#### Option Vercel (Recommandé - 30 secondes) :
1. Allez sur [Vercel](https://vercel.com) et connectez-vous avec votre compte GitHub.
2. Cliquez sur **« Add New... »** -> **« Project »**.
3. Sélectionnez votre dépôt GitHub `the-eternal-push`.
4. Cliquez sur **« Deploy »** sans rien changer.
5. Votre jeu est en ligne avec HTTPS ! Chaque fois que vous ferez un `git push`, Vercel mettra à jour le jeu automatiquement.

---

## 🎯 Comment Publier le Jeu sur Google ?

Il y a deux manières de « publier sur Google » selon votre objectif :

### Option A : Publier sur le Moteur de Recherche Google (Google Search)
Pour que n'importe qui tapant « Sisyphus Game » ou « Jeu de Sisyphe » trouve votre jeu :

1. **Mettre le site en ligne (Hébergement Gratuit) :**
   - Créez un compte gratuit sur [Vercel](https://vercel.com) ou [Netlify](https://netlify.com).
   - Glissez-déposez le dossier du projet ou connectez votre dépôt GitHub.
   - Vous obtiendrez immédiatement une URL en HTTPS (ex: `https://the-eternal-push.vercel.app` ou votre propre nom de domaine).

2. **Inscrire le site sur Google Search Console :**
   - Rendez-vous sur [Google Search Console](https://search.google.com/search-console).
   - Cliquez sur **Ajouter une propriété** et entrez l'URL de votre site.
   - Validez la propriété (via balise HTML ou DNS).

3. **Soumettre le Plan de Site (Sitemap) :**
   - Dans le menu de gauche, cliquez sur **Sitemaps**.
   - Entrez `sitemap.xml` (le fichier est déjà inclus dans votre projet à `/sitemap.xml`).
   - Cliquez sur **Envoyer**.

4. **Demander l'indexation immédiate :**
   - Dans la barre de recherche en haut, collez l'URL de votre page d'accueil.
   - Cliquez sur **Demander une indexation**.
   - Les robots Google visiteront la page en 24h à 72h.

---

### Option B : Publier sur le Google Play Store (Application Android)
Comme le jeu est une **Progressive Web App (PWA)** complète, vous pouvez le publier sur le Play Store sans réécrire une ligne de code Java/Kotlin :

1. Mettez votre site en ligne sur une URL HTTPS (ex: sur Vercel ou votre domaine).
2. Rendez-vous sur [PWABuilder](https://www.pwabuilder.com) (outil officiel gratuit recommandé par Google).
3. Entrez l'URL de votre jeu. PWABuilder vérifiera que votre `manifest.json`, vos icônes et votre `sw.js` sont valides (ils sont déjà configurés !).
4. Cliquez sur **Package for Stores** -> **Android (Google Play)**.
5. Téléchargez le fichier `.aab` (Android App Bundle).
6. Ouvrez votre compte [Google Play Console](https://play.google.com/console), créez une nouvelle application et téléversez le fichier `.aab`.

---

## 💻 Démarrage Local

\`\`\`bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Compiler pour la production
npm run build
\`\`\`

---

## 💰 Intégration Publicitaire (Adsterra)
1. Créez un compte éditeur sur [Adsterra](https://adsterra.com).
2. Ajoutez votre nom de domaine.
3. Choisissez le format bannière **300x250** ou **728x90**.
4. Insérez votre code d'annonce dans l'espace réservé de l'écran de fin de partie (\`src/components/GameOverModal.tsx\`).
