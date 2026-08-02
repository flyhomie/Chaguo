import React from 'react';
import { Candidate } from '../types';
import { ShieldCheck, X, Plus } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';

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
  const availableToAdd = allCandidates.filter(
    (c) => !candidates.some((selected) => selected.id === c.id)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white border-2 border-neutral-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Side-by-Side Candidate Voting Comparison
            </h2>
          </div>
          <p className="text-xs font-bold text-neutral-300 uppercase mt-1">
            Compare parliamentary voting records on Finance Bills 2024 & 2025, executive party ties, and independent status.
          </p>
        </div>

        {candidates.length > 0 && (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-600 hover:bg-white hover:text-neutral-900 text-white font-black text-xs uppercase tracking-wider transition-colors self-start md:self-auto"
          >
            CLEAR ALL ({candidates.length})
          </button>
        )}
      </div>

      {candidates.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center mx-auto border-2 border-neutral-900 dark:border-neutral-700 font-black text-xl">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100">No Candidates Selected for Comparison</h3>
          <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase max-w-md mx-auto">
            Select up to 3 candidates from the directory or pick from the available list below to contrast their voting behavior side by side.
          </p>

          <div className="pt-4 max-w-2xl mx-auto">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3 text-left">
              Quick Add Candidates:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {availableToAdd.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  onClick={() => onAddCandidate(c)}
                  className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-2 border-neutral-900 dark:border-neutral-700 text-left text-xs font-black uppercase transition-colors group"
                >
                  <span className="text-neutral-900 dark:text-neutral-100 truncate group-hover:text-red-600 dark:group-hover:text-red-400">
                    {c.name}
                  </span>
                  <Plus className="w-4 h-4 text-red-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Comparison Grid Table */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[640px] grid grid-cols-1 md:grid-cols-3 gap-4">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  className={`bg-white dark:bg-neutral-900 border-2 p-6 flex flex-col justify-between ${
                    c.tagColor === 'red'
                      ? 'border-red-600 dark:border-red-600'
                      : c.tagColor === 'green'
                      ? 'border-green-600 dark:border-green-600'
                      : 'border-purple-600 dark:border-purple-600'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white ${
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

                    <div className="flex items-center gap-3 mb-3">
                      <DemonicAvatar seed={c.id} name={c.name} tagColor={c.tagColor} size="md" />
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
                          {c.name}
                        </h3>
                        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                          {c.position} • {c.county}
                        </p>
                      </div>
                    </div>

                    {/* Voting Roll Rows */}
                    <div className="space-y-3 mb-4">
                      <div className="bg-neutral-100 dark:bg-neutral-800 p-3 border-2 border-neutral-900 dark:border-neutral-700 text-xs uppercase font-bold text-neutral-900 dark:text-neutral-100">
                        <span className="text-[10px] font-black text-neutral-500 dark:text-neutral-400 block mb-1">Finance Bill 2024 Vote</span>
                        <div className="flex items-center gap-1.5 font-black">
                          {c.votes.financeBill2024 === 'YES' && (
                            <span className="text-red-600 dark:text-red-400">VOTED YES</span>
                          )}
                          {c.votes.financeBill2024 === 'NO' && (
                            <span className="text-green-600 dark:text-green-400">VOTED NO</span>
                          )}
                          {c.votes.financeBill2024 === 'ABSENT' && (
                            <span className="text-neutral-500 dark:text-neutral-400">ABSENT</span>
                          )}
                          {c.votes.financeBill2024 === 'NOT_IN_OFFICE' && (
                            <span className="text-neutral-400 italic font-bold">Not in office</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-neutral-100 dark:bg-neutral-800 p-3 border-2 border-neutral-900 dark:border-neutral-700 text-xs uppercase font-bold text-neutral-900 dark:text-neutral-100">
                        <span className="text-[10px] font-black text-neutral-500 dark:text-neutral-400 block mb-1">Finance Bill 2025 Vote</span>
                        <div className="flex items-center gap-1.5 font-black">
                          {c.votes.financeBill2025 === 'YES' && (
                            <span className="text-red-600 dark:text-red-400">VOTED YES</span>
                          )}
                          {c.votes.financeBill2025 === 'NO' && (
                            <span className="text-green-600 dark:text-green-400">VOTED NO</span>
                          )}
                          {c.votes.financeBill2025 === 'ABSENT' && (
                            <span className="text-neutral-500 dark:text-neutral-400">ABSENT</span>
                          )}
                          {c.votes.financeBill2025 === 'NOT_IN_OFFICE' && (
                            <span className="text-neutral-400 italic font-bold">Not in office</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Executive Alignment */}
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-3 border-2 border-neutral-900 dark:border-neutral-700 mb-4 space-y-1 text-xs uppercase font-bold text-neutral-900 dark:text-neutral-100">
                      <span className="font-black text-neutral-500 dark:text-neutral-400 block mb-1">Executive Alignment</span>
                      <div className="grid grid-cols-3 gap-1 text-center font-black text-[9px]">
                        <div className={`p-1.5 ${c.ties.uhuru ? 'bg-red-600 text-white' : 'bg-white dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-700'}`}>
                          Uhuru: {c.ties.uhuru ? 'YES' : 'NO'}
                        </div>
                        <div className={`p-1.5 ${c.ties.ruto ? 'bg-red-600 text-white' : 'bg-white dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-700'}`}>
                          Ruto: {c.ties.ruto ? 'YES' : 'NO'}
                        </div>
                        <div className={`p-1.5 ${c.ties.gachagua ? 'bg-red-600 text-white' : 'bg-white dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-700'}`}>
                          Gachagua: {c.ties.gachagua ? 'YES' : 'NO'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectDetail(c)}
                    className="w-full mt-2 py-2.5 bg-neutral-900 dark:bg-neutral-800 hover:bg-red-600 dark:hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-colors"
                  >
                    FULL RECORD
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Additional Candidate Select Bar */}
          {candidates.length < 3 && availableToAdd.length > 0 && (
            <div className="mt-6 bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-4">
              <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase block mb-2">
                Add another candidate to comparison ({3 - candidates.length} slots left):
              </span>
              <div className="flex flex-wrap gap-2">
                {availableToAdd.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onAddCandidate(c)}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-900 dark:border-neutral-700 text-xs font-black uppercase transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-red-600" />
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
