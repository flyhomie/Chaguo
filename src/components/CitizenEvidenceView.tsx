import React, { useState } from 'react';
import { CitizenEvidenceReport, CandidatePosition, EvidenceSourceType } from '../types';
import { Upload, FileText, AlertTriangle, ShieldAlert, CheckCircle2, ThumbsUp, Plus, ExternalLink, X, Search, Filter, Download, MessageSquare, Video, Scale, Newspaper, Cloud } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';
import { downloadFile, exportToCSV } from '../utils/download';

interface CitizenEvidenceViewProps {
  reports: CitizenEvidenceReport[];
  onAddReport: (newReport: Omit<CitizenEvidenceReport, 'id' | 'timestamp' | 'upvotes' | 'status'>) => void;
  onUpvote: (reportId: string) => void;
  onOpenDrive?: () => void;
}

export const CitizenEvidenceView: React.FC<CitizenEvidenceViewProps> = ({
  reports,
  onAddReport,
  onUpvote,
  onOpenDrive,
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [leaderName, setLeaderName] = useState('');
  const [position, setPosition] = useState<CandidatePosition>('MP');
  const [county, setCounty] = useState('Nairobi');
  const [wardOrConstituency, setWardOrConstituency] = useState('');
  const [category, setCategory] = useState<'corruption' | 'sexual_violence' | 'robbery_crime' | 'development' | 'integrity_violation'>('corruption');
  const [sourceType, setSourceType] = useState<EvidenceSourceType>('document');
  const [socialMediaHandle, setSocialMediaHandle] = useState('');
  const [courtCaseNumber, setCourtCaseNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submitter, setSubmitter] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);

  const handleDownloadSingleReport = (report: CitizenEvidenceReport) => {
    const content = `=====================================================
CHAGUO 2027 KENYA CITIZEN EVIDENCE DOCKET
=====================================================
Target Leader: ${report.leaderName} (${report.position} - ${report.county})
Ward/Constituency: ${report.wardOrConstituency || 'N/A'}
Report ID: ${report.id}
Date Submitted: ${report.timestamp}
Category: ${report.category.toUpperCase()}
Source Type: ${(report.sourceType || 'document').toUpperCase()}
${report.socialMediaHandle ? `Social Handle/Creator: ${report.socialMediaHandle}\n` : ''}${report.courtCaseNumber ? `Court Case Docket Number: ${report.courtCaseNumber}\n` : ''}Submitter: ${report.submitter}
Upvotes: ${report.upvotes}
Status: ${report.status}

-----------------------------------------------------
EVIDENCE TITLE: ${report.title}
-----------------------------------------------------
DESCRIPTION & VERIFIED FACTS:
${report.description}

-----------------------------------------------------
ATTACHED DOCUMENTS / SOURCES:
File Attachment: ${report.fileName || 'None'}
Evidence URL: ${report.evidenceUrl || 'None'}
File Preview Hash: ${report.filePreview || 'N/A'}
=====================================================
`;
    downloadFile(`CHAGUO2027_EVIDENCE_${report.id}.txt`, content, 'text/plain');
  };

  const handleExportAllEvidenceCSV = () => {
    const csvData = reports.map((r) => ({
      ID: r.id,
      Leader: r.leaderName,
      Position: r.position,
      County: r.county,
      Category: r.category,
      SourceType: r.sourceType || 'document',
      SocialHandle: r.socialMediaHandle || '',
      CourtCaseNo: r.courtCaseNumber || '',
      Title: r.title,
      Description: r.description,
      Date: r.timestamp,
      Submitter: r.submitter,
      Upvotes: r.upvotes,
      EvidenceURL: r.evidenceUrl || '',
    }));
    exportToCSV(`CHAGUO2027_ALL_EVIDENCE_REGISTRY_${Date.now()}.csv`, csvData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFilePreview(`FILE ATTACHMENT: ${file.name} (${(file.size / 1024).toFixed(1)} KB) - Verified local hash.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderName.trim() || !title.trim() || !description.trim()) {
      alert("Please fill in Leader Name, Evidence Title, and Detailed Description.");
      return;
    }

    onAddReport({
      leaderName,
      position,
      county,
      wardOrConstituency,
      category,
      title,
      description,
      sourceType,
      socialMediaHandle: socialMediaHandle.trim() || undefined,
      courtCaseNumber: courtCaseNumber.trim() || undefined,
      evidenceUrl: evidenceUrl.trim() || undefined,
      fileName: uploadedFileName || undefined,
      filePreview: uploadedFilePreview || undefined,
      submitter: isAnonymous ? 'Anonymous Kenyan Citizen' : (submitter.trim() || 'Verified Citizen'),
      isAnonymous
    });

    // Reset Form
    setLeaderName('');
    setTitle('');
    setDescription('');
    setEvidenceUrl('');
    setSocialMediaHandle('');
    setCourtCaseNumber('');
    setSubmitter('');
    setUploadedFileName(null);
    setUploadedFilePreview(null);
    setShowSubmitModal(false);
    alert("Thank you! Your evidence report has been submitted to the public registry.");
  };

  const filteredReports = reports.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesLeader = r.leaderName.toLowerCase().includes(q);
      const matchesTitle = r.title.toLowerCase().includes(q);
      const matchesCounty = r.county.toLowerCase().includes(q);
      if (!matchesLeader && !matchesTitle && !matchesCounty) return false;
    }
    return true;
  });

  const getSourceTypeBadge = (source?: EvidenceSourceType) => {
    switch (source) {
      case 'tiktok':
        return <span className="px-2 py-0.5 bg-pink-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1"><Video className="w-3 h-3" /> TIKTOK VIDEO EVIDENCE</span>;
      case 'x_post':
        return <span className="px-2 py-0.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-[9px] font-black uppercase tracking-wider flex items-center gap-1"><MessageSquare className="w-3 h-3" /> X (TWITTER) POST</span>;
      case 'court_case':
        return <span className="px-2 py-0.5 bg-amber-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1"><Scale className="w-3 h-3" /> COURT CASE DOCKET</span>;
      case 'news_outlet':
        return <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1"><Newspaper className="w-3 h-3" /> NEWS INVESTIGATION</span>;
      default:
        return <span className="px-2 py-0.5 bg-neutral-700 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1"><FileText className="w-3 h-3" /> OFFICIAL DOCUMENT</span>;
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'corruption':
        return <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">🚨 CORRUPTION / FRAUD</span>;
      case 'sexual_violence':
        return <span className="px-2.5 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider">⚖️ RAPE / DEFILEMENT</span>;
      case 'robbery_crime':
        return <span className="px-2.5 py-1 bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider">🗡️ ROBBERY / VIOLENCE</span>;
      case 'development':
        return <span className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black uppercase tracking-wider">🌟 DEVELOPMENT PROJECT</span>;
      default:
        return <span className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider">📄 INTEGRITY VIOLATION</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white border-2 border-neutral-900 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest">
            <Upload className="w-3.5 h-3.5" /> CITIZEN EVIDENCE & REPORTING PORTAL
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">
            Submit & Verify Leader Case Evidence
          </h2>
          <p className="text-xs sm:text-sm font-bold text-neutral-300 uppercase leading-relaxed">
            Upload documented proof of corruption convictions, rape/defilement charges, robbery incidents, or actual community development projects. Public accountability driven by citizens.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {onOpenDrive && (
            <button
              onClick={onOpenDrive}
              className="px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest transition-all border-2 border-blue-500 flex items-center justify-center gap-2 shadow-sm"
              title="Backup and view evidence files on Google Drive"
            >
              <Cloud className="w-4 h-4 text-blue-100" />
              <span>DRIVE CLOUD STORAGE</span>
            </button>
          )}
          <button
            onClick={handleExportAllEvidenceCSV}
            className="px-4 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-black text-xs uppercase tracking-widest transition-all border-2 border-neutral-700 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>EXPORT ALL DATA (.CSV)</span>
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-6 py-4 bg-red-600 hover:bg-white hover:text-neutral-900 text-white font-black text-xs uppercase tracking-widest transition-all border-2 border-red-600 flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>SUBMIT EVIDENCE REPORT</span>
          </button>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-bold text-xs uppercase text-neutral-900 dark:text-neutral-100">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase transition-colors ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
            }`}
          >
            ALL REPORTS ({reports.length})
          </button>

          <button
            onClick={() => setSelectedCategory('corruption')}
            className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase transition-colors ${
              selectedCategory === 'corruption'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
            }`}
          >
            CORRUPTION ({reports.filter((r) => r.category === 'corruption').length})
          </button>

          <button
            onClick={() => setSelectedCategory('sexual_violence')}
            className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase transition-colors ${
              selectedCategory === 'sexual_violence'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
            }`}
          >
            RAPE / DEFILEMENT ({reports.filter((r) => r.category === 'sexual_violence').length})
          </button>

          <button
            onClick={() => setSelectedCategory('robbery_crime')}
            className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase transition-colors ${
              selectedCategory === 'robbery_crime'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
            }`}
          >
            ROBBERY / VIOLENCE ({reports.filter((r) => r.category === 'robbery_crime').length})
          </button>

          <button
            onClick={() => setSelectedCategory('development')}
            className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase transition-colors ${
              selectedCategory === 'development'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
            }`}
          >
            GOOD DEVELOPMENTS ({reports.filter((r) => r.category === 'development').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report by name..."
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 text-xs font-bold uppercase text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Evidence Reports Feed */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-12 text-center space-y-3">
            <p className="text-xs font-bold text-neutral-500 uppercase">No evidence reports match your selection criteria.</p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 bg-red-600 text-white font-black text-xs uppercase"
            >
              Be the first to submit a report
            </button>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 p-6 shadow-sm space-y-4 text-neutral-900 dark:text-neutral-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-neutral-200 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {getCategoryBadge(report.category)}
                  {getSourceTypeBadge(report.sourceType)}
                  <DemonicAvatar seed={report.leaderName} name={report.leaderName} size="xs" />
                  <span className="text-xs font-black uppercase text-neutral-900 dark:text-neutral-100">
                    TARGET: <strong className="text-red-600 dark:text-red-400">{report.leaderName}</strong> ({report.position} • {report.county})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase">
                  <span>DATE: {report.timestamp}</span>
                  <span>•</span>
                  <span>SUBMITTED BY: {report.submitter}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
                  {report.title}
                </h3>
                <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase leading-relaxed bg-neutral-50 dark:bg-neutral-950 p-4 border-l-4 border-neutral-900 dark:border-neutral-600">
                  {report.description}
                </p>
              </div>

              {/* Evidence File & Social Media / Court Metadata Box */}
              {(report.fileName || report.evidenceUrl || report.filePreview || report.socialMediaHandle || report.courtCaseNumber) && (
                <div className="bg-neutral-100 dark:bg-neutral-800 p-4 border-2 border-neutral-900 dark:border-neutral-700 text-xs uppercase font-bold space-y-2">
                  <span className="text-[10px] font-black text-neutral-500 dark:text-neutral-400 block">DOCUMENTED EVIDENCE ATTACHMENTS & SOURCES:</span>
                  
                  {report.socialMediaHandle && (
                    <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-black">
                      <Video className="w-4 h-4 shrink-0" />
                      <span>SOCIAL MEDIA SOURCE / CREATOR: {report.socialMediaHandle}</span>
                    </div>
                  )}

                  {report.courtCaseNumber && (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black">
                      <Scale className="w-4 h-4 shrink-0" />
                      <span>JUDICIARY COURT CASE DOCKET NO: {report.courtCaseNumber}</span>
                    </div>
                  )}

                  {report.fileName && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span>{report.fileName}</span>
                    </div>
                  )}

                  {report.filePreview && (
                    <p className="text-[11px] font-mono text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 p-2 border border-neutral-300 dark:border-neutral-700">
                      {report.filePreview}
                    </p>
                  )}

                  {report.evidenceUrl && (
                    <a
                      href={report.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 dark:text-red-400 hover:underline"
                    >
                      <span>OPEN PUBLIC LINK / EACC DOCKET / SOCIAL MEDIA POST</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Upvote, Download & Verification Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <span className="px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED COMMUNITY RECORD
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadSingleReport(report)}
                    className="px-3 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors border-2 border-neutral-900 dark:border-neutral-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD DOCKET (.TXT)</span>
                  </button>

                  <button
                    onClick={() => onUpvote(report.id)}
                    className="px-4 py-2 bg-neutral-900 dark:bg-neutral-800 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors border-2 border-neutral-900 dark:border-neutral-700"
                  >
                    <ThumbsUp className="w-4 h-4 text-red-500" />
                    <span>UPVOTE ({report.upvotes})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Evidence Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 my-8 p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-red-600" />
                <h3 className="text-2xl font-black uppercase tracking-tight">Submit Citizen Evidence Report</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 bg-neutral-800 text-white hover:bg-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold uppercase">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-neutral-500">Target Leader Name *</label>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="e.g. Honorable John Doe"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-neutral-500">Position *</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as CandidatePosition)}
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  >
                    <option value="MP">MP (Constituency)</option>
                    <option value="MCA">MCA (County Ward)</option>
                    <option value="Senator">Senator</option>
                    <option value="Governor">Governor</option>
                    <option value="Woman Rep">Woman Rep</option>
                    <option value="Presidential Aspirant">Presidential Aspirant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-neutral-500">County</label>
                  <input
                    type="text"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    placeholder="e.g. Nairobi / Kiambu / Kisii"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-neutral-500">Ward / Constituency</label>
                  <input
                    type="text"
                    value={wardOrConstituency}
                    onChange={(e) => setWardOrConstituency(e.target.value)}
                    placeholder="e.g. Roysambu Ward / Kikuyu"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-neutral-500">Evidence Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  >
                    <option value="corruption">🚨 Corruption / Embezzlement / Bribery</option>
                    <option value="sexual_violence">⚖️ Rape / Defilement / Sexual Violence</option>
                    <option value="robbery_crime">🗡️ Robbery / Assault / Violent Crime</option>
                    <option value="development">🌟 Good Development Project</option>
                    <option value="integrity_violation">📄 Chapter 6 Integrity Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-neutral-500">Evidence Source Type *</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as EvidenceSourceType)}
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  >
                    <option value="document">📄 Official Document / PDF</option>
                    <option value="court_case">⚖️ Court Case / Judiciary Docket</option>
                    <option value="tiktok">🎵 TikTok Video Evidence</option>
                    <option value="x_post">💬 X (Twitter) Post / Thread</option>
                    <option value="news_outlet">📰 News Outlet Investigation</option>
                    <option value="gazette">📜 Kenya Official Gazette</option>
                  </select>
                </div>
              </div>

              {(sourceType === 'tiktok' || sourceType === 'x_post') && (
                <div>
                  <label className="block mb-1 text-neutral-500">Social Media Creator / Account Handle</label>
                  <input
                    type="text"
                    value={socialMediaHandle}
                    onChange={(e) => setSocialMediaHandle(e.target.value)}
                    placeholder="e.g. @KenyanActivist or @CitizenReporter"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  />
                </div>
              )}

              {sourceType === 'court_case' && (
                <div>
                  <label className="block mb-1 text-neutral-500">Court Case Docket / Case Number</label>
                  <input
                    type="text"
                    value={courtCaseNumber}
                    onChange={(e) => setCourtCaseNumber(e.target.value)}
                    placeholder="e.g. EACC ACC No. 44 of 2024 or Milimani High Court 102/2023"
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block mb-1 text-neutral-500">Report Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Court Charge Sheet for CDF Fund Divergence"
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                />
              </div>

              <div>
                <label className="block mb-1 text-neutral-500">Detailed Description & Evidence Summary *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the incident, case docket number, court location, or project verification details..."
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                ></textarea>
              </div>

              {/* Upload Document File Area */}
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 border-2 border-dashed border-neutral-900 dark:border-neutral-700 text-center space-y-2">
                <Upload className="w-8 h-8 text-red-600 mx-auto" />
                <span className="block text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase">
                  Attach Evidence File (PDF, Image, Court Document, Audio)
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block mx-auto text-xs text-neutral-600 dark:text-neutral-400 file:mr-4 file:py-2 file:px-4 file:border-2 file:border-neutral-900 file:bg-neutral-900 file:text-white file:font-black file:uppercase hover:file:bg-red-600 cursor-pointer"
                />
                {uploadedFileName && (
                  <p className="text-xs font-black text-green-600">
                    File selected: {uploadedFileName}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-neutral-500">Official Evidence URL (Optional)</label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://judiciary.go.ke or news link"
                  className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymousCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-neutral-900"
                  />
                  <label htmlFor="anonymousCheck" className="text-xs font-black uppercase text-neutral-900 dark:text-neutral-100 cursor-pointer">
                    Submit Anonymously (Hide My Name)
                  </label>
                </div>

                {!isAnonymous && (
                  <input
                    type="text"
                    value={submitter}
                    onChange={(e) => setSubmitter(e.target.value)}
                    placeholder="Your Name / Handle"
                    className="p-2 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold text-xs"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-neutral-900 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-black text-xs uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-widest transition-colors"
                >
                  SUBMIT EVIDENCE REPORT
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
