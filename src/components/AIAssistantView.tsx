import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, HelpCircle, Loader2, Navigation, Award, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Candidate } from '../types';
import { TabType } from './Header';

interface AIAssistantProps {
  candidates: Candidate[];
  prefilledPrompt?: string;
  onClearPrefilledPrompt?: () => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const AIAssistantView: React.FC<AIAssistantProps> = ({
  candidates,
  prefilledPrompt = '',
  onClearPrefilledPrompt,
  onNavigateTab
}) => {
  const [prompt, setPrompt] = useState(prefilledPrompt);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: "Hujambo! I am Chaguo AI, your electoral intelligence & navigation guide. I can help you analyze candidate records (corruption, sexual violence, robbery/violent crime), find actual good leaders doing real development, or navigate across the accountability portal.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "Which leaders have 100% clean integrity records and documented development projects?",
    "Show me candidates convicted or charged with corruption.",
    "Are there any MCAs or leaders facing sexual violence or defilement charges?",
    "How can voters initiate an MP recall under Article 104 of the Constitution?",
    "Who voted YES to Finance Bill 2024 & 2025 in Nairobi?"
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || prompt;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    if (onClearPrefilledPrompt) onClearPrefilledPrompt();
    setLoading(true);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          candidateContext: candidates
        })
      });

      const data = await response.json();
      const aiReply = data.answer || "I am currently unable to fetch data. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Chaguo AI service encountered a temporary error. Please try again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-neutral-900 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 shadow-sm flex items-start gap-4 text-white">
        <div className="w-12 h-12 bg-red-600 border-2 border-white flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Chaguo AI Voter Intelligence & Guided Navigation
          </h2>
          <p className="text-xs font-bold text-neutral-300 uppercase mt-1 leading-relaxed">
            Ask questions about candidate corruption records, defilement & robbery dockets, good development champions, or ask AI to guide your portal navigation.
          </p>
        </div>
      </div>

      {/* Portal Quick Navigation Actions */}
      {onNavigateTab && (
        <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-4 font-bold text-xs uppercase space-y-2 text-neutral-900 dark:text-neutral-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-red-600" /> AI Portal Navigation Shortcuts:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('good-leaders')}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" /> GO TO GOOD LEADERSHIP PORTAL
            </button>
            <button
              onClick={() => onNavigateTab('evidence')}
              className="px-3 py-1.5 bg-red-600 hover:bg-neutral-900 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> VIEW CITIZEN EVIDENCE & UPLOADS
            </button>
            <button
              onClick={() => onNavigateTab('directory')}
              className="px-3 py-1.5 bg-neutral-900 text-white dark:bg-neutral-800 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> BROWSE MCAS & LEGISLATORS
            </button>
          </div>
        </div>
      )}

      {/* Suggested Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-red-600" />
          Suggested Voter Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs bg-white dark:bg-neutral-900 hover:bg-red-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-900 dark:border-neutral-700 px-3 py-2 font-bold uppercase transition-all text-left"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 min-h-[400px] max-h-[550px] overflow-y-auto space-y-4 shadow-sm text-neutral-900 dark:text-neutral-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 bg-neutral-900 dark:bg-red-600 text-white flex items-center justify-center shrink-0 mt-1 font-black text-xs">
                AI
              </div>
            )}

            <div
              className={`max-w-2xl p-4 text-xs sm:text-sm leading-relaxed border-2 font-bold uppercase ${
                msg.sender === 'user'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-900 dark:border-neutral-700'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <span className={`block text-[10px] mt-2 font-mono ${msg.sender === 'user' ? 'text-red-200 text-right' : 'text-neutral-500'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-1 font-black text-xs">
                YOU
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs font-black uppercase text-red-600 bg-neutral-100 dark:bg-neutral-800 p-4 border-2 border-neutral-900 dark:border-neutral-700 w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing judicial dockets, EACC files, and Hansard database...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="ASK CHAGUO AI ABOUT CORRUPTION, DEFILEMENT, GOOD LEADERS..."
          className="flex-1 bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 px-4 py-3 text-xs font-black uppercase text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-red-600 shadow-sm"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !prompt.trim()}
          className="px-6 py-3 bg-red-600 hover:bg-neutral-900 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all border-2 border-red-600 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>ASK</span>
        </button>
      </div>
    </div>
  );
};
