import { Candidate, CitizenEvidenceReport } from '../types';

export interface ReputationSummary {
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  status: string;
  badgeBg: string;
  textColor: string;
  goodCount: number;
  badCount: number;
  totalImpactPoints: number;
}

export function calculateReputation(candidate: Candidate, reports: CitizenEvidenceReport[]): ReputationSummary {
  // Find all evidence reports linked to this candidate
  const cReports = reports.filter(r => 
    r.leaderName.toLowerCase().trim() === candidate.name.toLowerCase().trim()
  );

  let baseScore = 70; // default benchmark neutral score

  // Category & Tag modifiers
  if (candidate.isGoodLeaderChampion) baseScore += 15;
  if (candidate.tagColor === 'green') baseScore += 10;
  if (candidate.tagColor === 'red') baseScore -= 20;

  // Finance bill votes
  if (candidate.votes.financeBill2024 === 'YES') baseScore -= 12;
  if (candidate.votes.financeBill2024 === 'NO') baseScore += 8;
  if (candidate.votes.financeBill2025 === 'YES') baseScore -= 12;
  if (candidate.votes.financeBill2025 === 'NO') baseScore += 8;

  // Legal status deductions
  if (candidate.corruptionStatus && candidate.corruptionStatus !== 'clean') baseScore -= 25;
  if (candidate.sexualViolenceStatus && candidate.sexualViolenceStatus !== 'clean') baseScore -= 35;
  if (candidate.robberyCrimeStatus && candidate.robberyCrimeStatus !== 'clean') baseScore -= 30;

  // Calculate user-submitted evidence score impact
  let goodCount = 0;
  let badCount = 0;
  let totalImpactPoints = 0;

  cReports.forEach(r => {
    const isGood = r.impactType === 'good' || r.category === 'development';
    const isBad = r.impactType === 'bad' || ['corruption', 'sexual_violence', 'robbery_crime', 'integrity_violation'].includes(r.category);

    if (isGood) {
      goodCount++;
      const pts = r.impactPoints || 8;
      totalImpactPoints += pts;
    } else if (isBad) {
      badCount++;
      const pts = r.impactPoints || -10;
      totalImpactPoints += pts;
    }
  });

  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore + totalImpactPoints)));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  let status = 'MODERATE ACCOUNTABILITY';
  let badgeBg = 'bg-amber-600 text-white';
  let textColor = 'text-amber-600 dark:text-amber-400';

  if (finalScore >= 90) {
    grade = 'A+';
    status = 'HIGH INTEGRITY CHAMPION';
    badgeBg = 'bg-emerald-600 text-white';
    textColor = 'text-emerald-600 dark:text-emerald-400';
  } else if (finalScore >= 75) {
    grade = 'A';
    status = 'GOOD LEADER STANDING';
    badgeBg = 'bg-green-600 text-white';
    textColor = 'text-green-600 dark:text-green-400';
  } else if (finalScore >= 60) {
    grade = 'B';
    status = 'SATISFACTORY RECORD';
    badgeBg = 'bg-blue-600 text-white';
    textColor = 'text-blue-600 dark:text-blue-400';
  } else if (finalScore >= 45) {
    grade = 'C';
    status = 'MODERATE CONCERNS';
    badgeBg = 'bg-amber-600 text-white';
    textColor = 'text-amber-600 dark:text-amber-400';
  } else if (finalScore >= 30) {
    grade = 'D';
    status = 'HIGH RISK POLITICIAN';
    badgeBg = 'bg-orange-600 text-white';
    textColor = 'text-orange-600 dark:text-orange-400';
  } else {
    grade = 'F';
    status = 'CRITICAL CORRUPTION / CRIME RISK';
    badgeBg = 'bg-red-600 text-white';
    textColor = 'text-red-600 dark:text-red-400';
  }

  return {
    score: finalScore,
    grade,
    status,
    badgeBg,
    textColor,
    goodCount,
    badCount,
    totalImpactPoints
  };
}
