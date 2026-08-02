import React from 'react';
import { TagColor } from '../types';
import { Info, ShieldAlert, Award, AlertTriangle } from 'lucide-react';

interface LegendProps {
  redCount: number;
  greenCount: number;
  purpleCount: number;
  selectedTag: TagColor | 'all';
  setSelectedTag: (tag: TagColor | 'all') => void;
}

export const TagLegend: React.FC<LegendProps> = ({
  redCount,
  greenCount,
  purpleCount,
  selectedTag,
  setSelectedTag,
}) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 shadow-sm text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black uppercase tracking-tighter">
              Accountability & Crime Index
            </h2>
            <div className="group relative cursor-pointer">
              <Info className="w-4 h-4 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider shadow-xl z-50 border border-neutral-700">
                Data includes official parliamentary Hansard rolls, Judiciary court filings (Corruption, Sexual Offences Act, Penal Code violent crimes), and verified development projects.
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1">
            Track MPs, Senators, Governors, and MCAs across voting history, political ties, legal dockets, and development projects:
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedTag === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-2 border-neutral-900'
                : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-900'
            }`}
          >
            All Leaders
          </button>

          {/* Red Tag */}
          <button
            onClick={() => setSelectedTag('red')}
            className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
              selectedTag === 'red'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-600/40 hover:border-red-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${selectedTag === 'red' ? 'bg-white' : 'bg-red-600'}`}></div>
            <span>Voted YES / Affiliated</span>
            <span className={`px-1.5 py-0.2 text-[9px] font-black ${selectedTag === 'red' ? 'bg-white text-red-700' : 'bg-red-600 text-white'}`}>
              {redCount}
            </span>
          </button>

          {/* Green Tag */}
          <button
            onClick={() => setSelectedTag('green')}
            className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
              selectedTag === 'green'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-600/40 hover:border-green-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${selectedTag === 'green' ? 'bg-white' : 'bg-green-600'}`}></div>
            <span>Voted NO / Clean Record</span>
            <span className={`px-1.5 py-0.2 text-[9px] font-black ${selectedTag === 'green' ? 'bg-white text-green-700' : 'bg-green-600 text-white'}`}>
              {greenCount}
            </span>
          </button>

          {/* Purple Tag */}
          <button
            onClick={() => setSelectedTag('purple')}
            className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
              selectedTag === 'purple'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-600/40 hover:border-purple-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${selectedTag === 'purple' ? 'bg-white' : 'bg-purple-600'}`}></div>
            <span>Independent</span>
            <span className={`px-1.5 py-0.2 text-[9px] font-black ${selectedTag === 'purple' ? 'bg-white text-purple-700' : 'bg-purple-600 text-white'}`}>
              {purpleCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
