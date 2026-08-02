import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Scale, ScrollText, Users, Trophy, Sparkles } from 'lucide-react';
import { CivicQuiz } from './CivicQuiz';

export const EducationView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'guide' | 'quiz'>('quiz');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sub-tab Navigation Bar */}
      <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-4 py-2 text-xs font-black uppercase transition-all flex items-center gap-2 border-2 ${
              activeSubTab === 'quiz'
                ? 'bg-red-600 text-white border-neutral-900 dark:border-white shadow-sm'
                : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:border-neutral-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CIVIC QUIZ CHALLENGE</span>
            <span className="px-1.5 py-0.2 bg-amber-400 text-neutral-900 text-[9px] font-black rounded-xs">GAMIFIED</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guide')}
            className={`px-4 py-2 text-xs font-black uppercase transition-all flex items-center gap-2 border-2 ${
              activeSubTab === 'guide'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm'
                : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:border-neutral-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-red-500" />
            <span>CONSTITUTIONAL GUIDE</span>
          </button>
        </div>

        <div className="text-[10px] font-bold uppercase text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>Voter Education Hub</span>
        </div>
      </div>

      {/* QUIZ SUB-TAB */}
      {activeSubTab === 'quiz' && (
        <CivicQuiz />
      )}

      {/* GUIDE SUB-TAB */}
      {activeSubTab === 'guide' && (
        <div className="space-y-8">
          {/* Top Banner */}
          <div className="bg-neutral-900 text-white border-2 border-neutral-900 dark:border-neutral-700 p-6 sm:p-8 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" /> CIVIC RIGHTS & CONSTITUTIONAL LITERACY
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
              Kenyan Voter Guide & Legal Rights
            </h2>
            <p className="text-xs sm:text-sm font-bold text-neutral-300 uppercase leading-relaxed">
              The Constitution of Kenya (2010) guarantees citizens the fundamental right to free, fair, and transparent elections, as well as the power to hold elected leaders accountable throughout their term.
            </p>
          </div>

          {/* Key Constitutional Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Article 104 - Recall of MPs */}
            <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-neutral-900 text-white dark:bg-neutral-800 flex items-center justify-center font-black">
                <Scale className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-black uppercase text-neutral-900 dark:text-white">
                Article 104: Right to Recall a Member of Parliament
              </h3>
              <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase leading-relaxed">
                The electorate in a constituency or county has the right to recall their Member of Parliament before the end of the term on grounds of:
              </p>
              <ul className="text-xs font-bold uppercase text-neutral-900 dark:text-neutral-100 space-y-1.5 list-disc pl-4 bg-neutral-100 dark:bg-neutral-800 p-4 border-2 border-neutral-900 dark:border-neutral-700">
                <li>Physical or mental incapacity preventing execution of functions</li>
                <li>Gross violation of Chapter 6 (Leadership & Integrity)</li>
                <li>Mismanagement of public funds (e.g., NG-CDF)</li>
                <li>Conviction of an offense punishable by imprisonment for 6+ months</li>
              </ul>
            </div>

            {/* Chapter 6 - Leadership & Integrity */}
            <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-neutral-900 text-white dark:bg-neutral-800 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-xl font-black uppercase text-neutral-900 dark:text-white">
                Chapter 6: Leadership and Integrity
              </h3>
              <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase leading-relaxed">
                State officers must exercise authority as a public trust to be exercised in a manner that:
              </p>
              <ul className="text-xs font-bold uppercase text-neutral-900 dark:text-neutral-100 space-y-1.5 list-disc pl-4 bg-neutral-100 dark:bg-neutral-800 p-4 border-2 border-neutral-900 dark:border-neutral-700">
                <li>Is consistent with the purposes and objects of the Constitution</li>
                <li>Demonstrates respect for the public and brings honor to the nation</li>
                <li>Promotes public confidence in the integrity of the office</li>
                <li>Requires transparency, financial accountability, and non-conflict of interest</li>
              </ul>
            </div>

            {/* Article 38 - Political Rights */}
            <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-neutral-900 text-white dark:bg-neutral-800 flex items-center justify-center font-black">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-xl font-black uppercase text-neutral-900 dark:text-white">
                Article 38: Political Rights & Independents
              </h3>
              <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase leading-relaxed">
                Every citizen has the right to make free political choices, including:
              </p>
              <ul className="text-xs font-bold uppercase text-neutral-900 dark:text-neutral-100 space-y-1.5 list-disc pl-4 bg-neutral-100 dark:bg-neutral-800 p-4 border-2 border-neutral-900 dark:border-neutral-700">
                <li>Forming or participating in a political party of choice</li>
                <li>Seeking public office as an Independent Candidate (unaffiliated)</li>
                <li>Free, fair, and transparent secret ballot elections conducted by IEBC</li>
              </ul>
            </div>

            {/* Understanding Chaguo Categorization */}
            <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-neutral-900 text-white dark:bg-neutral-800 flex items-center justify-center font-black">
                <ScrollText className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-black uppercase text-neutral-900 dark:text-white">
                How Chaguo Categorization Works
              </h3>
              <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase leading-relaxed">
                Chaguo indexes candidates based on verifiable parliamentary records:
              </p>
              <div className="space-y-2 text-xs font-bold uppercase">
                <div className="p-3 bg-red-600 text-white border-2 border-neutral-900">
                  <strong className="block text-white font-black">RED INDEX:</strong> Voted YES to Finance Bill 2024/2025 OR holds executive party ties with Uhuru, Ruto, or Gachagua.
                </div>
                <div className="p-3 bg-green-600 text-white border-2 border-neutral-900">
                  <strong className="block text-white font-black">GREEN INDEX:</strong> Voted NO to Finance Bills and has no documented alignment with executive coalition factions.
                </div>
                <div className="p-3 bg-purple-600 text-white border-2 border-neutral-900">
                  <strong className="block text-white font-black">PURPLE INDEX:</strong> Running independently by themselves without political party sponsorship.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

