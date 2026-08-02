import React from 'react';
import { Candidate } from '../types';
import { UserCheck, Trash2, FileText, Share2 } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';

interface MyBallotViewProps {
  savedCandidates: Candidate[];
  onRemove: (candidateId: string) => void;
  onClearAll: () => void;
  onSelectDetail: (candidate: Candidate) => void;
}

export const MyBallotView: React.FC<MyBallotViewProps> = ({
  savedCandidates,
  onRemove,
  onClearAll,
  onSelectDetail,
}) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Chaguo 2027 Voter Slate',
        text: `Check out my evaluated candidate shortlist on Chaguo 2027 Voter Portal! (${savedCandidates.length} candidates tracked)`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-neutral-900 text-white border-2 border-neutral-900 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
              My 2027 Voter Ballot & Candidate Shortlist
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-bold text-neutral-300 uppercase mt-1">
            Personal evaluation list saved locally in your browser. Track your preferred candidates for MP, Woman Rep, Senator, Governor, and President.
          </p>
        </div>

        {savedCandidates.length > 0 && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-red-600 hover:bg-white hover:text-neutral-900 text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE SLATE</span>
            </button>
            <button
              onClick={onClearAll}
              className="px-4 py-2 bg-neutral-800 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider transition-colors"
            >
              CLEAR SLATE
            </button>
          </div>
        )}
      </div>

      {savedCandidates.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center mx-auto border-2 border-neutral-900 dark:border-neutral-700 font-black text-xl">
            <UserCheck className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-black uppercase text-neutral-900 dark:text-neutral-100">Your Ballot Slate is Empty</h3>
          <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase max-w-md mx-auto">
            Click the bookmark icon on candidate cards in the Directory to save them to your personal 2027 voting evaluation list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedCandidates.map((c) => (
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
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white ${
                    c.tagColor === 'red' ? 'bg-red-600' : c.tagColor === 'green' ? 'bg-green-600' : 'bg-purple-600'
                  }`}>
                    {c.tagColor === 'red' ? 'AFFILIATED' : c.tagColor === 'green' ? 'CLEAN RECORD' : 'INDEPENDENT'}
                  </span>
                  <button
                    onClick={() => onRemove(c.id)}
                    className="p-1 bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-red-600 transition-colors"
                    title="Remove candidate from ballot"
                  >
                    <Trash2 className="w-4 h-4" />
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
                      {c.constituency ? ` (${c.constituency})` : ''}
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-100 dark:bg-neutral-800 p-3 border-2 border-neutral-900 dark:border-neutral-700 text-xs font-bold uppercase space-y-1 mb-3 text-neutral-900 dark:text-neutral-100">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">FB 2024:</span>
                    <span className="font-black text-neutral-900 dark:text-neutral-100">{c.votes.financeBill2024}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">FB 2025:</span>
                    <span className="font-black text-neutral-900 dark:text-neutral-100">{c.votes.financeBill2025}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectDetail(c)}
                className="w-full mt-2 py-2.5 bg-neutral-900 dark:bg-neutral-800 hover:bg-red-600 dark:hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>FULL RECORD</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
