import React, { useState } from 'react';
import { X, UserPlus, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';
import { Candidate, CandidatePosition, LegalCaseStatus, TagColor, VoteStatus } from '../types';
import { DemonicAvatar } from './DemonicAvatar';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCandidate: (candidate: Candidate) => void;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  isOpen,
  onClose,
  onAddCandidate,
}) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<CandidatePosition>('MP');
  const [county, setCounty] = useState('Nairobi');
  const [constituency, setConstituency] = useState('');
  const [ward, setWard] = useState('');
  const [party, setParty] = useState('UDA');
  const [isIndependent, setIsIndependent] = useState(false);
  const [tagColor, setTagColor] = useState<TagColor>('red');
  const [tagReason, setTagReason] = useState('');
  
  // Integrity parameters
  const [corruptionStatus, setCorruptionStatus] = useState<LegalCaseStatus>('clean');
  const [corruptionDetails, setCorruptionDetails] = useState('');
  const [sexualViolenceStatus, setSexualViolenceStatus] = useState<LegalCaseStatus>('clean');
  const [sexualViolenceDetails, setSexualViolenceDetails] = useState('');
  const [robberyCrimeStatus, setRobberyCrimeStatus] = useState<LegalCaseStatus>('clean');
  const [robberyCrimeDetails, setRobberyCrimeDetails] = useState('');
  
  // Good leader & votes
  const [isGoodLeaderChampion, setIsGoodLeaderChampion] = useState(false);
  const [goodLeaderHighlightsStr, setGoodLeaderHighlightsStr] = useState('');
  const [rutoTie, setRutoTie] = useState(false);
  const [uhuruTie, setUhuruTie] = useState(false);
  const [gachaguaTie, setGachaguaTie] = useState(false);
  const [tieDetails, setTieDetails] = useState('');
  
  const [financeBill2024, setFinanceBill2024] = useState<VoteStatus>('YES');
  const [financeBill2025, setFinanceBill2025] = useState<VoteStatus>('YES');
  const [bio, setBio] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tagReason.trim() || !bio.trim()) {
      alert('Please fill in candidate name, summary reason, and bio.');
      return;
    }

    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      name: name.trim(),
      position,
      county: county.trim(),
      constituency: constituency.trim() || undefined,
      ward: ward.trim() || undefined,
      party: isIndependent ? 'Independent' : party.trim(),
      isIndependent,
      tagColor,
      tagReason: tagReason.trim(),
      corruptionStatus,
      corruptionDetails: corruptionDetails.trim() || undefined,
      sexualViolenceStatus,
      sexualViolenceDetails: sexualViolenceDetails.trim() || undefined,
      robberyCrimeStatus,
      robberyCrimeDetails: robberyCrimeDetails.trim() || undefined,
      isGoodLeaderChampion,
      goodLeaderHighlights: goodLeaderHighlightsStr
        ? goodLeaderHighlightsStr.split('\n').filter((s) => s.trim().length > 0)
        : undefined,
      ties: {
        ruto: rutoTie,
        uhuru: uhuruTie,
        gachagua: gachaguaTie,
        details: tieDetails.trim() || 'No major coalition ties specified.',
      },
      votes: {
        financeBill2024,
        financeBill2025,
        notes2024: `Voted ${financeBill2024} on Finance Bill 2024.`,
        notes2025: `Voted ${financeBill2025} on Finance Bill 2025.`,
      },
      bio: bio.trim(),
      termInOffice: '2022 - Present',
      keyPositionsHeld: [position, `${county} Candidate`],
    };

    onAddCandidate(newCandidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative my-8 w-full max-w-2xl bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-4">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-black uppercase tracking-tight">
              Upload / Add New Candidate Dossier
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold uppercase">
          {/* Avatar Preview */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 flex items-center gap-4">
            <DemonicAvatar seed={name || 'new-candidate'} name={name} tagColor={tagColor} size="lg" />
            <div>
              <p className="font-black text-sm uppercase">Demonic Cartoon Character Profile</p>
              <p className="text-[11px] text-neutral-500 lowercase normal-case">
                Generated demonic avatar for <span className="font-bold">{name || 'Leader Name'}</span> ({tagColor.toUpperCase()} Dossier).
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-neutral-500">Leader Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kipchumba Murkomen"
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
              />
            </div>

            <div>
              <label className="block mb-1 text-neutral-500">Target Position *</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as CandidatePosition)}
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
              >
                <option value="MP">MP (Member of Parliament)</option>
                <option value="Senator">Senator</option>
                <option value="Governor">Governor</option>
                <option value="Presidential Aspirant">Presidential Aspirant</option>
                <option value="Woman Rep">Woman Representative</option>
                <option value="MCA">MCA (County Assembly Member)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-neutral-500">County *</label>
              <input
                type="text"
                required
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g. Nairobi / Kiambu / Kisumu"
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
              />
            </div>

            <div>
              <label className="block mb-1 text-neutral-500">Constituency / Ward</label>
              <input
                type="text"
                value={position === 'MCA' ? ward : constituency}
                onChange={(e) => (position === 'MCA' ? setWard(e.target.value) : setConstituency(e.target.value))}
                placeholder={position === 'MCA' ? 'Ward Name' : 'Constituency Name'}
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
              />
            </div>

            <div>
              <label className="block mb-1 text-neutral-500">Political Party</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  disabled={isIndependent}
                  value={isIndependent ? 'Independent' : party}
                  onChange={(e) => setParty(e.target.value)}
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold disabled:opacity-50"
                />
                <label className="flex items-center gap-1 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isIndependent}
                    onChange={(e) => setIsIndependent(e.target.checked)}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span>Independent</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-neutral-500">Profile Classification *</label>
              <select
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value as TagColor)}
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
              >
                <option value="red">RED - Voted YES / Charged / Corruption Allegations</option>
                <option value="green">GREEN - Voted NO / Good Leader Champion / Clean</option>
                <option value="purple">PURPLE - Independent Candidate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-neutral-500">Summary Classification Reason *</label>
            <input
              type="text"
              required
              value={tagReason}
              onChange={(e) => setTagReason(e.target.value)}
              placeholder="e.g. Voted YES to taxation bills, facing EACC query over Ksh 40M procurement anomaly."
              className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
            />
          </div>

          {/* Legal Dockets */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-4">
            <h4 className="font-black text-sm uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Integrity & Legal Cases (Corruption, Sexual, Robbery)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 text-neutral-500">Corruption Status</label>
                <select
                  value={corruptionStatus}
                  onChange={(e) => setCorruptionStatus(e.target.value as LegalCaseStatus)}
                  className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-700 font-bold"
                >
                  <option value="clean">Clean (No Case)</option>
                  <option value="alleged">Alleged</option>
                  <option value="charged">Charged in Court</option>
                  <option value="convicted">Convicted</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-neutral-500">Sexual Offense Status</label>
                <select
                  value={sexualViolenceStatus}
                  onChange={(e) => setSexualViolenceStatus(e.target.value as LegalCaseStatus)}
                  className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-700 font-bold"
                >
                  <option value="clean">Clean (No Case)</option>
                  <option value="alleged">Alleged</option>
                  <option value="charged">Charged in Court</option>
                  <option value="convicted">Convicted</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-neutral-500">Robbery / Crime Status</label>
                <select
                  value={robberyCrimeStatus}
                  onChange={(e) => setRobberyCrimeStatus(e.target.value as LegalCaseStatus)}
                  className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-700 font-bold"
                >
                  <option value="clean">Clean (No Case)</option>
                  <option value="alleged">Alleged</option>
                  <option value="charged">Charged in Court</option>
                  <option value="convicted">Convicted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Voting Record & Ties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-neutral-500">Finance Bill 2024 Vote</label>
              <select
                value={financeBill2024}
                onChange={(e) => setFinanceBill2024(e.target.value as VoteStatus)}
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
              >
                <option value="YES">Voted YES</option>
                <option value="NO">Voted NO</option>
                <option value="ABSENT">ABSENT</option>
                <option value="NOT_IN_OFFICE">NOT IN OFFICE</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-neutral-500">Finance Bill 2025 Vote</label>
              <select
                value={financeBill2025}
                onChange={(e) => setFinanceBill2025(e.target.value as VoteStatus)}
                className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
              >
                <option value="YES">Voted YES</option>
                <option value="NO">Voted NO</option>
                <option value="ABSENT">ABSENT</option>
                <option value="NOT_IN_OFFICE">NOT IN OFFICE</option>
              </select>
            </div>
          </div>

          {/* Good Leader Section */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer font-black text-sm">
              <input
                type="checkbox"
                checked={isGoodLeaderChampion}
                onChange={(e) => setIsGoodLeaderChampion(e.target.checked)}
                className="w-4 h-4 accent-green-600"
              />
              <Award className="w-5 h-5 text-green-600" />
              <span>Mark as "Good Leader" Development Champion</span>
            </label>

            {isGoodLeaderChampion && (
              <div>
                <label className="block mb-1 text-neutral-500">Development Highlights (One per line)</label>
                <textarea
                  rows={2}
                  value={goodLeaderHighlightsStr}
                  onChange={(e) => setGoodLeaderHighlightsStr(e.target.value)}
                  placeholder="Built 5 modern ICT labs in public schools&#10;100% transparent bursary disbursement"
                  className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-700 font-bold"
                />
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block mb-1 text-neutral-500">Candidate Bio / Summary *</label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Provide a brief summary of the leader's track record and public service background..."
              className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-neutral-900 text-white font-black text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>SAVE CANDIDATE TO LOCAL DEVICE</span>
          </button>
        </form>
      </div>
    </div>
  );
};
