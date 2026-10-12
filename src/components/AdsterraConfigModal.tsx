import React, { useState } from 'react';
import { getAdSettings, saveAdSettings, AdSettings } from '../services/adManager';
import { X, Save, AlertCircle, Check, HelpCircle, ExternalLink, Sparkles } from 'lucide-react';

interface AdsterraConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const AdsterraConfigModal: React.FC<AdsterraConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [settings, setSettings] = useState<AdSettings>(() => getAdSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdSettings(settings);
    setSavedSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#171513] border border-[#3E362C] p-6 shadow-2xl text-[#E8E2D8] flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2C2720]">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Configuration Publicités Adsterra
            </h3>
            <p className="text-xs text-[#9E9484] mt-0.5">
              Gérez vos codes de zones et scripts publicitaires en direct
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9E9484] hover:text-white hover:bg-[#25221D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
          
          {/* Activation switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#201D19] border border-[#2F2922]">
            <div className="flex flex-col">
              <span className="font-semibold text-white">Activer les publicités</span>
              <span className="text-[11px] text-[#A69C8D]">Déclenche les bannières, Social Bar et Popunder</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#383228] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Banner Zone Key */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#D4C8B8]">
                Clé de Zone Bannière 300×250 (Zone Key) :
              </label>
              <a
                href="https://adsterra.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
              >
                Dashboard Adsterra <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="text"
              value={settings.bannerZoneKey}
              onChange={(e) => setSettings({ ...settings, bannerZoneKey: e.target.value.trim() })}
              placeholder="ex: 1aefaa036598d0510220613bcd476ee3"
              className="w-full px-3 py-2 rounded-lg bg-[#0F0E0C] border border-[#3A3329] focus:border-amber-500 focus:outline-none font-mono text-amber-200 text-xs"
            />
            <span className="text-[10px] text-[#8C8171]">
              Dans Adsterra : <em>Websites → Get Code (Banner 300×250)</em>. C'est la chaîne alphanumérique dans <code>'key' : '...'</code>.
            </span>
          </div>

          {/* Social Bar URL */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#D4C8B8]">
              URL du Script Social Bar :
            </label>
            <input
              type="url"
              value={settings.socialBarScriptUrl}
              onChange={(e) => setSettings({ ...settings, socialBarScriptUrl: e.target.value.trim() })}
              placeholder="https://.../script.js"
              className="w-full px-3 py-2 rounded-lg bg-[#0F0E0C] border border-[#3A3329] focus:border-amber-500 focus:outline-none font-mono text-amber-200 text-xs"
            />
            <span className="text-[10px] text-[#8C8171]">
              URL du script <em>Social Bar</em> fourni par Adsterra pour votre domaine.
            </span>
          </div>

          {/* Popunder URL */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#D4C8B8]">
              URL du Script Popunder :
            </label>
            <input
              type="url"
              value={settings.popunderScriptUrl}
              onChange={(e) => setSettings({ ...settings, popunderScriptUrl: e.target.value.trim() })}
              placeholder="https://.../popunder.js"
              className="w-full px-3 py-2 rounded-lg bg-[#0F0E0C] border border-[#3A3329] focus:border-amber-500 focus:outline-none font-mono text-amber-200 text-xs"
            />
          </div>

          {/* Tips Box */}
          <div className="p-3 rounded-xl bg-[#1C1814] border border-[#3A3024] flex gap-2.5 items-start">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#B8AD9E] leading-relaxed">
              <strong className="text-white">Pourquoi une pub ne s'affiche pas ?</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#9C9080]">
                <li>Un <strong>bloqueur de pub</strong> (Adblock/Brave) bloque la requête réseau.</li>
                <li>Votre nom de domaine doit être <strong>Approuvé</strong> dans votre compte Adsterra.</li>
                <li>Les scripts Adsterra renouvellent périodiquement leurs domaines anti-adblock : mettez à jour l'URL avec le code frais de votre tableau de bord.</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C2720]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#B3A795] hover:bg-[#25211B] transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-xs font-cinzel font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Enregistré !</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer & Appliquer</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
