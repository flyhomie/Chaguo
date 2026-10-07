import React, { useState, useEffect } from 'react';
import { PUBLIC_DEBT_METRICS } from '../data/auditorGeneralFindings';
import { TrendingUp, AlertTriangle, Users, Calculator, ExternalLink, Clock, ShieldAlert, ArrowUpRight, Share2, Copy, CheckCircle2, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PublicDebtClock: React.FC = () => {
  const { t } = useLanguage();
  const [householdMembers, setHouseholdMembers] = useState<number>(4.5);
  const [currentDebt, setCurrentDebt] = useState<number>(PUBLIC_DEBT_METRICS.totalDebtKsh);
  const [copied, setCopied] = useState(false);

  // Live ticking debt clock simulating ~KES 38,400 per second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDebt(prev => prev + (PUBLIC_DEBT_METRICS.debtAddedPerSecondKsh * 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const debtPerPerson = currentDebt / 56000000; // Estimated 56M population
  const familyDebtShare = debtPerPerson * householdMembers;

  const formatCurrency = (val: number, decimals: number = 2) => {
    return `KES ${val.toLocaleString('en-KE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  };

  const formatTrillions = (val: number) => {
    return `KES ${(val / 1000000000000).toFixed(3)} Trillion`;
  };

  const handleCopySummary = () => {
    const text = `🇰🇪 KENYA PUBLIC DEBT CLOCK (Sourced from CBK & World Bank Open Data via @civicsnsins)
• Total National Debt: ${formatTrillions(currentDebt)}
• Debt Per Citizen: ${formatCurrency(debtPerPerson, 0)}
• My Family's Share (${householdMembers} people): ${formatCurrency(familyDebtShare, 2)}
• Debt-to-GDP Ratio: ${PUBLIC_DEBT_METRICS.debtToGdpRatioPercent}% (CRITICAL RISK ⚠️)
• Debt Added Per Second: KES 38,400.00
Check your family's debt share on Chaguo 2027: https://chaguo2027.ke`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with exact TikTok visual match */}
      <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950 text-white border-2 border-red-600/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1 shadow-sm">
                <Clock className="w-3.5 h-3.5 animate-spin text-amber-300" style={{ animationDuration: '6s' }} />
                LIVE DEBT CLOCK
              </span>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                +KES 38,400 / SECOND
              </span>
              <span className="px-2.5 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/40 text-[10px] font-black uppercase tracking-wider rounded-md">
                @civicsnsins Verified
              </span>
            </div>

            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 border border-neutral-700 shadow-sm"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Share Calculation</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* National Live Debt Total */}
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-neutral-400 block mb-1">
                Kenya Total Public Sovereign Debt (Live)
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white flex items-baseline gap-2">
                <span className="text-red-500">KES</span>
                <span>{(currentDebt / 1000000000000).toFixed(6)}</span>
                <span className="text-lg sm:text-xl font-bold text-neutral-400">Trillion</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2 font-medium">
                Data synthesized from Central Bank of Kenya (CBK) weekly bulletins, National Treasury debt registers, and World Bank Open Data.
              </p>
            </div>

            {/* Risk Gauge */}
            <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase">
                <span className="text-neutral-300 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Debt-to-GDP Sustainability Index
                </span>
                <span className="text-red-400 font-bold">68.4% (CRITICAL RISK)</span>
              </div>
              <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: '40%' }} title="Safe (<40%)" />
                <div className="bg-amber-500 h-full" style={{ width: '20%' }} title="Moderate (40-60%)" />
                <div className="bg-red-600 h-full animate-pulse" style={{ width: '8.4%' }} title="Critical (>60%)" />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-neutral-400">
                <span>0% Safe</span>
                <span className="text-amber-400">55% IMF Anchor</span>
                <span className="text-red-500">68.4% Current (High Risk)</span>
                <span>100% Default</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Family Debt Calculator matching the exact TikTok Screenshot */}
      <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
              Your Family's Share of Kenya's Debt Calculator
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              As featured on <strong className="text-red-600 dark:text-red-400">@civicsnsins</strong> TikTok breakdown. Adjust household members to see your unasked-for financial liability.
            </p>
          </div>
        </div>

        {/* Big Highlight Box */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-300 dark:border-neutral-800 rounded-2xl text-center space-y-2">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
            Your Family's Calculated Share of Kenya's Debt:
          </span>
          <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-red-600 dark:text-red-500">
            {formatCurrency(familyDebtShare, 2)}
          </div>
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">
            Based on <strong className="text-neutral-900 dark:text-neutral-100">{householdMembers} family members</strong> (~{formatCurrency(debtPerPerson, 0)} per individual)
          </span>
        </div>

        {/* Household Size Slider & Buttons */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-black uppercase">
            <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-neutral-500" />
              How many people live in your household?
            </span>
            <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-black">
              {householdMembers} {householdMembers === 1 ? 'Person' : 'People'}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={householdMembers}
            onChange={(e) => setHouseholdMembers(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
          />

          <div className="flex flex-wrap gap-2 pt-1">
            {[1, 2, 4, 4.5, 6, 8, 10].map((count) => (
              <button
                key={count}
                onClick={() => setHouseholdMembers(count)}
                className={`px-3 py-1.5 text-xs font-black uppercase rounded-lg border transition-all ${
                  householdMembers === count
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
                }`}
              >
                {count === 4.5 ? 'Average Family (4.5)' : `${count} ${count === 1 ? 'Person' : 'Persons'}`}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-1">
            <span className="text-[10px] font-black uppercase text-neutral-500 dark:text-neutral-400 block">
              Debt Per Citizen (Per Capita)
            </span>
            <span className="text-lg font-black text-neutral-900 dark:text-neutral-100 font-mono block">
              {formatCurrency(debtPerPerson, 0)}
            </span>
            <span className="text-[10px] text-neutral-500">Every newborn Kenyan baby starts with this debt</span>
          </div>

          <div className="p-3.5 bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-1">
            <span className="text-[10px] font-black uppercase text-neutral-500 dark:text-neutral-400 block">
              Annual Debt Servicing Burden
            </span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono block">
              KES 1.80 Trillion / Year
            </span>
            <span className="text-[10px] text-neutral-500">Consumes ~65% of all national tax revenue collected</span>
          </div>

          <div className="p-3.5 bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-1">
            <span className="text-[10px] font-black uppercase text-neutral-500 dark:text-neutral-400 block">
              Daily Debt Accumulation
            </span>
            <span className="text-lg font-black text-red-600 dark:text-red-400 font-mono block">
              +KES 3.31 Billion / Day
            </span>
            <span className="text-[10px] text-neutral-500">Added through new T-bills, bonds, and external credit</span>
          </div>
        </div>

        {/* Domestic vs External Debt Breakdown */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Kenya Sovereign Debt Composition (External vs Domestic)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Domestic Debt (Treasury Bills & Bonds)</span>
                <span className="text-xs font-black text-neutral-900 dark:text-neutral-100">49.8%</span>
              </div>
              <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">KES 5.74 Trillion</span>
              <p className="text-[10px] text-neutral-500 mt-1">Owed to local commercial banks, pension funds (NSSF), and insurance firms.</p>
            </div>

            <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">External Debt (Eurobonds, IMF, World Bank, China)</span>
                <span className="text-xs font-black text-neutral-900 dark:text-neutral-100">50.2%</span>
              </div>
              <span className="text-base font-black font-mono text-blue-600 dark:text-blue-400">KES 5.78 Trillion</span>
              <p className="text-[10px] text-neutral-500 mt-1">Denominated in USD, EUR, CNY, subject to exchange rate currency risks.</p>
            </div>
          </div>
        </div>

        {/* Official Sources List */}
        <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
            Official Data Sources & Dashboards Referenced by @civicsnsins:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PUBLIC_DEBT_METRICS.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-black text-neutral-900 dark:text-white group-hover:text-red-600 transition-colors">
                      {src.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-red-600" />
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-tight">
                    {src.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
