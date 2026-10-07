export type TagColor = 'red' | 'green' | 'purple';

export type CandidatePosition = 'President' | 'Deputy President' | 'Cabinet Secretary' | 'Governor' | 'Senator' | 'MP' | 'Woman Rep' | 'MCA' | 'Presidential Aspirant';

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

export interface IntegrityScandal {
  id: string;
  year: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  summary: string;
  status: 'Under EACC Probe' | 'Court Trial' | 'Convicted' | 'Dismissed / Out of Court' | 'Verified Civic Query';
  source?: string;
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

  // Enhanced Integrity & Audit Metrics
  ethicsAuditScore?: number; // 0-100%
  eaccQueryStatus?: 'Cleared' | 'Under Active Probe' | 'Assets Frozen' | 'Prosecuted / Charged' | 'Wealth Audit Flagged' | 'No Record';
  assetDeclarationDisclosed?: boolean;
  conflictOfInterestFlags?: string[];
  wealthGrowthMultiplier?: string;
  parliamentaryAttendanceScore?: number; // 0-100%
  citizenRatingScore?: number; // 1.0 to 5.0
  integrityScandals?: IntegrityScandal[];

  // Term-Limited Governor Contesting Lower Seat Red Flag
  isTermLimitedGovernorRunningForLowerSeat?: boolean;
  termLimitedGovernorDetails?: string;
  
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
  isPhotoVerified?: boolean;
  photoVerificationDetails?: string;
  photoVerifiedDate?: string;
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

export type CampaignDonorType = 'Corporate / Mega-Corp' | 'Foreign Interest / Proxy' | 'Government Tenderpreneur' | 'Grassroots / Citizen Micro-donations' | 'Private Equity / Real Estate' | 'Super PAC / Interest Group';

export interface CampaignDonation {
  id: string;
  donorName: string;
  donorCategory: CampaignDonorType;
  amountKsh: number;
  date: string;
  purpose: string;
  isFlaggedConflict: boolean;
  conflictReason?: string;
}

export interface LobbyingInfluenceEvent {
  id: string;
  billIdOrClause: string;
  billTitle: string;
  sponsorOrGroup: string;
  amountEstimatedKsh: number;
  outcome: 'Bill Amendment Passed' | 'Vote Flipped to YES' | 'Committee Delay' | 'Clause Stripped' | 'Under Investigation';
  summary: string;
  evidenceRef?: string;
  riskRating: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
}

export interface LeaderMoneyTrail {
  leaderId: string;
  leaderName: string;
  declaredNetWorthKsh: number;
  unexplainedWealthEstimateKsh: number;
  totalDonationsReceivedKsh: number;
  topDonors: CampaignDonation[];
  expenditures?: CandidateExpenditure[];
  eaccCharges?: EaccChargeDocket[];
  internationalConnections?: SuspiciousInternationalConnection[];
  influencesAndLobbying: LobbyingInfluenceEvent[];
  eaccInvestigationStatus: 'Active Probe' | 'Frozen Assets' | 'Case Pending in Court' | 'Cleared' | 'Under Audit' | 'Charged in Court';
  corruptionScoreRisk: number; // 0 (Clean) to 100 (Deep Corruption)
}

export interface CandidateExpenditure {
  id: string;
  category: 'Campaign Rallies & Choppers' | 'Voter Handouts & Inducement' | 'Offshore Shell Co / Real Estate' | 'Media Blitz & PR' | 'Legal Defense & Bails' | 'Foreign Proxy Transfers';
  itemDescription: string;
  amountKsh: number;
  recipientOrDestination: string;
  flaggedReason?: string;
}

export interface EaccChargeDocket {
  id: string;
  caseNumber: string;
  court: string;
  chargeTitle: string;
  amountInvolvedKsh: number;
  status: 'Plea Entered' | 'Trial Ongoing' | 'Assets Frozen by ARA' | 'Prosecution Order Issued' | 'Warrant Issued' | 'Under Audit';
  docketDetails: string;
  sourceRef?: string;
}

export interface SuspiciousInternationalConnection {
  id: string;
  entityName: string;
  countryOrRegion: string;
  connectionType: 'Offshore Shell Company' | 'Foreign Super PAC / Proxy' | 'Foreign Government / Embassy Tie' | 'Arms / Defense Syndicate' | 'Foreign Mining / Land Lease Lobby';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  amountOrAssetValueKsh?: number;
  description: string;
  evidenceRef?: string;
}

export type AuditFindingCategory = 
  | 'ifmis_voided' 
  | 'unconfirmed_grants' 
  | 'pending_bills' 
  | 'ghost_workers' 
  | 'domestic_travel' 
  | 'transport_fuel' 
  | 'training_workshops' 
  | 'legal_fees' 
  | 'land_acquisition' 
  | 'crf_cut_off' 
  | 'public_debt' 
  | 'procurement';

export interface AuditorGeneralFinding {
  id: string;
  category: AuditFindingCategory;
  categoryLabel: string;
  title: string;
  amountQuestionedKsh: number;
  entityOrCounty: string;
  financialYear: string;
  oagReportRef: string;
  summary: string;
  detailedAnomalies: string[];
  tiktokCreatorRef?: string;
  sourceUrl?: string;
  status: 'FLAGGED_BY_OAG' | 'UNDER_PARLIAMENTARY_PIC' | 'EACC_SUBMITTED' | 'UNRESOLVED';
  relatedLeaders?: string[];
}

export interface PublicDebtMetrics {
  totalDebtKsh: number;
  debtPerCitizenKsh: number;
  debtPerHouseholdKsh: number;
  debtToGdpRatioPercent: number;
  debtAddedPerSecondKsh: number;
  domesticDebtKsh: number;
  externalDebtKsh: number;
  annualDebtServicingKsh: number;
  sources: Array<{ name: string; url: string; description: string }>;
}

export interface CivicAuditCreator {
  handle: string;
  name: string;
  platform: 'TikTok' | 'X / Twitter' | 'YouTube';
  followers: string;
  likes: string;
  focusAreas: string[];
  featuredAudits: string[];
  sharedWebsites: Array<{ name: string; url: string; description: string; category: string }>;
  verifiedBadge: boolean;
  avatarUrl?: string;
  profileDescription: string;
}

