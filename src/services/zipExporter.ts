import JSZip from 'jszip';

// Code and asset templates to bundle into the downloadable ZIP
const README_MD = `# The Eternal Push – Sisyphus Game (Jeu de Sisyphe)

Un jeu web absurde, rapide, international et rentable inspiré du mythe de Sisyphe et de la philosophie d'Albert Camus (*Le Mythe de Sisyphe*, 1942).

## 🚀 Démarrage Rapide en Local

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn ou pnpm

### Installation & Lancement
\`\`\`bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement local
npm run dev
\`\`\`
Ouvrez ensuite votre navigateur sur **http://localhost:3000** (ou le port affiché).

### Build de Production
\`\`\`bash
npm run build
\`\`\`
Le dossier statique optimisé sera généré dans \`dist/\`.

## 🌐 Déploiement en 1 Clic (Gratuit)

### Sur Vercel :
\`\`\`bash
npx vercel
\`\`\`

### Sur Netlify :
\`\`\`bash
npx netlify deploy --prod
\`\`\`

### Sur GitHub Pages :
Vous pouvez déployer directement le dossier \`dist/\` généré après \`npm run build\`.

## 💰 Intégration Publicitaire (Adsterra)
1. Créez un compte éditeur sur [Adsterra](https://adsterra.com).
2. Créez un emplacement de bannière (300x250 ou 728x90).
3. Insérez votre script dans le conteneur réservé de l'écran de fin de partie (\`src/components/GameOverModal.tsx\`).
4. La zone est pré-dimensionnée pour garantir un score de stabilité visuelle **CLS ≤ 0,1**.

## 📱 PWA & Mode Hors-ligne
L'application inclut un \`manifest.json\` et un Service Worker (\`sw.js\`). Une fois installée sur mobile ou ordinateur, elle fonctionne 100% hors-ligne sans connexion internet.
`;

const PACKAGE_JSON_STRING = `{
  "name": "the-eternal-push-sisyphus-game",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "jszip": "^3.10.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "tailwindcss": "^4.3.3",
    "vite": "^8.3.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "typescript": "^7.0.2"
  }
}`;

const VITE_CONFIG_STRING = `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000
  }
});
`;

const TSCONFIG_STRING = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "noEmit": true
  }
}`;

const VERCEL_CONFIG_STRING = `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

/**
 * Downloads the entire project as a clean, ready-to-use ZIP file.
 */
export async function downloadProjectZip(onProgress?: (percent: number) => void): Promise<void> {
  const zip = new JSZip();

  // Root configuration files
  zip.file('README.md', README_MD);
  zip.file('package.json', PACKAGE_JSON_STRING);
  zip.file('vite.config.ts', VITE_CONFIG_STRING);
  zip.file('tsconfig.json', TSCONFIG_STRING);
  zip.file('vercel.json', VERCEL_CONFIG_STRING);

  // Fetch current page index.html
  try {
    const indexHtmlRes = await fetch('/index.html');
    if (indexHtmlRes.ok) {
      zip.file('index.html', await indexHtmlRes.text());
    }
  } catch {
    // fallback
  }

  // Public files
  const publicFolder = zip.folder('public')!;
  try {
    const [manifestRes, swRes, robotsRes, sitemapRes, iconRes] = await Promise.all([
      fetch('/manifest.json').then((r) => r.text()).catch(() => ''),
      fetch('/sw.js').then((r) => r.text()).catch(() => ''),
      fetch('/robots.txt').then((r) => r.text()).catch(() => ''),
      fetch('/sitemap.xml').then((r) => r.text()).catch(() => ''),
      fetch('/icon.svg').then((r) => r.text()).catch(() => '')
    ]);

    if (manifestRes) publicFolder.file('manifest.json', manifestRes);
    if (swRes) publicFolder.file('sw.js', swRes);
    if (robotsRes) publicFolder.file('robots.txt', robotsRes);
    if (sitemapRes) publicFolder.file('sitemap.xml', sitemapRes);
    if (iconRes) publicFolder.file('icon.svg', iconRes);
  } catch {
    // ignore
  }

  // Generate the ZIP blob
  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(metadata.percent);
    }
  });

  // Trigger download in browser
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = 'the-eternal-push-sisyphus-game.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
