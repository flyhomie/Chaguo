import React, { useState } from 'react';
import { Candidate, CitizenEvidenceReport, TagColor, CandidatePosition } from '../types';
import { X, Plus, Save, Trash2, ShieldCheck, Award, Upload, Search, Check, Image as ImageIcon, UserCheck, Lock, ShieldAlert } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';
import { KENYAN_COUNTIES } from '../data/counties';

interface OwnerAdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  onUpdateCandidatePhoto: (candidateId: string, photoUrl: string) => void;
  onUpdateCandidateDetails: (updatedCandidate: Candidate) => void;
  onAddCandidate: (newCandidate: Candidate) => void;
  onDeleteCandidate?: (candidateId: string) => void;
  evidenceReports?: CitizenEvidenceReport[];
  currentUser?: any;
}

export const OwnerAdminPanelModal: React.FC<OwnerAdminPanelModalProps> = ({
  isOpen,
  onClose,
  candidates,
  onUpdateCandidatePhoto,
  onUpdateCandidateDetails,
  onAddCandidate,
  onDeleteCandidate,
  evidenceReports = [],
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'edit' | 'add' | 'overview'>('photos');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  
  // Single Candidate Photo Upload modal state
  const [photoCandidate, setPhotoCandidate] = useState<Candidate | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState('');

  // Add Candidate Form State
  const [newName, setNewName] = useState('');
  const [newPosition, setNewPosition] = useState<CandidatePosition>('MP');
  const [newCounty, setNewCounty] = useState('Nairobi');
  const [newWard, setNewWard] = useState('');
  const [newParty, setNewParty] = useState('UDA');
  const [newTagColor, setNewTagColor] = useState<TagColor>('red');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isChampion, setIsChampion] = useState(false);

  if (!isOpen) return null;

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        callback(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (candidateId: string) => {
    const urlToUse = filePreview || photoUrlInput.trim();
    if (!urlToUse) return;

    onUpdateCandidatePhoto(candidateId, urlToUse);
    setPhotoSuccessMsg('✅ Candidate photo updated successfully!');
    setTimeout(() => {
      setPhotoSuccessMsg('');
      setPhotoCandidate(null);
      setPhotoUrlInput('');
      setFilePreview(null);
    }, 1200);
  };

  const handleSaveEditedCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;

    onUpdateCandidateDetails(editingCandidate);
    setPhotoSuccessMsg(`✅ Updated record for ${editingCandidate.name}`);
    setTimeout(() => {
      setPhotoSuccessMsg('');
      setEditingCandidate(null);
    }, 1200);
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: Candidate = {
      id: `cand-official-${Date.now()}`,
      name: newName.trim(),
      position: newPosition,
      county: newCounty,
      ward: newWard.trim() || undefined,
      party: newParty.trim() || 'INDEPENDENT',
      isIndependent: newParty.trim().toUpperCase() === 'INDEPENDENT',
      tagColor: newTagColor,
      tagReason: `Official record added by Owner / Admin. Tagged as ${newTagColor.toUpperCase()}.`,
      photoUrl: newPhotoUrl.trim() || undefined,
      isGoodLeaderChampion: isChampion,
      corruptionStatus: 'clean',
      sexualViolenceStatus: 'clean',
      robberyCrimeStatus: 'clean',
      ties: {
        uhuru: newTagColor === 'red',
        ruto: newTagColor === 'red',
        gachagua: newTagColor === 'red',
        details: 'Official executive affiliation analysis log.'
      },
      votes: {
        financeBill2024: 'NO',
        financeBill2025: 'NO',
        notes2024: 'Official record logged',
        notes2025: 'Official record logged'
      },
      bio: `Official 2027 leadership profile for ${newName.trim()} contesting as ${newPosition} in ${newCounty}.`,
      termInOffice: '2022 - 2027',
      keyPositionsHeld: [newPosition],
      goodLeaderHighlights: ['Verified civic record logged.'],
    };

    onAddCandidate(created);
    alert(`✅ Official candidate ${created.name} added!`);
    setNewName('');
    setNewWard('');
    setNewPhotoUrl('');
    setActiveTab('photos');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 overflow-hidden my-6 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-neutral-950 text-white border-b-2 border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                  OWNER & ADMIN CONTROL PANEL
                </h2>
                <span className="px-2 py-0.5 bg-amber-500 text-neutral-950 text-[10px] font-black uppercase rounded">
                  VERIFIED OWNER
                </span>
              </div>
              <p className="text-xs font-bold text-neutral-400 uppercase">
                Manage candidate official profile photos, leader records, and platform governance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-neutral-800 hover:bg-red-600 text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {photoSuccessMsg && (
          <div className="bg-emerald-600 text-white px-4 py-2 font-black text-xs uppercase flex items-center justify-between border-b border-emerald-700 animate-pulse">
            <span>{photoSuccessMsg}</span>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="bg-neutral-100 dark:bg-neutral-800 p-2 border-b-2 border-neutral-200 dark:border-neutral-700 flex items-center gap-2 overflow-x-auto text-xs font-black uppercase">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'photos'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>1. Candidate Photos ({candidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'edit'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>2. Edit Records</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'add'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>3. Add Official Candidate</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>4. Governance & Audit</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5 bg-neutral-50 dark:bg-neutral-950">
          
          {/* SEARCH BAR */}
          {(activeTab === 'photos' || activeTab === 'edit') && (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name, county, party or position..."
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 shadow-xs"
              />
            </div>
          )}

          {/* TAB 1: OFFICIAL CANDIDATE PHOTOS MANAGER */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center justify-between">
                <span>📸 As Owner, click "Upload Photo" on any candidate to set or change their official portrait.</span>
                <span className="font-black">{candidates.filter(c => c.photoUrl).length} / {candidates.length} With Photos</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-3.5 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 shadow-xs hover:border-neutral-400 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {candidate.photoUrl ? (
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.name}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-neutral-700 shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="shrink-0">
                          <DemonicAvatar seed={candidate.id} name={candidate.name} tagColor={candidate.tagColor} size="md" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-xs uppercase leading-tight truncate">
                          {candidate.name}
                        </h4>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase truncate">
                          {candidate.position} • {candidate.county}
                        </p>
                        <span className={`inline-block px-1.5 py-0.2 text-[8px] font-black uppercase rounded mt-1 ${
                          candidate.photoUrl ? 'bg-emerald-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}>
                          {candidate.photoUrl ? 'Has Official Photo' : 'Default Avatar'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setPhotoCandidate(candidate);
                        setPhotoUrlInput(candidate.photoUrl || '');
                        setFilePreview(null);
                      }}
                      className="w-full py-1.5 bg-neutral-900 hover:bg-red-600 text-white dark:bg-neutral-800 dark:hover:bg-red-600 text-[10px] font-black uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Update Photo</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EDIT CANDIDATE RECORDS */}
          {activeTab === 'edit' && (
            <div className="space-y-4">
              {editingCandidate ? (
                <form onSubmit={handleSaveEditedCandidate} className="p-5 bg-white dark:bg-neutral-900 border-2 border-neutral-900 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-black text-sm uppercase text-neutral-900 dark:text-white">
                      Editing Record: {editingCandidate.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingCandidate(null)}
                      className="text-xs font-bold uppercase text-neutral-500 hover:text-red-600"
                    >
                      Cancel Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    <div>
                      <label className="block uppercase text-neutral-500 mb-1">Candidate Name</label>
                      <input
                        type="text"
                        value={editingCandidate.name}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
                        className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-neutral-500 mb-1">Political Party</label>
                      <input
                        type="text"
                        value={editingCandidate.party}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, party: e.target.value })}
                        className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-neutral-500 mb-1">Position</label>
                      <select
                        value={editingCandidate.position}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, position: e.target.value as any })}
                        className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border rounded-lg"
                      >
                        <option value="President">President</option>
                        <option value="Governor">Governor</option>
                        <option value="Senator">Senator</option>
                        <option value="MP">MP</option>
                        <option value="Women Rep">Women Rep</option>
                        <option value="MCA">MCA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase text-neutral-500 mb-1">County</label>
                      <select
                        value={editingCandidate.county}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, county: e.target.value })}
                        className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border rounded-lg"
                      >
                        {KENYAN_COUNTIES.map(county => (
                          <option key={county.code} value={county.name}>{county.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase text-neutral-500 mb-1">Tag Color Classification</label>
                      <select
                        value={editingCandidate.tagColor}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, tagColor: e.target.value as TagColor })}
                        className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border rounded-lg font-black"
                      >
                        <option value="green">🟢 GREEN (Clean Record / Integrity)</option>
                        <option value="red">🔴 RED (Affiliated / High Risk)</option>
                        <option value="purple">🟣 PURPLE (Independent / Unaligned)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="championEdit"
                        checked={Boolean(editingCandidate.isGoodLeaderChampion)}
                        onChange={(e) => setEditingCandidate({ ...editingCandidate, isGoodLeaderChampion: e.target.checked })}
                        className="w-4 h-4 accent-green-600"
                      />
                      <label htmlFor="championEdit" className="uppercase font-black text-xs text-green-600">
                        🌟 Mark as Good Leader Champion
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Record Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="p-3 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {candidate.photoUrl ? (
                          <img src={candidate.photoUrl} alt={candidate.name} className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                        ) : (
                          <DemonicAvatar seed={candidate.id} name={candidate.name} tagColor={candidate.tagColor} size="xs" />
                        )}
                        <div className="min-w-0">
                          <h4 className="font-black text-xs uppercase truncate">{candidate.name}</h4>
                          <p className="text-[10px] text-neutral-500 uppercase">{candidate.position} • {candidate.county}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingCandidate(candidate)}
                          className="px-2.5 py-1 bg-neutral-900 text-white dark:bg-neutral-800 text-[10px] font-black uppercase rounded hover:bg-red-600 transition-colors"
                        >
                          Edit
                        </button>
                        {onDeleteCandidate && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${candidate.name}?`)) {
                                onDeleteCandidate(candidate.id);
                              }
                            }}
                            className="p-1 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADD NEW OFFICIAL CANDIDATE */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateCandidate} className="p-5 bg-white dark:bg-neutral-900 border-2 border-neutral-900 rounded-2xl space-y-4">
              <h3 className="font-black text-sm uppercase text-neutral-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-600" />
                Add Official Candidate Dossier
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                <div>
                  <label className="block uppercase text-neutral-500 mb-1">Full Leader Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Hon. Jane Wanjiru"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block uppercase text-neutral-500 mb-1">Political Party *</label>
                  <input
                    type="text"
                    required
                    value={newParty}
                    onChange={(e) => setNewParty(e.target.value)}
                    placeholder="e.g. UDA, ODM, Jubilee, Wiper"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block uppercase text-neutral-500 mb-1">Position / Office *</label>
                  <select
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border rounded-xl"
                  >
                    <option value="President">President</option>
                    <option value="Governor">Governor</option>
                    <option value="Senator">Senator</option>
                    <option value="MP">MP</option>
                    <option value="Women Rep">Women Rep</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-neutral-500 mb-1">County *</label>
                  <select
                    value={newCounty}
                    onChange={(e) => setNewCounty(e.target.value)}
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border rounded-xl"
                  >
                    {KENYAN_COUNTIES.map(county => (
                      <option key={county.code} value={county.name}>{county.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-neutral-500 mb-1">Constituency / Ward (Optional)</label>
                  <input
                    type="text"
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    placeholder="e.g. Starehe / Landimawe"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block uppercase text-neutral-500 mb-1">Classification Tag</label>
                  <select
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value as TagColor)}
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border rounded-xl font-black"
                  >
                    <option value="green">🟢 GREEN (Clean Record)</option>
                    <option value="red">🔴 RED (Affiliated / Risk)</option>
                    <option value="purple">🟣 PURPLE (Independent)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase text-neutral-500 mb-1">Official Candidate Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or official bio portrait URL"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="championNew"
                    checked={isChampion}
                    onChange={(e) => setIsChampion(e.target.checked)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <label htmlFor="championNew" className="uppercase font-black text-xs text-green-600">
                    🌟 Mark as Good Leader Champion
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Official Candidate Record</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: GOVERNANCE & AUDIT OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-5 bg-white dark:bg-neutral-900 border-2 border-neutral-900 rounded-2xl space-y-4 text-xs">
              <h3 className="font-black uppercase text-sm text-neutral-900 dark:text-white">
                Platform Statistics & System Health
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-black uppercase">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                  <span className="text-neutral-500 block text-[9px]">Total Candidates</span>
                  <span className="text-xl text-neutral-900 dark:text-white">{candidates.length}</span>
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                  <span className="text-neutral-500 block text-[9px]">Official Photos</span>
                  <span className="text-xl text-emerald-600">{candidates.filter(c => c.photoUrl).length}</span>
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                  <span className="text-neutral-500 block text-[9px]">Evidence Reports</span>
                  <span className="text-xl text-blue-600">{evidenceReports.length}</span>
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                  <span className="text-neutral-500 block text-[9px]">Champions</span>
                  <span className="text-xl text-green-600">{candidates.filter(c => c.isGoodLeaderChampion).length}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* PHOTO UPDATE POPUP DIALOG */}
        {photoCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-xs">
            <div className="bg-white dark:bg-neutral-900 border-4 border-neutral-900 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-black text-sm uppercase">
                  Update Official Photo: {photoCandidate.name}
                </h3>
                <button
                  onClick={() => setPhotoCandidate(null)}
                  className="p-1 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Preview */}
              <div className="flex flex-col items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 space-y-2">
                {filePreview || photoUrlInput ? (
                  <img
                    src={filePreview || photoUrlInput}
                    alt="Preview"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-neutral-900 shadow-md"
                    onError={() => alert('Unable to load photo preview from URL. Please check the link.')}
                  />
                ) : (
                  <DemonicAvatar seed={photoCandidate.id} name={photoCandidate.name} tagColor={photoCandidate.tagColor} size="lg" />
                )}
                <span className="text-[10px] font-bold uppercase text-neutral-500">
                  {filePreview ? 'Uploaded Image File' : photoUrlInput ? 'Image URL Loaded' : 'Current Avatar'}
                </span>
              </div>

              {/* Option 1: File Upload */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-neutral-700 dark:text-neutral-300">
                  Option 1: Upload Image File from Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (url) => setFilePreview(url))}
                  className="w-full text-xs font-bold p-2 bg-neutral-100 dark:bg-neutral-800 border rounded-xl"
                />
              </div>

              {/* Option 2: Image URL */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase text-neutral-700 dark:text-neutral-300">
                  Option 2: Paste Direct Image URL
                </label>
                <input
                  type="url"
                  value={photoUrlInput}
                  onChange={(e) => {
                    setPhotoUrlInput(e.target.value);
                    setFilePreview(null);
                  }}
                  placeholder="https://images.unsplash.com/... or official bio photo"
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPhotoCandidate(null)}
                  className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs uppercase rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePhoto(photoCandidate.id)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Photo</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
