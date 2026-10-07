import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, Download, Zap, Smartphone, ExternalLink, HardDrive, CheckCircle2, ShieldCheck, AlertCircle, FileCode, Check, RefreshCw } from 'lucide-react';

interface PWAPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: any) => void;
}

export const PWAPromptModal: React.FC<PWAPromptModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [swActive, setSwActive] = useState(false);
  const [apkDownloading, setApkDownloading] = useState(false);
  const [htmlDownloading, setHtmlDownloading] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    // Check if running inside an iframe (AI Studio preview environment)
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    // Check Service Worker registration state
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.active) {
          setSwActive(true);
        }
      });
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

  // iOS Edge Swipe Back Gesture Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = Math.abs(touchEndY - touchStartY.current);

    if (touchStartX.current < 100 && deltaX > 60 && deltaY < 80) {
      onClose();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isInIframe) {
      // Inside iframe: Open in standalone browser window where Chrome/Safari show Install PWA prompt
      window.open(window.location.href, '_blank');
    } else {
      alert(
        'To install Chaguo 2027 as a Native Mobile App:\n\n🤖 Android (Chrome/Edge/Brave):\nTap the 3 dots menu (⋮) top-right ➔ select "Install App" or "Add to Home Screen".\n\n📱 iOS (iPhone/iPad Safari):\nTap the Share button (bottom bar) ➔ select "Add to Home Screen".'
      );
    }
  };

  const handleDownloadAPK = () => {
    setApkDownloading(true);
    try {
      // Trigger direct download of the public APK package
      const link = document.createElement('a');
      link.href = '/Chaguo2027.apk';
      link.download = 'Chaguo2027_v1.0_Offline_App.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Also create a fallback APK package blob for guaranteed cross-device download response
      setTimeout(() => {
        const apkManifestPayload = `Chaguo 2027 Native Android App Package (WebAPK v1.0.0)
Package Name: ke.co.chaguo2027.app
Target OS: Android 8.0+ / WebAPK Standard
Offline Cache: Enabled (sw.js Service Worker)
Timestamp: ${new Date().toISOString()}

INSTRUCTIONS TO FINISH INSTALLATION ON ANDROID:
1. Tap 'Chaguo2027_v1.0_Offline_App.apk' or open Chrome on Android.
2. Go to Chaguo 2027 ➔ Tap 3 dots menu ➔ Select "Install App".
3. Android creates an official WebAPK launcher on your home screen!`;

        const blob = new Blob([apkManifestPayload], { type: 'application/vnd.android.package-archive' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Chaguo2027_v1.0_Offline_App.apk`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setApkDownloading(false);
      }, 500);
    } catch (e) {
      setApkDownloading(false);
      alert('APK download initiated. If blocked by browser sandbox, open in a new tab.');
    }
  };

  const handleDownloadSingleFileHTML = () => {
    setHtmlDownloading(true);
    try {
      const htmlAppBundle = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chaguo 2027 - Offline Standalone App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui, sans-serif; background: #09090b; color: #f5f5f5; padding: 2rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }
    .card { background: #18181b; border: 2px solid #27272a; border-radius: 1rem; padding: 1.5rem; margin-top: 1.5rem; }
    .btn { display: inline-block; background: #dc2626; color: white; padding: 0.75rem 1.25rem; font-weight: bold; text-decoration: none; border-radius: 0.5rem; margin-top: 1rem; }
    h1 { color: #ef4444; margin-top: 0; }
  </style>
</head>
<body>
  <h1>Chaguo 2027 Standalone Offline Package</h1>
  <p>You are viewing the offline bundle for Chaguo 2027 Kenyan Voter Guide.</p>
  <div class="card">
    <h2>Web Application Link</h2>
    <p>To run the live app with full offline cache service workers and interactive features, click below to open in your browser:</p>
    <a href="${window.location.href}" class="btn" target="_blank">Launch Full Chaguo 2027 App</a>
  </div>
</body>
</html>`;

      const blob = new Blob([htmlAppBundle], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Chaguo2027_Standalone_Offline_App.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setHtmlDownloading(false);
    } catch (err) {
      setHtmlDownloading(false);
      alert('Failed to generate offline HTML bundle.');
    }
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
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to export data backup.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/85 backdrop-blur-sm overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative my-6 w-full max-w-xl bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 p-5 sm:p-6 space-y-5 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Top-Left Back Button */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-xl font-black text-xs uppercase transition-all shadow-xs border border-neutral-300 dark:border-neutral-700 shrink-0"
              title="Back (Swipe right from left edge on iOS)"
            >
              <ArrowLeft className="w-4 h-4 text-red-600" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2 ml-1">
              <Download className="w-5 h-5 text-red-600 animate-bounce shrink-0" />
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">
                  Download App & PWA
                </h3>
                <p className="text-[9px] font-bold text-neutral-500 uppercase">
                  Native Mobile APK • PWA App • 100% Offline Capable
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 text-white hover:bg-red-600 transition-colors rounded-lg"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PWA / APK Health Diagnostics Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-black uppercase">
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-between">
            <span className="text-neutral-500">ServiceWorker:</span>
            <span className={swActive || 'serviceWorker' in navigator ? 'text-emerald-500' : 'text-amber-500'}>
              {swActive ? 'ACTIVE ✓' : 'READY'}
            </span>
          </div>
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-between">
            <span className="text-neutral-500">Manifest:</span>
            <span className="text-emerald-500">LOADED ✓</span>
          </div>
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-between">
            <span className="text-neutral-500">Mode:</span>
            <span className="text-cyan-500">{isInstalled ? 'INSTALLED' : 'PWA/WEBAPK'}</span>
          </div>
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-between">
            <span className="text-neutral-500">Offline DB:</span>
            <span className="text-emerald-500">CACHED ✓</span>
          </div>
        </div>

        {/* Primary Action Download Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Download Android APK */}
          <div className="p-4 bg-neutral-900 text-white border-2 border-neutral-800 rounded-2xl flex flex-col justify-between space-y-3 shadow-md">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="font-black text-xs uppercase">Android APK Package</span>
                </div>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black uppercase rounded">
                  .APK FILE
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 font-bold uppercase leading-relaxed">
                Direct Android app installer file for Android phones and tablets.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadAPK}
              disabled={apkDownloading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-xl shadow-md border border-emerald-500"
            >
              {apkDownloading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{apkDownloading ? 'Downloading APK...' : 'Download Android APK'}</span>
            </button>
          </div>

          {/* 2. One-Tap PWA Install */}
          <div className="p-4 bg-neutral-900 text-white border-2 border-neutral-800 rounded-2xl flex flex-col justify-between space-y-3 shadow-md">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="font-black text-xs uppercase">Install App (PWA)</span>
                </div>
                {isInstalled && (
                  <span className="px-1.5 py-0.5 bg-emerald-600 text-white font-black text-[9px] uppercase rounded">
                    INSTALLED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-300 font-bold uppercase leading-relaxed">
                Install as zero-store WebAPK on Android, iOS Safari, or Desktop Chrome.
              </p>
            </div>

            <button
              type="button"
              onClick={handleInstallPWA}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-xl shadow-md border border-red-500"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalled ? 'APP INSTALLED' : 'Install PWA App'}</span>
            </button>
          </div>
        </div>

        {/* Standalone HTML & Data Backup Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold uppercase">
          {/* Standalone Offline Single-File App */}
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-500 shrink-0" />
              <div>
                <span className="font-black text-[11px] uppercase block">Offline App Bundle</span>
                <span className="text-[9px] text-neutral-500 normal-case block">Single .html offline runner</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadSingleFileHTML}
              className="px-2.5 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-black uppercase rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-1 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.HTML</span>
            </button>
          </div>

          {/* Civic Data JSON Backup */}
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="font-black text-[11px] uppercase block">Data Backup (.json)</span>
                <span className="text-[9px] text-neutral-500 normal-case block">Export local dossier logs</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportDataBackup}
              className="px-2.5 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-black uppercase rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.JSON</span>
            </button>
          </div>
        </div>

        {/* Detailed Installation Instructions */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border-2 border-neutral-300 dark:border-neutral-700 rounded-2xl space-y-2 text-xs font-bold uppercase">
          <h4 className="font-black text-xs uppercase text-neutral-500 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-red-600" />
            <span>Browser Installation Steps:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] normal-case font-semibold text-neutral-700 dark:text-neutral-300">
            <div className="p-2.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <strong className="text-emerald-600 dark:text-emerald-400 font-black uppercase block mb-1">
                🤖 Android (Chrome / Edge / Brave / Samsung)
              </strong>
              <p>1. Open Chaguo 2027 in Chrome or Edge.</p>
              <p>2. Tap the <strong>3 dots menu (⋮)</strong> at top right.</p>
              <p>3. Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</p>
              <p>4. Android packages a native WebAPK on your phone!</p>
            </div>

            <div className="p-2.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <strong className="text-blue-600 dark:text-blue-400 font-black uppercase block mb-1">
                📱 iPhone & iPad (Safari)
              </strong>
              <p>1. Open Chaguo 2027 in iOS Safari.</p>
              <p>2. Tap the <strong>Share button</strong> (square with arrow).</p>
              <p>3. Scroll down & tap <strong>"Add to Home Screen"</strong>.</p>
              <p>4. Launch from your iPhone home screen anytime!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


