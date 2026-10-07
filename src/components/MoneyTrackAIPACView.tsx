import React, { useState, useMemo } from 'react';
import { Candidate, LeaderMoneyTrail, CampaignDonation, LobbyingInfluenceEvent, CampaignDonorType } from '../types';
import { INITIAL_MONEY_TRAILS } from '../data/moneyTrails';
import { DollarSign, ShieldAlert, AlertTriangle, TrendingUp, Building2, Globe, Scale, FileText, AlertCircle, Sparkles, PieChart, Plus, Search, Filter, CheckCircle2, ArrowUpRight, Plane, Home, Shield, Lock, ExternalLink, Clock, Video, BookOpen, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PublicDebtClock } from './PublicDebtClock';
import { AuditorGeneralFindingsHub } from './AuditorGeneralFindingsHub';
import { CivicCreatorsAndSources } from './CivicCreatorsAndSources';

interface MoneyTrackAIPACViewProps {
  candidates: Candidate[];
  selectedCandidateId?: string | null;
  onSelectCandidate?: (candidate: Candidate) => void;
  onNavigateHome?: () => void;
  onOpenAddEvidence?: (candidate?: Candidate) => void;
  currentUser?: any;
}

export const MoneyTrackAIPACView: React.FC<MoneyTrackAIPACViewProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  onNavigateHome,
  onOpenAddEvidence,
  currentUser
}) => {
  const { t } = useLanguage();
  const [moneyTrails, setMoneyTrails] = useState<LeaderMoneyTrail[]>(() => {
    try {
      const saved = localStorage.getItem('chaguo_money_trails');
      return saved ? JSON.parse(saved) : INITIAL_MONEY_TRAILS;
    } catch {
      return INITIAL_MONEY_TRAILS;
    }
  });

  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(selectedCandidateId || null);

  React.useEffect(() => {
    if (selectedCandidateId) {
      setSelectedLeaderId(selectedCandidateId);
    }
  }, [selectedCandidateId]);
  const [searchFilter, setSearchFilter] = useState('');
  const [donorTypeFilter, setDonorTypeFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'EACC_CHARGED' | 'INTL_FLAGS' | 'HIGH_RISK' | 'CLEAN'>('ALL');
  const [activeSectionTab, setActiveSectionTab] = useState<'donors' | 'expenditures' | 'eacc' | 'international' | 'lobbying'>('donors');
  const [activeHubView, setActiveHubView] = useState<'oag_findings' | 'debt_clock' | 'civic_sources' | 'money_trail'>('oag_findings');

  // Submit new money/donor report modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorType, setNewDonorType] = useState<CampaignDonorType>('Government Tenderpreneur');
  const [newAmount, setNewAmount] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [newConflictReason, setNewConflictReason] = useState('');
  const [newBillTarget, setNewBillTarget] = useState('');

  const handleAddDonationReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaderName || !newDonorName || !newAmount) return;

    const amountKsh = parseFloat(newAmount) || 0;
    const isConflict = Boolean(newConflictReason.trim());

    // Find if leader exists in moneyTrails
    const existingIndex = moneyTrails.findIndex(
      m => m.leaderName.toLowerCase().includes(newLeaderName.toLowerCase()) || m.leaderId === selectedLeaderId
    );

    const newDonation: CampaignDonation = {
      id: `don-${Date.now()}`,
      donorName: newDonorName,
      donorCategory: newDonorType,
      amountKsh,
      date: new Date().toISOString().split('T')[0],
      purpose: newPurpose || 'Campaign & Political Operations',
      isFlaggedConflict: isConflict,
      conflictReason: newConflictReason || undefined
    };

    let updatedTrails = [...moneyTrails];

    if (existingIndex >= 0) {
      const target = updatedTrails[existingIndex];
      const updatedDonations = [newDonation, ...target.topDonors];
      const updatedTotal = target.totalDonationsReceivedKsh + amountKsh;
      const updatedScore = Math.min(100, target.corruptionScoreRisk + (isConflict ? 15 : 3));

      if (newBillTarget.trim()) {
        const newInfluence: LobbyingInfluenceEvent = {
          id: `inf-${Date.now()}`,
          billIdOrClause: 'Citizen Alert',
          billTitle: newBillTarget,
          sponsorOrGroup: newDonorName,
          amountEstimatedKsh: amountKsh,
          outcome: 'Under Investigation',
          summary: `Citizen reported campaign contribution linked to ${newBillTarget}. Conflict details: ${newConflictReason || 'Pending verification'}`,
          riskRating: isConflict ? 'HIGH' : 'MODERATE'
        };
        target.influencesAndLobbying = [newInfluence, ...target.influencesAndLobbying];
      }

      updatedTrails[existingIndex] = {
        ...target,
        topDonors: updatedDonations,
        totalDonationsReceivedKsh: updatedTotal,
        corruptionScoreRisk: updatedScore
      };
    } else {
      const matchedCand = candidates.find(c => c.name.toLowerCase().includes(newLeaderName.toLowerCase()));
      const newTrail: LeaderMoneyTrail = {
        leaderId: matchedCand ? matchedCand.id : `cand-${Date.now()}`,
        leaderName: newLeaderName,
        declaredNetWorthKsh: 150000000,
        unexplainedWealthEstimateKsh: isConflict ? 250000000 : 0,
        totalDonationsReceivedKsh: amountKsh,
        topDonors: [newDonation],
        influencesAndLobbying: newBillTarget ? [{
          id: `inf-${Date.now()}`,
          billIdOrClause: 'Citizen Alert',
          billTitle: newBillTarget,
          sponsorOrGroup: newDonorName,
          amountEstimatedKsh: amountKsh,
          outcome: 'Under Investigation',
          summary: newConflictReason || 'Reported donor influence on policy',
          riskRating: isConflict ? 'HIGH' : 'LOW'
        }] : [],
        eaccInvestigationStatus: isConflict ? 'Active Probe' : 'Under Audit',
        corruptionScoreRisk: isConflict ? 65 : 20
      };
      updatedTrails.unshift(newTrail);
    }

    setMoneyTrails(updatedTrails);
    try {
      localStorage.setItem('chaguo_money_trails', JSON.stringify(updatedTrails));
    } catch (e) {}

    setIsSubmitModalOpen(false);
    setNewLeaderName('');
    setNewDonorName('');
    setNewAmount('');
    setNewPurpose('');
    setNewConflictReason('');
    setNewBillTarget('');
    alert('✅ Money trail report logged! Thank you for tracking civic influence.');
  };

  // Filtered money trails
  const filteredTrails = useMemo(() => {
    return moneyTrails.filter(trail => {
      const matchesSearch = 
        trail.leaderName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        trail.topDonors.some(d => d.donorName.toLowerCase().includes(searchFilter.toLowerCase())) ||
        trail.influencesAndLobbying.some(i => i.billTitle.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (trail.internationalConnections && trail.internationalConnections.some(ic => ic.entityName.toLowerCase().includes(searchFilter.toLowerCase())));
      
      const matchesDonorType = donorTypeFilter === 'ALL' || trail.topDonors.some(d => d.donorCategory === donorTypeFilter);
      
      let matchesRisk = true;
      if (riskFilter === 'EACC_CHARGED') {
        matchesRisk = (trail.eaccCharges && trail.eaccCharges.length > 0) || trail.eaccInvestigationStatus === 'Charged in Court' || trail.eaccInvestigationStatus === 'Active Probe';
      } else if (riskFilter === 'INTL_FLAGS') {
        matchesRisk = Boolean(trail.internationalConnections && trail.internationalConnections.length > 0);
      } else if (riskFilter === 'HIGH_RISK') {
        matchesRisk = trail.corruptionScoreRisk >= 50;
      } else if (riskFilter === 'CLEAN') {
        matchesRisk = trail.corruptionScoreRisk < 50;
      }

      return matchesSearch && matchesDonorType && matchesRisk;
    });
  }, [moneyTrails, searchFilter, donorTypeFilter, riskFilter]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalDonations = moneyTrails.reduce((sum, t) => sum + t.totalDonationsReceivedKsh, 0);
    const totalFlaggedConflicts = moneyTrails.reduce((sum, t) => sum + t.topDonors.filter(d => d.isFlaggedConflict).length, 0);
    const totalUnexplainedWealth = moneyTrails.reduce((sum, t) => sum + t.unexplainedWealthEstimateKsh, 0);
    const totalEaccChargesCount = moneyTrails.reduce((sum, t) => sum + (t.eaccCharges?.length || 0), 0);
    const totalIntlLinksCount = moneyTrails.reduce((sum, t) => sum + (t.internationalConnections?.length || 0), 0);

    return {
      totalDonations,
      totalFlaggedConflicts,
      totalUnexplainedWealth,
      totalEaccChargesCount,
      totalIntlLinksCount
    };
  }, [moneyTrails]);

  const activeLeaderTrail = useMemo(() => {
    if (!selectedLeaderId) return filteredTrails[0] || moneyTrails[0];
    return moneyTrails.find(m => m.leaderId === selectedLeaderId) || moneyTrails[0];
  }, [selectedLeaderId, moneyTrails, filteredTrails]);

  const activeCandidateObj = useMemo(() => {
    if (!activeLeaderTrail) return null;
    return candidates.find(c => c.id === activeLeaderTrail.leaderId || c.name.toLowerCase() === activeLeaderTrail.leaderName.toLowerCase());
  }, [activeLeaderTrail, candidates]);

  const formatKsh = (amount: number) => {
    if (amount >= 1000000000) return `KSh ${(amount / 1000000000).toFixed(2)}B`;
    if (amount >= 1000000) return `KSh ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `KSh ${(amount / 1000).toFixed(0)}K`;
    return `KSh ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 pb-24 text-neutral-900 dark:text-neutral-100">
      {/* HEADER HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950 text-white border-4 border-neutral-900 rounded-2xl p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 shadow-md">
                <DollarSign className="w-3.5 h-3.5" />
                TrackAIPAC Money & Influence
              </span>
              <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Follow The Money
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 border border-neutral-700"
                >
                  <Home className="w-4 h-4 text-amber-400" />
                  <span>Home Directory</span>
                </button>
              )}

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-1.5 border border-red-500"
              >
                <Plus className="w-4 h-4" />
                <span>{t.reportDonorBtn}</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            {t.moneyTrailTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl font-medium leading-relaxed">
            Track campaign funding sources, tenderpreneur conflicts, EACC prosecutions, expenditure patterns (helicopters, handouts, real estate), and suspicious international offshore connections.
          </p>

          {/* KPI STATS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3">
            <div className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-center">
              <span className="text-[9px] font-black uppercase text-neutral-400 block">Total Tracked Funds</span>
              <span className="text-sm sm:text-base font-black text-emerald-400 block">{formatKsh(stats.totalDonations)}</span>
            </div>
            <div className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-center">
              <span className="text-[9px] font-black uppercase text-neutral-400 block">Unexplained Wealth</span>
              <span className="text-sm sm:text-base font-black text-amber-400 block">{formatKsh(stats.totalUnexplainedWealth)}</span>
            </div>
            <div className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-center">
              <span className="text-[9px] font-black uppercase text-neutral-400 block">EACC Charges Flagged</span>
              <span className="text-sm sm:text-base font-black text-red-500 block">{stats.totalEaccChargesCount} Dockets</span>
            </div>
            <div className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-center">
              <span className="text-[9px] font-black uppercase text-neutral-400 block">Int'l Offshore Links</span>
              <span className="text-sm sm:text-base font-black text-purple-400 block">{stats.totalIntlLinksCount} Suspicious</span>
            </div>
            <div className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-center col-span-2 sm:col-span-1">
              <span className="text-[9px] font-black uppercase text-neutral-400 block">Tenderpreneur Conflicts</span>
              <span className="text-sm sm:text-base font-black text-red-400 block">{stats.totalFlaggedConflicts} Flagged</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY CIVIC AUDIT & MONEY TRAIL NAVIGATION TABS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveHubView('oag_findings')}
          className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
            activeHubView === 'oag_findings'
              ? 'bg-red-600 text-white border-red-600 shadow-lg ring-2 ring-red-500/30'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-red-500 text-neutral-800 dark:text-neutral-200'
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${activeHubView === 'oag_findings' ? 'bg-white/20 text-white' : 'bg-red-600/10 text-red-600 dark:text-red-400'}`}>
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-tight truncate">OAG Audit Findings</span>
              <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-md ${activeHubView === 'oag_findings' ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>
                10
              </span>
            </div>
            <span className={`text-[10px] font-bold block truncate ${activeHubView === 'oag_findings' ? 'text-red-100' : 'text-neutral-500'}`}>
              @civicsnsins & Nancy Gathungu
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveHubView('debt_clock')}
          className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
            activeHubView === 'debt_clock'
              ? 'bg-red-600 text-white border-red-600 shadow-lg ring-2 ring-red-500/30'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-red-500 text-neutral-800 dark:text-neutral-200'
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${activeHubView === 'debt_clock' ? 'bg-white/20 text-white' : 'bg-amber-600/10 text-amber-600 dark:text-amber-400'}`}>
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-tight truncate">Public Debt Clock</span>
              <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-md ${activeHubView === 'debt_clock' ? 'bg-white text-amber-700' : 'bg-amber-600 text-white'}`}>
                Live
              </span>
            </div>
            <span className={`text-[10px] font-bold block truncate ${activeHubView === 'debt_clock' ? 'text-red-100' : 'text-neutral-500'}`}>
              KES 875K / Family Calculator
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveHubView('civic_sources')}
          className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
            activeHubView === 'civic_sources'
              ? 'bg-purple-600 text-white border-purple-600 shadow-lg ring-2 ring-purple-500/30'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-purple-500 text-neutral-800 dark:text-neutral-200'
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${activeHubView === 'civic_sources' ? 'bg-white/20 text-white' : 'bg-purple-600/10 text-purple-600 dark:text-purple-400'}`}>
            <Video className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-tight truncate">Civic Creators & Sources</span>
              <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-md ${activeHubView === 'civic_sources' ? 'bg-white text-purple-700' : 'bg-purple-600 text-white'}`}>
                8 Portals
              </span>
            </div>
            <span className={`text-[10px] font-bold block truncate ${activeHubView === 'civic_sources' ? 'text-purple-100' : 'text-neutral-500'}`}>
              @civicsnsins & Verified Tools
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveHubView('money_trail')}
          className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
            activeHubView === 'money_trail'
              ? 'bg-red-600 text-white border-red-600 shadow-lg ring-2 ring-red-500/30'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-red-500 text-neutral-800 dark:text-neutral-200'
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 ${activeHubView === 'money_trail' ? 'bg-white/20 text-white' : 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400'}`}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-tight truncate">Leader Money Trails</span>
              <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-md ${activeHubView === 'money_trail' ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'}`}>
                {filteredTrails.length}
              </span>
            </div>
            <span className={`text-[10px] font-bold block truncate ${activeHubView === 'money_trail' ? 'text-red-100' : 'text-neutral-500'}`}>
              Donors, EACC & Super PACs
            </span>
          </div>
        </button>
      </div>

      {/* ACTIVE VIEW RENDERING */}
      {activeHubView === 'oag_findings' && (
        <AuditorGeneralFindingsHub
          candidates={candidates}
          onSelectCandidate={onSelectCandidate}
          onOpenAddEvidence={onOpenAddEvidence}
        />
      )}

      {activeHubView === 'debt_clock' && (
        <PublicDebtClock />
      )}

      {activeHubView === 'civic_sources' && (
        <CivicCreatorsAndSources />
      )}

      {activeHubView === 'money_trail' && (
        <div className="space-y-6">
          {/* FILTER CONTROLS BAR */}
          <div className="p-4 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search leader, donor, bill, or offshore entity..."
                  className="w-full pl-9 pr-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-900 dark:text-neutral-100 placeholder-neutral-500"
                />
              </div>

              {/* Donor Type Filter */}
              <select
                value={donorTypeFilter}
                onChange={(e) => setDonorTypeFilter(e.target.value)}
                className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200"
              >
                <option value="ALL">All Donor Categories</option>
                <option value="Government Tenderpreneur">Government Tenderpreneurs</option>
                <option value="Corporate / Mega-Corp">Corporate Mega-Corps</option>
                <option value="Foreign Interest / Proxy">Foreign Interest / Proxies</option>
                <option value="Private Equity / Real Estate">Private Equity / Real Estate</option>
                <option value="Super PAC / Interest Group">Super PACs & Lobby Groups</option>
                <option value="Grassroots / Citizen Micro-donations">Grassroots Citizen Micro-donations</option>
              </select>

              {/* Risk & Audit Status Filter */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200"
              >
                <option value="ALL">All Audit Statuses</option>
                <option value="EACC_CHARGED">⚖️ EACC Charged / Court Prosecutions</option>
                <option value="INTL_FLAGS">🌐 Suspicious International Links</option>
                <option value="HIGH_RISK">🔴 High Risk Corruption Index (≥50)</option>
                <option value="CLEAN">🟢 Clean Financial Audit Record</option>
              </select>
            </div>
          </div>

          {/* MAIN LAYOUT: LEADER SELECTOR CARDS + DEEP DRILLDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: POLITICIAN LIST CARDS */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Tracked Politicians ({filteredTrails.length})</span>
            <span className="text-[10px]">Click leader to audit money</span>
          </h2>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredTrails.map((trail) => {
              const candObj = candidates.find(c => c.id === trail.leaderId || c.name.toLowerCase() === trail.leaderName.toLowerCase());
              const isSelected = activeLeaderTrail?.leaderId === trail.leaderId;

              return (
                <div
                  key={trail.leaderId}
                  onClick={() => setSelectedLeaderId(trail.leaderId)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-red-600 shadow-xl ring-2 ring-red-500/50'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-900 dark:text-neutral-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {candObj?.photoUrl ? (
                        <img
                          src={candObj.photoUrl}
                          alt={trail.leaderName}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-neutral-700 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-neutral-800 text-white font-black text-base flex items-center justify-center border-2 border-neutral-700 shrink-0">
                          {trail.leaderName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-black text-sm uppercase leading-tight">
                          {trail.leaderName}
                        </h3>
                        <p className={`text-[11px] font-bold ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {candObj ? `${candObj.position} • ${candObj.county} (${candObj.party})` : 'Political Leader'}
                        </p>
                      </div>
                    </div>

                    {/* Corruption Risk Rating Badge */}
                    <div className="text-right shrink-0">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase rounded ${
                        trail.corruptionScoreRisk >= 70
                          ? 'bg-red-600 text-white'
                          : trail.corruptionScoreRisk >= 40
                          ? 'bg-amber-500 text-neutral-900'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        Risk: {trail.corruptionScoreRisk}/100
                      </span>
                      <span className="block text-[9px] font-bold uppercase text-neutral-400 mt-1">
                        {trail.eaccInvestigationStatus}
                      </span>
                    </div>
                  </div>

                  {/* Quick Audit Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-black uppercase">
                    {trail.eaccCharges && trail.eaccCharges.length > 0 && (
                      <span className="px-2 py-0.5 bg-red-600/20 text-red-500 border border-red-500/30 rounded flex items-center gap-1">
                        <Scale className="w-3 h-3" />
                        {trail.eaccCharges.length} EACC Docket(s)
                      </span>
                    )}
                    {trail.internationalConnections && trail.internationalConnections.length > 0 && (
                      <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {trail.internationalConnections.length} Int'l Link(s)
                      </span>
                    )}
                    {trail.expenditures && trail.expenditures.length > 0 && (
                      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded flex items-center gap-1">
                        <PieChart className="w-3 h-3" />
                        {trail.expenditures.length} Expenditure Audit(s)
                      </span>
                    )}
                  </div>

                  {/* Summary Bar */}
                  <div className={`grid grid-cols-2 gap-2 text-[10px] font-black uppercase p-2 rounded-lg ${
                    isSelected ? 'bg-neutral-800/90 text-neutral-200' : 'bg-neutral-100 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300'
                  }`}>
                    <div>
                      <span className="text-neutral-400 font-normal block">Total Donations:</span>
                      <span className="font-black text-emerald-500">{formatKsh(trail.totalDonationsReceivedKsh)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-normal block">Unexplained Wealth:</span>
                      <span className="font-black text-amber-500">{formatKsh(trail.unexplainedWealthEstimateKsh)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE LEADER FINANCIAL DEEP AUDIT */}
        <div className="lg:col-span-7 space-y-4">
          {activeLeaderTrail ? (
            <div className="bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 rounded-2xl p-5 space-y-6 shadow-xl">
              {/* Leader Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  {activeCandidateObj?.photoUrl ? (
                    <img
                      src={activeCandidateObj.photoUrl}
                      alt={activeLeaderTrail.leaderName}
                      className="w-16 h-16 rounded-2xl object-cover border-4 border-neutral-900 dark:border-neutral-700 shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center border-4 border-neutral-900 shadow-md">
                      {activeLeaderTrail.leaderName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
                        {activeLeaderTrail.leaderName}
                      </h2>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activeCandidateObj && (
                          <button
                            onClick={() => onSelectCandidate && onSelectCandidate(activeCandidateObj)}
                            className="px-2.5 py-1 bg-neutral-900 text-white dark:bg-neutral-800 text-[9px] font-black uppercase rounded hover:bg-red-600 transition-colors flex items-center gap-1 shadow-xs"
                            title="Open Full Candidate Dossier in Home"
                          >
                            <Home className="w-3 h-3 text-amber-400" />
                            <span>View Bio (Home)</span>
                          </button>
                        )}
                        {onOpenAddEvidence && (
                          <button
                            onClick={() => onOpenAddEvidence(activeCandidateObj || undefined)}
                            className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-black uppercase rounded hover:bg-neutral-900 transition-colors flex items-center gap-1 shadow-xs"
                            title="Attach Court / Tender / Donor Evidence Report"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ Add Evidence</span>
                          </button>
                        )}
                        {onNavigateHome && (
                          <button
                            onClick={onNavigateHome}
                            className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[9px] font-black uppercase rounded hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <span>Home</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-neutral-500 uppercase">
                      {activeCandidateObj ? `${activeCandidateObj.position} • ${activeCandidateObj.county} (${activeCandidateObj.party})` : 'Kenyan Politician'}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-black uppercase">
                      <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded">
                        EACC Status: {activeLeaderTrail.eaccInvestigationStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corruption Gauge */}
                <div className="bg-neutral-900 text-white p-3 rounded-xl border border-neutral-800 text-center space-y-1 sm:min-w-[140px]">
                  <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block">Corruption Risk</span>
                  <div className="text-2xl font-black text-red-500">
                    {activeLeaderTrail.corruptionScoreRisk}<span className="text-xs text-neutral-400">/100</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        activeLeaderTrail.corruptionScoreRisk >= 70 ? 'bg-red-600' : activeLeaderTrail.corruptionScoreRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${activeLeaderTrail.corruptionScoreRisk}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* NET WORTH & UNEXPLAINED WEALTH SUMMARY */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-1">
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase block">Declared Net Worth</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block">{formatKsh(activeLeaderTrail.declaredNetWorthKsh)}</span>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase block">Unexplained Wealth Estimate</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400 block">{formatKsh(activeLeaderTrail.unexplainedWealthEstimateKsh)}</span>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase block">Total Tracked Donations</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block">{formatKsh(activeLeaderTrail.totalDonationsReceivedKsh)}</span>
                </div>
              </div>

              {/* 5-PILLAR FINANCIAL AUDIT SUB-TABS */}
              <div className="flex items-center gap-1 overflow-x-auto border-b-2 border-neutral-200 dark:border-neutral-800 pb-2 text-xs font-black uppercase">
                <button
                  onClick={() => setActiveSectionTab('donors')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeSectionTab === 'donors'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>1. Money Sources ({activeLeaderTrail.topDonors.length})</span>
                </button>

                <button
                  onClick={() => setActiveSectionTab('expenditures')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeSectionTab === 'expenditures'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>2. Money Usage ({activeLeaderTrail.expenditures?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveSectionTab('eacc')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeSectionTab === 'eacc'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>3. EACC Charges ({activeLeaderTrail.eaccCharges?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveSectionTab('international')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeSectionTab === 'international'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>4. Int'l Links ({activeLeaderTrail.internationalConnections?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveSectionTab('lobbying')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    activeSectionTab === 'lobbying'
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>5. Lobbying ({activeLeaderTrail.influencesAndLobbying.length})</span>
                </button>
              </div>

              {/* SECTION 1: CAMPAIGN DONORS & MONEY SOURCES */}
              {activeSectionTab === 'donors' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                      <Building2 className="w-4 h-4" />
                      <span>Where Candidate Gets Money (Top Donors & Super PACs)</span>
                    </span>
                  </h3>

                  <div className="space-y-2.5">
                    {activeLeaderTrail.topDonors.map((donor) => (
                      <div
                        key={donor.id}
                        className={`p-3.5 rounded-xl border-2 transition-all space-y-2 ${
                          donor.isFlaggedConflict
                            ? 'bg-red-500/5 dark:bg-red-950/20 border-red-500/40'
                            : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-black text-xs uppercase text-neutral-900 dark:text-white block">
                              {donor.donorName}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase">
                              Category: <span className="text-neutral-700 dark:text-neutral-300">{donor.donorCategory}</span>
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 block">
                              {formatKsh(donor.amountKsh)}
                            </span>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase">
                              Date: {donor.date}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-medium">
                          <strong>Purpose:</strong> {donor.purpose}
                        </p>

                        {donor.isFlaggedConflict && (
                          <div className="p-2.5 bg-red-600/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-[11px] space-y-1">
                            <div className="flex items-center gap-1 font-black uppercase text-[10px]">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Tenderpreneur Conflict of Interest Flagged</span>
                            </div>
                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                              {donor.conflictReason}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 2: EXPENDITURES & WHAT MONEY IS USED FOR */}
              {activeSectionTab === 'expenditures' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <PieChart className="w-4 h-4" />
                      <span>What Money Is Used For (Expenditures & Asset Transfers)</span>
                    </span>
                  </h3>

                  {activeLeaderTrail.expenditures && activeLeaderTrail.expenditures.length > 0 ? (
                    <div className="space-y-2.5">
                      {activeLeaderTrail.expenditures.map((exp) => (
                        <div
                          key={exp.id}
                          className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-500/30 rounded-xl space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 dark:border-blue-900/50 pb-2">
                            <div>
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded mr-2">
                                {exp.category}
                              </span>
                              <span className="font-black text-xs uppercase text-neutral-900 dark:text-white">
                                {exp.itemDescription}
                              </span>
                            </div>
                            <span className="font-black text-sm text-blue-600 dark:text-blue-400">
                              {formatKsh(exp.amountKsh)}
                            </span>
                          </div>

                          <div className="text-[11px] text-neutral-700 dark:text-neutral-300 font-medium">
                            <p><strong>Recipient / Destination Entity:</strong> {exp.recipientOrDestination}</p>
                            {exp.flaggedReason && (
                              <p className="mt-1 text-red-600 dark:text-red-400 font-semibold bg-red-500/10 p-2 rounded border border-red-500/20">
                                🚨 Audit Flag: {exp.flaggedReason}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-neutral-50 dark:bg-neutral-800/40 rounded-xl text-neutral-500 font-semibold italic text-xs">
                      No public expenditure audit logs flagged for this leader yet.
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 3: EACC CHARGES & COURT DOCKETS */}
              {activeSectionTab === 'eacc' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <Scale className="w-4 h-4" />
                      <span>Charged by EACC & Court Prosecution Dockets</span>
                    </span>
                  </h3>

                  {activeLeaderTrail.eaccCharges && activeLeaderTrail.eaccCharges.length > 0 ? (
                    <div className="space-y-3">
                      {activeLeaderTrail.eaccCharges.map((chg) => (
                        <div
                          key={chg.id}
                          className="p-4 bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-500/40 rounded-xl space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-2">
                            <div>
                              <span className="px-2 py-0.5 bg-amber-600 text-neutral-950 text-[9px] font-black uppercase rounded mr-2">
                                {chg.caseNumber}
                              </span>
                              <span className="font-black text-xs uppercase text-neutral-900 dark:text-white">
                                {chg.chargeTitle}
                              </span>
                            </div>

                            <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-black uppercase rounded">
                              {chg.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-bold uppercase text-neutral-700 dark:text-neutral-300">
                            <p><strong>Court Jurisdiction:</strong> {chg.court}</p>
                            <p><strong>Graft Amount Involved:</strong> <span className="text-red-600 dark:text-red-400">{formatKsh(chg.amountInvolvedKsh)}</span></p>
                            {chg.sourceRef && <p className="col-span-2"><strong>Source File:</strong> {chg.sourceRef}</p>}
                          </div>

                          <p className="text-[11px] text-neutral-800 dark:text-neutral-200 font-medium bg-white dark:bg-neutral-950 p-2.5 rounded-lg border border-amber-500/30">
                            {chg.docketDetails}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-neutral-50 dark:bg-neutral-800/40 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold uppercase text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>No Active EACC Charges or Anti-Corruption Court Prosecutions On File</span>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 4: SUSPICIOUS INTERNATIONAL & OFFSHORE CONNECTIONS */}
              {activeSectionTab === 'international' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                      <Globe className="w-4 h-4" />
                      <span>Suspicious International, Offshore & Foreign Proxy Connections</span>
                    </span>
                  </h3>

                  {activeLeaderTrail.internationalConnections && activeLeaderTrail.internationalConnections.length > 0 ? (
                    <div className="space-y-3">
                      {activeLeaderTrail.internationalConnections.map((intl) => (
                        <div
                          key={intl.id}
                          className="p-4 bg-purple-500/10 dark:bg-purple-950/30 border-2 border-purple-500/40 rounded-xl space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/30 pb-2">
                            <div>
                              <span className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-black uppercase rounded mr-2">
                                🌐 {intl.countryOrRegion}
                              </span>
                              <span className="font-black text-xs uppercase text-neutral-900 dark:text-white">
                                {intl.entityName}
                              </span>
                            </div>

                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                              intl.riskLevel === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'
                            }`}>
                              {intl.riskLevel} INTL RISK
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-bold uppercase text-neutral-700 dark:text-neutral-300">
                            <p><strong>Connection Type:</strong> {intl.connectionType}</p>
                            {intl.amountOrAssetValueKsh ? (
                              <p><strong>Est. Offshore Asset Value:</strong> <span className="text-purple-600 dark:text-purple-300">{formatKsh(intl.amountOrAssetValueKsh)}</span></p>
                            ) : null}
                            {intl.evidenceRef && <p className="col-span-2"><strong>Intelligence Source:</strong> {intl.evidenceRef}</p>}
                          </div>

                          <p className="text-[11px] text-neutral-800 dark:text-neutral-200 font-medium bg-white dark:bg-neutral-950 p-2.5 rounded-lg border border-purple-500/30">
                            {intl.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-neutral-50 dark:bg-neutral-800/40 rounded-xl text-neutral-500 font-semibold italic text-xs">
                      No suspicious international offshore shell companies or foreign proxy links reported for this politician.
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 5: LOBBYING & POLICY INFLUENCE EVENTS */}
              {activeSectionTab === 'lobbying' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    <span className="flex items-center gap-1.5 text-neutral-900 dark:text-white">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      <span>Policy Lobbying & Quid-Pro-Quo Vote Flips</span>
                    </span>
                  </h3>

                  {activeLeaderTrail.influencesAndLobbying.length > 0 ? (
                    <div className="space-y-3">
                      {activeLeaderTrail.influencesAndLobbying.map((event) => (
                        <div
                          key={event.id}
                          className="p-4 bg-neutral-900 text-white border-2 border-neutral-800 rounded-xl space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
                            <div>
                              <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-black uppercase rounded mr-2">
                                {event.billIdOrClause}
                              </span>
                              <span className="font-black text-xs uppercase text-neutral-100">
                                {event.billTitle}
                              </span>
                            </div>

                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                              event.riskRating === 'CRITICAL' ? 'bg-red-600 text-white' : event.riskRating === 'HIGH' ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'
                            }`}>
                              {event.riskRating} RISK
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-bold uppercase text-neutral-300">
                            <p><strong>Lobby Group:</strong> {event.sponsorOrGroup}</p>
                            <p><strong>Est. Cash Flow:</strong> {formatKsh(event.amountEstimatedKsh)}</p>
                            <p><strong>Legislative Outcome:</strong> <span className="text-emerald-400">{event.outcome}</span></p>
                            {event.evidenceRef && <p><strong>Source / Ref:</strong> {event.evidenceRef}</p>}
                          </div>

                          <p className="text-[11px] text-neutral-200 font-medium bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                            {event.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 font-semibold italic p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg text-center">
                      No active legislative lobbying events reported for this politician yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-800 rounded-2xl text-neutral-500 font-bold uppercase">
              Select a politician from the left list to inspect campaign donor trails & corruption links.
            </div>
          )}
        </div>
      </div>
    </div>
  )}

      {/* REPORT DONOR & CORRUPTION LINK MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-neutral-900 dark:text-neutral-100">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 text-red-600">
                <DollarSign className="w-5 h-5" />
                <span>Report Donor Money & Corruption Link</span>
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDonationReport} className="space-y-4 text-xs font-bold uppercase">
              <div>
                <label className="block text-[10px] text-neutral-500 mb-1">Politician Name</label>
                <input
                  type="text"
                  value={newLeaderName}
                  onChange={(e) => setNewLeaderName(e.target.value)}
                  placeholder="e.g. Kimani Ichung'wah, Governor Johnson Sakaja..."
                  required
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Donor Company or Individual</label>
                  <input
                    type="text"
                    value={newDonorName}
                    onChange={(e) => setNewDonorName(e.target.value)}
                    placeholder="e.g. Mount Kenya Construction Co."
                    required
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Donor Category</label>
                  <select
                    value={newDonorType}
                    onChange={(e) => setNewDonorType(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                  >
                    <option value="Government Tenderpreneur">Government Tenderpreneur</option>
                    <option value="Corporate / Mega-Corp">Corporate / Mega-Corp</option>
                    <option value="Foreign Interest / Proxy">Foreign Interest / Proxy</option>
                    <option value="Private Equity / Real Estate">Private Equity / Real Estate</option>
                    <option value="Super PAC / Interest Group">Super PAC / Interest Group</option>
                    <option value="Grassroots / Citizen Micro-donations">Grassroots Micro-donations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Donation Amount (KSh)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 5000000"
                    required
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Purpose / Context</label>
                  <input
                    type="text"
                    value={newPurpose}
                    onChange={(e) => setNewPurpose(e.target.value)}
                    placeholder="e.g. Campaign Dinner Sponsorship"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-red-500 mb-1">Tenderpreneur Conflict / Quid-Pro-Quo Reason (Optional)</label>
                <textarea
                  value={newConflictReason}
                  onChange={(e) => setNewConflictReason(e.target.value)}
                  placeholder="e.g. Company was awarded KSh 2B road maintenance tender 1 month after campaign funding."
                  rows={2}
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-500 mb-1">Influenced Bill or Clause (Optional)</label>
                <input
                  type="text"
                  value={newBillTarget}
                  onChange={(e) => setNewBillTarget(e.target.value)}
                  placeholder="e.g. Finance Bill 2024 - Edible Oil Tax Exemption"
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
              >
                Submit Money Trail Audit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
