import React, { useState } from 'react';
import { Candidate, CitizenEvidenceReport, EvidenceSourceType } from '../types';
import { X, ThumbsUp, ThumbsDown, ShieldAlert, FileText, Video, MessageSquare, Scale, Newspaper, CheckCircle2, Award } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';

interface AddImpactEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  preSelectedCandidate?: Candidate | null;
  onSubmitEvidence: (newReport: CitizenEvidenceReport) => void;
}

export const AddImpactEvidenceModal: React.FC<AddImpactEvidenceModalProps> = ({
  isOpen,
  onClose,
  candidates,
  preSelectedCandidate,
  onSubmitEvidence,
}) => {
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>(
    preSelectedCandidate ? preSelectedCandidate.id : candidates[0]?.id || ''
  );
  const [impactType, setImpactType] = useState<'good' | 'bad'>('bad');
  const [category, setCategory] = useState<'corruption' | 'sexual_violence' | 'robbery_crime' | 'development' | 'integrity_violation'>('corruption');
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [sourceType, setSourceType] = useState<EvidenceSourceType>('TikTok');
  const [sourceUrl, setSourceUrl] = useState('');
  const [socialMediaHandle, setSocialMediaHandle] = useState('');
  const [courtCaseNumber, setCourtCaseNumber] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [submitter, setSubmitter] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Update selected candidate if preSelectedCandidate changes
  React.useEffect(() => {
    if (preSelectedCandidate) {
      setSelectedLeaderId(preSelectedCandidate.id);
    }
  }, [preSelectedCandidate]);

  if (!isOpen) return null;

  const targetLeader = candidates.find((c) => c.id === selectedLeaderId) || preSelectedCandidate || candidates[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFilePreview(`FILE HASH: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLeader || !title.trim() || !reason.trim()) return;

    const impactPts = impactType === 'good' ? 10 : -12;

    const newReport: CitizenEvidenceReport = {
      id: `report-${Date.now()}`,
      leaderName: targetLeader.name,
      position: targetLeader.position,
      county: targetLeader.county,
      wardOrConstituency: targetLeader.ward || targetLeader.constituency,
      category: impactType === 'good' ? 'development' : category,
      impactType,
      impactPoints: impactPts,
      title: title.trim(),
      description: reason.trim(),
      reason: reason.trim(),
      sourceType,
      sourceUrl: sourceUrl.trim() || undefined,
      socialMediaHandle: socialMediaHandle.trim() || undefined,
      courtCaseNumber: courtCaseNumber.trim() || undefined,
      fileName: uploadedFileName || undefined,
      filePreview: uploadedFilePreview || undefined,
      submitter: isAnonymous ? 'Anonymous Kenyan Citizen' : submitter.trim() || 'Verified Civic Reporter',
      isAnonymous,
      timestamp: new Date().toISOString().split('T')[0],
      upvotes: 1,
      status: 'verified',
    };

    onSubmitEvidence(newReport);

    setSuccessMsg(`Evidence logged successfully! ${targetLeader.name}'s score has been recalculated (${impactPts > 0 ? `+${impactPts}` : impactPts} pts).`);

    setTimeout(() => {
      setSuccessMsg('');
      setTitle('');
      setReason('');
      setSourceUrl('');
      setSocialMediaHandle('');
      setCourtCaseNumber('');
      setUploadedFileName(null);
      setUploadedFilePreview(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 w-full max-w-xl shadow-2xl relative my-auto">
        {/* Header Bar */}
        <div className="bg-neutral-900 text-white p-4 flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-600 text-white font-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight">LOG EVIDENCE & RATE POLITICIAN SCORE</h3>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Directly impacts target leader's 2027 accountability rating
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-neutral-800 hover:bg-red-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {successMsg && (
            <div className="p-3 bg-emerald-600 text-white text-xs font-black uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Leader Selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
              Select Target Politician *
            </label>
            <div className="flex items-center gap-3 p-2 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
              {targetLeader && (
                <DemonicAvatar seed={targetLeader.id} name={targetLeader.name} tagColor={targetLeader.tagColor} size="sm" />
              )}
              <select
                value={selectedLeaderId}
                onChange={(e) => setSelectedLeaderId(e.target.value)}
                className="w-full bg-transparent font-black text-sm uppercase text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.position} • {c.county})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Impact Type Selection (Good vs Bad) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
              Evidence Impact on Score & Reputation *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setImpactType('good');
                  setCategory('development');
                }}
                className={`p-3 border-2 flex items-center justify-center gap-2 font-black text-xs uppercase transition-all ${
                  impactType === 'good'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-emerald-600'
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-300" />
                <span>GOOD IMPACT (+ SCORE)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setImpactType('bad');
                  setCategory('corruption');
                }}
                className={`p-3 border-2 flex items-center justify-center gap-2 font-black text-xs uppercase transition-all ${
                  impactType === 'bad'
                    ? 'bg-red-600 text-white border-red-600 shadow-md scale-[1.02]'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-red-600'
                }`}
              >
                <ThumbsDown className="w-4 h-4 text-white" />
                <span>BAD IMPACT (- SCORE)</span>
              </button>
            </div>
            <p className="text-[10px] font-bold uppercase text-neutral-500 mt-1">
              {impactType === 'good'
                ? '🟢 Good evidence adds points (+10) to leader integrity score for track record, development, or public service.'
                : '🔴 Bad evidence reduces points (-12) from leader rating for corruption, tax votes, or criminal charges.'}
            </p>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold text-xs uppercase text-neutral-900 dark:text-neutral-100"
              >
                {impactType === 'good' ? (
                  <>
                    <option value="development">🌟 Good Development & Infrastructure</option>
                    <option value="integrity_violation">🛡️ Integrity & Exemplary Leadership</option>
                  </>
                ) : (
                  <>
                    <option value="corruption">🚨 Corruption & Embezzlement</option>
                    <option value="sexual_violence">⚖️ Sexual Violence / Defilement Charges</option>
                    <option value="robbery_crime">🗡️ Robbery & Violent Crime</option>
                    <option value="integrity_violation">📄 Chapter 6 Ethics Violation</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Evidence Source *
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as EvidenceSourceType)}
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold text-xs uppercase text-neutral-900 dark:text-neutral-100"
              >
                <option value="TikTok">🎵 TikTok Video / Clip</option>
                <option value="X / Twitter">💬 X (Twitter) Post / Thread</option>
                <option value="News Outlet">📰 News Article / Media Audit</option>
                <option value="Court Case / EACC">⚖️ Court Docket / EACC Charge Sheet</option>
                <option value="Hansard / Parliamentary Record">📜 Hansard / Official Voting Roll</option>
                <option value="Official Gazette">📄 Kenya Official Gazette</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
              Evidence Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Documented EACC Audit on CDF Fund Diversion"
              className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold text-xs text-neutral-900 dark:text-neutral-100"
            />
          </div>

          {/* Reason & Explanation */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
              Detailed Reason & Score Justification *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this evidence proves good/bad conduct and why it should directly adjust the politician's score..."
              className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold text-xs text-neutral-900 dark:text-neutral-100"
            />
          </div>

          {/* Social Media Handle or Court Case Number */}
          {(sourceType === 'TikTok' || sourceType === 'X / Twitter') && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Social Media Handle / Video Creator (@Handle)
              </label>
              <input
                type="text"
                value={socialMediaHandle}
                onChange={(e) => setSocialMediaHandle(e.target.value)}
                placeholder="e.g. @GenZKenyanWatch or @StandardKenya"
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold text-xs text-neutral-900 dark:text-neutral-100"
              />
            </div>
          )}

          {sourceType === 'Court Case / EACC' && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Court Docket / EACC Charge Sheet Number
              </label>
              <input
                type="text"
                value={courtCaseNumber}
                onChange={(e) => setCourtCaseNumber(e.target.value)}
                placeholder="e.g. Nakuru Anti-Corruption Court Case ACC 14/2023"
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold text-xs text-neutral-900 dark:text-neutral-100"
              />
            </div>
          )}

          {/* Public URL & File Attachment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Source URL / Video Link
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://tiktok.com/@creator/video/123..."
                className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold text-xs text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1">
                Upload Proof File (PDF/Image)
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full p-1.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold text-xs text-neutral-900 dark:text-neutral-100"
              />
              {uploadedFileName && (
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  ✓ Attached: {uploadedFileName}
                </p>
              )}
            </div>
          </div>

          {/* Submitter Info */}
          <div className="flex items-center justify-between p-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                Submitter Identity
              </label>
              <input
                type="text"
                disabled={isAnonymous}
                value={submitter}
                onChange={(e) => setSubmitter(e.target.value)}
                placeholder="Your Name / Civic Organization"
                className="p-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 font-bold text-xs"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              <span className="text-xs font-black uppercase text-neutral-700 dark:text-neutral-300">
                Submit Anonymously
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border-2 border-neutral-900 shadow-md ${
              impactType === 'good' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SUBMIT EVIDENCE & RECALCULATE LEADER SCORE</span>
          </button>
        </form>
      </div>
    </div>
  );
};
