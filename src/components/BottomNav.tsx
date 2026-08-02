import React from 'react';
import {
  Home,
  FileSpreadsheet,
  Bot,
  Settings,
  User,
  ShieldAlert,
} from 'lucide-react';
import { TabType } from './Header';
import { LocalUser } from './AuthModal';
import { DemonicAvatar } from './DemonicAvatar';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenDonations?: () => void;
  onOpenPWA?: () => void;
  onOpenAddCandidate?: () => void;
  onOpenLanding?: () => void;
  currentUser: LocalUser | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
  onOpenProfile,
  currentUser,
}) => {
  const handleTabClick = (tab: TabType) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomeActive = activeTab === 'directory';
  const isHansardActive = activeTab === 'finance-bills';
  const isAIActive = activeTab === 'ai-assistant';
  const isEvidenceActive = activeTab === 'evidence';

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-2 border-neutral-900 dark:border-neutral-700 shadow-[0_12px_36px_rgba(0,0,0,0.4)] rounded-2xl px-2 py-1.5 transition-all">
      <div className="grid grid-cols-5 gap-1 text-center font-black uppercase text-[10px] tracking-tight items-center">
        {/* 1. HANSARD (LEFT 1) */}
        <button
          type="button"
          onClick={() => handleTabClick('finance-bills')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            isHansardActive
              ? 'text-white bg-red-600 shadow-sm font-black'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title="Hansard MP Voting Records"
        >
          <FileSpreadsheet className={`w-5 h-5 mb-0.5 ${isHansardActive ? 'stroke-[2.5px]' : ''}`} />
          <span>Hansard</span>
        </button>

        {/* 2. CIVIC AI (LEFT 2) */}
        <button
          type="button"
          onClick={() => handleTabClick('ai-assistant')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            isAIActive
              ? 'text-white bg-red-600 shadow-sm font-black'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title="Civic AI Advisor"
        >
          <Bot className={`w-5 h-5 mb-0.5 ${isAIActive ? 'stroke-[2.5px]' : ''}`} />
          <span>Civic AI</span>
        </button>

        {/* 3. HOME (EXACT MIDDLE) */}
        <button
          type="button"
          onClick={() => handleTabClick('directory')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
            isHomeActive
              ? 'text-white bg-red-600 shadow-md scale-105 font-black ring-2 ring-red-400'
              : 'text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-red-600'
          }`}
          title="Home Directory"
        >
          <Home className={`w-5 h-5 mb-0.5 ${isHomeActive ? 'stroke-[2.5px]' : ''}`} />
          <span className="font-black">Home</span>
        </button>

        {/* 4. SETTINGS */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          title="App Settings"
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span>Settings</span>
        </button>

        {/* 5. PROFILE (FAR RIGHT) */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          title={currentUser ? `Account Profile (${currentUser.username})` : 'Sign In / Register Profile'}
        >
          {currentUser ? (
            <div className="mb-0.5">
              <DemonicAvatar seed={currentUser.id} name={currentUser.username} size="xs" />
            </div>
          ) : (
            <User className="w-5 h-5 mb-0.5 text-neutral-600 dark:text-neutral-400" />
          )}
          <span className="truncate max-w-[55px]">
            {currentUser ? currentUser.username : 'Profile'}
          </span>
        </button>
      </div>
    </div>
  );
};
