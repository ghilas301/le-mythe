/**
 * Ad Manager Service
 * Gère l'activation des scripts publicitaires (Social Bar & Popunder)
 * spécifiquement au moment de perdre la partie (Game Over / Chute).
 * 
 * Règles :
 * - Aucun script publicitaire n'est injecté au chargement initial pour garantir un chargement rapide.
 * - Dès que le joueur perd la partie (chute du rocher / Game Over), les scripts
 *   sont immédiatement activés et attachés au DOM.
 */

const SOCIAL_BAR_SCRIPT_SRC = 'https://insensitiveshoweraudible.com/1a/ef/aa/1aefaa036598d0510220613bcd476ee3.js';
const POPUNDER_SCRIPT_SRC = 'https://insensitiveshoweraudible.com/f5/4a/e8/f54ae823a1aef1eeba2a8e2e4442148c.js';

let isSocialBarInjected = false;
let isPopunderInjected = false;

/**
 * Active les scripts publicitaires au moment de perdre la partie.
 * Injecte la Social Bar et le Popunder pour qu'ils s'activent dès l'écran de défaite.
 */
export function triggerGameOverAds(): void {
  if (typeof document === 'undefined') return;

  try {
    const targetParent = document.body || document.head;
    if (!targetParent) return;

    // 1. Injection de la Social Bar
    const existingSocial = document.querySelector(`script[src="${SOCIAL_BAR_SCRIPT_SRC}"]`);
    if (!existingSocial) {
      const socialScript = document.createElement('script');
      socialScript.type = 'text/javascript';
      socialScript.src = SOCIAL_BAR_SCRIPT_SRC;
      socialScript.async = true;
      socialScript.dataset.adFormat = 'social-bar';
      targetParent.appendChild(socialScript);
      isSocialBarInjected = true;
    }

    // 2. Injection du Popunder
    // On réinitialise si nécessaire pour capter les interactions sur l'écran de fin de partie
    const existingPop = document.querySelector(`script[src="${POPUNDER_SCRIPT_SRC}"]`);
    if (existingPop) {
      existingPop.remove();
    }

    const popScript = document.createElement('script');
    popScript.type = 'text/javascript';
    popScript.src = POPUNDER_SCRIPT_SRC;
    popScript.async = true;
    popScript.dataset.adFormat = 'popunder';
    targetParent.appendChild(popScript);
    isPopunderInjected = true;
  } catch (error) {
    console.warn('[AdManager] Erreur lors de l’activation de la publicité de défaite :', error);
  }
}

/**
 * Déclencheur supplémentaire lors du clic sur Recommencer
 */
export function triggerRestartAds(): void {
  triggerGameOverAds();
}
