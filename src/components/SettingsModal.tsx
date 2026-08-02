import React, { useState } from 'react';
import { X, Settings, Sun, Moon, Database, Trash2, ShieldCheck, CheckCircle2, Smartphone, Monitor, Cloud } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dim' | 'dark';
  onToggleTheme: (newTheme?: 'light' | 'dim' | 'dark') => void;
  viewportMode?: 'auto' | 'desktop' | 'mobile';
  onToggleViewportMode?: (mode: 'auto' | 'desktop' | 'mobile') => void;
  onOpenDrive?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  viewportMode = 'auto',
  onToggleViewportMode,
  onOpenDrive,
}) => {
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClearLocalData = () => {
    if (confirm('Are you sure you want to reset all locally added candidates and authentication data on this device?')) {
      localStorage.removeItem('chaguo_candidates');
      localStorage.removeItem('chaguo_registered_users');
      localStorage.removeItem('chaguo_current_user');
      localStorage.removeItem('chaguo_evidence_reports');
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Calculate local storage size
  let itemsCount = 0;
  try {
    const candStr = localStorage.getItem('chaguo_candidates');
    if (candStr) itemsCount += JSON.parse(candStr).length;
  } catch (e) {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-black uppercase tracking-tight">App Settings & Data</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs font-bold uppercase">
          {/* Appearance Section */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-3">
            <h4 className="font-black text-sm uppercase">Visual Theme</h4>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onToggleTheme('light')}
                className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border transition-colors ${
                  theme === 'light'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>LIGHT</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleTheme('dim')}
                className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border transition-colors ${
                  theme === 'dim'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-slate-400" />
                <span>DIM (SLATE)</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleTheme('dark')}
                className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border transition-colors ${
                  theme === 'dark'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>DARK (OLED)</span>
              </button>
            </div>
          </div>

          {/* Device & Layout Viewport Toggle */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm uppercase flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-red-600" />
                <span>Layout Viewport Mode</span>
              </h4>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                {viewportMode.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-semibold normal-case">
              Force a simulated Smartphone frame or Desktop widescreen layout on any screen size.
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onToggleViewportMode?.('auto')}
                className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border transition-colors ${
                  viewportMode === 'auto'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>AUTO</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleViewportMode?.('desktop')}
                className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border transition-colors ${
                  viewportMode === 'desktop'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>DESKTOP</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleViewportMode?.('mobile')}
                className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border transition-colors ${
                  viewportMode === 'mobile'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>MOBILE</span>
              </button>
            </div>
          </div>

          {/* Typography */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-2">
            <h4 className="font-black text-sm uppercase">Typography & Display</h4>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">System Font:</span>
              <span className="font-black text-red-600 dark:text-red-400">Proxima Nova</span>
            </div>
            <p className="text-[10px] text-neutral-500 normal-case">
              All text, candidate cards, and legal dossiers render in Proxima Nova / Plus Jakarta Sans font stack.
            </p>
          </div>

          {/* Google Drive Integration */}
          {onOpenDrive && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-600 dark:border-blue-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm uppercase flex items-center gap-2 text-blue-900 dark:text-blue-300">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span>Google Drive Cloud Sync</span>
                </h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-600 text-white rounded">
                  Connected
                </span>
              </div>
              <p className="text-[10px] text-neutral-600 dark:text-neutral-300 font-semibold normal-case">
                Sync citizen reports, voter guide backups, and evidence attachments to your personal Google Drive account.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDrive();
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase transition-colors flex items-center justify-center gap-2 rounded shadow-xs"
              >
                <Cloud className="w-4 h-4" />
                <span>OPEN GOOGLE DRIVE MANAGER</span>
              </button>
            </div>
          )}

          {/* Local Data Storage */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-3">
            <h4 className="font-black text-sm uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-red-600" />
              <span>Local Device Storage</span>
            </h4>
            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
              <span>Saved Custom Records:</span>
              <span className="font-black">{itemsCount} Items</span>
            </div>

            {resetSuccess && (
              <div className="p-2 bg-green-100 dark:bg-green-950 border border-green-600 text-green-800 dark:text-green-200 text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span>Local data cleared! Reloading application...</span>
              </div>
            )}

            <button
              onClick={handleClearLocalData}
              className="w-full py-2.5 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border-2 border-red-600 font-black text-xs uppercase transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>RESET LOCAL DEVICE DATA</span>
            </button>
          </div>

          {/* Local Security & Privacy Guarantee */}
          <div className="p-3 bg-neutral-900 text-white border-2 border-neutral-900 text-[11px] font-bold space-y-1">
            <div className="flex items-center gap-1.5 text-green-400 font-black">
              <ShieldCheck className="w-4 h-4" />
              <span>100% PRIVATE LOCAL STORAGE</span>
            </div>
            <p className="text-neutral-400 normal-case">
              No cloud tracking or remote databases. All user sign-ins, evidence uploads, candidate dossiers, and ballot bookmarks remain saved exclusively on your local browser device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
