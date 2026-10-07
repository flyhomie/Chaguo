import React from 'react';
import { Search, Filter, Sparkles, BookOpen, ShieldCheck, Layers, UserCheck, Sun, Moon, Award, Upload, UserPlus, LogIn, Download, PlusCircle, Scale, DollarSign, Globe, Monitor, Smartphone, Laptop } from 'lucide-react';
import { LocalUser } from './AuthModal';
import { DemonicAvatar } from './DemonicAvatar';
import { useLanguage } from '../context/LanguageContext';

export type TabType = 'directory' | 'good-leaders' | 'evidence' | 'finance-bills' | 'compare' | 'ai-assistant' | 'education' | 'my-ballot' | 'money-trail';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  savedCount: number;
  theme: 'light' | 'dim' | 'dark';
  onToggleTheme: () => void;
  deviceMode?: 'auto' | 'desktop' | 'mobile';
  onToggleDeviceMode?: () => void;
  currentUser: LocalUser | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenAddCandidate: () => void;
  onOpenAddEvidence?: () => void;
  onOpenOwnerPanel?: () => void;
  onOpenPWA?: () => void;
  onOpenLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  savedCount,
  theme,
  onToggleTheme,
  deviceMode = 'auto',
  onToggleDeviceMode,
  currentUser,
  onOpenAuth,
  onOpenAddCandidate,
  onOpenAddEvidence,
  onOpenOwnerPanel,
  onOpenPWA,
  onOpenLanding,
}) => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-700 shadow-sm transition-colors">
      {/* Symmetrical Main Top Bar */}
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Wing: Brand Logo & Quick Action */}
        <div className="flex items-center justify-start gap-3 shrink-0">
          <div 
            onClick={() => setActiveTab('directory')}
            className="flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <div className="text-xl sm:text-2xl font-black tracking-tighter uppercase leading-none text-neutral-900 dark:text-white">
              CHAGUO<span className="text-red-600">.</span>
            </div>
            <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm hidden xs:inline-block">
              2027
            </span>
          </div>

          <button
            onClick={onOpenAddCandidate}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-md text-[10px] font-black uppercase transition-colors shrink-0"
            title="Add New Leader to Database"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Leader</span>
          </button>
        </div>

        {/* Right Wing: Balanced Action Controls */}
        <div className="flex items-center justify-end gap-1.5 shrink-0">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-black uppercase transition-colors flex items-center gap-1"
            title="Badilisha Lugha / Switch Language (English / Kiswahili)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'en' ? 'ENG' : 'SW'}</span>
          </button>

          {/* Welcome Landing & Vote Animation Button */}
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 border border-amber-600 rounded-md shadow-xs"
              title="Watch Vote Animation & Welcome Portal"
            >
              <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
              <span className="hidden lg:inline">Portal</span>
            </button>
          )}

          {/* User Account / Sign In Sign Up Button */}
          <button
            onClick={() => onOpenAuth(currentUser ? 'signin' : 'signin')}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 border rounded-md ${
              currentUser
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 hover:border-red-600'
                : 'bg-red-600 hover:bg-neutral-900 text-white border-red-700'
            }`}
            title={currentUser ? `Signed in as ${currentUser.username}` : `${t.signIn} / ${t.signUp}`}
          >
            {currentUser ? (
              <>
                <DemonicAvatar seed={currentUser.id} name={currentUser.username} size="xs" />
                <span className="hidden md:inline">{currentUser.username}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t.signIn}</span>
              </>
            )}
          </button>

          {/* Download App (PWA & APK) Button */}
          <button
            onClick={onOpenPWA}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-wider hover:bg-red-600 dark:hover:bg-red-600 transition-colors flex items-center gap-1 border border-neutral-800 dark:border-neutral-700 rounded-md"
            title="Download Mobile & Desktop App (PWA & Android APK)"
          >
            <Download className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="hidden md:inline">{t.installApp}</span>
          </button>

          {/* Device View Mode Toggle Button (Desktop / Mobile / Auto) */}
          {onToggleDeviceMode && (
            <button
              onClick={onToggleDeviceMode}
              className={`px-2.5 py-1.5 border rounded-md text-[10px] font-black uppercase transition-all flex items-center gap-1.5 shadow-xs ${
                deviceMode === 'desktop'
                  ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/40 hover:bg-blue-600/20'
                  : deviceMode === 'mobile'
                  ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400 border-purple-500/40 hover:bg-purple-600/20'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 hover:border-red-600'
              }`}
              title={`Current View Mode: ${deviceMode.toUpperCase()}. Click to switch between Auto Responsive, Desktop, and Mobile modes.`}
            >
              {deviceMode === 'desktop' ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">DESKTOP</span>
                </>
              ) : deviceMode === 'mobile' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="hidden sm:inline">MOBILE</span>
                </>
              ) : (
                <>
                  <Laptop className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="hidden sm:inline">AUTO</span>
                </>
              )}
            </button>
          )}

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            className="px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded-md text-[10px] font-black uppercase hover:border-red-600 dark:hover:border-red-500 transition-colors flex items-center gap-1.5 shadow-xs"
            aria-label="Toggle Light and Dark Mode"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="hidden sm:inline">DARK</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline">LIGHT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Symmetrical Centered Nav Tabs */}
      <div className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <nav className="flex items-center justify-start md:justify-center gap-1 sm:gap-1.5 overflow-x-auto py-1.5 scrollbar-none text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                activeTab === 'directory'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>{t.directory}</span>
            </button>

            <button
              onClick={() => setActiveTab('good-leaders')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                activeTab === 'good-leaders'
                  ? 'border-green-600 text-green-600 dark:text-green-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3 h-3 text-green-600" />
              <span>{t.goodLeaders} 🌟</span>
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                activeTab === 'evidence'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3 h-3 text-red-600" />
              <span>{t.evidence} 📁</span>
            </button>

            <button
              onClick={() => setActiveTab('finance-bills')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                activeTab === 'finance-bills'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3 text-red-600" />
              <span>{t.financeBills}</span>
            </button>

            <button
              onClick={() => setActiveTab('money-trail')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                activeTab === 'money-trail'
                  ? 'border-red-600 text-red-600 dark:text-red-400 bg-red-500/10'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <DollarSign className="w-3 h-3 text-emerald-500" />
              <span>{t.moneyTrail} 💵</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                activeTab === 'compare'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{t.compare}</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                activeTab === 'ai-assistant'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-red-600" />
              <span>{t.aiAssistant}</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                activeTab === 'education'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>{t.education}</span>
            </button>

            <button
              onClick={() => setActiveTab('my-ballot')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 rounded-xs ${
                activeTab === 'my-ballot'
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-transparent bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-neutral-800'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>{t.myBallot}</span>
              {savedCount > 0 && (
                <span className="ml-1 bg-white text-neutral-900 font-black text-[9px] px-1 py-0.2 rounded-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {onOpenOwnerPanel && (
              <button
                onClick={onOpenOwnerPanel}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 rounded-xs bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black shadow-xs"
                title="Owner & Admin Control Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-950" />
                <span>Owner Panel 👑</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
