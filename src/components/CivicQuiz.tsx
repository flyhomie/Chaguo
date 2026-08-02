import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Flame, 
  Zap, 
  Award, 
  BookOpen, 
  Scale, 
  ChevronRight, 
  Lightbulb, 
  Timer,
  Share2,
  Check,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

export interface QuizQuestion {
  id: string;
  category: 'all' | 'finance-bills' | 'constitution' | 'elections' | 'county';
  categoryLabel: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  articleRef: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'fb-1',
    category: 'finance-bills',
    categoryLabel: 'Finance Bills',
    question: 'What proposed tax measure in Finance Bill 2024 sparked nationwide public protests leading to its rejection?',
    options: [
      '16% VAT on bread, Eco Levy on essential goods, and increased mobile money tax',
      'Removal of fuel subsidies only',
      'Direct tax reduction on basic foodstuffs and maize flour',
      'Exemption of agricultural machinery from import duties'
    ],
    correctAnswer: 0,
    explanation: 'Finance Bill 2024 introduced tax hikes including 16% VAT on bread, Eco Levy on diapers & electronics, and motor vehicle tax. Widespread protests forced the President to decline assent.',
    articleRef: 'Finance Bill 2024 Proposals & Public Opposition',
    difficulty: 'Easy'
  },
  {
    id: 'const-1',
    category: 'constitution',
    categoryLabel: 'Constitution & Integrity',
    question: 'Which Article of the Constitution of Kenya (2010) guarantees citizens the right to recall an MP for gross misconduct?',
    options: [
      'Article 104',
      'Article 1',
      'Article 200',
      'Article 50'
    ],
    correctAnswer: 0,
    explanation: 'Article 104 allows the electorate to recall their Member of Parliament before the end of their term for incapacity, gross violation of Chapter 6, or funds mismanagement.',
    articleRef: 'Article 104, Constitution of Kenya 2010',
    difficulty: 'Medium'
  },
  {
    id: 'const-2',
    category: 'constitution',
    categoryLabel: 'Constitution & Integrity',
    question: 'Under Chapter 6 of the Kenyan Constitution, how are state officers expected to exercise public authority?',
    options: [
      'As a public trust to be exercised with honor, dignity, and public confidence',
      'With absolute immunity from judicial prosecution during their tenure',
      'By prioritizing political party directives over constitutional mandates',
      'With total secrecy regarding financial declarations'
    ],
    correctAnswer: 0,
    explanation: 'Chapter 6 (Articles 73-80) emphasizes that public office is a trust. State officers must bring honor to the nation and maintain public confidence.',
    articleRef: 'Chapter 6 (Leadership & Integrity), Article 73',
    difficulty: 'Easy'
  },
  {
    id: 'fb-2',
    category: 'finance-bills',
    categoryLabel: 'Finance Bills',
    question: 'How did the National Assembly vote during the Second Reading of Finance Bill 2024 on June 20, 2024?',
    options: [
      '195 MPs voted YES, 106 voted NO',
      'Unanimous rejection by all 349 MPs',
      '300 voted NO, 10 voted YES',
      'The vote failed due to lack of parliamentary quorum'
    ],
    correctAnswer: 0,
    explanation: 'Despite mass public opposition, 195 MPs voted YES to advance the bill, while 106 voted NO. Chaguo 2027 logs all 195 YES votes under the Red Index.',
    articleRef: 'Parliamentary Division Roll Call, June 2024',
    difficulty: 'Medium'
  },
  {
    id: 'elect-1',
    category: 'elections',
    categoryLabel: 'Elections & Rights',
    question: 'Can a candidate contest for political office in Kenya as an Independent (without party sponsorship)?',
    options: [
      'Yes, guaranteed under Article 85 if not a party member for 90 days before elections',
      'No, political party sponsorship is strictly mandatory for all positions',
      'Only for MCA position, not for MP, Governor, or President',
      'Only if approved by the ruling coalition committee'
    ],
    correctAnswer: 0,
    explanation: 'Article 85 guarantees the right of Independent candidates to contest elections provided they meet requirements and are not party members 90 days prior to election.',
    articleRef: 'Article 85, Constitution of Kenya 2010',
    difficulty: 'Easy'
  },
  {
    id: 'county-1',
    category: 'county',
    categoryLabel: 'County & MCA',
    question: 'What is the primary constitutional duty of a Member of County Assembly (MCA)?',
    options: [
      'Enacting county legislation, approving county budgets, and oversight of the county executive',
      'Directly distributing national university bursaries and police uniforms',
      'Managing national defense and international diplomacy',
      'Appointing High Court judges and ambassadors'
    ],
    correctAnswer: 0,
    explanation: 'Under Article 185, MCAs exercise legislative power at the county level, approve county budget allocations, and hold the Governor and CEC members accountable.',
    articleRef: 'Article 185, Constitution of Kenya 2010',
    difficulty: 'Easy'
  },
  {
    id: 'const-3',
    category: 'constitution',
    categoryLabel: 'Constitution & Integrity',
    question: 'Under Article 37 of the Constitution, what right do Kenyans have during peaceful civic assemblies?',
    options: [
      'Right to assemble, demonstrate, picket, and present petitions peacefully and unarmed',
      'Right to block public transport indefinitely without notice',
      'Right to break into government installations',
      'Protests are illegal without written presidential consent'
    ],
    correctAnswer: 0,
    explanation: 'Article 37 guarantees every person the right, peacefully and unarmed, to assemble, demonstrate, picket, and present petitions to public authorities.',
    articleRef: 'Article 37, Bill of Rights',
    difficulty: 'Medium'
  },
  {
    id: 'fb-3',
    category: 'finance-bills',
    categoryLabel: 'Finance Bills',
    question: 'What threshold of votes in the National Assembly is required to override a Presidential Veto on a Tax Bill?',
    options: [
      'Two-thirds majority of all members (233 MPs)',
      'Simple majority of present members (50% + 1)',
      'Unanimous consent of all 47 County Delegations',
      'Presidential vetoes cannot be overridden by Parliament'
    ],
    correctAnswer: 0,
    explanation: 'Article 115 states that if the President returns a bill to Parliament with reservations, Parliament may pass it again only with a two-thirds majority (233 MPs).',
    articleRef: 'Article 115(4)(a), Constitution of Kenya 2010',
    difficulty: 'Hard'
  },
  {
    id: 'elect-2',
    category: 'elections',
    categoryLabel: 'Elections & Rights',
    question: 'Under Article 1 of the Constitution, where does all sovereign power in Kenya reside?',
    options: [
      'In the people of Kenya, exercised directly or through elected representatives',
      'Exclusively in the Cabinet and Executive Branch',
      'In political party leadership councils',
      'In international monetary institutions'
    ],
    correctAnswer: 0,
    explanation: 'Article 1 declares: All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution.',
    articleRef: 'Article 1(1), Constitution of Kenya 2010',
    difficulty: 'Easy'
  },
  {
    id: 'county-2',
    category: 'county',
    categoryLabel: 'County & MCA',
    question: 'Which constitutional body recommends the equitable sharing of national revenue between National and County governments?',
    options: [
      'Commission on Revenue Allocation (CRA)',
      'Central Bank of Kenya (CBK)',
      'Ethics and Anti-Corruption Commission (EACC)',
      'Independent Electoral and Boundaries Commission (IEBC)'
    ],
    correctAnswer: 0,
    explanation: 'Article 216 establishes the CRA to make recommendations on equitable sharing of revenue raised nationally between national and county governments.',
    articleRef: 'Article 216 & 217, Constitution of Kenya',
    difficulty: 'Medium'
  },
  {
    id: 'const-4',
    category: 'constitution',
    categoryLabel: 'Constitution & Integrity',
    question: 'How many consecutive sittings can an MP miss without written permission before automatically losing their seat?',
    options: [
      '8 consecutive sittings of the Assembly',
      '30 consecutive sittings',
      '3 consecutive months',
      '1 full calendar year'
    ],
    correctAnswer: 0,
    explanation: 'Under Article 103(1)(b), the office of a Member of Parliament becomes vacant if the member is absent from eight sittings of the Assembly without permission in writing from the Speaker.',
    articleRef: 'Article 103(1)(b), Constitution of Kenya',
    difficulty: 'Hard'
  },
  {
    id: 'elect-3',
    category: 'elections',
    categoryLabel: 'Elections & Rights',
    question: 'When are General Elections held in Kenya as stipulated by the 2010 Constitution?',
    options: [
      'On the second Tuesday in August every fifth year',
      'On the first Monday of December every four years',
      'Whenever the sitting President dissolves Parliament',
      'On Jamhuri Day (December 12) every five years'
    ],
    correctAnswer: 0,
    explanation: 'Article 101(1) stipulates that a general election of members of Parliament shall be held on the second Tuesday in August in every fifth year.',
    articleRef: 'Article 101(1), Constitution of Kenya',
    difficulty: 'Medium'
  }
];

export const CivicQuiz: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'finance-bills' | 'constitution' | 'elections' | 'county'>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [quizState, setQuizState] = useState<'start' | 'playing' | 'completed'>('start');
  
  // Lifelines
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  // Copied share status
  const [copiedShare, setCopiedShare] = useState(false);

  // Initialize questions based on filter
  useEffect(() => {
    let filtered = QUIZ_QUESTIONS;
    if (selectedCategory !== 'all') {
      filtered = QUIZ_QUESTIONS.filter(q => q.category === selectedCategory);
    }
    // Shuffle questions slightly for replayability
    setQuestions([...filtered].sort(() => 0.5 - Math.random()));
  }, [selectedCategory]);

  const handleStartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setFiftyFiftyUsed(false);
    setDisabledOptions([]);
    setShowHint(false);
    setHintUsed(false);
    setQuizState('playing');
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered || disabledOptions.includes(index)) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = index === currentQ.correctAnswer;

    if (isCorrect) {
      const points = 100 + (streak * 25);
      setScore(prev => prev + points);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setDisabledOptions([]);
      setShowHint(false);
    } else {
      setQuizState('completed');
    }
  };

  const handleUseFiftyFifty = () => {
    if (fiftyFiftyUsed || isAnswered) return;
    const currentQ = questions[currentIndex];
    const incorrectIndices = [0, 1, 2, 3].filter(i => i !== currentQ.correctAnswer);
    // Shuffle and pick 2 to disable
    const toDisable = incorrectIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setDisabledOptions(toDisable);
    setFiftyFiftyUsed(true);
  };

  const handleUseHint = () => {
    if (hintUsed || isAnswered) return;
    setShowHint(true);
    setHintUsed(true);
  };

  const getRankBadge = (finalScore: number, totalQ: number) => {
    const maxScore = totalQ * 100;
    const ratio = finalScore / (maxScore || 1);

    if (ratio >= 0.85) {
      return {
        title: 'CIVIC GUARDIAN 👑',
        badgeColor: 'bg-amber-500 text-neutral-900 border-amber-400',
        desc: 'Master of Kenyan Constitutional Law & Finance Bill Parliamentary Records!'
      };
    } else if (ratio >= 0.6) {
      return {
        title: 'VOTER ADVOCATE 📜',
        badgeColor: 'bg-red-600 text-white border-red-700',
        desc: 'Strong awareness of citizen rights, Chapter 6 integrity, and MP accountability.'
      };
    } else {
      return {
        title: 'CITIZEN IN TRAINING 🎓',
        badgeColor: 'bg-neutral-800 text-neutral-200 border-neutral-700',
        desc: 'Good start! Review Article 104 and Finance Bill voting records to boost your score.'
      };
    }
  };

  const handleShareResults = () => {
    const text = `🎮 I scored ${score} PTS (${Math.round((score / (questions.length * 100)) * 100)}% accuracy) on the Chaguo 2027 Civic Quiz! Test your knowledge of Kenyan Finance Bills & Constitution!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const currentQ = questions[currentIndex];
  const rank = getRankBadge(score, questions.length);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Quiz Mode Header Banner */}
      <div className="bg-neutral-900 text-white border-2 border-neutral-900 dark:border-neutral-700 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" /> GAMIFIED CIVIC EDUCATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
            Civic Quiz Challenge 🎮
          </h2>
          <p className="text-xs font-bold text-neutral-300 uppercase leading-relaxed max-w-xl">
            Test your knowledge of Finance Bills 2024/2025, Chapter 6 Integrity, MP Recall rights (Article 104), and IEBC election rules.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            onClick={() => { setSelectedCategory('all'); setQuizState('start'); }}
            className={`px-2.5 py-1 text-[10px] font-black uppercase transition-colors border ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            All Topics
          </button>
          <button
            onClick={() => { setSelectedCategory('finance-bills'); setQuizState('start'); }}
            className={`px-2.5 py-1 text-[10px] font-black uppercase transition-colors border ${
              selectedCategory === 'finance-bills'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            Finance Bills
          </button>
          <button
            onClick={() => { setSelectedCategory('constitution'); setQuizState('start'); }}
            className={`px-2.5 py-1 text-[10px] font-black uppercase transition-colors border ${
              selectedCategory === 'constitution'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            Constitution
          </button>
          <button
            onClick={() => { setSelectedCategory('elections'); setQuizState('start'); }}
            className={`px-2.5 py-1 text-[10px] font-black uppercase transition-colors border ${
              selectedCategory === 'elections'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            Elections
          </button>
        </div>
      </div>

      {/* START SCREEN */}
      {quizState === 'start' && (
        <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-neutral-900 text-white dark:bg-red-600 flex items-center justify-center rounded-full mx-auto shadow-md">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">
              Ready to Test Your Voter IQ?
            </h3>
            <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase max-w-md mx-auto">
              Answer {questions.length} card questions to earn XP points, unlock civic badges, and master Kenyan constitutional rights.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 text-left">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">Questions</span>
              <span className="text-xl font-black text-neutral-900 dark:text-white">{questions.length} Cards</span>
            </div>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">Streaks</span>
              <span className="text-xl font-black text-red-600 flex items-center gap-1">
                <Flame className="w-4 h-4" /> Multipliers
              </span>
            </div>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">Lifelines</span>
              <span className="text-xl font-black text-amber-500 flex items-center gap-1">
                <Lightbulb className="w-4 h-4" /> 50/50 & Hint
              </span>
            </div>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">Top Rank</span>
              <span className="text-xl font-black text-green-600">Guardian 👑</span>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white text-sm font-black uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 mx-auto rounded-xs"
          >
            <span>START QUIZ CHALLENGE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PLAYING SCREEN CARD */}
      {quizState === 'playing' && currentQ && (
        <div className="space-y-4">
          
          {/* Top Score & Progress Bar */}
          <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-3 sm:p-4 shadow-sm flex items-center justify-between gap-4 font-black uppercase text-xs">
            
            {/* Question Counter */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px]">
                QUESTION {currentIndex + 1} / {questions.length}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px]">
                {currentQ.categoryLabel}
              </span>
            </div>

            {/* Streak & Score */}
            <div className="flex items-center gap-4">
              {streak > 1 && (
                <motion.div 
                  initial={{ scale: 0.8 }} 
                  animate={{ scale: 1 }} 
                  className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 border border-amber-300 dark:border-amber-800 text-[10px] font-black"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{streak}x STREAK!</span>
                </motion.div>
              )}

              <div className="flex items-center gap-1.5 text-neutral-900 dark:text-white">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-sm">{score} PTS</span>
              </div>
            </div>

          </div>

          {/* Linear Progress Indicator Bar */}
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 border border-neutral-900 dark:border-neutral-700 overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Main Question Card */}
          <motion.div 
            key={currentQ.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-5 sm:p-7 shadow-sm space-y-5"
          >
            {/* Card Header & Difficulty / Lifelines */}
            <div className="flex items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                Difficulty: {currentQ.difficulty}
              </span>

              {/* Lifelines Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUseFiftyFifty}
                  disabled={fiftyFiftyUsed || isAnswered}
                  className={`px-2 py-1 text-[9px] font-black uppercase border flex items-center gap-1 transition-colors ${
                    fiftyFiftyUsed || isAnswered
                      ? 'opacity-40 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border-neutral-300 dark:border-neutral-700 cursor-not-allowed'
                      : 'bg-amber-500 text-neutral-900 border-amber-600 hover:bg-amber-400'
                  }`}
                  title="Remove 2 incorrect options"
                >
                  <span>50/50</span>
                </button>

                <button
                  onClick={handleUseHint}
                  disabled={hintUsed || isAnswered}
                  className={`px-2 py-1 text-[9px] font-black uppercase border flex items-center gap-1 transition-colors ${
                    hintUsed || isAnswered
                      ? 'opacity-40 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border-neutral-300 dark:border-neutral-700 cursor-not-allowed'
                      : 'bg-neutral-900 dark:bg-neutral-800 text-white border-neutral-700 hover:bg-red-600'
                  }`}
                  title="Show Constitutional reference hint"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>HINT</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
              {currentQ.question}
            </h3>

            {/* Hint Box (if activated) */}
            {showHint && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold uppercase flex items-start gap-2"
              >
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>CONSTITUTIONAL CLUE:</strong> Look for references in <em>{currentQ.articleRef}</em>.
                </div>
              </motion.div>
            )}

            {/* Interactive Answer Option Cards */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctAnswer;
                const isDisabled = disabledOptions.includes(idx);

                let cardStyle = 'bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-400';

                if (isDisabled) {
                  cardStyle = 'opacity-30 bg-neutral-200 dark:bg-neutral-800 text-neutral-400 border-neutral-300 dark:border-neutral-800 cursor-not-allowed';
                } else if (isAnswered) {
                  if (isCorrect) {
                    cardStyle = 'bg-green-600 text-white border-green-700 font-black shadow-sm';
                  } else if (isSelected) {
                    cardStyle = 'bg-red-600 text-white border-red-700 font-black shadow-sm';
                  } else {
                    cardStyle = 'opacity-50 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-700';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered || isDisabled}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 text-left border-2 text-xs font-bold uppercase tracking-tight transition-all flex items-center justify-between gap-3 ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-xs border text-[10px] font-black flex items-center justify-center shrink-0 ${
                        isAnswered && isCorrect 
                          ? 'bg-white text-green-700 border-white'
                          : isAnswered && isSelected 
                          ? 'bg-white text-red-700 border-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-400 dark:border-neutral-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Article Reference Box (after answered) */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-black uppercase">
                  <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <BookOpen className="w-4 h-4" /> LEGAL & PARLIAMENTARY DOSSIER
                  </span>
                  <span className="text-[10px] bg-neutral-900 text-white px-2 py-0.5">
                    {currentQ.articleRef}
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase leading-relaxed">
                  {currentQ.explanation}
                </p>

                <button
                  onClick={handleNextQuestion}
                  className="w-full mt-3 py-3 bg-neutral-900 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-xs"
                >
                  <span>{currentIndex < questions.length - 1 ? 'NEXT QUESTION CARD' : 'VIEW FINAL RESULTS'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

          </motion.div>
        </div>
      )}

      {/* COMPLETED RESULTS SCREEN */}
      {quizState === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 sm:p-10 shadow-sm text-center space-y-6"
        >
          {/* Rank Badge Header */}
          <div className="space-y-3">
            <span className={`inline-block px-4 py-1.5 text-xs font-black uppercase tracking-widest border-2 shadow-sm ${rank.badgeColor}`}>
              {rank.title}
            </span>

            <h3 className="text-3xl font-black uppercase text-neutral-900 dark:text-neutral-100 tracking-tight">
              Civic Challenge Completed!
            </h3>
            <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase max-w-lg mx-auto">
              {rank.desc}
            </p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">Final Score</span>
              <span className="text-2xl font-black text-red-600">{score} PTS</span>
            </div>

            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">Accuracy</span>
              <span className="text-2xl font-black text-neutral-900 dark:text-white">
                {Math.round((score / (questions.length * 100)) * 100)}%
              </span>
            </div>

            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">Max Streak</span>
              <span className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" /> {maxStreak}x
              </span>
            </div>

            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
              <span className="text-[10px] font-black uppercase text-neutral-500 block">Cards Completed</span>
              <span className="text-2xl font-black text-green-600">{questions.length} / {questions.length}</span>
            </div>
          </div>

          {/* Share & Retry Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={handleShareResults}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-neutral-800 rounded-xs"
            >
              {copiedShare ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span>{copiedShare ? 'RESULTS COPIED!' : 'SHARE SCORE & BADGE'}</span>
            </button>

            <button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REPLAY CIVIC QUIZ</span>
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
};
