export type TagColor = 'red' | 'green' | 'purple';

export type CandidatePosition = 'MP' | 'Senator' | 'Governor' | 'Presidential Aspirant' | 'Woman Rep' | 'MCA' | 'Cabinet Secretary';

export type VoteStatus = 'YES' | 'NO' | 'ABSENT' | 'NOT_IN_OFFICE';

export type LegalCaseStatus = 'clean' | 'alleged' | 'charged' | 'convicted';

export interface DevelopmentProject {
  id: string;
  title: string;
  category: 'Infrastructure' | 'Education' | 'Healthcare' | 'Water & Sanitation' | 'Youth & Empowerment';
  description: string;
  impact: string;
  year: string;
}

export interface Candidate {
  id: string;
  name: string;
  position: CandidatePosition;
  county: string;
  constituency?: string;
  ward?: string;
  party: string;
  isIndependent: boolean;
  tagColor: TagColor;
  tagReason: string;
  
  // Integrity & Legal Parameters
  corruptionStatus: LegalCaseStatus;
  corruptionDetails?: string;
  
  sexualViolenceStatus: LegalCaseStatus; // Rape / defilement cases
  sexualViolenceDetails?: string;
  
  robberyCrimeStatus: LegalCaseStatus; // Robbery, assault, violent crime cases
  robberyCrimeDetails?: string;
  
  // Good Leader & Development Parameters
  isGoodLeaderChampion?: boolean;
  goodLeaderHighlights?: string[];
  developmentProjects?: DevelopmentProject[];

  ties: {
    uhuru: boolean;
    ruto: boolean;
    gachagua: boolean;
    details: string;
  };
  votes: {
    financeBill2024: VoteStatus;
    financeBill2025: VoteStatus;
    notes2024?: string;
    notes2025?: string;
  };
  bio: string;
  termInOffice: string;
  keyPositionsHeld: string[];
  photoUrl?: string;
  hansardRecordUrl?: string;
}

export interface CountyData {
  code: number;
  name: string;
  region: string;
  constituencies: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface FinanceBillClause {
  id: string;
  title: string;
  category: string;
  description: string;
  impactOnCitizens: string;
  billYear: '2024' | '2025';
}

export type EvidenceSourceType = 'tiktok' | 'x_post' | 'court_case' | 'news_outlet' | 'document' | 'other' | 'TikTok' | 'X / Twitter' | 'News Outlet' | 'Court Case / EACC' | 'Hansard / Parliamentary Record' | 'Official Gazette';

export interface CitizenEvidenceReport {
  id: string;
  leaderName: string;
  position: CandidatePosition;
  county: string;
  wardOrConstituency?: string;
  category: 'corruption' | 'sexual_violence' | 'robbery_crime' | 'development' | 'integrity_violation';
  title: string;
  description: string;
  sourceType?: EvidenceSourceType;
  sourceUrl?: string;
  socialMediaHandle?: string;
  courtCaseNumber?: string;
  evidenceUrl?: string;
  fileName?: string;
  filePreview?: string;
  submitter: string;
  isAnonymous: boolean;
  timestamp: string;
  upvotes: number;
  status: 'verified' | 'under_review';
  impactType?: 'good' | 'bad';
  impactPoints?: number;
  reason?: string;
}

