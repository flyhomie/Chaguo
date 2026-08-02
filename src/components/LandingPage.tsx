import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  LogIn,
  UserPlus,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Smartphone,
  Award,
  FileText,
  Vote,
  Sparkles,
  Stamp,
  Lock,
  BarChart3,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}

const BALLOT_CANDIDATES = [
  { id: 'integrity', name: 'Kenya 2027 Integrity & Reform Coalition', symbol: '🇰🇪', score: '98%' },
  { id: 'transparency', name: 'Anti-Corruption & Civic Docket', symbol: '🛡️', score: '94%' },
  { id: 'fiscal', name: 'Hansard Fiscal Responsibility Front', symbol: '📜', score: '91%' },
  { id: 'youth', name: 'Gen-Z Civic Youth Movement', symbol: '⚡', score: '96%' },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  isOpen,
  onClose,
  onOpenSignIn,
  onOpenSignUp,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState('integrity');
  const [animState, setAnimState] = useState<'idle' | 'stamping' | 'dropping' | 'success'>('idle');
  const [voteCount, setVoteCount] = useState(1482904);
  const [receiptId, setReceiptId] = useState('');

  const selectedCandidate = BALLOT_CANDIDATES.find((c) => c.id === selectedCandidateId) || BALLOT_CANDIDATES[0];

  // Auto-play demo animation on open
  useEffect(() => {
    if (isOpen) {
      triggerVoteCastAnimation();
    }
  }, [isOpen]);

  const triggerVoteCastAnimation = (candidateId?: string) => {
    if (candidateId) setSelectedCandidateId(candidateId);
    setAnimState('stamping');

    // Step 1: Stamp the ballot (0.6s)
    setTimeout(() => {
      setAnimState('dropping');

      // Step 2: Slide ballot into box slot (1.2s)
      setTimeout(() => {
        setAnimState('success');
        setVoteCount((prev) => prev + 1);
        setReceiptId(`KE-${Math.floor(100000 + Math.random() * 900000)}-2027`);
      }, 1200);
    }, 600);
  };

  const resetBallot = () => {
    setAnimState('idle');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative my-auto w-full max-w-2xl bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-neutral-900 dark:text-neutral-100 p-5 sm:p-7 space-y-5 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-md border border-red-700">
              <Vote className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 tracking-widest block">
                CIVIC VOTER GUIDE & ACCOUNTABILITY
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <span>Chaguo 2027 Portal</span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-black rounded-full">
                  2027 ELECTIONS
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-600 dark:hover:bg-red-600 text-neutral-700 dark:text-neutral-300 hover:text-white transition-colors rounded-xl border border-neutral-300 dark:border-neutral-700"
            title="Continue as Guest"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HERO INTERACTIVE VOTE CASTING ANIMATION SECTION */}
        <div className="bg-neutral-950 border-2 border-neutral-900 rounded-2xl p-4 sm:p-5 text-white relative overflow-hidden shadow-2xl space-y-4">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #ffffff 1px, transparent 1px), linear-gradient(to right, #333333 1px, transparent 1px)',
              backgroundSize: '24px 24px, 48px 48px',
            }}
          />

          {/* Section Header */}
          <div className="relative z-10 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/30 text-red-400 rounded-full border border-red-500/40 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Official Ballot Simulation</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-100">
              Experience Transparent Ballot Tallying
            </h3>
            <p className="text-xs text-neutral-400 font-semibold max-w-lg mx-auto">
              Select a candidate platform below and cast your simulated vote into the tamper-proof Chaguo ballot box.
            </p>
          </div>

          {/* CANDIDATE SELECTOR CHIPS */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BALLOT_CANDIDATES.map((cand) => (
              <button
                key={cand.id}
                onClick={() => {
                  setSelectedCandidateId(cand.id);
                  if (animState === 'success') resetBallot();
                }}
                disabled={animState === 'stamping' || animState === 'dropping'}
                className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  selectedCandidateId === cand.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-black shadow-md'
                    : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{cand.symbol}</span>
                  {selectedCandidateId === cand.id && (
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <span className="text-[10px] font-black uppercase leading-tight mt-1 line-clamp-2">
                  {cand.name}
                </span>
              </button>
            ))}
          </div>

          {/* ANIMATED BALLOT & BALLOT BOX STAGE */}
          <div className="relative z-10 py-5 px-3 bg-neutral-900/90 rounded-xl border border-neutral-800 flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
            {/* Stage wrapper */}
            <div className="relative flex flex-col items-center w-full max-w-md">
              
              {/* Floating Animated Ballot Paper */}
              <AnimatePresence mode="wait">
                {animState !== 'success' && (
                  <motion.div
                    key="ballot-paper"
                    initial={{ y: -20, opacity: 0, scale: 0.9 }}
                    animate={
                      animState === 'idle'
                        ? { y: 0, opacity: 1, scale: 1, rotate: 0 }
                        : animState === 'stamping'
                        ? { y: 0, opacity: 1, scale: 1.02, rotate: [-1, 1, 0] }
                        : { y: 110, opacity: 0, scale: 0.4, rotateX: 65 }
                    }
                    transition={{
                      duration: animState === 'dropping' ? 1.1 : 0.4,
                      ease: 'easeInOut',
                    }}
                    className="w-full max-w-xs sm:max-w-sm bg-amber-50 text-neutral-950 border-2 border-neutral-900 rounded-xl p-3.5 shadow-2xl relative z-20 space-y-2"
                  >
                    {/* Official Ballot Watermark & Header */}
                    <div className="flex items-center justify-between border-b-2 border-dashed border-neutral-400 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Vote className="w-4 h-4 text-red-600" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-700">
                          KENYA 2027 CIVIC BALLOT
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-neutral-200 px-1.5 py-0.5 rounded border border-neutral-300">
                        OFFICIAL #2027
                      </span>
                    </div>

                    {/* Selected Candidate Info */}
                    <div className="p-2 bg-white border border-neutral-300 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{selectedCandidate.symbol}</span>
                        <div>
                          <span className="text-[11px] font-black uppercase text-neutral-900 block leading-tight">
                            {selectedCandidate.name}
                          </span>
                          <span className="text-[9px] font-semibold text-emerald-700">
                            Integrity Score: {selectedCandidate.score}
                          </span>
                        </div>
                      </div>

                      {/* Animated Stamp Badge */}
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        {animState !== 'idle' ? (
                          <motion.div
                            initial={{ scale: 2.5, opacity: 0, rotate: -25 }}
                            animate={{ scale: 1, opacity: 1, rotate: -8 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                            className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-[9px] uppercase border-2 border-red-800 flex items-center justify-center shadow-lg"
                          >
                            <Stamp className="w-4 h-4 fill-white" />
                          </motion.div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-dashed border-neutral-400 flex items-center justify-center">
                            <span className="text-[9px] text-neutral-400 font-bold">VOTE</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 pt-0.5">
                      <span>VERIFIED VOTER HASH</span>
                      <span className="font-bold text-neutral-800">#CHAGUO-LEDGER-OK</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BALLOT BOX CONTAINER */}
              <div className="relative w-full max-w-xs sm:max-w-sm bg-neutral-800 border-4 border-neutral-900 rounded-2xl p-4 shadow-2xl mt-3 text-center z-10 space-y-3">
                {/* Ballot Box Slot */}
                <div className="relative">
                  <div className="w-48 sm:w-64 h-3.5 mx-auto bg-neutral-950 border-2 border-neutral-700 rounded-full shadow-inner relative overflow-hidden flex items-center justify-center">
                    {animState === 'dropping' && (
                      <motion.div
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 opacity-80"
                      />
                    )}
                  </div>
                  <span className="text-[8px] font-black uppercase text-neutral-500 tracking-widest block mt-1">
                    SLOT: TAMPER-PROOF DIGITAL SCANNER
                  </span>
                </div>

                {/* Ballot Box Tally Display */}
                <div className="p-2.5 bg-neutral-950/90 border border-neutral-700 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-left">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[9px] font-black uppercase text-neutral-400 block">
                        VERIFIED BALLOT TALLY
                      </span>
                      <span className="text-sm font-mono font-black text-amber-400">
                        {voteCount.toLocaleString()} VOTES
                      </span>
                    </div>
                  </div>

                  {/* Pulsing Ledger Status */}
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LEDGER LIVE</span>
                  </div>
                </div>

                {/* SUCCESS RECEIPT DISPLAY */}
                {animState === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-emerald-950/90 border-2 border-emerald-500 rounded-xl text-left space-y-1.5 shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-emerald-800 pb-1">
                      <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-black uppercase">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                        <span>Ballot Registered!</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">
                        {receiptId}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-200 font-bold uppercase leading-tight">
                      VOTE CAST FOR: <span className="text-white underline">{selectedCandidate.name}</span>
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-emerald-400 font-mono">
                      <span>TIMESTAMP: {new Date().toLocaleTimeString()}</span>
                      <span>CHAGUO 2027 DECENTRALIZED</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ACTION CONTROLS FOR ANIMATION */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {animState === 'idle' && (
                <button
                  onClick={() => triggerVoteCastAnimation()}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border border-emerald-400 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Stamp className="w-4 h-4" />
                  <span>Cast Vote for {selectedCandidate.symbol}</span>
                </button>
              )}

              {animState === 'success' && (
                <button
                  onClick={resetBallot}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-black uppercase transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Vote Again / Change Selection</span>
                </button>
              )}

              {(animState === 'stamping' || animState === 'dropping') && (
                <div className="px-4 py-2 bg-neutral-800 text-amber-400 rounded-xl text-xs font-black uppercase flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Processing Ballot Verification...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Sign In or Sign Up */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sign In Button */}
            <button
              onClick={() => {
                onClose();
                onOpenSignIn();
              }}
              className="py-3.5 px-4 bg-red-600 hover:bg-neutral-900 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border-2 border-red-600 hover:border-neutral-900"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In to Your Account</span>
            </button>

            {/* Sign Up Button */}
            <button
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              className="py-3.5 px-4 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-900 font-black text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border-2 border-neutral-900 dark:border-neutral-100"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Free Account</span>
            </button>
          </div>

          {/* Continue as Guest Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-neutral-300 dark:border-neutral-700 flex items-center justify-center gap-1.5"
          >
            <span>Continue as Guest Voter (Browse Candidate Dossiers)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t-2 border-neutral-200 dark:border-neutral-800 text-xs">
          <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700/60 flex items-start gap-2">
            <FileText className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black uppercase text-[11px] text-neutral-900 dark:text-neutral-100">
                Hansard Voting Roll-call
              </strong>
              <span className="text-[10px] text-neutral-500 font-semibold leading-tight">
                Inspect 2024/2025 MP votes on Finance Bills clause by clause.
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700/60 flex items-start gap-2">
            <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black uppercase text-[11px] text-neutral-900 dark:text-neutral-100">
                Track Integrity & Good Leaders
              </strong>
              <span className="text-[10px] text-neutral-500 font-semibold leading-tight">
                Review candidate records, judiciary filings, and public evidence.
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700/60 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black uppercase text-[11px] text-neutral-900 dark:text-neutral-100">
                Offline PWA & APK App
              </strong>
              <span className="text-[10px] text-neutral-500 font-semibold leading-tight">
                Install as standalone app or download direct Android APK.
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
