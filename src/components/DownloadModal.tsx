import React, { useState, useEffect } from 'react';
import { Translations } from '../services/i18n';
import { Language } from '../types/game';
import { downloadProjectZip } from '../services/zipExporter';
import { Download, Smartphone, Laptop, Check, Terminal, ExternalLink, X, Loader2 } from 'lucide-react';

interface DownloadModalProps {
  t: Translations;
  lang: Language;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ t, lang, onClose }) => {
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipDownloaded, setZipDownloaded] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDownloadZip = () => {
    // Instant direct download of the pre-built project ZIP from public folder
    const link = document.createElement('a');
    link.href = '/the-eternal-push.zip';
    link.download = 'the-eternal-push.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setZipDownloaded(true);
    setTimeout(() => setZipDownloaded(false), 4000);
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCmd(id);
      setTimeout(() => setCopiedCmd(null), 2000);
    } catch {
      // fallback
    }
  };

  const isFr = lang === 'fr';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#171513] border border-[#3E3529] p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2C261F]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-[#F7F3EB] flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-500" />
              {isFr ? 'Télécharger & Installer le Jeu' : 'Download & Install the Game'}
            </h2>
            <p className="text-xs text-[#9E9383] mt-0.5">
              {isFr 
                ? 'Code source complet en .ZIP ou installation native PWA sur votre appareil.' 
                : 'Full project source code in .ZIP or native PWA installation on your device.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#28231C] text-[#8C806F] hover:text-[#E8E2D8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Direct Source Code ZIP Download */}
        <div className="p-5 rounded-xl bg-[#1C1A17] border border-[#352E24] flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-600/40">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-sm font-bold text-[#F0EAE1]">
                  {isFr ? 'Télécharger le Code Source (.ZIP)' : 'Download Source Code (.ZIP)'}
                </h3>
                <p className="text-xs text-[#9E9383]">
                  {isFr 
                    ? 'Archive complète avec code React/Canvas, styles, configuration et guide de déploiement.' 
                    : 'Complete standalone archive with React/Canvas code, styles, configuration, and README.'}
                </p>
              </div>
            </div>
          </div>

          <a
            href="/the-eternal-push.zip"
            download="the-eternal-push.zip"
            onClick={() => {
              setZipDownloaded(true);
              setTimeout(() => setZipDownloaded(false), 4000);
            }}
            className="w-full mt-2 py-3 px-5 rounded-xl font-cinzel font-bold text-sm tracking-wide uppercase bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer no-underline text-center"
          >
            {zipDownloaded ? (
              <>
                <Check className="w-4 h-4 text-green-300" />
                <span>{isFr ? 'Archive téléchargée avec succès !' : 'Archive downloaded successfully!'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isFr ? 'Télécharger the-eternal-push.zip (1,2 Mo)' : 'Download the-eternal-push.zip (1.2 MB)'}</span>
              </>
            )}
          </a>
        </div>

        {/* 2. PWA Install Option */}
        <div className="p-5 rounded-xl bg-[#1C1A17] border border-[#352E24] flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#25201A] text-amber-400 border border-[#40382E]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-sm font-bold text-[#F0EAE1]">
                {isFr ? 'Installer comme Application (Mobile & PC)' : 'Install as Native App (PWA)'}
              </h3>
              <p className="text-xs text-[#9E9383]">
                {isFr 
                  ? 'Ajoutez le jeu directement sur votre écran d\'accueil pour jouer 100% hors-ligne.' 
                  : 'Add the game to your home screen or desktop to play 100% offline without network.'}
              </p>
            </div>
          </div>

          {deferredPrompt ? (
            <button
              type="button"
              onClick={handleInstallPWA}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-amber-700 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isFr ? 'Installer sur cet appareil maintenant' : 'Install on this device now'}</span>
            </button>
          ) : isInstalled ? (
            <div className="p-2.5 rounded-lg bg-green-950/40 border border-green-700/40 text-xs text-green-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>{isFr ? 'Application déjà installée sur cet appareil.' : 'Application already installed.'}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#B8ADA0] pt-1">
              <div className="p-3 rounded-lg bg-[#141210] border border-[#2B251E] flex flex-col gap-1.5">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" /> iPhone / iPad (Safari)
                </span>
                <p className="text-[11px] leading-relaxed text-[#968B7D]">
                  {isFr
                    ? '1. Appuyez sur le bouton Partager (carré avec flèche). 2. Sélectionnez « Sur l\'écran d\'accueil ».'
                    : '1. Tap Share button (square with arrow). 2. Tap "Add to Home Screen".'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#141210] border border-[#2B251E] flex flex-col gap-1.5">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5" /> Android / Chrome / Edge
                </span>
                <p className="text-[11px] leading-relaxed text-[#968B7D]">
                  {isFr
                    ? 'Cliquez sur l\'icône « Installer l\'application » dans la barre d\'adresse ou le menu du navigateur.'
                    : 'Click "Install App" in the browser address bar or menu.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Guide : Publier sur GitHub */}
        <div className="p-5 rounded-xl bg-[#1C1A17] border border-[#352E24] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2C261F]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-500" />
              <h3 className="font-cinzel text-sm font-bold text-[#F0EAE1]">
                {isFr ? '1. Publier sur GitHub' : '1. Publish on GitHub'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('git init && git add . && git commit -m "Initial commit" && git branch -M main', 'gh-cmd')}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              {copiedCmd === 'gh-cmd' ? <Check className="w-3 h-3 text-green-400" /> : null}
              {copiedCmd === 'gh-cmd' ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier les commandes' : 'Copy commands')}
            </button>
          </div>

          <div className="flex flex-col gap-2 text-xs text-[#B5AAA]">
            <p className="text-[11px] text-[#A69B8B] leading-relaxed">
              {isFr
                ? '1. Créez un dépôt sur github.com/new. 2. Dans votre terminal, exécutez :'
                : '1. Create a repository on github.com/new. 2. In your terminal, run:'}
            </p>
            <pre className="p-3 rounded-lg bg-[#0E0D0B] border border-[#2B251E] font-mono text-[11px] text-amber-200/90 overflow-x-auto leading-relaxed">
              git init{'\n'}
              git add .{'\n'}
              git commit -m "Initial commit"{'\n'}
              git branch -M main{'\n'}
              git remote add origin https://github.com/ghilas301/sisyphus.git{'\n'}
              git push -u origin main
            </pre>
          </div>
        </div>

        {/* 4. Guide : Comment publier sur Google */}
        <div className="p-5 rounded-xl bg-[#1C1A17] border border-[#352E24] flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#2C261F]">
            <ExternalLink className="w-4 h-4 text-amber-500" />
            <h3 className="font-cinzel text-sm font-bold text-[#F0EAE1]">
              {isFr ? '2. Publier ensuite sur Google' : '2. Then Publish on Google'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Option A: Google Search */}
            <div className="p-3.5 rounded-lg bg-[#141210] border border-[#2B251E] flex flex-col gap-2">
              <span className="font-bold font-cinzel text-amber-400">
                {isFr ? 'A. Sur Google Search (Recherche)' : 'A. On Google Search'}
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-[#A69B8B] leading-relaxed">
                <li>
                  <strong>{isFr ? 'Mettre en ligne :' : 'Deploy online:'}</strong>{' '}
                  {isFr ? 'Déployez gratuitement sur Vercel, Netlify ou votre domaine.' : 'Deploy on Vercel or Netlify for free.'}
                </li>
                <li>
                  <strong>Google Search Console :</strong>{' '}
                  {isFr ? 'Ajoutez votre site sur search.google.com/search-console.' : 'Add your domain to Google Search Console.'}
                </li>
                <li>
                  <strong>Sitemap :</strong>{' '}
                  {isFr ? 'Soumettez l\'URL /sitemap.xml (déjà inclus).' : 'Submit your /sitemap.xml URL.'}
                </li>
                <li>
                  <strong>Indexation :</strong>{' '}
                  {isFr ? 'Cliquez sur « Demander une indexation » (visite sous 24-72h).' : 'Click "Request Indexing" for crawlers.'}
                </li>
              </ol>
            </div>

            {/* Option B: Google Play Store */}
            <div className="p-3.5 rounded-lg bg-[#141210] border border-[#2B251E] flex flex-col gap-2">
              <span className="font-bold font-cinzel text-amber-400">
                {isFr ? 'B. Sur Google Play Store (Android)' : 'B. On Google Play Store'}
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-[#A69B8B] leading-relaxed">
                <li>
                  <strong>PWABuilder :</strong>{' '}
                  {isFr ? 'Entrez l\'URL de votre jeu sur pwabuilder.com.' : 'Enter your game URL on pwabuilder.com.'}
                </li>
                <li>
                  <strong>Package Android :</strong>{' '}
                  {isFr ? 'Cliquez sur « Package for Stores » -> Android (.aab).' : 'Generate the .aab Android App Bundle.'}
                </li>
                <li>
                  <strong>Play Console :</strong>{' '}
                  {isFr ? 'Téléversez le .aab sur play.google.com/console.' : 'Upload the .aab to Google Play Console.'}
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* 4. Local Development Quickstart */}
        <div className="p-4 rounded-xl bg-[#141210] border border-[#29241E] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-[#A89C8C]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-500" />
              {isFr ? 'Commandes après extraction du ZIP :' : 'Commands after extracting ZIP:'}
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard('npm install && npm run dev', 'cmd')}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedCmd === 'cmd' ? <Check className="w-3 h-3 text-green-400" /> : null}
              {copiedCmd === 'cmd' ? (isFr ? 'Copié' : 'Copied') : (isFr ? 'Copier' : 'Copy')}
            </button>
          </div>

          <pre className="p-3 rounded-lg bg-[#0C0B0A] border border-[#201D17] font-mono text-xs text-amber-200/90 overflow-x-auto">
            npm install{'\n'}
            npm run dev
          </pre>
        </div>

      </div>
    </div>
  );
};
