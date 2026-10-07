import React from 'react';
import {
  X,
  ShieldCheck,
  LogIn,
  UserPlus,
  ChevronRight,
  Vote,
  KeyRound,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  isOpen,
  onClose,
  onOpenSignIn,
  onOpenSignUp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative my-auto w-full max-w-xl bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-neutral-900 dark:text-neutral-100 p-6 sm:p-8 space-y-6 rounded-3xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-600 dark:hover:bg-red-600 text-neutral-700 dark:text-neutral-300 hover:text-white transition-colors rounded-xl border border-neutral-300 dark:border-neutral-700"
          title="Close / Guest Mode"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HERO WORDMARK: "chaguo." IN KENYAN FLAG COLORS */}
        <div className="pt-4 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-600/10 text-red-600 dark:text-red-400 rounded-full border border-red-500/30 text-[11px] font-black uppercase tracking-widest">
            <Vote className="w-4 h-4 text-red-600" />
            <span>Kenya 2027 Voter Accountability Docket</span>
          </div>

          {/* CHAGUO WORDMARK IN KENYAN FLAG COLORS */}
          <div className="py-2">
            <h1 className="text-6xl sm:text-7xl font-black tracking-tighter uppercase font-mono drop-shadow-md select-none flex items-center justify-center">
              <span className="text-black dark:text-white">ch</span>
              <span className="text-red-600">ag</span>
              <span className="text-emerald-600">uo</span>
              <span className="text-red-600 animate-pulse">.</span>
            </h1>

            {/* KENYAN FLAG 5-STRIPE ACCENT RIBBON */}
            <div className="w-48 sm:w-64 mx-auto h-2.5 mt-3 rounded-full overflow-hidden flex border border-neutral-900 shadow-inner">
              <div className="h-full w-[30%] bg-black" />
              <div className="h-full w-[5%] bg-white" />
              <div className="h-full w-[30%] bg-red-600" />
              <div className="h-full w-[5%] bg-white" />
              <div className="h-full w-[30%] bg-emerald-600" />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-bold max-w-md mx-auto leading-relaxed">
            The civic voter intelligence platform exposing Parliamentary votes, tenderpreneur money trails, and integrity reports across all Kenya 2027 leaders.
          </p>
        </div>

        {/* AUTHENTICATION ACTION CARDS */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* SIGN IN OPTION */}
            <button
              onClick={() => {
                onClose();
                onOpenSignIn();
              }}
              className="p-4 bg-red-600 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex flex-col items-center justify-center gap-2 border-2 border-red-600 hover:border-neutral-900 group"
            >
              <div className="p-2 bg-white/20 rounded-xl group-hover:bg-red-600 transition-colors">
                <LogIn className="w-5 h-5" />
              </div>
              <span className="text-sm">Sign In</span>
              <span className="text-[10px] font-medium text-red-100 group-hover:text-neutral-300">
                Via 4-Digit PIN or Email
              </span>
            </button>

            {/* SIGN UP OPTION */}
            <button
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              className="p-4 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-900 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex flex-col items-center justify-center gap-2 border-2 border-neutral-900 dark:border-neutral-100 group"
            >
              <div className="p-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-sm">Create Account</span>
              <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-600">
                Email Validation or Quick PIN
              </span>
            </button>
          </div>

          {/* GUEST MODE */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-black text-xs uppercase tracking-wider rounded-xl transition-all border border-neutral-300 dark:border-neutral-700 flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Proceed to Chaguo Portal as Guest</span>
            <ChevronRight className="w-4 h-4 text-red-600" />
          </button>
        </div>

        {/* PERSISTENT STORAGE & FEATURES FOOTER */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[10px] font-bold uppercase text-neutral-500 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Persistent Local Storage
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <KeyRound className="w-3.5 h-3.5" /> 4-Digit Fast PIN & Email Validation
          </span>
        </div>
      </motion.div>
    </div>
  );
};
