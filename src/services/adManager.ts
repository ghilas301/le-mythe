/**
 * Ad Manager Service
 * Gère l'activation et la configuration des scripts publicitaires Adsterra
 * (Bannière 300x250, Social Bar, Popunder & Direct Link).
 */

export interface AdSettings {
  enabled: boolean;
  bannerZoneKey: string;
  socialBarScriptUrl: string;
  popunderScriptUrl: string;
  directLinkUrl: string;
  showDemoWhenBlocked: boolean;
}

const STORAGE_KEY = 'eternal_push_ad_settings';

export const DEFAULT_AD_SETTINGS: AdSettings = {
  enabled: true,
  // Clés Adsterra par défaut du projet
  bannerZoneKey: '1aefaa036598d0510220613bcd476ee3',
  socialBarScriptUrl: 'https://insensitiveshoweraudible.com/1a/ef/aa/1aefaa036598d0510220613bcd476ee3.js',
  popunderScriptUrl: 'https://insensitiveshoweraudible.com/f5/4a/e8/f54ae823a1aef1eeba2a8e2e4442148c.js',
  directLinkUrl: '',
  showDemoWhenBlocked: true,
};

export function getAdSettings(): AdSettings {
  if (typeof window === 'undefined') return DEFAULT_AD_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_AD_SETTINGS, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_AD_SETTINGS;
}

export function saveAdSettings(settings: Partial<AdSettings>): AdSettings {
  const current = getAdSettings();
  const updated: AdSettings = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return updated;
}

let isSocialBarInjected = false;

/**
 * Active les scripts publicitaires au moment de perdre la partie.
 * Injecte la Social Bar et le Popunder selon les paramètres configurés.
 */
export function triggerGameOverAds(): void {
  if (typeof document === 'undefined') return;

  const settings = getAdSettings();
  if (!settings.enabled) return;

  try {
    const targetParent = document.body || document.head;
    if (!targetParent) return;

    // 1. Injection de la Social Bar Adsterra
    if (settings.socialBarScriptUrl && settings.socialBarScriptUrl.trim()) {
      const cleanUrl = settings.socialBarScriptUrl.trim();
      const existingSocial = document.querySelector(`script[src="${cleanUrl}"]`);
      if (!existingSocial) {
        const socialScript = document.createElement('script');
        socialScript.type = 'text/javascript';
        socialScript.src = cleanUrl;
        socialScript.async = true;
        socialScript.dataset.adFormat = 'social-bar';
        socialScript.onerror = () => {
          console.warn('[AdManager] Erreur chargement Social Bar (bloqueur de pub ou domaine inactif).');
        };
        targetParent.appendChild(socialScript);
        isSocialBarInjected = true;
      }
    }

    // 2. Injection du Popunder Adsterra
    if (settings.popunderScriptUrl && settings.popunderScriptUrl.trim()) {
      const cleanPopUrl = settings.popunderScriptUrl.trim();
      const existingPop = document.querySelector(`script[src="${cleanPopUrl}"]`);
      if (existingPop) {
        existingPop.remove();
      }

      const popScript = document.createElement('script');
      popScript.type = 'text/javascript';
      popScript.src = cleanPopUrl;
      popScript.async = true;
      popScript.dataset.adFormat = 'popunder';
      popScript.onerror = () => {
        console.warn('[AdManager] Erreur chargement Popunder (bloqueur de pub ou domaine inactif).');
      };
      targetParent.appendChild(popScript);
    }
  } catch (error) {
    console.warn('[AdManager] Erreur lors de l’activation des publicités :', error);
  }
}

/**
 * Déclencheur supplémentaire lors du clic sur Recommencer
 */
export function triggerRestartAds(): void {
  triggerGameOverAds();
}
