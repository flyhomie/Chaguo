import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle, ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface ElectionCountdownBannerProps {
  onOpenEducation?: () => void;
}

export const ElectionCountdownBanner: React.FC<ElectionCountdownBannerProps> = ({ onOpenEducation }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });

  useEffect(() => {
    // Kenya General Election target: August 10, 2027 at 08:00 AM EAT (05:00 UTC)
    const targetDate = new Date('2027-08-10T08:00:00+03:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, totalMs: diff });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isDismissed) {
    return (
      <div className="bg-neutral-900 text-white px-3 py-1.5 border-b border-neutral-800 text-[11px] font-bold flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Timer className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>KE 2027 Election: <strong className="text-red-400 font-mono">{timeLeft.days} days left</strong></span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-neutral-400 hover:text-white underline text-[10px] uppercase tracking-wider"
        >
          Expand Counter
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Election Countdown" className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-red-950 text-white border-b-2 border-red-600 shadow-md relative overflow-hidden">
      {/* Decorative accent lines */}
      <div className="absolute top-0 right-0 w-64 h-full bg-red-600/10 skew-x-12 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 relative z-10">
        {/* Left: Title & Urgency Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 text-white rounded-lg shadow-sm shrink-0 flex items-center justify-center">
            <Timer className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest bg-red-600/30 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                Civic Alert • KE 2027
              </span>
              <span className="text-xs font-bold text-neutral-300 hidden sm:inline">
                Kenya General Election Day
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5 mt-0.5">
              <span>Every Vote & Integrity Record Counts</span>
            </h3>
          </div>
        </div>

        {/* Center: Live Timer Box */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 font-mono shrink-0 py-1 px-2.5 bg-black/40 border border-neutral-800 rounded-lg">
          <div className="text-center px-1.5 sm:px-2">
            <span className="block text-sm sm:text-lg font-black text-red-500 tracking-tight leading-none">
              {String(timeLeft.days).padStart(3, '0')}
            </span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">Days</span>
          </div>
          <span className="text-neutral-600 font-bold text-sm">:</span>
          <div className="text-center px-1.5 sm:px-2">
            <span className="block text-sm sm:text-lg font-black text-white tracking-tight leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">Hrs</span>
          </div>
          <span className="text-neutral-600 font-bold text-sm">:</span>
          <div className="text-center px-1.5 sm:px-2">
            <span className="block text-sm sm:text-lg font-black text-white tracking-tight leading-none">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">Mins</span>
          </div>
          <span className="text-neutral-600 font-bold text-sm">:</span>
          <div className="text-center px-1.5 sm:px-2">
            <span className="block text-sm sm:text-lg font-black text-red-400 tracking-tight leading-none animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">Secs</span>
          </div>
        </div>

        {/* Right: Action & Close */}
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
          {onOpenEducation && (
            <button
              onClick={onOpenEducation}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded transition-all flex items-center gap-1 shadow-sm shrink-0"
              title="Learn how to verify voter registration & candidates"
            >
              <span>Voter Rights Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors shrink-0"
            title="Minimize election countdown"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
