import React from 'react';
import { FinanceBillClause, Candidate } from '../types';
import { Layers, CheckCircle2, XCircle, AlertCircle, AlertTriangle, Download } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';
import { exportToCSV } from '../utils/download';

interface FinanceBillsViewProps {
  clauses: FinanceBillClause[];
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
}

export const FinanceBillsView: React.FC<FinanceBillsViewProps> = ({
  clauses,
  candidates,
  onSelectCandidate,
}) => {
  const yes2024Count = candidates.filter((c) => c.votes.financeBill2024 === 'YES').length;
  const no2024Count = candidates.filter((c) => c.votes.financeBill2024 === 'NO').length;
  const absent2024Count = candidates.filter((c) => c.votes.financeBill2024 === 'ABSENT').length;

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-neutral-900 text-white border-2 border-neutral-900 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest">
            <AlertTriangle className="w-3.5 h-3.5" /> DIVISION BREAKDOWN
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
            Kenya Finance Bills 2024 & 2025 Voting Analysis
          </h2>
          <p className="text-xs sm:text-sm font-bold text-neutral-300 uppercase leading-relaxed">
            The 2024 and 2025 Finance Bills introduced sweeping tax reforms that sparked nationwide public discourse. 
            Below is the verified record of how legislators voted on second and third reading divisions in Kenya's National Assembly.
          </p>

          {/* Parliamentary Vote Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="bg-white text-neutral-900 p-4 border-2 border-red-600">
              <span className="text-[10px] font-black uppercase text-red-600 block">Voted YES to Finance Bill</span>
              <span className="text-3xl font-black font-mono leading-none">{yes2024Count} MPs</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase block mt-1">Supported tax increases</span>
            </div>

            <div className="bg-white text-neutral-900 p-4 border-2 border-green-600">
              <span className="text-[10px] font-black uppercase text-green-600 block">Voted NO to Finance Bill</span>
              <span className="text-3xl font-black font-mono leading-none">{no2024Count} MPs</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase block mt-1">Opposed tax measures</span>
            </div>

            <div className="bg-white text-neutral-900 p-4 border-2 border-neutral-900">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">Absent / Walkout</span>
              <span className="text-3xl font-black font-mono leading-none">{absent2024Count} MPs</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase block mt-1">Skipped division roll</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Clauses Breakdown */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-red-600" />
          Key Controversial Clauses in Finance Bills
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clauses.map((clause) => (
            <div key={clause.id} className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider">
                    BILL YEAR {clause.billYear} • {clause.category}
                  </span>
                  <h4 className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100 mt-2">
                    {clause.title}
                  </h4>
                </div>
              </div>

              <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase">
                {clause.description}
              </p>

              <div className="bg-neutral-100 dark:bg-neutral-800 p-3 border-2 border-neutral-900 dark:border-neutral-700 text-xs font-bold uppercase text-neutral-900 dark:text-neutral-100">
                <span className="font-black text-red-600 dark:text-red-400 block mb-1">Direct Impact on Citizens:</span>
                {clause.impactOnCitizens}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Voting Roll Table */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-neutral-100">
            Parliamentary Roll Call (Recorded Votes)
          </h3>
          <button
            onClick={() => {
              const votingData = candidates.map((c) => ({
                MP_Name: c.name,
                Position: c.position,
                County: c.county,
                Constituency: c.constituency || '',
                Party: c.party,
                TagColor: c.tagColor,
                FinanceBill2024_Vote: c.votes.financeBill2024,
                FinanceBill2024_Notes: c.votes.notes2024 || '',
                FinanceBill2025_Vote: c.votes.financeBill2025,
                FinanceBill2025_Notes: c.votes.notes2025 || '',
              }));
              exportToCSV(`KENYA_PARLIAMENT_FINANCE_BILL_VOTING_ROLL_${Date.now()}.csv`, votingData);
            }}
            className="px-4 py-2 bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors border-2 border-neutral-900 dark:border-neutral-700 self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>EXPORT VOTING ROLL (.CSV)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase font-bold text-neutral-900 dark:text-neutral-100 border-2 border-neutral-900 dark:border-neutral-700">
            <thead>
              <tr className="border-b-2 border-neutral-900 dark:border-neutral-700 bg-neutral-900 dark:bg-neutral-950 text-white text-[10px] font-black tracking-widest">
                <th className="p-3">Candidate</th>
                <th className="p-3">County / Constituency</th>
                <th className="p-3">Party</th>
                <th className="p-3">2024 Vote</th>
                <th className="p-3">2025 Vote</th>
                <th className="p-3">Executive Ties</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-800">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <td className="p-3 font-black text-neutral-900 dark:text-neutral-100">
                    <div className="flex items-center gap-2">
                      <DemonicAvatar seed={c.id} name={c.name} tagColor={c.tagColor} size="xs" />
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-neutral-600 dark:text-neutral-400 font-bold">
                    {c.county} {c.constituency ? `(${c.constituency})` : ''}
                  </td>
                  <td className="p-3 font-black">
                    {c.party}
                  </td>
                  <td className="p-3">
                    {c.votes.financeBill2024 === 'YES' && (
                      <span className="font-black text-red-600 dark:text-red-400">VOTED YES</span>
                    )}
                    {c.votes.financeBill2024 === 'NO' && (
                      <span className="font-black text-green-600 dark:text-green-400">VOTED NO</span>
                    )}
                    {c.votes.financeBill2024 === 'ABSENT' && (
                      <span className="font-bold text-neutral-500 dark:text-neutral-400">ABSENT</span>
                    )}
                    {c.votes.financeBill2024 === 'NOT_IN_OFFICE' && (
                      <span className="text-neutral-400 italic">Not in office</span>
                    )}
                  </td>
                  <td className="p-3">
                    {c.votes.financeBill2025 === 'YES' && (
                      <span className="font-black text-red-600 dark:text-red-400">VOTED YES</span>
                    )}
                    {c.votes.financeBill2025 === 'NO' && (
                      <span className="font-black text-green-600 dark:text-green-400">VOTED NO</span>
                    )}
                    {c.votes.financeBill2025 === 'ABSENT' && (
                      <span className="font-bold text-neutral-500 dark:text-neutral-400">ABSENT</span>
                    )}
                    {c.votes.financeBill2025 === 'NOT_IN_OFFICE' && (
                      <span className="text-neutral-400 italic">Not in office</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 text-[9px] font-black">
                      <span className={`px-1 py-0.2 ${c.ties.uhuru ? 'bg-red-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'}`}>U</span>
                      <span className={`px-1 py-0.2 ${c.ties.ruto ? 'bg-red-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'}`}>R</span>
                      <span className={`px-1 py-0.2 ${c.ties.gachagua ? 'bg-red-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'}`}>G</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectCandidate(c)}
                      className="px-3 py-1 bg-neutral-900 dark:bg-neutral-800 hover:bg-red-600 dark:hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-wider transition-colors"
                    >
                      RECORD
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
