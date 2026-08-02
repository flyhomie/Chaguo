import React from 'react';
import { Candidate, CitizenEvidenceReport } from '../types';
import { X, CheckCircle2, AlertTriangle, ShieldAlert, Bookmark, BookmarkCheck, FileSpreadsheet, Building2, Award, Sparkles, AlertCircle, Download, ThumbsUp, ThumbsDown, PlusCircle, Scale } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';
import { downloadFile } from '../utils/download';
import { calculateReputation } from '../utils/reputation';

interface CandidateModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (candidate: Candidate) => void;
  onAskAIAboutCandidate: (candidate: Candidate) => void;
  evidenceReports?: CitizenEvidenceReport[];
  onOpenAddEvidenceForCandidate?: (candidate: Candidate) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidate,
  onClose,
  isSaved,
  onToggleSave,
  onAskAIAboutCandidate,
  evidenceReports = [],
  onOpenAddEvidenceForCandidate,
}) => {
  if (!candidate) return null;

  const rep = calculateReputation(candidate, evidenceReports);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div className="p-6 bg-neutral-900 dark:bg-neutral-950 text-white border-b-2 border-neutral-900 dark:border-neutral-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <DemonicAvatar
                seed={candidate.id}
                name={candidate.name}
                tagColor={candidate.tagColor}
                size="lg"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                    {candidate.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                    candidate.tagColor === 'red'
                      ? 'bg-red-600 text-white'
                      : candidate.tagColor === 'green'
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}>
                    {candidate.tagColor === 'red' ? 'AFFILIATED / RED' : candidate.tagColor === 'green' ? 'CLEAN RECORD' : 'INDEPENDENT'}
                  </span>

                  {candidate.isGoodLeaderChampion && (
                    <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-black uppercase flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> GOOD LEADER CHAMPION
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-red-500" />
                  {candidate.position} • {candidate.county}
                  {candidate.ward ? ` (${candidate.ward})` : candidate.constituency ? ` (${candidate.constituency})` : ''}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-neutral-800 text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-neutral-50 dark:bg-neutral-950">
          
          {/* Politician Score & Reputation Widget */}
          <div className="bg-white dark:bg-neutral-900 p-5 border-2 border-neutral-900 dark:border-neutral-700 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-sm flex flex-col items-center justify-center font-mono font-black border-2 border-neutral-900 shrink-0 ${rep.badgeBg}`}>
                  <span className="text-xl leading-none">{rep.score}</span>
                  <span className="text-[9px] uppercase tracking-tighter">/ 100</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black uppercase text-neutral-400">CITIZEN REPUTATION SCORE</span>
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${rep.badgeBg}`}>
                      GRADE {rep.grade}
                    </span>
                  </div>
                  <h3 className={`text-base font-black uppercase tracking-tight ${rep.textColor}`}>
                    {rep.status}
                  </h3>
                  <p className="text-[10px] font-bold uppercase text-neutral-500">
                    Dynamic rating derived from voting records, legal dockets & verified citizen evidence
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenAddEvidenceForCandidate?.(candidate)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-colors border-2 border-neutral-900 flex items-center justify-center gap-2 shrink-0 shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>+ LOG EVIDENCE & RATE</span>
              </button>
            </div>

            {/* Score Impact Breakdown Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-emerald-500" /> GOOD EVIDENCE</span>
                <span className="font-mono font-bold text-xs">{rep.goodCount}</span>
              </div>

              <div className="p-2 bg-red-50 dark:bg-red-950/40 border border-red-500 text-red-800 dark:text-red-300 flex items-center justify-between">
                <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3 text-red-500" /> BAD EVIDENCE</span>
                <span className="font-mono font-bold text-xs">{rep.badCount}</span>
              </div>

              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                <span>USER SCORE IMPACT</span>
                <span className={`font-mono font-bold text-xs ${rep.totalImpactPoints >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {rep.totalImpactPoints > 0 ? `+${rep.totalImpactPoints}` : rep.totalImpactPoints} PTS
                </span>
              </div>
            </div>
          </div>

          {/* Executive & Party Categorization Summary */}
          <div className="bg-white dark:bg-neutral-900 p-5 border-2 border-neutral-900 dark:border-neutral-700 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Categorization & Alignment Analysis
            </h3>
            <p className="text-xs font-bold leading-relaxed uppercase">
              {candidate.tagReason}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-black uppercase">
              <div className={`p-2.5 border-2 flex items-center justify-between ${
                candidate.ties.uhuru ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-600' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-700'
              }`}>
                <span>Uhuru Ties</span>
                <span>{candidate.ties.uhuru ? 'YES' : 'NO'}</span>
              </div>

              <div className={`p-2.5 border-2 flex items-center justify-between ${
                candidate.ties.ruto ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-600' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-700'
              }`}>
                <span>Ruto Ties</span>
                <span>{candidate.ties.ruto ? 'YES' : 'NO'}</span>
              </div>

              <div className={`p-2.5 border-2 flex items-center justify-between ${
                candidate.ties.gachagua ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-600' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-700'
              }`}>
                <span>Gachagua Ties</span>
                <span>{candidate.ties.gachagua ? 'YES' : 'NO'}</span>
              </div>
            </div>
            
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-bold italic pt-1">
              Alignment Notes: {candidate.ties.details}
            </p>
          </div>

          {/* Legal & Crime Docket Parameters */}
          <div className="bg-white dark:bg-neutral-900 p-5 border-2 border-neutral-900 dark:border-neutral-700 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Documented Legal & Integrity Records
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Corruption Status */}
              <div className={`p-3 border-2 text-xs font-bold uppercase ${
                candidate.corruptionStatus === 'convicted'
                  ? 'bg-red-100 dark:bg-red-950 border-red-600 text-red-800 dark:text-red-200'
                  : candidate.corruptionStatus === 'charged' || candidate.corruptionStatus === 'alleged'
                  ? 'bg-amber-50 dark:bg-amber-950 border-amber-600 text-amber-900 dark:text-amber-200'
                  : 'bg-green-50 dark:bg-green-950 border-green-600 text-green-800 dark:text-green-300'
              }`}>
                <span className="block text-[9px] font-black text-neutral-400">CORRUPTION DOCKET</span>
                <span className="font-black text-sm">{candidate.corruptionStatus.toUpperCase()}</span>
                {candidate.corruptionDetails && (
                  <p className="text-[10px] mt-1 normal-case leading-tight font-normal">{candidate.corruptionDetails}</p>
                )}
              </div>

              {/* Sexual Violence Status */}
              <div className={`p-3 border-2 text-xs font-bold uppercase ${
                candidate.sexualViolenceStatus === 'convicted' || candidate.sexualViolenceStatus === 'charged'
                  ? 'bg-purple-100 dark:bg-purple-950 border-purple-600 text-purple-900 dark:text-purple-200'
                  : candidate.sexualViolenceStatus === 'alleged'
                  ? 'bg-purple-50 dark:bg-purple-950 border-purple-400 text-purple-800 dark:text-purple-200'
                  : 'bg-green-50 dark:bg-green-950 border-green-600 text-green-800 dark:text-green-300'
              }`}>
                <span className="block text-[9px] font-black text-neutral-400">RAPE / DEFILEMENT</span>
                <span className="font-black text-sm">{candidate.sexualViolenceStatus.toUpperCase()}</span>
                {candidate.sexualViolenceDetails && (
                  <p className="text-[10px] mt-1 normal-case leading-tight font-normal">{candidate.sexualViolenceDetails}</p>
                )}
              </div>

              {/* Robbery & Crime Status */}
              <div className={`p-3 border-2 text-xs font-bold uppercase ${
                candidate.robberyCrimeStatus === 'convicted' || candidate.robberyCrimeStatus === 'charged'
                  ? 'bg-amber-100 dark:bg-amber-950 border-amber-600 text-amber-900 dark:text-amber-200'
                  : candidate.robberyCrimeStatus === 'alleged'
                  ? 'bg-amber-50 dark:bg-amber-950 border-amber-400 text-amber-800 dark:text-amber-200'
                  : 'bg-green-50 dark:bg-green-950 border-green-600 text-green-800 dark:text-green-300'
              }`}>
                <span className="block text-[9px] font-black text-neutral-400">ROBBERY / VIOLENCE</span>
                <span className="font-black text-sm">{candidate.robberyCrimeStatus.toUpperCase()}</span>
                {candidate.robberyCrimeDetails && (
                  <p className="text-[10px] mt-1 normal-case leading-tight font-normal">{candidate.robberyCrimeDetails}</p>
                )}
              </div>
            </div>
          </div>

          {/* Development Achievements & Projects Section */}
          {(candidate.isGoodLeaderChampion || (candidate.developmentProjects && candidate.developmentProjects.length > 0)) && (
            <div className="bg-white dark:bg-neutral-900 p-5 border-2 border-green-600 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-green-700 dark:text-green-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Community Development & Track Record
              </h3>

              {candidate.goodLeaderHighlights && (
                <ul className="space-y-1.5 text-xs font-bold uppercase">
                  {candidate.goodLeaderHighlights.map((hl, index) => (
                    <li key={index} className="flex items-start gap-2 bg-green-50 dark:bg-neutral-800 p-2 border-l-4 border-green-600 text-neutral-800 dark:text-neutral-200">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              )}

              {candidate.developmentProjects && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-neutral-500">Documented Projects:</span>
                  {candidate.developmentProjects.map((p) => (
                    <div key={p.id} className="bg-neutral-50 dark:bg-neutral-950 p-3 border border-neutral-300 dark:border-neutral-700 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-neutral-900 dark:text-neutral-100 uppercase">{p.title}</strong>
                        <span className="px-2 py-0.5 bg-green-600 text-white text-[9px] font-black">{p.category} ({p.year})</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 uppercase font-bold">{p.description}</p>
                      <p className="text-[11px] text-green-700 dark:text-green-400 font-black uppercase mt-1">Impact: {p.impact}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Parliamentary Division Voting Roll */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-red-600" />
              Parliamentary Division Voting Records
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Finance Bill 2024 */}
              <div className="bg-white dark:bg-neutral-900 p-4 border-2 border-neutral-900 dark:border-neutral-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase">Finance Bill 2024</span>
                  {candidate.votes.financeBill2024 === 'YES' && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-600 text-white">
                      VOTED YES
                    </span>
                  )}
                  {candidate.votes.financeBill2024 === 'NO' && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-green-600 text-white">
                      VOTED NO
                    </span>
                  )}
                  {candidate.votes.financeBill2024 === 'ABSENT' && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-neutral-900 text-white">
                      ABSENT
                    </span>
                  )}
                  {candidate.votes.financeBill2024 === 'NOT_IN_OFFICE' && (
                    <span className="text-xs text-neutral-400 italic font-bold">Not in office</span>
                  )}
                </div>
                <p className="text-xs font-bold uppercase bg-neutral-100 dark:bg-neutral-800 p-2 border border-neutral-300 dark:border-neutral-700">
                  {candidate.votes.notes2024 || "Recorded vote on second and third reading."}
                </p>
              </div>

              {/* Finance Bill 2025 */}
              <div className="bg-white dark:bg-neutral-900 p-4 border-2 border-neutral-900 dark:border-neutral-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase">Finance Bill 2025</span>
                  {candidate.votes.financeBill2025 === 'YES' && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-600 text-white">
                      VOTED YES
                    </span>
                  )}
                  {candidate.votes.financeBill2025 === 'NO' && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-green-600 text-white">
                      VOTED NO
                    </span>
                  )}
                  {candidate.votes.financeBill2025 === 'ABSENT' && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-neutral-900 text-white">
                      ABSENT
                    </span>
                  )}
                  {candidate.votes.financeBill2025 === 'NOT_IN_OFFICE' && (
                    <span className="text-xs text-neutral-400 italic font-bold">Not in office</span>
                  )}
                </div>
                <p className="text-xs font-bold uppercase bg-neutral-100 dark:bg-neutral-800 p-2 border border-neutral-300 dark:border-neutral-700">
                  {candidate.votes.notes2025 || "Recorded vote on revenue framework division."}
                </p>
              </div>
            </div>
          </div>

          {/* Biography & Track Record */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Biography & Leadership Tenure
            </h3>
            <p className="text-xs font-bold uppercase bg-white dark:bg-neutral-900 p-4 border-2 border-neutral-900 dark:border-neutral-700 leading-relaxed">
              {candidate.bio}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold uppercase">
              <span className="font-black">TENURE:</span>
              <span className="bg-neutral-900 dark:bg-neutral-800 text-white px-2.5 py-1 text-[10px] font-black">{candidate.termInOffice}</span>
              
              <span className="font-black ml-2">PARTY TICKET:</span>
              <span className="bg-neutral-900 dark:bg-neutral-800 text-white px-2.5 py-1 text-[10px] font-black">{candidate.party}</span>
            </div>

            {candidate.keyPositionsHeld && candidate.keyPositionsHeld.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-black uppercase block mb-1">Key Roles & Committees:</span>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.keyPositionsHeld.map((role, index) => (
                    <span key={index} className="text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold uppercase px-2 py-1 border border-neutral-400 dark:border-neutral-700">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-t-2 border-neutral-900 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const dossier = `=====================================================
CHAGUO 2027 KENYA LEADER CIVIC DOSSIER
=====================================================
Candidate Name: ${candidate.name}
Position: ${candidate.position}
County/Region: ${candidate.county} ${candidate.ward ? `(Ward: ${candidate.ward})` : candidate.constituency ? `(Constituency: ${candidate.constituency})` : ''}
Party Alignment: ${candidate.party}
Classification Tag: ${candidate.tagColor.toUpperCase()} (${candidate.tagReason})
Good Leader Champion: ${candidate.isGoodLeaderChampion ? 'YES' : 'NO'}

-----------------------------------------------------
FINANCE BILL VOTING RECORD:
-----------------------------------------------------
2024 Finance Bill Vote: ${candidate.votes.financeBill2024} (${candidate.votes.notes2024 || 'N/A'})
2025 Revenue Bill Vote: ${candidate.votes.financeBill2025} (${candidate.votes.notes2025 || 'N/A'})

-----------------------------------------------------
EXECUTIVE POLITICAL ALIGNMENT:
-----------------------------------------------------
Uhuru Kenyatta Ties: ${candidate.ties.uhuru ? 'YES' : 'NO'}
William Ruto / KK Ties: ${candidate.ties.ruto ? 'YES' : 'NO'}
Raila Odinga Ties: ${candidate.ties.raila ? 'YES' : 'NO'}

-----------------------------------------------------
BIOGRAPHY & TENURE:
-----------------------------------------------------
Tenure in Office: ${candidate.termInOffice}
Bio: ${candidate.bio}
Key Positions Held: ${candidate.keyPositionsHeld?.join(', ') || 'N/A'}

Verified Records & Sources:
${candidate.documents?.map(d => `- ${d.title}: ${d.url}`).join('\n') || 'Official Parliamentary & Electoral Records'}
=====================================================
`;
                downloadFile(`DOSSIER_${candidate.name.replace(/\s+/g, '_')}.txt`, dossier, 'text/plain');
              }}
              className="px-3 py-2 bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 border-2 border-neutral-900 dark:border-neutral-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>DOWNLOAD DOSSIER (.TXT)</span>
            </button>

            <button
              onClick={() => onAskAIAboutCandidate(candidate)}
              className="px-4 py-2 bg-red-600 hover:bg-neutral-900 text-white text-xs font-black uppercase tracking-wider transition-colors"
            >
              ASK AI
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => onToggleSave(candidate)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 ${
                isSaved
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-neutral-900 dark:bg-neutral-800 text-white border-neutral-900 dark:border-neutral-700 hover:bg-neutral-800'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'SAVED TO BALLOT' : 'SAVE TO BALLOT'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-black text-xs uppercase border-2 border-neutral-900 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
