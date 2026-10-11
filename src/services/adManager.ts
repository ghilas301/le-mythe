/**
 * Ad Manager Service
 * Handles conditional delayed loading of Social Bar and Popunder ad scripts.
 * 
 * Rules:
 * - NO ad scripts loaded on initial page visit / landing.
 * - Scripts are injected exclusively when the player finishes a game (loses)
 *   and clicks "Recommencer" (restart).
 */

const SOCIAL_BAR_SCRIPT_SRC = 'https://insensitiveshoweraudible.com/1a/ef/aa/1aefaa036598d0510220613bcd476ee3.js';
const POPUNDER_SCRIPT_SRC = 'https://insensitiveshoweraudible.com/f5/4a/e8/f54ae823a1aef1eeba2a8e2e4442148c.js';

let isSocialBarInjected = false;
let isPopunderInjected = false;

/**
 * Injects Social Bar and Popunder scripts into the DOM when restarting the game.
 * Must be triggered directly by the user's "Recommencer" click action.
 */
export function triggerRestartAds(): void {
  if (typeof document === 'undefined') return;

  try {
    // 1. Inject Social Bar if not already present
    if (!isSocialBarInjected && !document.querySelector(`script[src="${SOCIAL_BAR_SCRIPT_SRC}"]`)) {
      const socialScript = document.createElement('script');
      socialScript.type = 'text/javascript';
      socialScript.src = SOCIAL_BAR_SCRIPT_SRC;
      socialScript.async = true;
      socialScript.dataset.adFormat = 'social-bar';
      document.body.appendChild(socialScript);
      isSocialBarInjected = true;
    }

    // 2. Inject Popunder
    // For popunder scripts, we ensure the script is attached during the user interaction.
    // If it was already injected, re-inserting can refresh the trigger state for subsequent runs.
    const existingPop = document.querySelector(`script[src="${POPUNDER_SCRIPT_SRC}"]`);
    if (existingPop) {
      existingPop.remove();
    }

    const popScript = document.createElement('script');
    popScript.type = 'text/javascript';
    popScript.src = POPUNDER_SCRIPT_SRC;
    popScript.async = true;
    popScript.dataset.adFormat = 'popunder';
    document.body.appendChild(popScript);
    isPopunderInjected = true;
  } catch (error) {
    console.warn('[AdManager] Error activating restart ads:', error);
  }
}
