import React, { useState } from 'react';
import { CIVIC_AUDIT_CREATORS } from '../data/auditorGeneralFindings';
import { Video, ExternalLink, ShieldCheck, Sparkles, BookOpen, Layers, CheckCircle2, Copy, Users, Globe, Building2, Scale, Heart } from 'lucide-react';

export const CivicCreatorsAndSources: React.FC = () => {
  const [selectedCreator, setSelectedCreator] = useState<string>(CIVIC_AUDIT_CREATORS[0].handle);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const activeCreator = CIVIC_AUDIT_CREATORS.find(c => c.handle === selectedCreator) || CIVIC_AUDIT_CREATORS[0];

  const handleCopyLink = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(name);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-purple-950 text-white border-2 border-purple-500/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                <Video className="w-3.5 h-3.5" />
                Civic Creators & Open Data Sources
              </span>
              <span className="px-2.5 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Citizen Auditors
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
            Sourced Civic Audits & Official Portals
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Directly sourcing financial analyses from top Kenyan civic creators decoding Auditor-General reports, debt clocks, and government budgets alongside verified constitutional open-data platforms.
          </p>
        </div>
      </div>

      {/* Creator Profile Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CIVIC_AUDIT_CREATORS.map((creator) => (
          <div
            key={creator.handle}
            onClick={() => setSelectedCreator(creator.handle)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-sm flex items-start gap-3 ${
              selectedCreator === creator.handle
                ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-600 dark:border-purple-500 shadow-md ring-2 ring-purple-600/20'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md">
              {creator.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black uppercase tracking-tight text-neutral-900 dark:text-white truncate">
                  {creator.name}
                </h3>
                {creator.verifiedBadge && (
                  <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0" title="Verified Creator">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold block">
                {creator.handle}
              </span>
              <div className="flex items-center gap-3 text-[10px] text-neutral-500 mt-1 font-bold">
                <span>{creator.followers} Followers</span>
                <span>•</span>
                <span>{creator.likes} Likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Creator In-Depth Dossier */}
      <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-6 shadow-md">
        {/* Creator Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-lg border-2 border-white/20">
              {activeCreator.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
                  {activeCreator.name}
                </h2>
                <span className="px-2 py-0.5 bg-pink-600 text-white text-[9px] font-black uppercase rounded-md flex items-center gap-1">
                  <Video className="w-3 h-3" /> {activeCreator.platform}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 block mt-0.5">
                {activeCreator.handle}
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 max-w-2xl font-medium leading-relaxed">
                {activeCreator.profileDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://tiktok.com/${activeCreator.handle}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Visit TikTok Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Focus Areas & Featured Audits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Focus Areas */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Core Civic Investigation Focus Areas:
            </h4>
            <ul className="space-y-1.5">
              {activeCreator.focusAreas.map((area, i) => (
                <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Audits */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-500" />
              Top Viral Audit Breakdowns & Findings:
            </h4>
            <ul className="space-y-1.5">
              {activeCreator.featuredAudits.map((audit, i) => (
                <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2 font-medium">
                  <span className="text-red-600 font-black text-[11px] shrink-0 mt-0.5">📌</span>
                  <span>{audit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Websites Shared by this Creator */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              Official Websites & Data Portals Shared by {activeCreator.name}:
            </h3>
            <span className="text-[10px] font-bold text-neutral-500 uppercase">
              {activeCreator.sharedWebsites.length} Official Portals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeCreator.sharedWebsites.map((site, index) => (
              <div
                key={index}
                className="p-4 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 hover:border-red-600 dark:hover:border-red-500 rounded-xl transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[9px] font-black uppercase text-red-600 dark:text-red-400 tracking-wider">
                      {site.category}
                    </span>
                    <button
                      onClick={() => handleCopyLink(site.url, site.name)}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-[10px]"
                      title="Copy URL"
                    >
                      {copiedLink === site.name ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <h4 className="text-xs font-black uppercase text-neutral-900 dark:text-white group-hover:text-red-600 transition-colors">
                    {site.name}
                  </h4>

                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
                    {site.description}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-neutral-400 truncate max-w-[150px]">
                    {site.url.replace('https://', '').replace('http://', '')}
                  </span>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-black text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Citizen Audit Methodology Guide */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-600" />
            The Citizen Auditor Constitutional Playbook (Kenya):
          </h4>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Under <strong>Article 35</strong> of the Kenyan Constitution (Access to Information) and <strong>Article 201</strong> (Principles of Public Finance), every citizen has the constitutional right to scrutinize public expenditures, inspect IFMIS records, review Auditor-General reports, and demand accountability from elected officials.
          </p>
        </div>
      </div>
    </div>
  );
};
