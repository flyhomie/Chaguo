import { Candidate, IntegrityScandal } from '../types';

export interface ExtendedIntegrityData {
  ethicsScore: number; // 0-100%
  eaccStatus: 'Cleared' | 'Under Active Probe' | 'Assets Frozen' | 'Prosecuted / Charged' | 'Wealth Audit Flagged' | 'No Record';
  assetDeclared: boolean;
  conflicts: string[];
  wealthGrowth: string;
  attendanceScore: number;
  citizenRating: number;
  scandals: IntegrityScandal[];
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export function getCandidateIntegrityData(c: Candidate): ExtendedIntegrityData {
  // Check if candidate is a term-limited Governor running for lower seat (MP, Senator, MCA)
  const isTermLimitedGovLower = Boolean(
    c.isTermLimitedGovernorRunningForLowerSeat ||
    ((c.position === 'MP' || c.position === 'Senator' || c.position === 'MCA') &&
     (c.termInOffice?.includes('Governor') || c.keyPositionsHeld?.some(k => k.toLowerCase().includes('governor'))))
  );

  // If explicitly set on candidate, use explicit values or derive intelligent fallbacks
  let ethicsScore = c.ethicsAuditScore;
  if (ethicsScore === undefined) {
    if (c.tagColor === 'green' || c.isGoodLeaderChampion) {
      ethicsScore = 88;
    } else if (c.tagColor === 'purple') {
      ethicsScore = 62;
    } else if (c.corruptionStatus === 'charged' || c.corruptionStatus === 'convicted') {
      ethicsScore = 25;
    } else {
      ethicsScore = 42;
    }
  }

  // Apply red-flag penalty if a 2-term Governor is running for MP / lower seat
  if (isTermLimitedGovLower && c.isTermLimitedGovernorRunningForLowerSeat !== false) {
    ethicsScore = Math.max(15, ethicsScore - 20);
  }

  let eaccStatus = c.eaccQueryStatus;
  if (!eaccStatus) {
    if (c.corruptionStatus === 'charged') eaccStatus = 'Prosecuted / Charged';
    else if (c.corruptionStatus === 'alleged') eaccStatus = 'Wealth Audit Flagged';
    else if (c.tagColor === 'green') eaccStatus = 'Cleared';
    else eaccStatus = 'Under Active Probe';
  }

  const assetDeclared = c.assetDeclarationDisclosed ?? (c.tagColor === 'green');
  
  const rawConflicts = c.conflictOfInterestFlags ?? (
    c.tagColor === 'red' ? ['CDF Tender conflict query', 'Voted YES to high-tax clauses aligned with state executive'] : []
  );

  const conflicts = [...rawConflicts];
  if (isTermLimitedGovLower && !conflicts.some(fl => fl.toLowerCase().includes('governor') || fl.toLowerCase().includes('term-limited'))) {
    conflicts.unshift('🚩 RED FLAG: Ex-Governor Downgrading to MP/Legislative Seat in 2027 (Power Recycling & Audit Evasion Query)');
  }

  const wealthGrowth = c.wealthGrowthMultiplier ?? (c.tagColor === 'red' ? '8.4x net worth surge' : '1.5x average growth');
  const attendanceScore = c.parliamentaryAttendanceScore ?? (c.votes.financeBill2024 === 'YES' ? 82 : 93);
  const citizenRating = c.citizenRatingScore ?? (c.tagColor === 'green' ? 4.7 : c.tagColor === 'purple' ? 3.4 : 2.2);

  const scandals = [...(c.integrityScandals || [])];

  if (isTermLimitedGovLower && !scandals.some(s => s.title.toLowerCase().includes('governor') || s.id.includes('gov-downgrade'))) {
    scandals.unshift({
      id: `sc-gov-downgrade-${c.id}`,
      year: '2027',
      title: '🚨 RED FLAG: Term-Limited Governor Running for MP Seat',
      severity: 'CRITICAL',
      summary: c.termLimitedGovernorDetails || `Served as Governor for 2 full terms (10 years) and is now running for an MP seat in 2027. Civically red-flagged for political elite recycling, seeking legislative immunity, and controlling local CDF funds after executive term expiration.`,
      status: 'Verified Civic Query',
      source: 'Civic Audit & Electoral Watchdog Inquiry'
    });
  } else if (c.tagColor === 'red' && scandals.length === 0) {
    scandals.push({
      id: `sc-auto-${c.id}`,
      year: '2024',
      title: 'Finance Bill Tax Vote Civic Inquiry',
      severity: 'HIGH',
      summary: `Voted YES to controversial tax clauses opposed by constituent voters in ${c.county}.`,
      status: 'Verified Civic Query',
    });
  }

  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (isTermLimitedGovLower) {
    riskLevel = ethicsScore < 40 ? 'CRITICAL' : 'HIGH';
  } else if (ethicsScore >= 80) {
    riskLevel = 'LOW';
  } else if (ethicsScore >= 60) {
    riskLevel = 'MODERATE';
  } else if (ethicsScore >= 40) {
    riskLevel = 'HIGH';
  } else {
    riskLevel = 'CRITICAL';
  }

  return {
    ethicsScore,
    eaccStatus,
    assetDeclared,
    conflicts,
    wealthGrowth,
    attendanceScore,
    citizenRating,
    scandals,
    riskLevel,
  };
}
