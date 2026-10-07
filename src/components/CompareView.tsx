import React, { useState } from 'react';
import { Candidate } from '../types';
import { ShieldCheck, X, Plus, Sparkles, Scale, AlertTriangle, CheckCircle2, Award, Filter, ArrowRightLeft, FileText, BarChart3, HelpCircle } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';
import { getCandidateIntegrityData } from '../utils/integrity';
import { calculateReputation } from '../utils/reputation';
import { useLanguage } from '../context/LanguageContext';

interface CompareViewProps {
  candidates: Candidate[];
  onRemove: (candidateId: string) => void;
  onClear: () => void;
  allCandidates: Candidate[];
  onAddCandidate: (candidate: Candidate) => void;
  onSelectDetail: (candidate: Candidate) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  candidates,
  onRemove,
  onClear,
  allCandidates,
  onAddCandidate,
  onSelectDetail,
}) => {
  const { t } = useLanguage();

  // Quick Preset Matchup state
  const [searchFilter, setSearchFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'matrix' | 'analytics' | 'verdict'>('matrix');

  // Available candidates to add (up to 4 max comparison)
  const availableToAdd = allCandidates.filter(
    (c) => !candidates.some((selected) => selected.id === c.id)
  );

  const filteredAvailable = availableToAdd.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.county.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.party.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesPos = positionFilter === 'ALL' || c.position === positionFilter;
    return matchesSearch && matchesPos;
  });

  // Preset scenarios
  const applyPresetMatchup = (scenario: 'presidential' | 'deputy' | 'clean_champions' | 'ex_governors') => {
    onClear();
    if (scenario === 'presidential') {
      const match = allCandidates.filter(c => ['exec-1', 'exec-4', 'exec-5'].includes(c.id));
      match.forEach(c => onAddCandidate(c));
    } else if (scenario === 'deputy') {
      const match = allCandidates.filter(c => ['exec-2', 'exec-3'].includes(c.id));
      match.forEach(c => onAddCandidate(c));
    } else if (scenario === 'clean_champions') {
      const match = allCandidates.filter(c => c.tagColor === 'green' || c.isGoodLeaderChampion).slice(0, 3);
      match.forEach(c => onAddCandidate(c));
    } else if (scenario === 'ex_governors') {
      const match = allCandidates.filter(c => c.isTermLimitedGovernorRunningForLowerSeat || c.id.startsWith('gov-tl-'));
      match.forEach(c => onAddCandidate(c));
    }
  };

  // Compute AI Comparative Verdict
  const generateAIVerdict = () => {
    if (candidates.length < 2) return null;

    const evaluated = candidates.map(c => ({
      candidate: c,
      rep: calculateReputation(c, []),
      integ: getCandidateIntegrityData(c),
    }));

    // Sort by ethics score
    evaluated.sort((a, b) => b.integ.ethicsScore - a.integ.ethicsScore);

    const leader = evaluated[0];
    const laggard = evaluated[evaluated.length - 1];

    const yesVoters = candidates.filter(c => c.votes.financeBill2024 === 'YES');
    const noVoters = candidates.filter(c => c.votes.financeBill2024 === 'NO');

    return {
      topIntegrity: leader.candidate.name,
      topScore: leader.integ.ethicsScore,
      laggardIntegrity: laggard.candidate.name,
      laggardScore: laggard.integ.ethicsScore,
      yesCount: yesVoters.length,
      noCount: noVoters.length,
      taxContrast: yesVoters.length > 0 && noVoters.length > 0
        ? `${yesVoters.map(c => c.name).join(', ')} voted YES to Finance Bill tax increases, contrasting directly with ${noVoters.map(c => c.name).join(', ')} who voted NO.`
        : `Selected candidates share similar voting trajectories on major national Finance Bills.`,
      eaccSummary: evaluated.map(e => `${e.candidate.name}: EACC Status [${e.integ.eaccStatus}], Risk Level [${e.integ.riskLevel}]`).join(' • '),
    };
  };

  const aiVerdict = generateAIVerdict();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white border-4 border-neutral-900 dark:border-neutral-700 p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-7 h-7 text-red-600 animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
                Kenya 2027 Candidate Comparison Model
              </h2>
            </div>
            <p className="text-xs font-bold text-neutral-300 uppercase mt-1.5 max-w-2xl">
              Multi-vector civic audit evaluating side-by-side Finance Bill votes, EACC ethics probes, asset declarations, and parliamentary attendance across 2027 leaders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {candidates.length > 0 && (
              <button
                onClick={onClear}
                className="px-4 py-2 bg-red-600 hover:bg-white hover:text-neutral-900 text-white font-black text-xs uppercase tracking-wider transition-colors border-2 border-red-700"
              >
                RESET MODEL ({candidates.length}/4)
              </button>
            )}
          </div>
        </div>

        {/* Preset Matchups Quick Select Bar */}
        <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> QUICK MODEL PRESETS:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPresetMatchup('presidential')}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-black uppercase border border-neutral-700 transition-colors"
            >
              🏛️ 2027 Presidential Race (Ruto vs Raila vs Kalonzo)
            </button>

            <button
              onClick={() => applyPresetMatchup('deputy')}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-black uppercase border border-neutral-700 transition-colors"
            >
              🛡️ Executive DP Audit (Kindiki vs Gachagua)
            </button>

            <button
              onClick={() => applyPresetMatchup('clean_champions')}
              className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[11px] font-black uppercase border border-emerald-700 transition-colors"
            >
              🌟 Top Integrity Champions
            </button>

            <button
              onClick={() => applyPresetMatchup('ex_governors')}
              className="px-3 py-1 bg-red-950 hover:bg-red-900 text-red-200 text-[11px] font-black uppercase border border-red-700 transition-colors flex items-center gap-1 animate-pulse"
            >
              🚩 2-Term Governors Contesting MP Seats
            </button>
          </div>
        </div>
      </div>

      {/* Comparison View Navigation Tabs */}
      {candidates.length > 0 && (
        <div className="flex items-center gap-2 border-b-2 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 text-xs font-black uppercase transition-colors flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            <Scale className="w-4 h-4" /> Side-by-Side Matrix
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs font-black uppercase transition-colors flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Metric Radar & Visual Gauges
          </button>

          <button
            onClick={() => setActiveTab('verdict')}
            className={`px-4 py-2 text-xs font-black uppercase transition-colors flex items-center gap-2 ${
              activeTab === 'verdict'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" /> AI Civic Verdict Analysis
          </button>
        </div>
      )}

      {/* Main Content Areas */}
      {candidates.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center mx-auto border-4 border-neutral-900 dark:border-neutral-700 font-black text-2xl shadow-md">
            <ArrowRightLeft className="w-10 h-10 text-red-500 animate-pulse" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-tight">
              No Candidates Selected for Comparison
            </h3>
            <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase leading-relaxed">
              Select 2 to 4 candidates below or use our quick presets to analyze their parliamentary votes, EACC investigation history, asset disclosures, and public integrity grades side by side.
            </p>
          </div>

          {/* Quick Add Candidate Grid */}
          <div className="pt-4 max-w-4xl mx-auto border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 text-left">
                Select Candidates to Add ({availableToAdd.length} Available):
              </h4>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search candidate name or county..."
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-sm text-xs font-bold text-neutral-900 dark:text-neutral-100"
                />
                <select
                  value={positionFilter}
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-sm text-xs font-bold text-neutral-900 dark:text-neutral-100"
                >
                  <option value="ALL">All Positions</option>
                  <option value="President">President</option>
                  <option value="Deputy President">Deputy President</option>
                  <option value="Presidential Aspirant">Presidential Aspirant</option>
                  <option value="Governor">Governor</option>
                  <option value="Senator">Senator</option>
                  <option value="MP">MP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
              {filteredAvailable.slice(0, 9).map((c) => {
                const rep = calculateReputation(c, []);
                return (
                  <button
                    key={c.id}
                    onClick={() => onAddCandidate(c)}
                    className="flex items-center justify-between p-3.5 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-2 border-neutral-900 dark:border-neutral-700 transition-colors group shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <DemonicAvatar seed={c.id} name={c.name} tagColor={c.tagColor} size="sm" />
                      <div>
                        <span className="block text-xs font-black uppercase text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 transition-colors truncate max-w-[160px]">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                          {c.position} • {c.county}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 text-[9px] font-mono font-black ${rep.badgeBg}`}>
                        {rep.score}
                      </span>
                      <Plus className="w-4 h-4 text-red-600 shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: SIDE-BY-SIDE MATRIX */}
          {activeTab === 'matrix' && (
            <div className="overflow-x-auto pb-4">
              <div className={`grid gap-4 min-w-[720px] ${
                candidates.length === 2 ? 'grid-cols-2' : candidates.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
              }`}>
                {candidates.map((c) => {
                  const rep = calculateReputation(c, []);
                  const integ = getCandidateIntegrityData(c);

                  return (
                    <div
                      key={c.id}
                      className={`bg-white dark:bg-neutral-900 border-4 p-5 flex flex-col justify-between shadow-lg ${
                        c.tagColor === 'red'
                          ? 'border-red-600'
                          : c.tagColor === 'green'
                          ? 'border-green-600'
                          : 'border-purple-600'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Header & Avatar */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white ${
                              c.tagColor === 'red' ? 'bg-red-600' : c.tagColor === 'green' ? 'bg-green-600' : 'bg-purple-600'
                            }`}>
                              {c.tagColor === 'red' ? 'AFFILIATED' : c.tagColor === 'green' ? 'CLEAN RECORD' : 'INDEPENDENT'}
                            </span>
                            <button
                              onClick={() => onRemove(c.id)}
                              className="p-1 bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-red-600 transition-colors"
                              title="Remove from comparison"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3 mb-2">
                            <DemonicAvatar seed={c.id} name={c.name} tagColor={c.tagColor} size="md" />
                            <div>
                              <h3 className="text-lg font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
                                {c.name}
                              </h3>
                              <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                                {c.position} • {c.county}
                              </p>
                              <span className="text-[10px] font-mono text-neutral-400 font-bold block">{c.party}</span>
                            </div>
                          </div>

                          {(c.isTermLimitedGovernorRunningForLowerSeat ||
                            ((c.position === 'MP' || c.position === 'Senator' || c.position === 'MCA') &&
                             (c.termInOffice?.includes('Governor') || c.keyPositionsHeld?.some(k => k.toLowerCase().includes('governor'))))) && (
                            <div className="mt-2 p-2 bg-red-100 dark:bg-red-950/80 border border-red-600 text-[10px] font-black uppercase text-red-900 dark:text-red-200 flex items-center gap-1.5 animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              <span>🚩 RED FLAG: 2-Term Governor Contesting MP Seat</span>
                            </div>
                          )}
                        </div>

                        {/* Civic Reputation & Ethics Score */}
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-3 border-2 border-neutral-900 dark:border-neutral-700 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-neutral-500">Reputation Index</span>
                            <span className={`px-2 py-0.5 text-[10px] font-black font-mono ${rep.badgeBg}`}>
                              GRADE {rep.grade} ({rep.score}/100)
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-black uppercase">
                              <span>Ethics Audit Score:</span>
                              <span className="font-mono">{integ.ethicsScore}%</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-none overflow-hidden">
                              <div
                                className={`h-full ${
                                  integ.ethicsScore >= 80 ? 'bg-emerald-600' : integ.ethicsScore >= 60 ? 'bg-blue-600' : integ.ethicsScore >= 40 ? 'bg-amber-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${integ.ethicsScore}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Voting Roll Rows */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase text-neutral-500 block">Parliamentary Voting Record</span>
                          
                          <div className="bg-neutral-100 dark:bg-neutral-800 p-2.5 border border-neutral-300 dark:border-neutral-700 text-xs">
                            <div className="text-[9px] font-black text-neutral-500 uppercase">Finance Bill 2024</div>
                            <div className="font-black text-xs uppercase mt-0.5">
                              {c.votes.financeBill2024 === 'YES' && <span className="text-red-600 dark:text-red-400">VOTED YES (TAX HIKE)</span>}
                              {c.votes.financeBill2024 === 'NO' && <span className="text-green-600 dark:text-green-400">VOTED NO (REJECTED)</span>}
                              {c.votes.financeBill2024 === 'ABSENT' && <span className="text-neutral-500">ABSENT</span>}
                              {c.votes.financeBill2024 === 'NOT_IN_OFFICE' && <span className="text-neutral-400 italic">Not in office</span>}
                            </div>
                          </div>

                          <div className="bg-neutral-100 dark:bg-neutral-800 p-2.5 border border-neutral-300 dark:border-neutral-700 text-xs">
                            <div className="text-[9px] font-black text-neutral-500 uppercase">Finance Bill 2025</div>
                            <div className="font-black text-xs uppercase mt-0.5">
                              {c.votes.financeBill2025 === 'YES' && <span className="text-red-600 dark:text-red-400">VOTED YES</span>}
                              {c.votes.financeBill2025 === 'NO' && <span className="text-green-600 dark:text-green-400">VOTED NO</span>}
                              {c.votes.financeBill2025 === 'ABSENT' && <span className="text-neutral-500">ABSENT</span>}
                              {c.votes.financeBill2025 === 'NOT_IN_OFFICE' && <span className="text-neutral-400 italic">Not in office</span>}
                            </div>
                          </div>
                        </div>

                        {/* Integrity & EACC Docket */}
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-3 border-2 border-neutral-900 dark:border-neutral-700 space-y-2 text-xs">
                          <span className="text-[9px] font-black uppercase text-neutral-500 block">EACC & Asset Audit</span>
                          
                          <div className="flex justify-between items-center text-[10px] font-black uppercase">
                            <span>EACC Probe:</span>
                            <span className="text-red-600 dark:text-red-400">{integ.eaccStatus}</span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-black uppercase">
                            <span>Asset Disclosed:</span>
                            <span className={integ.assetDeclared ? 'text-emerald-600' : 'text-amber-600'}>
                              {integ.assetDeclared ? 'YES' : 'NO'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-black uppercase">
                            <span>Wealth Growth:</span>
                            <span className="font-mono">{integ.wealthGrowth}</span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-black uppercase">
                            <span>Corruption Case:</span>
                            <span className="font-mono">{c.corruptionStatus.toUpperCase()}</span>
                          </div>
                        </div>

                        {/* Attendance & Good Leader Score */}
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-3 border border-neutral-300 dark:border-neutral-700 space-y-1.5 text-xs">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>House Attendance:</span>
                            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{integ.attendanceScore}%</span>
                          </div>

                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>Citizen Rating:</span>
                            <span className="font-mono font-bold text-yellow-500">★ {integ.citizenRating} / 5.0</span>
                          </div>

                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>Conflicts Disclosed:</span>
                            <span className="font-mono font-bold">{integ.conflicts.length} Flags</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectDetail(c)}
                        className="w-full mt-4 py-2.5 bg-neutral-900 dark:bg-neutral-800 hover:bg-red-600 dark:hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-colors border border-neutral-900"
                      >
                        VIEW FULL DOSSIER
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: METRIC RADAR & VISUAL GAUGES */}
          {activeTab === 'analytics' && (
            <div className="bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <BarChart3 className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-black uppercase text-neutral-900 dark:text-neutral-100">
                  Visual Metric Comparison Bars
                </h3>
              </div>

              <div className="space-y-6">
                {/* Metric 1: Ethics Audit Score */}
                <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border-2 border-neutral-900 dark:border-neutral-700 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                    <span>🛡️ Ethics & Integrity Index (0-100%)</span>
                    <span className="text-[10px] text-neutral-400 font-normal">Higher is better</span>
                  </h4>
                  <div className="space-y-3">
                    {candidates.map((c) => {
                      const integ = getCandidateIntegrityData(c);
                      return (
                        <div key={c.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-black uppercase">
                            <span>{c.name} ({c.county})</span>
                            <span className="font-mono">{integ.ethicsScore}%</span>
                          </div>
                          <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                integ.ethicsScore >= 80 ? 'bg-emerald-600' : integ.ethicsScore >= 60 ? 'bg-blue-600' : integ.ethicsScore >= 40 ? 'bg-amber-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${integ.ethicsScore}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metric 2: Parliamentary Attendance */}
                <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border-2 border-neutral-900 dark:border-neutral-700 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                    <span>🏛️ Parliamentary Sitting Attendance Rate (%)</span>
                    <span className="text-[10px] text-neutral-400 font-normal">Sittings attended</span>
                  </h4>
                  <div className="space-y-3">
                    {candidates.map((c) => {
                      const integ = getCandidateIntegrityData(c);
                      return (
                        <div key={c.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-black uppercase">
                            <span>{c.name}</span>
                            <span className="font-mono">{integ.attendanceScore}%</span>
                          </div>
                          <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                            <div
                              className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-500"
                              style={{ width: `${integ.attendanceScore}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metric 3: Citizen Approval Rating */}
                <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border-2 border-neutral-900 dark:border-neutral-700 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                    <span>🌟 Citizen Rating Score (1.0 to 5.0 Stars)</span>
                    <span className="text-[10px] text-neutral-400 font-normal">Public satisfaction</span>
                  </h4>
                  <div className="space-y-3">
                    {candidates.map((c) => {
                      const integ = getCandidateIntegrityData(c);
                      const pct = (integ.citizenRating / 5.0) * 100;
                      return (
                        <div key={c.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-black uppercase">
                            <span>{c.name}</span>
                            <span className="font-mono text-yellow-600 dark:text-yellow-400">★ {integ.citizenRating} / 5.0</span>
                          </div>
                          <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI CIVIC VERDICT ANALYSIS */}
          {activeTab === 'verdict' && aiVerdict && (
            <div className="bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <Sparkles className="w-6 h-6 text-red-600 animate-spin" />
                <div>
                  <h3 className="text-lg font-black uppercase text-neutral-900 dark:text-neutral-100">
                    AI Comparative Civic Verdict
                  </h3>
                  <p className="text-xs font-bold text-neutral-500 uppercase">
                    Automated comparative evaluation of selected candidates
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-600 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4" /> HIGHEST ETHICS INTEGRITY SCORE
                  </div>
                  <h4 className="text-xl font-black uppercase text-emerald-950 dark:text-emerald-100">
                    {aiVerdict.topIntegrity}
                  </h4>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                    Ethics Score: {aiVerdict.topScore}% • Strongest public accountability record in current matchup.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-600 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-black text-xs uppercase">
                    <AlertTriangle className="w-4 h-4" /> HIGHEST INTEGRITY / TAX RISK
                  </div>
                  <h4 className="text-xl font-black uppercase text-red-950 dark:text-red-100">
                    {aiVerdict.laggardIntegrity}
                  </h4>
                  <p className="text-xs font-bold text-red-800 dark:text-red-300 uppercase">
                    Ethics Score: {aiVerdict.laggardScore}% • Elevated risk profile due to tax vote record or EACC audit flags.
                  </p>
                </div>
              </div>

              {/* Fiscal & Tax Contrast Summary */}
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 border-2 border-neutral-900 dark:border-neutral-700 space-y-2 text-xs font-bold uppercase">
                <span className="text-neutral-500 font-black block">Tax & Fiscal Bill Alignment Breakdown</span>
                <p className="text-neutral-900 dark:text-neutral-100 leading-relaxed font-bold">
                  {aiVerdict.taxContrast}
                </p>
              </div>

              {/* EACC Audit Summary */}
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 border-2 border-neutral-900 dark:border-neutral-700 space-y-2 text-xs font-bold uppercase">
                <span className="text-neutral-500 font-black block">EACC & Asset Investigation Overview</span>
                <p className="text-neutral-800 dark:text-neutral-200 font-mono text-[11px] leading-relaxed">
                  {aiVerdict.eaccSummary}
                </p>
              </div>

              {/* Citizen Townhall Action Questions */}
              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 border-2 border-amber-500 space-y-2 text-xs">
                <span className="text-amber-900 dark:text-amber-200 font-black uppercase flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" /> Key Questions for Citizens to Ask in Debates / Townhalls:
                </span>
                <ul className="space-y-1.5 text-neutral-800 dark:text-neutral-200 font-bold uppercase">
                  <li>• "What was your justification for voting {candidates[0]?.votes.financeBill2024} on Finance Bill 2024?"</li>
                  <li>• "Have you publicly published your EACC Asset Declaration to voters?"</li>
                  <li>• "How will you address local constituency projects and CDF tender transparency before 2027?"</li>
                </ul>
              </div>
            </div>
          )}

          {/* Add Additional Candidate Bar */}
          {candidates.length < 4 && availableToAdd.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 p-5">
              <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase block mb-3">
                Add another candidate to comparison ({4 - candidates.length} slots left):
              </span>
              <div className="flex flex-wrap gap-2">
                {availableToAdd.slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onAddCandidate(c)}
                    className="px-3.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-900 dark:border-neutral-700 text-xs font-black uppercase transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-red-600" />
                    <span>{c.name} ({c.county})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
