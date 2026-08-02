import React from 'react';
import { Candidate, CitizenEvidenceReport } from '../types';
import { ChevronRight, Bookmark, BookmarkCheck, ShieldAlert, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';
import { calculateReputation } from '../utils/reputation';

interface CandidateCardProps {
  candidate: Candidate;
  onSelect: (candidate: Candidate) => void;
  isSaved?: boolean;
  onToggleSave?: (candidate: Candidate) => void;
  onCompareToggle?: (candidate: Candidate) => void;
  isCompared?: boolean;
  viewMode?: 'grid' | 'list';
  evidenceReports?: CitizenEvidenceReport[];
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  isSaved = false,
  onToggleSave,
  onCompareToggle,
  isCompared = false,
  viewMode = 'grid',
  evidenceReports = [],
}) => {
  const rep = calculateReputation(candidate, evidenceReports);
  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'red':
        return {
          cardBg: 'border-2 border-red-600 bg-white dark:bg-neutral-900 dark:border-red-600',
          badgeBg: 'bg-red-600 text-white',
          tagText: 'text-red-600 dark:text-red-400',
          indicator: 'Affiliated'
        };
      case 'green':
        return {
          cardBg: 'border-2 border-green-600 bg-white dark:bg-neutral-900 dark:border-green-600',
          badgeBg: 'bg-green-600 text-white',
          tagText: 'text-green-600 dark:text-green-400',
          indicator: 'Clean Record'
        };
      case 'purple':
        return {
          cardBg: 'border-2 border-purple-600 bg-white dark:bg-neutral-900 dark:border-purple-600',
          badgeBg: 'bg-purple-600 text-white',
          tagText: 'text-purple-600 dark:text-purple-400',
          indicator: 'Independent'
        };
      default:
        return {
          cardBg: 'border-2 border-neutral-900 bg-white dark:bg-neutral-900 dark:border-neutral-700',
          badgeBg: 'bg-neutral-900 text-white dark:bg-neutral-800',
          tagText: 'text-neutral-900 dark:text-neutral-100',
          indicator: 'Legislator'
        };
    }
  };

  const style = getBadgeStyle(candidate.tagColor);

  const hasCorruptionCase = candidate.corruptionStatus && candidate.corruptionStatus !== 'clean';
  const hasSexualViolenceCase = candidate.sexualViolenceStatus && candidate.sexualViolenceStatus !== 'clean';
  const hasRobberyCase = candidate.robberyCrimeStatus && candidate.robberyCrimeStatus !== 'clean';

  // Render Horizontal List View Row
  if (viewMode === 'list') {
    return (
      <div className={`relative ${style.cardBg} p-2.5 sm:p-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5 shadow-xs hover:shadow-md hover:border-red-600 transform transition-all duration-200 hover:scale-105 hover:z-10 group text-neutral-900 dark:text-neutral-100 rounded-xs w-full`}>
        {/* Left Section: Number ID, Avatar, Name & Role */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 w-full lg:w-auto">
          <span className="text-base sm:text-lg font-black font-mono tracking-tight text-neutral-400 dark:text-neutral-500 shrink-0 w-8">
            #{candidate.id.length < 3 ? candidate.id.padStart(2, '0') : candidate.id}
          </span>
          <DemonicAvatar
            seed={candidate.id}
            name={candidate.name}
            tagColor={candidate.tagColor}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-black uppercase tracking-tight truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {candidate.name}
              </h3>
              <span className={`px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider ${style.badgeBg}`}>
                {style.indicator}
              </span>
              {candidate.isGoodLeaderChampion && (
                <span className="px-1 py-0.2 bg-green-600 text-white text-[8px] font-black uppercase flex items-center gap-0.5">
                  <Award className="w-2.5 h-2.5" /> CHAMPION
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide truncate mt-0.5">
              {candidate.position} • {candidate.county} {candidate.ward ? `(${candidate.ward})` : candidate.constituency ? `(${candidate.constituency})` : ''} • Party: <strong className="text-neutral-900 dark:text-neutral-100">{candidate.party}</strong>
            </p>
          </div>
        </div>

        {/* Middle Section: Crime Badges & Voting Roll */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {hasCorruptionCase && (
            <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-[9px] font-black uppercase border border-red-300 dark:border-red-800">
              CORRUPTION
            </span>
          )}
          {hasSexualViolenceCase && (
            <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 text-[9px] font-black uppercase border border-purple-300 dark:border-purple-800">
              RAPE/DEFILEMENT
            </span>
          )}
          {hasRobberyCase && (
            <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[9px] font-black uppercase border border-amber-300 dark:border-amber-800">
              ROBBERY
            </span>
          )}

          <div className="text-[9px] font-bold uppercase bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 border border-neutral-300 dark:border-neutral-700 flex items-center gap-1.5">
            <span>FB '24: <strong className={candidate.votes.financeBill2024 === 'YES' ? 'text-red-600' : 'text-green-600'}>{candidate.votes.financeBill2024}</strong></span>
            <span>•</span>
            <span>FB '25: <strong className={candidate.votes.financeBill2025 === 'YES' ? 'text-red-600' : 'text-green-600'}>{candidate.votes.financeBill2025}</strong></span>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1.5 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-neutral-200 dark:border-neutral-800">
          {onCompareToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareToggle(candidate);
              }}
              className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider border transition-colors ${
                isCompared
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:border-neutral-900'
              }`}
            >
              {isCompared ? 'COMPARED' : '+ COMPARE'}
            </button>
          )}

          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(candidate);
              }}
              className={`p-1 border transition-colors ${
                isSaved
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-900'
              }`}
              title={isSaved ? "Saved to Ballot" : "Save candidate"}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={() => onSelect(candidate)}
            className="px-2.5 py-1 bg-neutral-900 dark:bg-neutral-800 hover:bg-red-600 dark:hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 rounded-xs"
          >
            <span>DOSSIER</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Render Dense Compact Grid Card Layout (fit as many per row/column as possible)
  return (
    <div className={`relative ${style.cardBg} p-2.5 sm:p-3 flex flex-col justify-between h-full shadow-xs hover:shadow-lg transform transition-all duration-200 hover:scale-105 hover:z-10 group text-neutral-900 dark:text-neutral-100 rounded-xs`}>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Card Top Row: Number ID & Badges */}
          <div className="flex justify-between items-start gap-1 mb-1.5">
            <div className="flex items-center gap-1">
              <span className="text-base font-black leading-none font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
                #{candidate.id.length < 3 ? candidate.id.padStart(2, '0') : candidate.id}
              </span>
              {candidate.isGoodLeaderChampion && (
                <span className="px-1 py-0.2 bg-green-600 text-white text-[7.5px] font-black uppercase flex items-center gap-0.5">
                  <Award className="w-2 h-2" /> CHAMPION
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {onCompareToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompareToggle(candidate);
                  }}
                  title={isCompared ? "Remove from Compare" : "Add to Compare"}
                  className={`px-1 py-0.2 text-[8px] font-black uppercase border transition-colors ${
                    isCompared
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  {isCompared ? '✓' : '+CMP'}
                </button>
              )}

              {onToggleSave && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(candidate);
                  }}
                  className={`p-0.5 border transition-colors ${
                    isSaved
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                  }`}
                  title={isSaved ? "Saved to Ballot" : "Save candidate"}
                >
                  {isSaved ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex items-start gap-2 mb-2">
            <DemonicAvatar
              seed={candidate.id}
              name={candidate.name}
              tagColor={candidate.tagColor}
              size="xs"
            />

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-black uppercase tracking-tight leading-snug truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {candidate.name}
              </h3>
              <p className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide truncate">
                {candidate.position} • {candidate.county}
              </p>
              <p className="text-[8.5px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider truncate">
                PARTY: <span className="text-neutral-900 dark:text-neutral-100 font-black">{candidate.party}</span>
              </p>
            </div>
          </div>

          {/* Legal & Crime Warning Badges */}
          {(hasCorruptionCase || hasSexualViolenceCase || hasRobberyCase) && (
            <div className="mb-2 space-y-0.5">
              {hasCorruptionCase && (
                <div className="px-1 py-0.2 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-[8px] font-black uppercase border border-red-300 dark:border-red-800 flex items-center justify-between">
                  <span className="truncate">CORRUPTION: {candidate.corruptionStatus}</span>
                </div>
              )}
              {hasSexualViolenceCase && (
                <div className="px-1 py-0.2 bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 text-[8px] font-black uppercase border border-purple-300 dark:border-purple-800 flex items-center justify-between">
                  <span className="truncate">RAPE/DEFILEMENT: {candidate.sexualViolenceStatus}</span>
                </div>
              )}
              {hasRobberyCase && (
                <div className="px-1 py-0.2 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-[8px] font-black uppercase border border-amber-300 dark:border-amber-800 flex items-center justify-between">
                  <span className="truncate">ROBBERY: {candidate.robberyCrimeStatus}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Division Votes Roll */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-1.5 space-y-0.5 text-[9px] mt-1">
          <div className="flex justify-between items-center font-bold uppercase">
            <span className="text-neutral-500 dark:text-neutral-400">FB '24</span>
            <span className={`font-black ${
              candidate.votes.financeBill2024 === 'YES'
                ? 'text-red-600 dark:text-red-400'
                : candidate.votes.financeBill2024 === 'NO'
                ? 'text-green-600 dark:text-green-400'
                : 'text-neutral-900 dark:text-neutral-200'
            }`}>
              {candidate.votes.financeBill2024}
            </span>
          </div>

          <div className="flex justify-between items-center font-bold uppercase">
            <span className="text-neutral-500 dark:text-neutral-400">FB '25</span>
            <span className={`font-black ${
              candidate.votes.financeBill2025 === 'YES'
                ? 'text-red-600 dark:text-red-400'
                : candidate.votes.financeBill2025 === 'NO'
                ? 'text-green-600 dark:text-green-400'
                : 'text-neutral-900 dark:text-neutral-200'
            }`}>
              {candidate.votes.financeBill2025}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelect(candidate)}
        className="w-full mt-2 bg-neutral-900 dark:bg-neutral-800 hover:bg-red-600 dark:hover:bg-red-600 text-white px-2 py-1 text-[9px] font-black uppercase tracking-wider transition-colors flex items-center justify-between rounded-xs"
      >
        <span>DOSSIER</span>
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};
