import React, { useState } from 'react';
import { Candidate } from '../types';
import { Award, CheckCircle2, Building, Sparkles, MapPin, ExternalLink, BookmarkCheck, Bookmark, ChevronRight } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';

interface GoodLeadersViewProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  savedCandidateIds?: string[];
  onToggleSave?: (candidate: Candidate) => void;
  onAskAIAboutCandidate?: (candidate: Candidate) => void;
}

export const GoodLeadersView: React.FC<GoodLeadersViewProps> = ({
  candidates,
  onSelectCandidate,
  savedCandidateIds,
  onToggleSave,
  onAskAIAboutCandidate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');

  // Filter good leaders: 100% clean record on corruption, sexual violence, robbery AND flagged as champion or voted NO to Finance Bills with projects
  const goodLeaders = candidates.filter((c) => {
    const isCleanIntegrity = 
      c.corruptionStatus === 'clean' &&
      c.sexualViolenceStatus === 'clean' &&
      c.robberyCrimeStatus === 'clean';

    const possessesDevelopment = 
      c.isGoodLeaderChampion || 
      (c.developmentProjects && c.developmentProjects.length > 0) ||
      c.tagColor === 'green';

    if (!isCleanIntegrity || !possessesDevelopment) return false;

    if (selectedCounty !== 'all' && c.county !== selectedCounty) return false;

    if (selectedCategory !== 'all') {
      const hasMatchingProject = c.developmentProjects?.some((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchesHighlight = c.goodLeaderHighlights?.some((h) => h.toLowerCase().includes(selectedCategory.toLowerCase()));
      if (!hasMatchingProject && !matchesHighlight) return false;
    }

    return true;
  });

  const countiesList = Array.from(new Set(candidates.map((c) => c.county))).sort();

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white border-2 border-neutral-900 p-6 sm:p-8 shadow-sm space-y-4 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest">
          <Award className="w-3.5 h-3.5" /> INTEGRITY & DEVELOPMENT CHAMPIONS
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">
              Good Leaders Portal: Zero Cases & Real Development
            </h2>
            <p className="text-xs sm:text-sm font-bold text-neutral-300 uppercase leading-relaxed">
              Verified list of Kenyan leaders (MPs, Senators, Governors, and MCAs) with <strong>ZERO corruption convictions</strong>, <strong>ZERO sexual violence / defilement cases</strong>, <strong>ZERO robbery records</strong>, and documented community development achievements.
            </p>
          </div>

          <div className="bg-green-600 text-white p-5 border-2 border-white flex flex-col justify-center items-center text-center shrink-0">
            <span className="text-4xl font-black font-mono leading-none">{goodLeaders.length}</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Clean Record Champions</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-bold text-xs uppercase text-neutral-900 dark:text-neutral-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-2 border-2 border-neutral-900 dark:border-neutral-700">
            <MapPin className="w-3.5 h-3.5 text-green-600" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="bg-transparent text-xs text-neutral-900 dark:text-neutral-100 font-black uppercase focus:outline-none cursor-pointer"
            >
              <option value="all">ALL COUNTIES ({countiesList.length})</option>
              {countiesList.map((ct) => (
                <option key={ct} value={ct}>
                  {ct} COUNTY
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-2 border-2 border-neutral-900 dark:border-neutral-700">
            <Building className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-neutral-900 dark:text-neutral-100 font-black uppercase focus:outline-none cursor-pointer"
            >
              <option value="all">ALL DEVELOPMENT SECTORS</option>
              <option value="education">EDUCATION & BURSARIES</option>
              <option value="infrastructure">INFRASTRUCTURE & HOUSING</option>
              <option value="water">WATER & SANITATION</option>
              <option value="healthcare">HEALTHCARE FACILITIES</option>
            </select>
          </div>
        </div>

        <div className="text-neutral-500 font-black text-[11px] uppercase">
          SHOWING {goodLeaders.length} VERIFIED CHAMPIONS
        </div>
      </div>

      {/* Grid of Good Leaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goodLeaders.map((c) => {
          const isSaved = savedCandidateIds.includes(c.id);
          return (
            <div
              key={c.id}
              className="bg-white dark:bg-neutral-900 border-4 border-green-600 p-6 flex flex-col justify-between shadow-sm space-y-4"
            >
              <div>
                {/* Header Row */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% CLEAN INTEGRITY RECORD
                  </span>

                  <button
                    onClick={() => onToggleSave(c)}
                    className={`p-1.5 border-2 transition-colors ${
                      isSaved
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-900 dark:border-neutral-700 hover:bg-neutral-200'
                    }`}
                    title={isSaved ? "Saved to Ballot" : "Save Candidate"}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Profile Brief */}
                <div className="flex items-start gap-4">
                  <DemonicAvatar seed={c.id} name={c.name} tagColor={c.tagColor} size="lg" />

                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">
                      {c.name}
                    </h3>
                    <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-widest mt-0.5">
                      {c.position} • {c.county} {c.ward ? `(${c.ward})` : c.constituency ? `(${c.constituency})` : ''}
                    </p>
                    <p className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 uppercase mt-1">
                      PARTY: <span className="font-black text-neutral-900 dark:text-neutral-100">{c.party}</span>
                    </p>
                  </div>
                </div>

                {/* Verified Integrity Scorecard */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-black uppercase text-center">
                  <div className="bg-green-50 dark:bg-neutral-800 text-green-700 dark:text-green-300 p-2 border border-green-300 dark:border-green-800">
                    <span className="block text-neutral-400 text-[9px]">CORRUPTION</span>
                    <span>0 CASES</span>
                  </div>
                  <div className="bg-green-50 dark:bg-neutral-800 text-green-700 dark:text-green-300 p-2 border border-green-300 dark:border-green-800">
                    <span className="block text-neutral-400 text-[9px]">SEXUAL VIOLENCE</span>
                    <span>CLEAN</span>
                  </div>
                  <div className="bg-green-50 dark:bg-neutral-800 text-green-700 dark:text-green-300 p-2 border border-green-300 dark:border-green-800">
                    <span className="block text-neutral-400 text-[9px]">ROBBERY/CRIME</span>
                    <span>CLEAN</span>
                  </div>
                </div>

                {/* Development Highlights */}
                {c.goodLeaderHighlights && c.goodLeaderHighlights.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-green-600" /> Key Development Achievements:
                    </span>
                    <ul className="space-y-1.5 text-xs font-bold uppercase text-neutral-800 dark:text-neutral-200">
                      {c.goodLeaderHighlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-neutral-100 dark:bg-neutral-800 p-2 border-l-4 border-green-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specific Projects */}
                {c.developmentProjects && c.developmentProjects.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Documented Community Projects:
                    </span>
                    <div className="space-y-2">
                      {c.developmentProjects.map((p) => (
                        <div key={p.id} className="bg-white dark:bg-neutral-950 p-3 border-2 border-neutral-900 dark:border-neutral-700 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black uppercase text-neutral-900 dark:text-neutral-100">{p.title}</span>
                            <span className="px-2 py-0.5 bg-neutral-900 text-white dark:bg-neutral-800 text-[9px] font-black uppercase">{p.category} • {p.year}</span>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-bold uppercase">{p.description}</p>
                          <p className="text-[11px] text-green-700 dark:text-green-400 font-black uppercase mt-1">Impact: {p.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t-2 border-neutral-900 dark:border-neutral-700">
                <button
                  onClick={() => onSelectCandidate(c)}
                  className="flex-1 bg-neutral-900 hover:bg-green-700 dark:bg-neutral-800 dark:hover:bg-green-600 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-between"
                >
                  <span>FULL INTEGRITY DOSSIER</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAskAIAboutCandidate(c)}
                  className="px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider transition-colors"
                >
                  ASK AI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
