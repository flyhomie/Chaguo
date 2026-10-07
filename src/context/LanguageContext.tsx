import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'sw';

export interface Translations {
  // Navigation & Tabs
  directory: string;
  goodLeaders: string;
  evidence: string;
  financeBills: string;
  compare: string;
  aiAssistant: string;
  education: string;
  myBallot: string;
  moneyTrail: string;

  // Common UI
  searchPlaceholder: string;
  signIn: string;
  signUp: string;
  signOut: string;
  guestMode: string;
  proceedAsGuest: string;
  account: string;

  // Hero & Page Headers
  knowTheLeadersTitle: string;
  knowTheLeadersSub: string;
  databaseTotal: string;
  leadersTracked: string;

  // Countdown & Banner
  electionCountdown: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  voterAccountabilityHeader: string;

  // Filters
  allCounties: string;
  allPositions: string;
  allIntegrityRecords: string;
  allFinanceBillVotes: string;
  resetFilters: string;
  gridView: string;
  listView: string;
  showingLeaders: string;

  // Tags
  allTags: string;
  tagRed: string;
  tagGreen: string;
  tagPurple: string;
  tagBlack: string;

  // Candidate Card & Badges
  viewBio: string;
  compareBtn: string;
  comparedBtn: string;
  saveBallot: string;
  savedBallot: string;
  trackAIPACMoney: string;
  corruptionBadge: string;
  sexualViolenceBadge: string;
  robberyBadge: string;
  redFlagExGovBadge: string;
  ethicsScoreLabel: string;
  citizenRatingLabel: string;
  wealthGrowthLabel: string;
  votedYesLabel: string;
  votedNoLabel: string;

  // Money Trail (TrackAIPAC) System
  moneyTrailTitle: string;
  moneyTrailSub: string;
  reportDonorBtn: string;
  trackedMoneyFlow: string;
  unexplainedWealth: string;
  flaggedConflicts: string;
  highRiskLeaders: string;
  searchDonorPlaceholder: string;
  allDonorCategories: string;
  allCorruptionRisk: string;
  highRiskOnly: string;
  cleanOnly: string;
  trackedPoliticiansList: string;
  topDonorsHeader: string;
  lobbyingEventsHeader: string;
  pacVsGrassrootsLabel: string;
  quidProQuoTitle: string;
  declaredNetWorth: string;
  eaccStatusLabel: string;

  // Action Buttons
  addCandidate: string;
  reportEvidence: string;
  installApp: string;
  languageLabel: string;
  
  // Hero / Tagline
  tagline: string;
  
  // Language Names
  englishName: string;
  swahiliName: string;
}

const translations: Record<Language, Translations> = {
  en: {
    directory: 'Leaders Directory',
    goodLeaders: 'Good Leaders',
    evidence: 'Citizen Evidence',
    financeBills: 'Finance Bills',
    compare: 'Compare',
    aiAssistant: 'AI Assistant',
    education: 'Civic Ed',
    myBallot: 'My 2027 Ballot',
    moneyTrail: 'Money Trail (TrackAIPAC)',

    searchPlaceholder: 'Search leader by name, constituency or county...',
    signIn: 'Sign In',
    signUp: 'Create Account',
    signOut: 'Sign Out',
    guestMode: 'Guest Mode',
    proceedAsGuest: 'Proceed as Guest',
    account: 'Account Profile',

    knowTheLeadersTitle: 'KNOW THE LEADERS YOU ELECT.',
    knowTheLeadersSub: 'The 2027 Kenyan Voter Accountability Portal. Track corruption dockets, defilement/rape cases, robbery records, MCA performance, and good leaders doing real development.',
    databaseTotal: 'Database Total',
    leadersTracked: 'MCAs & Leaders Tracked',

    allCounties: 'All Counties',
    allPositions: 'All Positions',
    allIntegrityRecords: 'All Integrity Records',
    allFinanceBillVotes: 'All Finance Bill Votes',
    resetFilters: 'Reset Filters',
    gridView: 'GRID',
    listView: 'LIST',
    showingLeaders: 'SHOWING LEADERS',

    allTags: 'All Tags',
    tagRed: 'Red Tag (Voted YES / Integrity Query)',
    tagGreen: 'Green Tag (Voted NO / High Integrity)',
    tagPurple: 'Purple Tag (Mixed / Switched Stance)',
    tagBlack: 'Black Tag (Severe Integrity Queries)',

    electionCountdown: 'Kenya 2027 General Election Countdown',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Mins',
    seconds: 'Secs',
    voterAccountabilityHeader: 'Kenya 2027 Voter Accountability Docket',

    viewBio: 'View Bio',
    compareBtn: 'Compare',
    comparedBtn: 'Compared',
    saveBallot: 'Save Ballot',
    savedBallot: 'Saved in Ballot',
    trackAIPACMoney: 'Track AIPAC Money',
    corruptionBadge: 'CORRUPTION',
    sexualViolenceBadge: 'SEXUAL OFFENCE / RAPE',
    robberyBadge: 'ROBBERY / VIOLENCE',
    redFlagExGovBadge: '🚩 RED FLAG: EX-GOV RUNNING FOR MP',
    ethicsScoreLabel: 'Ethics Score',
    citizenRatingLabel: 'Citizen Rating',
    wealthGrowthLabel: 'Wealth Surge',
    votedYesLabel: 'VOTED YES',
    votedNoLabel: 'VOTED NO',

    moneyTrailTitle: 'TrackAIPAC Campaign Finance & Lobbying Tracker',
    moneyTrailSub: 'Exposing who funds Kenyan politicians, PAC lobby money, tenderpreneur campaign donations, and direct voting amendments influenced by private cash.',
    reportDonorBtn: 'Report Donor & Corruption Link',
    trackedMoneyFlow: 'Tracked Money Flow',
    unexplainedWealth: 'Unexplained Wealth',
    flaggedConflicts: 'Flagged Conflicts',
    highRiskLeaders: 'High Risk Leaders',
    searchDonorPlaceholder: 'Search politician, donor company, tender, PAC, or bill clause...',
    allDonorCategories: 'All Donor Categories',
    allCorruptionRisk: 'All Corruption Risk',
    highRiskOnly: 'High Risk (50%+ Score)',
    cleanOnly: 'Clean / Low Risk (<50%)',
    trackedPoliticiansList: 'Tracked Politicians',
    topDonorsHeader: 'Top Campaign Donors & Tenderpreneur Connections',
    lobbyingEventsHeader: 'Lobbying & Policy Influence Events',
    pacVsGrassrootsLabel: 'PAC vs Grassroots Ratio',
    quidProQuoTitle: 'Policy Quid-Pro-Quo Matrix',
    declaredNetWorth: 'Declared Net Worth',
    eaccStatusLabel: 'EACC Status',

    addCandidate: 'Add Leader',
    reportEvidence: 'Report Evidence',
    installApp: 'Install App',
    languageLabel: 'Lugha / Language',

    tagline: 'The civic voter intelligence platform exposing Parliamentary votes, tenderpreneur money trails, and integrity reports across all Kenya 2027 leaders.',
    englishName: 'English',
    swahiliName: 'Kiswahili',
  },
  sw: {
    directory: 'Orodha ya Viongozi',
    goodLeaders: 'Viongozi Waadilifu',
    evidence: 'Ushahidi wa Mwananchi',
    financeBills: 'Mswada wa Fedha',
    compare: 'Linganisha Viongozi',
    aiAssistant: 'Msaidizi wa AI',
    education: 'Elimu ya Uraia',
    myBallot: 'Kura Yangu 2027',
    moneyTrail: 'Ufuatiliaji wa Pesa (TrackAIPAC)',

    searchPlaceholder: 'Tafuta kiongozi kwa jina, eneo bunge au kaunti...',
    signIn: 'Ingia Akaunti',
    signUp: 'Tengeneza Akaunti',
    signOut: 'Ondoka',
    guestMode: 'Hali ya Mgeni',
    proceedAsGuest: 'Endelea kama Mgeni',
    account: 'Wasifu wa Akaunti',

    knowTheLeadersTitle: 'WAPAMBUE VIONGOZI UNAOWACHAGUA.',
    knowTheLeadersSub: 'Dokezo la Uwajibikaji wa Mpiga Kura Kenya 2027. Fuatilia kesi za ufisadi, ubakaji, ujambazi, matokeo ya ma-MCA na viongozi wanaofanya maendeleo ya ukweli.',
    databaseTotal: 'Jumla ya Data',
    leadersTracked: 'Ma-MCA & Viongozi Wanaofuatiliwa',

    allCounties: 'Kaunti Zote',
    allPositions: 'Vyeo Vyote',
    allIntegrityRecords: 'Kumbukumbu Zote za Uadilifu',
    allFinanceBillVotes: 'Kura Zote za Mswada wa Fedha',
    resetFilters: 'Rejesha Vichujio',
    gridView: 'GRIDI',
    listView: 'ORODHA',
    showingLeaders: 'INAYOONYESHA VIONGOZI',

    allTags: 'Baji Zote',
    tagRed: 'Tag Nyekundu (Alipiga Ndiyo / Maswali ya Uadilifu)',
    tagGreen: 'Tag Kijani (Alipiga Hapana / Uadilifu Mkubwa)',
    tagPurple: 'Tag Zambarau (Kumbukumbu Mseto)',
    tagBlack: 'Tag Nyusi (Maswali Makuu ya Uadilifu)',

    electionCountdown: 'Hesabu ya Uchaguzi Mkuu wa Kenya 2027',
    days: 'Siku',
    hours: 'Saa',
    minutes: 'Dakika',
    seconds: 'Sekunde',
    voterAccountabilityHeader: 'Dokezo la Uwajibikaji wa Mpiga Kura Kenya 2027',

    viewBio: 'Tazama Wasifu',
    compareBtn: 'Linganisha',
    comparedBtn: 'Imelinganishwa',
    saveBallot: 'Hifadhi Kura',
    savedBallot: 'Imehifadhiwa Kuran',
    trackAIPACMoney: 'Fuatilia Pesa za AIPAC',
    corruptionBadge: 'KESI YA UFISADI',
    sexualViolenceBadge: 'UBAKAJI / MAOVU YA JINSIA',
    robberyBadge: 'UJAMBAZI / VITA',
    redFlagExGovBadge: '🚩 BANDERA NYEKUNDU: GAVANA WA ZAMANI WA MP',
    ethicsScoreLabel: 'Alama ya Uadilifu',
    citizenRatingLabel: 'Tathmini ya Mwananchi',
    wealthGrowthLabel: 'Ongezeko la Mali',
    votedYesLabel: 'ALIPIGA NDIYO',
    votedNoLabel: 'ALIPIGA HAPANA',

    moneyTrailTitle: 'Ufuatiliaji wa Pesa za Kampeni & Lobbying (TrackAIPAC)',
    moneyTrailSub: 'Kufichua wanaofadhili wanasiasa wa Kenya, pesa za makundi ya ushawishi (PACs), michango ya wafanyabiashara wa zabuni, na sheria zinazopitishwa kwa pesa za siri.',
    reportDonorBtn: 'Ripoti Mfadhili & Ufisadi',
    trackedMoneyFlow: 'Pesa Zinazofuatiliwa',
    unexplainedWealth: 'Mali Isiyoelezeka',
    flaggedConflicts: 'Migongano ya Maslahi',
    highRiskLeaders: 'Viongozi wa Hatari Kubwa',
    searchDonorPlaceholder: 'Tafuta mwanasiasa, kampuni ya mfadhili, zabuni, au kipengele cha mswada...',
    allDonorCategories: 'Aina Zote za Wafadhili',
    allCorruptionRisk: 'Hatari Zote za Ufisadi',
    highRiskOnly: 'Hatari Kubwa (Alama 50%+)',
    cleanOnly: 'Safi / Hatari Ndogo (<50%)',
    trackedPoliticiansList: 'Viongozi Wanaofuatiliwa',
    topDonorsHeader: 'Wafadhili Wakuu wa Kampeni & Ufusadi wa Zabuni',
    lobbyingEventsHeader: 'Matukio ya Ushawishi wa Sheria & Pesa',
    pacVsGrassrootsLabel: 'Kiwango cha PAC dhidi ya Wananchi',
    quidProQuoTitle: 'Jedwali la Ushawishi wa Sheria kwa Pesa',
    declaredNetWorth: 'Utajiri Uliotangazwa',
    eaccStatusLabel: 'Hali ya EACC',

    addCandidate: 'Ongeza Kiongozi',
    reportEvidence: 'Ripoti Ushahidi',
    installApp: 'Weka Programu',
    languageLabel: 'Lugha / Language',

    tagline: 'Jukwaa la uraia la kumpasha mpiga kura habari kuhusu kura za Bunge, ufuatiliaji wa pesa za zabuni, na ripoti za uadilifu za viongozi wote wa Kenya 2027.',
    englishName: 'Kiingereza',
    swahiliName: 'Kiswahili',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('chaguo_language_preference');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('chaguo_language_preference', lang);
    } catch (e) {}
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'sw' : 'en';
    setLanguage(nextLang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
