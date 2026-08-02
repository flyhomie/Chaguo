import React, { useState, useEffect } from 'react';
import { X, Download, Zap, Smartphone, ExternalLink, HardDrive, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface PWAPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: any) => void;
}

export const PWAPromptModal: React.FC<PWAPromptModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Check if running inside an iframe (AI Studio preview environment)
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isInIframe) {
      // If inside iframe, open in new tab so browser can prompt PWA install
      window.open(window.location.href, '_blank');
    } else {
      alert(
        'To install Chaguo 2027 as a Native Mobile/Desktop App:\n\n🤖 Android (Chrome/Edge): Tap the 3 dots menu top-right ➔ select "Install App" or "Add to Home Screen".\n\n📱 iOS (iPhone/iPad Safari): Tap the Share button (bottom bar) ➔ select "Add to Home Screen".'
      );
    }
  };

  const handleOpenInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  const handleExportDataBackup = () => {
    try {
      const candidates = localStorage.getItem('chaguo_candidates') || '[]';
      const evidence = localStorage.getItem('chaguo_evidence_reports') || '[]';
      const payload = JSON.stringify(
        {
          appName: 'Chaguo 2027 Civic Guide',
          version: '1.0.0-offline',
          timestamp: new Date().toISOString(),
          candidates: JSON.parse(candidates),
          evidence: JSON.parse(evidence),
        },
        null,
        2
      );

      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chaguo-2027-civic-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to export data backup.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative my-8 w-full max-w-xl bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 p-6 space-y-5 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 text-white rounded-lg">
              <Download className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                Install Mobile & Desktop App (PWA)
              </h3>
              <p className="text-[10px] font-bold text-neutral-500 uppercase">
                Zero App Store Needed • 100% Offline Capable • Native Android & iOS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 text-white hover:bg-red-600 transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice about PWA vs raw APK */}
        <div className="p-3.5 bg-amber-500/10 border-2 border-amber-500/40 rounded-xl text-xs space-y-1.5 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-black uppercase">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>How to Install on Android & iOS</span>
          </div>
          <p className="text-[11px] leading-relaxed font-semibold">
            Chaguo 2027 uses <strong>PWA (Progressive Web App / WebAPK)</strong> technology. On Android Chrome & Edge, adding to Home Screen creates a real native Android app (WebAPK) directly on your device without needing an unverified APK download file!
          </p>
        </div>

        {/* App Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Install PWA App */}
          <div className="p-4 bg-neutral-900 text-white border-2 border-neutral-900 rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-500" />
                  <span className="font-black text-xs uppercase">Install App (PWA)</span>
                </div>
                {isInstalled && (
                  <span className="px-1.5 py-0.5 bg-green-600 text-white font-black text-[9px] uppercase rounded">
                    INSTALLED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-300 font-bold uppercase leading-relaxed">
                Install directly on Android, iPhone, iPad, or Desktop. Works completely offline!
              </p>
            </div>

            <button
              onClick={handleInstallPWA}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-red-500 shadow-md rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalled ? 'APP INSTALLED' : 'Install PWA App'}</span>
            </button>
          </div>

          {/* 2. Open in New Tab (Needed for IFrame) */}
          <div className="p-4 bg-neutral-900 text-white border-2 border-neutral-900 rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-emerald-400" />
                  <span className="font-black text-xs uppercase">Open Full Tab</span>
                </div>
                <span className="px-1.5 py-0.5 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[9px] font-black uppercase rounded">
                  FOR PREVIEW IFRAME
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 font-bold uppercase leading-relaxed">
                Required inside AI Studio preview to allow Android/iOS to trigger native app installation prompts.
              </p>
            </div>

            <button
              onClick={handleOpenInNewTab}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-emerald-500 shadow-md rounded-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open App in New Tab</span>
            </button>
          </div>
        </div>

        {/* Data Backup Option */}
        <div className="p-3.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <span className="font-black text-xs uppercase block text-neutral-900 dark:text-neutral-100">
                Civic Data Backup (.json)
              </span>
              <span className="text-[10px] text-neutral-500 font-semibold block">
                Export all candidates & evidence reports for offline viewing
              </span>
            </div>
          </div>
          <button
            onClick={handleExportDataBackup}
            className="px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-black text-[10px] uppercase rounded-lg hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors flex items-center gap-1 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Detailed Installation Guide */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl space-y-2 text-xs font-bold uppercase">
          <h4 className="font-black text-xs uppercase text-neutral-500 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-red-600" />
            <span>Mobile Device Instructions:</span>
          </h4>
          <div className="space-y-2 text-[11px] normal-case font-semibold text-neutral-700 dark:text-neutral-300">
            <div className="p-2 bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700">
              <strong className="text-emerald-600 dark:text-emerald-400 font-black">🤖 Android Phones & Tablets (Chrome / Edge / Brave):</strong>
              <p className="mt-0.5">1. Open Chaguo 2027 in Chrome/Edge.</p>
              <p>2. Tap the <strong>3 dots menu (⋮)</strong> at the top right.</p>
              <p>3. Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</p>
              <p>4. Android will automatically package and install the WebAPK on your phone!</p>
            </div>

            <div className="p-2 bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700">
              <strong className="text-blue-600 dark:text-blue-400 font-black">📱 iPhones & iPads (Safari):</strong>
              <p className="mt-0.5">1. Open Chaguo 2027 in Safari.</p>
              <p>2. Tap the <strong>Share button</strong> (square with arrow pointing up).</p>
              <p>3. Scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

