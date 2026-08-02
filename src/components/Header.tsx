import React from 'react';
import { Search, Filter, Sparkles, BookOpen, ShieldCheck, Layers, UserCheck, Sun, Moon, Award, Upload, UserPlus, LogIn, Download, PlusCircle, Scale, Cloud } from 'lucide-react';
import { LocalUser } from './AuthModal';
import { DemonicAvatar } from './DemonicAvatar';

export type TabType = 'directory' | 'good-leaders' | 'evidence' | 'finance-bills' | 'compare' | 'ai-assistant' | 'education' | 'my-ballot';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  savedCount: number;
  theme: 'light' | 'dim' | 'dark';
  onToggleTheme: () => void;
  currentUser: LocalUser | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenAddCandidate: () => void;
  onOpenAddEvidence?: () => void;
  onOpenPWA?: () => void;
  onOpenDrive?: () => void;
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
  currentUser,
  onOpenAuth,
  onOpenAddCandidate,
  onOpenAddEvidence,
  onOpenPWA,
  onOpenDrive,
  onOpenLanding,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-700 shadow-sm transition-colors">
      {/* Sleek Minimal Main Bar */}
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('directory')}
          className="flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <div className="text-xl sm:text-2xl font-black tracking-tighter uppercase leading-none text-neutral-900 dark:text-white">
            CHAGUO<span className="text-red-600">.</span>
          </div>
          <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-xs hidden xs:inline-block">
            2027
          </span>
        </div>

        {/* Minimal Search Input */}
        <div className="flex-1 max-w-lg relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, county, crime..."
            className="w-full pl-8 pr-12 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-sm text-xs font-semibold text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-red-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Welcome Landing & Vote Animation Button */}
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 border border-amber-600 rounded-sm shadow-xs"
              title="Watch Vote Animation & Welcome Portal"
            >
              <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
              <span className="hidden lg:inline">Vote Animation</span>
            </button>
          )}

          {/* User Account / Sign In Sign Up Button */}
          <button
            onClick={() => onOpenAuth(currentUser ? 'signin' : 'signin')}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 border rounded-sm ${
              currentUser
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 hover:border-red-600'
                : 'bg-red-600 hover:bg-neutral-900 text-white border-red-700'
            }`}
            title={currentUser ? `Signed in as ${currentUser.username}` : 'Sign In / Sign Up'}
          >
            {currentUser ? (
              <>
                <DemonicAvatar seed={currentUser.id} name={currentUser.username} size="xs" />
                <span className="hidden md:inline">{currentUser.username}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Sign In / Register</span>
              </>
            )}
          </button>

          {/* Google Drive Sync Button */}
          <button
            onClick={onOpenDrive}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 border border-blue-700 rounded-sm shadow-xs"
            title="Google Drive Backup & Evidence Storage"
          >
            <Cloud className="w-3.5 h-3.5 text-blue-100" />
            <span className="hidden xl:inline">Drive</span>
          </button>

          {/* Download App (PWA & APK) Button */}
          <button
            onClick={onOpenPWA}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-wider hover:bg-red-600 dark:hover:bg-red-600 transition-colors flex items-center gap-1 border border-neutral-800 dark:border-neutral-700 rounded-sm"
            title="Download Mobile & Desktop App (PWA & Android APK)"
          >
            <Download className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="hidden md:inline">App (PWA / APK)</span>
          </button>

          {/* Theme Toggle Button (Light / Dim / Dark) */}
          <button
            onClick={onToggleTheme}
            className="px-2 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded-sm text-[10px] font-black uppercase hover:border-red-600 transition-colors flex items-center gap-1"
            aria-label="Toggle Theme"
            title={`Current theme: ${theme.toUpperCase()}. Click to cycle.`}
          >
            {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {theme === 'dim' && <Moon className="w-3.5 h-3.5 text-slate-400" />}
            {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
            <span className="hidden sm:inline">{theme}</span>
          </button>
        </div>
      </div>

      {/* Sleek Minimal Nav Tabs */}
      <div className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                activeTab === 'directory'
                  ? 'border-red-600 text-red-600 dark:text-red-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>Directory & Crime Log</span>
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
              <span>Good Leaders 🌟</span>
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
              <span>Evidence 📁</span>
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
              <span>Finance Bills</span>
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
              <span>Compare</span>
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
              <span>AI Assistant</span>
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
              <span>Voter Rights</span>
            </button>

            <button
              onClick={() => setActiveTab('my-ballot')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all ml-auto shrink-0 rounded-xs ${
                activeTab === 'my-ballot'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-neutral-800'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>My Ballot</span>
              {savedCount > 0 && (
                <span className="ml-1 bg-white text-neutral-900 font-black text-[9px] px-1 py-0.2 rounded-xs">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
