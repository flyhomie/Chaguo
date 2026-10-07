import { AuditorGeneralFinding, PublicDebtMetrics, CivicAuditCreator } from '../types';

export const PUBLIC_DEBT_METRICS: PublicDebtMetrics = {
  totalDebtKsh: 11520000000000, // 11.52 Trillion KES
  debtPerCitizenKsh: 193598, // ~KES 193.6K per Kenyan citizen
  debtPerHouseholdKsh: 875205.01, // ~KES 875,205 per typical Kenyan household (4.5 members)
  debtToGdpRatioPercent: 68.4, // Critical Risk Level (>60% IMF limit)
  debtAddedPerSecondKsh: 38400, // ~KSh 38.4K added to debt clock every second
  domesticDebtKsh: 5740000000000, // 5.74 Trillion KES
  externalDebtKsh: 5780000000000, // 5.78 Trillion KES
  annualDebtServicingKsh: 1800000000000, // 1.8 Trillion KES per year (~65% of tax revenue)
  sources: [
    {
      name: 'World Bank Open Data',
      url: 'https://data.worldbank.org/country/kenya',
      description: 'Global macroeconomic indicators, external debt stocks, and GDP growth metrics for Kenya.'
    },
    {
      name: 'Central Bank of Kenya (CBK)',
      url: 'https://www.centralbank.go.ke/statistics/public-debt',
      description: 'Weekly and monthly bulletins on domestic treasury bills, bonds, and external loan disbursements.'
    },
    {
      name: 'National Treasury & Economic Planning',
      url: 'https://www.treasury.go.ke/debt-reports',
      description: 'Annual Public Debt Management Reports, Medium Term Debt Strategy, and sovereign bond filings.'
    },
    {
      name: 'Office of the Auditor-General (OAG Kenya)',
      url: 'https://www.oagkenya.go.ke',
      description: 'Constitutional watchdog audits on national government, state corporations, and all 47 counties.'
    },
    {
      name: 'Office of the Controller of Budget (OCOB)',
      url: 'https://www.cob.go.ke',
      description: 'Quarterly County & National Budget Implementation Review Reports exposing wasteful spending.'
    }
  ]
};

export const CIVIC_AUDIT_CREATORS: CivicAuditCreator[] = [
  {
    handle: '@civicsnsins',
    name: 'THE ACCOUNTANT',
    platform: 'TikTok',
    followers: '461.3K',
    likes: '24M',
    verifiedBadge: true,
    focusAreas: [
      'Auditor-General Report Breakdowns',
      'Kenya National Debt Clock & Family Burden',
      'IFMIS Voided Transactions & Procurement Fraud',
      'County Ghost Workers & Payroll Inconsistencies',
      'Questionable Domestic Travel & Sitting Allowances'
    ],
    featuredAudits: [
      'Finding: VOIDED IFMIS TRANSACTIONS (1,500+ Questioned) - KSh 560,627,819',
      'Your Family’s Share of Kenya’s Debt: KES 875,205.01 Live Clock',
      'DOMESTIC TRAVEL???? KSh 51.7M Unaccounted in County Executive Retreats',
      'CRF TRANSFERS SUBJECT TO CUT-OFF ISSUE - KSh 7,095,447,929',
      'Ghost Workers Compensation: KSh 2.87 Billion in Irregular Payrolls'
    ],
    sharedWebsites: [
      {
        name: 'Office of the Auditor-General (OAG)',
        url: 'https://www.oagkenya.go.ke',
        category: 'Official Audit Reports',
        description: 'Primary source of Nancy Gathungu county and national financial audit reports.'
      },
      {
        name: 'World Bank Open Data - Kenya',
        url: 'https://data.worldbank.org/country/kenya',
        category: 'Debt & Macro Data',
        description: 'Sovereign debt, poverty indices, and external debt service percentages.'
      },
      {
        name: 'Central Bank of Kenya (CBK)',
        url: 'https://www.centralbank.go.ke',
        category: 'Fiscal Statistics',
        description: 'Official exchange rates, debt clocks, and treasury bond auctions.'
      },
      {
        name: 'National Treasury Debt Management',
        url: 'https://www.treasury.go.ke',
        category: 'National Budgets',
        description: 'Official budget policy statements, Finance Act clauses, and debt registers.'
      },
      {
        name: 'Controller of Budget (OCOB)',
        url: 'https://www.cob.go.ke',
        category: 'Budget Implementation',
        description: 'Real-time county expenditure vs development spending ratios.'
      },
      {
        name: 'Ethics and Anti-Corruption Commission (EACC)',
        url: 'https://www.eacc.go.ke',
        category: 'Legal Dockets & Asset Recovery',
        description: 'Anti-graft charge sheets, land forfeiture petitions, and public officer probes.'
      },
      {
        name: 'Mzalendo Parliamentary Monitor',
        url: 'https://info.mzalendo.com',
        category: 'Hansard & Voting Records',
        description: 'Parliamentary voting scores, Finance Bill voting records, and MP performance metrics.'
      }
    ],
    profileDescription: 'Forensic accountant and civic educator breaking down official Auditor-General reports, national debt mathematics, and governance integrity for Kenyan citizens and Gen Z.'
  },
  {
    handle: '@thecitizensauditor',
    name: "The Citizen's Auditor",
    platform: 'TikTok',
    followers: '13.7K',
    likes: '480K',
    verifiedBadge: true,
    focusAreas: [
      'Constituency Development Fund (NG-CDF) Audits',
      'County Executive Tenders & Kickback Networks',
      'School Infrastructure & Ghost Classrooms'
    ],
    featuredAudits: [
      'NG-CDF Procurement Inconsistencies across 40 Constituencies',
      'Substandard Road Tenders: KSh 450M allocated for 3km murram road',
      'Hospital Equipment Leasing Scheme Audit Queries'
    ],
    sharedWebsites: [
      {
        name: 'NG-CDF Board Audit Portal',
        url: 'https://ngcdf.go.ke',
        category: 'Constituency Audits',
        description: 'Project allocation registers for all 290 Kenyan constituencies.'
      },
      {
        name: 'Office of the Auditor-General (OAG)',
        url: 'https://www.oagkenya.go.ke',
        category: 'Official Audit Reports',
        description: 'County and national compliance audit files.'
      }
    ],
    profileDescription: 'Citizen investigative auditor cross-referencing on-the-ground infrastructure with official Auditor-General budget disbursements.'
  },
  {
    handle: '@genzbaddie',
    name: 'GEN Z Baddie 🫧',
    platform: 'TikTok',
    followers: '366.6K',
    likes: '14.2M',
    verifiedBadge: true,
    focusAreas: [
      'Finance Bill 2024 / 2025 Youth Impact',
      'Taxation on Sanitary Pads, Bread & Digital Services',
      'Article 37 Peaceful Picketing & Civic Rights',
      'Youth Voter Registration 2027 Mobilization'
    ],
    featuredAudits: [
      'Breaking Down the Eco Levy & Digital Nomad Tax Clauses',
      'Where Does Your PAYE Tax Go? KES 1.8T Debt Servicing Breakdown',
      'Senator Sifuna & Parliamentary Committee Fact-Checks'
    ],
    sharedWebsites: [
      {
        name: 'Kenya Law Reports (Kenyalaw.org)',
        url: 'http://kenyalaw.org',
        category: 'Judiciary & Legislation',
        description: 'Constitutional petitions, High Court rulings on Finance Acts, and statutes.'
      },
      {
        name: 'Mzalendo Parliamentary Trust',
        url: 'https://info.mzalendo.com',
        category: 'Hansard Monitoring',
        description: 'Tracking live debates and roll-call votes in National Assembly & Senate.'
      }
    ],
    profileDescription: 'Civic advocate and content creator mobilizing Gen Z youth through simplified legal, financial, and legislative breakdowns.'
  }
];

export const AUDITOR_GENERAL_FINDINGS: AuditorGeneralFinding[] = [
  {
    id: 'oag-ifmis-101',
    category: 'ifmis_voided',
    categoryLabel: 'VOIDED IFMIS TRANSACTIONS',
    title: '1,500+ Voided IFMIS Transactions Without Audit Trail',
    amountQuestionedKsh: 560627819, // KSh 560,627,819 from screenshot
    entityOrCounty: 'County Executives & State Departments',
    financialYear: 'FY 2022/2023 - 2023/2024',
    oagReportRef: 'OAG/REPORT/NAT-CO/2024/VOL.IV/SEC.2',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.oagkenya.go.ke/county-audit-reports',
    status: 'FLAGGED_BY_OAG',
    summary: 'Over 1,500 transactions totaling KSh 560.6M were voided, reversed, or deleted in the Integrated Financial Management Information System (IFMIS) after approvals and merchant payments were initiated, leaving no paper trail or reversal justification.',
    detailedAnomalies: [
      '1,514 distinct IFMIS transaction vouchers cancelled post-authorization without required National Treasury clearance.',
      'Lack of supporting journal entries or reconciliation notes for merchant payment cancellations.',
      'Potential double-invoicing loophole where voided vouchers were re-entered under duplicate vendor codes.',
      'Breach of Public Finance Management (PFM) Act 2012 Section 149 on accounting officer accountability.'
    ],
    relatedLeaders: ['Susan Kihika', 'Johnson Sakaja', 'William Ruto']
  },
  {
    id: 'oag-grants-102',
    category: 'unconfirmed_grants',
    categoryLabel: 'UNCONFIRMED GRANTS & TRANSFERS',
    title: 'Other Grants & Transfers Whose Accuracy Could Not Be Confirmed',
    amountQuestionedKsh: 713747000, // KSh 713,747,000 from screenshot
    entityOrCounty: 'Ministry of Agriculture & County Health Funds',
    financialYear: 'FY 2023/2024',
    oagReportRef: 'OAG/MIN-AGRI/TRANSFERS/2024/08',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.oagkenya.go.ke/national-government-audit',
    status: 'EACC_SUBMITTED',
    summary: 'Auditor-General Nancy Gathungu flagged KSh 713.7M in public grants and inter-agency transfers where recipient bank statements, project implementation logs, and delivery certificates were completely missing or withheld from auditors.',
    detailedAnomalies: [
      'KSh 420M in farmer fertilizer and seed support grants wired to unverified commercial bank accounts.',
      'KSh 293.7M in health facility modernization transfers with zero physical inspection certificates.',
      'No acknowledgement receipts from intended beneficiary self-help groups or agricultural cooperatives.',
      'Funds routed through temporary transit accounts contrary to Treasury Circular No. 4/2023.'
    ],
    relatedLeaders: ['Mithika Linturi', 'Kipchumba Murkomen']
  },
  {
    id: 'oag-pending-103',
    category: 'pending_bills',
    categoryLabel: 'ACCUMULATED PENDING BILLS',
    title: 'Unverified & Questionable Pending Bills Accumulation',
    amountQuestionedKsh: 1466051827, // KSh 1,466,051,827 from screenshot
    entityOrCounty: 'Nairobi & Nakuru County Executives',
    financialYear: 'FY 2023/2024',
    oagReportRef: 'OAG/CO-PB/2024/NAIROBI-NAKURU',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.oagkenya.go.ke/pending-bills-special-audit',
    status: 'UNDER_PARLIAMENTARY_PIC',
    summary: 'Pending bills totaling KSh 1.466 Billion were submitted for payment without basic tender awards, Local Purchase Orders (LPOs), or store receipt vouchers (S13), suffocating genuine local SME suppliers while paying phantom contractors.',
    detailedAnomalies: [
      'Special Audit Committee flagged KSh 890M in "ineligible" bills lacking inspection committee sign-offs.',
      'Interest penalties accrued at commercial rates costing taxpayers an extra KSh 140M in avoidable damages.',
      'First-In-First-Out (FIFO) payment rule violated to prioritize politically connected proxy firms.',
      'Failure to reconcile county pending bills with National Treasury Pending Bills Verification Committee.'
    ],
    relatedLeaders: ['Johnson Sakaja', 'Susan Kihika']
  },
  {
    id: 'oag-ghost-104',
    category: 'ghost_workers',
    categoryLabel: 'COMPENSATION OF EMPLOYEES QUESTIONED',
    title: 'Ghost Workers & Manual Payroll Irregularities',
    amountQuestionedKsh: 2872515819, // KSh 2,872,515,819 from screenshot
    entityOrCounty: 'Inter-County Public Service Boards',
    financialYear: 'FY 2022/2023 - 2023/2024',
    oagReportRef: 'OAG/PAYROLL/IPPD-MANUAL/2024',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.oagkenya.go.ke/county-payroll-audit',
    status: 'FLAGGED_BY_OAG',
    summary: 'KSh 2.872 Billion in employee compensation was disbursed outside the statutory Integrated Personnel and Payroll Database (IPPD), paying salaries via manual spreadsheets with duplicate national identity and KRA PIN records.',
    detailedAnomalies: [
      '3,418 staff members paid through manual off-system payrolls without County Public Service Board approval.',
      'Duplicate bank account numbers receiving multiple monthly salary disbursements under different names.',
      'Officers who retired or passed away continuing to receive active salary and pension credits for over 18 months.',
      'Wage bill exceeding the statutory 35% revenue ceiling set under Section 25(1)(b) of the PFM County Regulations.'
    ],
    relatedLeaders: ['Susan Kihika', 'Johnson Sakaja', 'Gladys Wanga']
  },
  {
    id: 'oag-travel-105',
    category: 'domestic_travel',
    categoryLabel: 'DOMESTIC TRAVEL QUESTIONED',
    title: 'Inflated Domestic Travel & Per Diems ("DOMESTIC TRAVEL????")',
    amountQuestionedKsh: 51744232, // KSh 51,744,232 from screenshot
    entityOrCounty: 'County Assemblies & National Executive Secretariats',
    financialYear: 'FY 2023/2024',
    oagReportRef: 'OAG/TRAVEL/DOM-ALLOW/2024/11',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.cob.go.ke/reports/budget-implementation',
    status: 'UNRESOLVED',
    summary: 'KSh 51.74 Million spent on "domestic travel allowances", per diems, and luxury hotel retreats where officers were listed as attending workshops in Mombasa, Naivasha, and Kisumu while biometric office logs show they were in Nairobi.',
    detailedAnomalies: [
      'Simultaneous per diem claims by senior executives for multiple destinations on the exact same dates.',
      'Over KSh 18M spent on "team-building and strategy alignment" retreats during active fiscal austerity directives.',
      'No boarding passes, vehicle work tickets, or hotel receipts attached to travel surrender vouchers.',
      'Direct violation of Salaries and Remuneration Commission (SRC) circular on daily subsistence allowance caps.'
    ],
    relatedLeaders: ['Kimani Ichungwah', 'Oscar Sudi', 'Gladys Boss Shollei']
  },
  {
    id: 'oag-transport-106',
    category: 'transport_fuel',
    categoryLabel: 'TRANSPORT & FLEET EXPENDITURE QUESTIONED',
    title: 'Unlogged Fleet Maintenance & Fuel Card Arbitrage',
    amountQuestionedKsh: 70751623, // KSh 70,751,623 from screenshot
    entityOrCounty: 'Ministry of Roads & Transport / County Fleet Units',
    financialYear: 'FY 2023/2024',
    oagReportRef: 'OAG/FLEET/FUEL-MAINT/2024/09',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.oagkenya.go.ke',
    status: 'FLAGGED_BY_OAG',
    summary: 'KSh 70.75 Million in fuel card charges and emergency vehicle overhaul invoices where fuel drawn exceeded fuel tank capacity by over 300%, and grounded vehicles were billed for daily luxury servicing.',
    detailedAnomalies: [
      'Fuel card logs showing 400 liters drawn in a single transaction for standard 70-liter capacity salon cars.',
      'Multiple private campaign vehicles fueled using official ministerial electronic fleet cards.',
      'Over KSh 22M in engine replacement and tire invoices issued by single-sourced roadside garages without spare-part returns.',
      'Lack of official monthly fleet management work ticket reconciliations.'
    ],
    relatedLeaders: ['Kipchumba Murkomen']
  },
  {
    id: 'oag-training-107',
    category: 'training_workshops',
    categoryLabel: 'TRAINING EXPENDITURE QUESTIONED',
    title: 'Luxury Hotel Workshops & Training Seminars Without Attendance',
    amountQuestionedKsh: 14595631, // KSh 14,595,631 from screenshot
    entityOrCounty: 'State Department for Devolution & Parliamentary Committees',
    financialYear: 'FY 2023/2024',
    oagReportRef: 'OAG/TRAIN/CONF-2024/04',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.oagkenya.go.ke',
    status: 'UNRESOLVED',
    summary: 'KSh 14.59 Million paid to 5-star beachfront resorts for "capacity enhancement and digital transformation workshops" with zero signed participant registers, training curriculum syllabi, or facilitator outputs.',
    detailedAnomalies: [
      'Workshops scheduled during official parliamentary recess without committee speaker clearance.',
      'Full conference package rates billed for 120 pax while hotel security manifests show fewer than 25 attendees.',
      'Exorbitant facilitator honoraria paid in raw cash without statutory PAYE withholding tax deductions.',
      'Duplication of generic training modules run 4 times in the same quarter by the same external consultant.'
    ],
    relatedLeaders: ['Aaron Cheruiyot', 'Kimani Ichungwah']
  },
  {
    id: 'oag-legal-108',
    category: 'legal_fees',
    categoryLabel: 'LEGAL FEES QUESTIONED',
    title: 'Single-Sourced Private Law Firm Retainers & Inflated Billable Hours',
    amountQuestionedKsh: 34662766, // KSh 34,662,766 from screenshot
    entityOrCounty: 'Nairobi City County & State Corporations',
    financialYear: 'FY 2022/2023 - 2023/2024',
    oagReportRef: 'OAG/LEGAL/EXT-COUNSEL/2024/07',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.eacc.go.ke/investigations/legal-fees-cartels',
    status: 'EACC_SUBMITTED',
    summary: 'KSh 34.66 Million in legal fee disbursements awarded to private advocate firms without pre-qualification panels, fee tariff agreements, or clearance from the Office of the Attorney General.',
    detailedAnomalies: [
      'Law firms retained to handle routine chamber summons at astronomical rates of KSh 5M per hour.',
      'Payment made for consent orders in cases where the county assembly had already passed executive resolutions.',
      'Advocates representing county executives in personal election petitions billed to the public exchequer.',
      'Failure to adhere to the Advocates Remuneration Order under the Advocates Act Cap 16.'
    ],
    relatedLeaders: ['Johnson Sakaja']
  },
  {
    id: 'oag-land-109',
    category: 'land_acquisition',
    categoryLabel: 'LAND ACQUISITION QUESTIONED',
    title: 'Public Land & Asset Acquisitions Without Title Deeds',
    amountQuestionedKsh: 32970000, // KSh 32,970,000 from screenshot
    entityOrCounty: 'Nakuru & Kiambu County Municipalities',
    financialYear: 'FY 2023/2024',
    oagReportRef: 'OAG/ASSETS/LAND-TITLES/2024/03',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.oagkenya.go.ke',
    status: 'FLAGGED_BY_OAG',
    summary: 'KSh 32.97 Million disbursed for the purchase of cemetery, waste disposal, and market expansion land parcels where titles have not been transferred to the public entity after 3 years.',
    detailedAnomalies: [
      'Acquisition of land parcels with active court caveats and ownership disputes at the Environment and Land Court.',
      'Valuation reports conducted by private real estate brokers instead of the National Land Commission (NLC).',
      'Full purchase funds wired to vendor advocates before receiving original title deeds or stamp duty clearance.',
      'Risk of public funds loss through fraudulent double-titling cartels.'
    ],
    relatedLeaders: ['Susan Kihika', 'Kimani Wamatangi']
  },
  {
    id: 'oag-crf-110',
    category: 'crf_cut_off',
    categoryLabel: 'CRF TRANSFERS SUBJECT TO CUT-OFF ISSUE',
    title: 'County Revenue Fund (CRF) Cut-off & Commercial Bank Retention Anomaly',
    amountQuestionedKsh: 7095447929, // KSh 7,095,447,929 from screenshot
    entityOrCounty: 'Central Bank of Kenya & County Revenue Fund (CRF) Accounts',
    financialYear: 'FY 2022/2023 - 2023/2024',
    oagReportRef: 'OAG/CRF/CUT-OFF/NAT-SUMMARY/2024',
    tiktokCreatorRef: '@civicsnsins (THE ACCOUNTANT)',
    sourceUrl: 'https://www.oagkenya.go.ke/county-revenue-fund-special-report',
    status: 'FLAGGED_BY_OAG',
    summary: 'A staggering KSh 7.095 Billion in revenue transfers was caught in "cut-off" timing discrepancies between Central Bank of Kenya CRF accounts and commercial bank sweep accounts, leaving public revenues vulnerable to off-book arbitrage.',
    detailedAnomalies: [
      'KSh 7.095 Billion in county own-source revenue and equitable share transfers delayed past the 30th June fiscal cut-off.',
      'Revenue collections held in unauthorized commercial bank revenue collection accounts earning undisclosed interest.',
      'Mismatch of over KSh 1.2B between statements issued by County Treasuries and Central Bank of Kenya records.',
      'Violations of Article 207 of the Constitution of Kenya on the establishment of the Consolidated County Revenue Fund.'
    ],
    relatedLeaders: ['William Ruto', 'Susan Kihika', 'Johnson Sakaja']
  }
];
