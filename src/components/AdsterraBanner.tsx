import React, { useState, useEffect, useRef } from 'react';
import { getAdSettings, AdSettings } from '../services/adManager';
import { Settings, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { AdsterraConfigModal } from './AdsterraConfigModal';

interface AdsterraBannerProps {
  className?: string;
  onOpenConfig?: () => void;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ className = '' }) => {
  const [settings, setSettings] = useState<AdSettings>(() => getAdSettings());
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [adBlocked, setAdBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync settings when modal updates
  const refreshSettings = () => {
    setSettings(getAdSettings());
  };

  const zoneKey = settings.bannerZoneKey?.trim() || '1aefaa036598d0510220613bcd476ee3';

  // Construct isolated HTML for the 300x250 Adsterra banner
  const bannerSrcDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
</head>
<body>
  <div id="ad-container" style="width: 300px; height: 250px; display: flex; align-items: center; justify-content: center;">
    <script type="text/javascript">
      atOptions = {
        'key' : '${zoneKey}',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="//www.highperformanceformat.com/${zoneKey}/invoke.js" onerror="window.parent.postMessage('adsterra-blocked', '*');"></script>
  </div>
</body>
</html>`;

  // Listen for blocked messages from inside the iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'adsterra-blocked') {
        setAdBlocked(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Check if an adblocker might be active by creating a test element with ad classes
  useEffect(() => {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox ad-placement pub_300x250';
    testAd.style.position = 'absolute';
    testAd.style.left = '-9999px';
    document.body.appendChild(testAd);
    setTimeout(() => {
      if (testAd.offsetHeight === 0 || testAd.offsetParent === null) {
        setAdBlocked(true);
      }
      testAd.remove();
    }, 100);
  }, []);

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      
      {/* Top Banner Bar with Settings Shortcut */}
      <div className="flex items-center justify-between text-[10px] text-[#8C8171] uppercase tracking-wider font-mono px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Emplacement Publicitaire 300×250 (Adsterra)
        </span>
        <button
          type="button"
          onClick={() => setIsConfigOpen(true)}
          className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer lowercase hover:underline"
          title="Modifier votre clé de zone Adsterra"
        >
          <Settings className="w-3 h-3" />
          <span>configurer pub</span>
        </button>
      </div>

      {/* Main Container 300x250 strictly dimensioned (CLS = 0) */}
      <div className="w-full min-h-[250px] max-h-[260px] rounded-xl bg-[#0E0D0B] border border-[#2F281F] flex items-center justify-center relative overflow-hidden shadow-inner">
        
        {settings.enabled ? (
          <>
            {/* Real Adsterra Iframe */}
            <iframe
              ref={iframeRef}
              title="Adsterra 300x250 Banner"
              srcDoc={bannerSrcDoc}
              className="w-[300px] h-[250px] border-0 mx-auto"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              scrolling="no"
            />

            {/* Adblocker Warning Overlay if blocked */}
            {adBlocked && (
              <div className="absolute inset-0 bg-[#141210]/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10 animate-fade-in">
                <ShieldAlert className="w-6 h-6 text-amber-500 mb-1.5" />
                <span className="text-xs font-bold font-cinzel text-amber-300">
                  Bloqueur de publicité détecté
                </span>
                <p className="text-[11px] text-[#A39886] max-w-xs mt-1 leading-snug">
                  Votre navigateur ou extension (Adblock, Brave) bloque les requêtes publicitaires Adsterra.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setAdBlocked(false)}
                    className="px-3 py-1 rounded bg-[#27221A] hover:bg-[#342D23] text-[10px] font-mono text-[#D4C8B8] border border-[#443B2F] cursor-pointer"
                  >
                    Masquer l'alerte
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfigOpen(true)}
                    className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-[10px] font-cinzel font-bold text-white cursor-pointer"
                  >
                    Changer de clé
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* When ads are manually toggled off in settings */
          <div className="flex flex-col items-center justify-center p-4 text-center gap-2 text-[#7F7464]">
            <span className="text-xs font-cinzel uppercase tracking-widest text-[#9C8F7E]">
              Publicités Désactivées
            </span>
            <p className="text-[11px] max-w-xs">
              Les publicités Adsterra sont temporairement coupées dans vos réglages.
            </p>
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="mt-1 px-3 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white font-cinzel text-xs font-bold cursor-pointer"
            >
              Réactiver les publicités
            </button>
          </div>
        )}

      </div>

      <div className="flex items-center justify-between text-[9px] text-[#696052] px-1 font-mono">
        <span>Zone Key: {zoneKey.substring(0, 10)}...</span>
        <span>Adsterra HighPerformanceFormat</span>
      </div>

      {/* Configuration Modal */}
      <AdsterraConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSaved={refreshSettings}
      />
    </div>
  );
};
