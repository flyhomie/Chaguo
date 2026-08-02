import React, { useState, useMemo, useEffect } from 'react';
import { Candidate, TagColor, CandidatePosition, CitizenEvidenceReport } from './types';
import { INITIAL_CANDIDATES } from './data/candidates';
import { INITIAL_EVIDENCE_REPORTS } from './data/evidenceReports';
import { KENYAN_COUNTIES } from './data/counties';
import { FINANCE_BILL_CLAUSES } from './data/financeBills';
import { Header, TabType } from './components/Header';
import { TagLegend } from './components/TagLegend';
import { CandidateCard } from './components/CandidateCard';
import { CandidateModal } from './components/CandidateModal';
import { CompareView } from './components/CompareView';
import { FinanceBillsView } from './components/FinanceBillsView';
import { AIAssistantView } from './components/AIAssistantView';
import { EducationView } from './components/EducationView';
import { MyBallotView } from './components/MyBallotView';
import { GoodLeadersView } from './components/GoodLeadersView';
import { CitizenEvidenceView } from './components/CitizenEvidenceView';
import { AuthModal, LocalUser } from './components/AuthModal';
import { AddCandidateModal } from './components/AddCandidateModal';
import { SettingsModal } from './components/SettingsModal';
import { DonationsModal } from './components/DonationsModal';
import { PWAPromptModal } from './components/PWAPromptModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { LandingPage } from './components/LandingPage';
import { ElectionCountdownBanner } from './components/ElectionCountdownBanner';
import { CountyCandidateMap } from './components/CountyCandidateMap';
import { BottomNav } from './components/BottomNav';
import { MapPin, Filter, RotateCcw, ShieldAlert, UserPlus, Smartphone, Download, LayoutGrid, List } from 'lucide-react';

export default function App() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDonationsModalOpen, setIsDonationsModalOpen] = useState(false);
  const [isPWAModalOpen, setIsPWAModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isLandingModalOpen, setIsLandingModalOpen] = useState(() => {
    try {
      const dismissed = sessionStorage.getItem('chaguo_landing_dismissed');
      return !dismissed;
    } catch {
      return true;
    }
  });

  const handleCloseLanding = () => {
    setIsLandingModalOpen(false);
    try {
      sessionStorage.setItem('chaguo_landing_dismissed', 'true');
    } catch (e) {}
  };
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewportMode, setViewportMode] = useState<'auto' | 'desktop' | 'mobile'>(() => {
    try {
      const saved = localStorage.getItem('chaguo_viewport_preference');
      return (saved as 'auto' | 'desktop' | 'mobile') || 'auto';
    } catch {
      return 'auto';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chaguo_viewport_preference', viewportMode);
    } catch (e) {}
  }, [viewportMode]);
  // Local candidates state with localStorage persistence
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem('chaguo_candidates');
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chaguo_candidates', JSON.stringify(candidates));
    } catch (e) {
      console.error(e);
    }
  }, [candidates]);

  const handleAddCandidate = (newCandidate: Candidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  // Local User Authentication State
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(() => {
    try {
      const saved = localStorage.getItem('chaguo_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);

  const handleLogin = (user: LocalUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('chaguo_current_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('chaguo_current_user');
    } catch (e) {
      console.error(e);
    }
  };

  const openAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const [activeTab, setActiveTab] = useState<TabType>('directory');
  
  // Theme state: light or dark mode
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('chaguo_theme');
      return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('chaguo_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Citizen Evidence Reports State
  const [evidenceReports, setEvidenceReports] = useState<CitizenEvidenceReport[]>(() => {
    try {
      const saved = localStorage.getItem('chaguo_evidence_reports');
      return saved ? JSON.parse(saved) : INITIAL_EVIDENCE_REPORTS;
    } catch {
      return INITIAL_EVIDENCE_REPORTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chaguo_evidence_reports', JSON.stringify(evidenceReports));
    } catch (e) {
      console.error(e);
    }
  }, [evidenceReports]);

  const handleAddEvidenceReport = (newReport: Omit<CitizenEvidenceReport, 'id' | 'timestamp' | 'upvotes' | 'status'>) => {
    const report: CitizenEvidenceReport = {
      ...newReport,
      id: `rep-${Date.now()}`,
      timestamp: new Date().toISOString().split('T')[0],
      upvotes: 1,
      status: 'verified'
    };
    setEvidenceReports((prev) => [report, ...prev]);
  };

  const handleUpvoteReport = (reportId: string) => {
    setEvidenceReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagColor | 'all'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<CandidatePosition | 'all'>('all');
  const [selectedVoteFilter, setSelectedVoteFilter] = useState<'all' | 'yes2024' | 'no2024' | 'yes2025' | 'no2025'>('all');
  const [selectedCrimeFilter, setSelectedCrimeFilter] = useState<'all' | 'good_leaders' | 'corruption' | 'sexual_violence' | 'robbery_crime'>('all');

  // Interactive Selection states
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<Candidate | null>(null);
  const [comparedCandidates, setComparedCandidates] = useState<Candidate[]>([]);
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chaguo_saved_ballot');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [prefilledAIPrompt, setPrefilledAIPrompt] = useState<string>('');

  // Save candidate to local ballot state
  useEffect(() => {
    try {
      localStorage.setItem('chaguo_saved_ballot', JSON.stringify(savedCandidateIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedCandidateIds]);

  const toggleSaveCandidate = (candidate: Candidate) => {
    setSavedCandidateIds((prev) =>
      prev.includes(candidate.id)
        ? prev.filter((id) => id !== candidate.id)
        : [...prev, candidate.id]
    );
  };

  const toggleCompareCandidate = (candidate: Candidate) => {
    setComparedCandidates((prev) => {
      if (prev.some((c) => c.id === candidate.id)) {
        return prev.filter((c) => c.id !== candidate.id);
      }
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 candidates simultaneously.");
        return prev;
      }
      return [...prev, candidate];
    });
  };

  const handleAskAIAboutCandidate = (candidate: Candidate) => {
    setPrefilledAIPrompt(`Give me a detailed factual analysis of ${candidate.name} (${candidate.position}, ${candidate.county}), including their legal case records (corruption, sexual offences, robbery), development projects, voting history, and ties.`);
    setSelectedCandidateForModal(null);
    setActiveTab('ai-assistant');
  };

  // Tag Counts
  const redCount = candidates.filter((c) => c.tagColor === 'red').length;
  const greenCount = candidates.filter((c) => c.tagColor === 'green').length;
  const purpleCount = candidates.filter((c) => c.tagColor === 'purple').length;

  // Filtered Candidates computation
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCounty = c.county.toLowerCase().includes(q);
        const matchesConst = c.constituency?.toLowerCase().includes(q) || false;
        const matchesWard = c.ward?.toLowerCase().includes(q) || false;
        const matchesParty = c.party.toLowerCase().includes(q);
        const matchesReason = c.tagReason.toLowerCase().includes(q);
        if (!matchesName && !matchesCounty && !matchesConst && !matchesWard && !matchesParty && !matchesReason) {
          return false;
        }
      }

      // Tag Filter
      if (selectedTag !== 'all' && c.tagColor !== selectedTag) {
        return false;
      }

      // County Filter
      if (selectedCounty !== 'all' && c.county !== selectedCounty) {
        return false;
      }

      // Position Filter
      if (selectedPosition !== 'all' && c.position !== selectedPosition) {
        return false;
      }

      // Finance Bill Vote Filter
      if (selectedVoteFilter === 'yes2024' && c.votes.financeBill2024 !== 'YES') return false;
      if (selectedVoteFilter === 'no2024' && c.votes.financeBill2024 !== 'NO') return false;
      if (selectedVoteFilter === 'yes2025' && c.votes.financeBill2025 !== 'YES') return false;
      if (selectedVoteFilter === 'no2025' && c.votes.financeBill2025 !== 'NO') return false;

      // Crime / Integrity Filter
      if (selectedCrimeFilter === 'good_leaders' && !c.isGoodLeaderChampion) return false;
      if (selectedCrimeFilter === 'corruption' && c.corruptionStatus === 'clean') return false;
      if (selectedCrimeFilter === 'sexual_violence' && c.sexualViolenceStatus === 'clean') return false;
      if (selectedCrimeFilter === 'robbery_crime' && c.robberyCrimeStatus === 'clean') return false;

      return true;
    });
  }, [candidates, searchQuery, selectedTag, selectedCounty, selectedPosition, selectedVoteFilter, selectedCrimeFilter]);

  const savedCandidatesList = candidates.filter((c) => savedCandidateIds.includes(c.id));

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTag('all');
    setSelectedCounty('all');
    setSelectedPosition('all');
    setSelectedVoteFilter('all');
    setSelectedCrimeFilter('all');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'} font-sans selection:bg-red-600 selection:text-white flex flex-col justify-between transition-colors duration-200`}>
      <div>
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          savedCount={savedCandidateIds.length}
          theme={theme}
          onToggleTheme={toggleTheme}
          currentUser={currentUser}
          onOpenAuth={openAuth}
          onOpenAddCandidate={() => setIsAddCandidateModalOpen(true)}
          onOpenAddEvidence={() => setActiveTab('evidence')}
          onOpenPWA={() => setIsPWAModalOpen(true)}
          onOpenDrive={() => setIsDriveModalOpen(true)}
          onOpenLanding={() => setIsLandingModalOpen(true)}
        />

        {/* Live Kenya 2027 Election Countdown Notification Banner */}
        <ElectionCountdownBanner onOpenEducation={() => setActiveTab('education')} />

        {/* Main Content Area */}
        <main
          className={`mx-auto pt-6 pb-24 transition-all duration-300 ${
            viewportMode === 'mobile'
              ? 'max-w-[430px] border-x-4 border-b-4 border-red-600 dark:border-red-600 shadow-2xl px-2.5 bg-white dark:bg-neutral-900 rounded-b-3xl min-h-[85vh]'
              : viewportMode === 'desktop'
              ? 'max-w-[1750px] px-3 sm:px-6 lg:px-8'
              : 'max-w-[1680px] px-2.5 sm:px-4 lg:px-6'
          }`}
        >
          {/* Active Viewport Mode Indicator Banner if Forced */}
          {viewportMode !== 'auto' && (
            <div className="mb-3 p-2 bg-neutral-900 text-white dark:bg-red-600 dark:text-white border-2 border-neutral-800 text-[10px] font-black uppercase flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>ACTIVE VIEWPORT MODE: {viewportMode.toUpperCase()} VIEW</span>
              </div>
              <button
                onClick={() => setViewportMode('auto')}
                className="underline hover:text-amber-300 text-[9px]"
              >
                RESET TO AUTO
              </button>
            </div>
          )}
          
          {/* TAB 1: CANDIDATE DIRECTORY */}
          {activeTab === 'directory' && (
            <div className="space-y-4">
              
              {/* Bold Typography Hero Header */}
              <div className="border-b-2 border-neutral-900 dark:border-neutral-700 pb-4 pt-1">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tighter text-neutral-900 dark:text-neutral-100">
                      KNOW THE LEADERS YOU <span className="text-red-600">ELECT.</span>
                    </h1>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400 font-bold text-xs sm:text-sm uppercase max-w-2xl">
                      The 2027 Kenyan Voter Accountability Portal. Track corruption dockets, defilement/rape cases, robbery records, MCA performance, and good leaders doing real development.
                    </p>
                  </div>

                  <div className="bg-neutral-900 text-white px-5 py-3 border-2 border-neutral-900 dark:border-neutral-700 flex items-center gap-4 shrink-0">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Database Total</div>
                      <div className="text-3xl font-black italic tracking-tighter text-red-500">349+</div>
                    </div>
                    <div className="text-xs font-black uppercase leading-tight border-l border-neutral-800 pl-3">
                      MCAs & Leaders<br/>Tracked
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorization Index Legend */}
              <TagLegend
                redCount={redCount}
                greenCount={greenCount}
                purpleCount={purpleCount}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
              />

              {/* Visual Kenya County Candidate Density Map Component */}
              <CountyCandidateMap
                candidates={candidates}
                selectedCounty={selectedCounty}
                onSelectCounty={(county) => setSelectedCounty(county)}
                selectedTag={selectedTag}
              />

              {/* Secondary Filter Controls Bar */}
              <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-2.5 sm:p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 font-bold text-xs uppercase">
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* County Selector */}
                  <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-xs">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <select
                      value={selectedCounty}
                      onChange={(e) => setSelectedCounty(e.target.value)}
                      className="bg-transparent text-xs text-neutral-900 dark:text-neutral-100 font-black uppercase focus:outline-none"
                    >
                      <option value="all">ALL COUNTIES</option>
                      {KENYAN_COUNTIES.map((ct) => (
                        <option key={ct.code} value={ct.name}>
                          {ct.name} COUNTY
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Position Selector (Includes MCA!) */}
                  <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-xs">
                    <Filter className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
                    <select
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value as CandidatePosition | 'all')}
                      className="bg-transparent text-xs text-neutral-900 dark:text-neutral-100 font-black uppercase focus:outline-none"
                    >
                      <option value="all">ALL POSITIONS</option>
                      <option value="MP">MP (CONSTITUENCY)</option>
                      <option value="MCA">MCA (COUNTY WARD)</option>
                      <option value="Senator">SENATOR</option>
                      <option value="Governor">GOVERNOR</option>
                      <option value="Woman Rep">WOMAN REP</option>
                      <option value="Presidential Aspirant">PRESIDENTIAL ASPIRANT</option>
                    </select>
                  </div>

                  {/* Crime & Legal Docket Filter */}
                  <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-xs">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    <select
                      value={selectedCrimeFilter}
                      onChange={(e) => setSelectedCrimeFilter(e.target.value as any)}
                      className="bg-transparent text-xs text-neutral-900 dark:text-neutral-100 font-black uppercase focus:outline-none"
                    >
                      <option value="all">ALL INTEGRITY RECORDS</option>
                      <option value="good_leaders">🌟 GOOD LEADERS / CHAMPIONS</option>
                      <option value="corruption">🚨 CORRUPTION CASES</option>
                      <option value="sexual_violence">⚖️ RAPE / DEFILEMENT CASES</option>
                      <option value="robbery_crime">🗡️ ROBBERY / VIOLENCE CASES</option>
                    </select>
                  </div>

                  {/* Vote Filter */}
                  <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-xs">
                    <select
                      value={selectedVoteFilter}
                      onChange={(e) => setSelectedVoteFilter(e.target.value as any)}
                      className="bg-transparent text-xs text-neutral-900 dark:text-neutral-100 font-black uppercase focus:outline-none"
                    >
                      <option value="all">ALL FINANCE BILL VOTES</option>
                      <option value="yes2024">FB 2024: VOTED YES</option>
                      <option value="no2024">FB 2024: VOTED NO</option>
                      <option value="yes2025">FB 2025: VOTED YES</option>
                      <option value="no2025">FB 2025: VOTED NO</option>
                    </select>
                  </div>
                </div>

                {/* Reset, Status Count & View Switcher */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Grid vs List View Selector */}
                  <div className="flex items-center border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-xs">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-2 py-1 flex items-center gap-1 text-[11px] font-black uppercase transition-colors rounded-xs ${
                        viewMode === 'grid'
                          ? 'bg-neutral-900 text-white dark:bg-red-600'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                      title="Grid View (Dense multi-column - fits max profiles per row)"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>GRID</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-2 py-1 flex items-center gap-1 text-[11px] font-black uppercase transition-colors rounded-xs ${
                        viewMode === 'list'
                          ? 'bg-neutral-900 text-white dark:bg-red-600'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                      title="List View (Horizontal rows)"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>LIST</span>
                    </button>
                  </div>

                  <span className="text-neutral-500 font-bold text-xs">
                    SHOWING <strong className="text-neutral-900 dark:text-neutral-100 font-black">{filteredCandidates.length}</strong> LEADERS
                  </span>

                  {(searchQuery || selectedTag !== 'all' || selectedCounty !== 'all' || selectedPosition !== 'all' || selectedVoteFilter !== 'all' || selectedCrimeFilter !== 'all') && (
                    <button
                      onClick={resetFilters}
                      className="px-2.5 py-1 bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-red-600 font-black text-xs uppercase transition-colors flex items-center gap-1 rounded-xs"
                    >
                      <RotateCcw className="w-3 h-3" /> RESET
                    </button>
                  )}
                </div>
              </div>

              {/* Grid or List of Candidates */}
              {filteredCandidates.length === 0 ? (
                <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-12 text-center space-y-3">
                  <p className="text-neutral-500 font-bold uppercase text-xs">No leaders match your current filter parameters.</p>
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-black uppercase tracking-wider transition-colors"
                  >
                    CLEAR ALL FILTERS
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                /* Dense Multi-column Grid: fits as many profiles in a row as possible (2 cols on mobile, 3 on sm, 4 on md, 5 on lg, 6 on xl, 7 on 2xl) */
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 items-stretch">
                  {filteredCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onSelect={setSelectedCandidateForModal}
                      isSaved={savedCandidateIds.includes(candidate.id)}
                      onToggleSave={toggleSaveCandidate}
                      onCompareToggle={toggleCompareCandidate}
                      isCompared={comparedCandidates.some((c) => c.id === candidate.id)}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                /* Sleek List View Row Stack */
                <div className="space-y-2">
                  {filteredCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onSelect={setSelectedCandidateForModal}
                      isSaved={savedCandidateIds.includes(candidate.id)}
                      onToggleSave={toggleSaveCandidate}
                      onCompareToggle={toggleCompareCandidate}
                      isCompared={comparedCandidates.some((c) => c.id === candidate.id)}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GOOD LEADERS SECTION */}
          {activeTab === 'good-leaders' && (
            <GoodLeadersView
              candidates={candidates}
              onSelectCandidate={setSelectedCandidateForModal}
            />
          )}

          {/* TAB 3: CITIZEN EVIDENCE UPLOAD PORTAL */}
          {activeTab === 'evidence' && (
            <CitizenEvidenceView
              reports={evidenceReports}
              onAddReport={handleAddEvidenceReport}
              onUpvote={handleUpvoteReport}
              onOpenDrive={() => setIsDriveModalOpen(true)}
            />
          )}

          {/* TAB 4: FINANCE BILL VOTES */}
          {activeTab === 'finance-bills' && (
            <FinanceBillsView
              clauses={FINANCE_BILL_CLAUSES}
              candidates={candidates}
              onSelectCandidate={setSelectedCandidateForModal}
            />
          )}

          {/* TAB 5: COMPARE CANDIDATES */}
          {activeTab === 'compare' && (
            <CompareView
              candidates={comparedCandidates}
              onRemove={(id) => setComparedCandidates((prev) => prev.filter((c) => c.id !== id))}
              onClear={() => setComparedCandidates([])}
              allCandidates={candidates}
              onAddCandidate={(c) => toggleCompareCandidate(c)}
              onSelectDetail={setSelectedCandidateForModal}
            />
          )}

          {/* TAB 6: AI VOTER ASSISTANT */}
          {activeTab === 'ai-assistant' && (
            <AIAssistantView
              candidates={candidates}
              prefilledPrompt={prefilledAIPrompt}
              onClearPrefilledPrompt={() => setPrefilledAIPrompt('')}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* TAB 7: CIVIC EDUCATION */}
          {activeTab === 'education' && <EducationView />}

          {/* TAB 8: MY BALLOT */}
          {activeTab === 'my-ballot' && (
            <MyBallotView
              savedCandidates={savedCandidatesList}
              onRemove={(id) => setSavedCandidateIds((prev) => prev.filter((item) => item !== id))}
              onClearAll={() => setSavedCandidateIds([])}
              onSelectDetail={setSelectedCandidateForModal}
            />
          )}

        </main>
      </div>

      {/* Candidate Detail Modal Popup */}
      <CandidateModal
        candidate={selectedCandidateForModal}
        onClose={() => setSelectedCandidateForModal(null)}
        isSaved={selectedCandidateForModal ? savedCandidateIds.includes(selectedCandidateForModal.id) : false}
        onToggleSave={toggleSaveCandidate}
        onAskAIAboutCandidate={handleAskAIAboutCandidate}
      />

      {/* Local Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        viewportMode={viewportMode}
        onToggleViewportMode={setViewportMode}
      />

      {/* Add / Upload Candidate Modal */}
      <AddCandidateModal
        isOpen={isAddCandidateModalOpen}
        onClose={() => setIsAddCandidateModalOpen(false)}
        onAddCandidate={handleAddCandidate}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        viewportMode={viewportMode}
        onToggleViewportMode={setViewportMode}
        onOpenDrive={() => setIsDriveModalOpen(true)}
      />

      {/* Google Drive Integration Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
      />

      {/* Donations Modal */}
      <DonationsModal
        isOpen={isDonationsModalOpen}
        onClose={() => setIsDonationsModalOpen(false)}
      />

      {/* PWA Download & Unstoppable Node Modal */}
      <PWAPromptModal
        isOpen={isPWAModalOpen}
        onClose={() => setIsPWAModalOpen(false)}
        onSelectTab={setActiveTab}
      />

      {/* Landing Page Modal with Vote Animation & Sign In / Sign Up */}
      <LandingPage
        isOpen={isLandingModalOpen}
        onClose={handleCloseLanding}
        onOpenSignIn={() => openAuth('signin')}
        onOpenSignUp={() => openAuth('signup')}
      />

      {/* Sticky Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenProfile={() => openAuth('signin')}
        onOpenDonations={() => setIsDonationsModalOpen(true)}
        onOpenPWA={() => setIsPWAModalOpen(true)}
        onOpenAddCandidate={() => setIsAddCandidateModalOpen(true)}
        onOpenLanding={() => setIsLandingModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Sticky Design Theme Footer */}
      <footer className="bg-neutral-100 dark:bg-neutral-900 px-6 sm:px-10 py-5 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-widest border-t-2 border-neutral-900 dark:border-neutral-700 mt-12 mb-14 gap-4 text-neutral-900 dark:text-neutral-100 transition-colors">
        <div>2027 VOTER AWARENESS & ACCOUNTABILITY PROJECT</div>
        <div className="flex gap-6 items-center text-neutral-600 dark:text-neutral-400">
          <span>UPDATED HANSARD & JUDICIARY ROLLS</span>
          <span className="text-red-600 dark:text-red-400 font-black">#CHAGUO2027</span>
        </div>
      </footer>
    </div>
  );
}
