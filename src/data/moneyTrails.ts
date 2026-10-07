import { LeaderMoneyTrail } from '../types';

export const INITIAL_MONEY_TRAILS: LeaderMoneyTrail[] = [
  {
    leaderId: "exec-1",
    leaderName: "Dr. William Samoei Ruto",
    declaredNetWorthKsh: 5500000000, // ~5.5 Billion KSh
    unexplainedWealthEstimateKsh: 12800000000, // ~12.8 Billion KSh
    totalDonationsReceivedKsh: 950000000,
    corruptionScoreRisk: 82,
    eaccInvestigationStatus: "Active Probe",
    topDonors: [
      {
        id: "don-exec-1",
        donorName: "Apex Infrastructure & Energy Holdings",
        donorCategory: "Government Tenderpreneur",
        amountKsh: 280000000,
        date: "2024-02-15",
        purpose: "Super PAC Campaign Mobilization Fund",
        isFlaggedConflict: true,
        conflictReason: "Awarded KSh 18.5B geothermal & transmission line tender without open competitive bidding."
      },
      {
        id: "don-exec-2",
        donorName: "Gulf Energy & Commodity Syndicate",
        donorCategory: "Foreign Interest / Proxy",
        amountKsh: 350000000,
        date: "2024-05-10",
        purpose: "G2G Oil Import Policy Advisory Grant",
        isFlaggedConflict: true,
        conflictReason: "Intermediary company for Government-to-Government oil deal receiving tax concessions."
      },
      {
        id: "don-exec-3",
        donorName: "Kenya Commercial Developers Association",
        donorCategory: "Private Equity / Real Estate",
        amountKsh: 120000000,
        date: "2024-08-20",
        purpose: "Housing Levy Partnership Sponsorship",
        isFlaggedConflict: true,
        conflictReason: "Lobbied for mandatory housing levy allocations to select private construction contractors."
      }
    ],
    expenditures: [
      {
        id: "exp-101",
        category: "Campaign Rallies & Choppers",
        itemDescription: "Lease of 6 Eurocopter helicopters & countrywide campaign sound systems",
        amountKsh: 180000000,
        recipientOrDestination: "Tropic Air Kenya & Helicopter Charter Ltd",
        flaggedReason: "Unexplained source of campaign funds exceeding statutory limits."
      },
      {
        id: "exp-102",
        category: "Offshore Shell Co / Real Estate",
        itemDescription: "Purchase of 5 luxury beachfront villas & prime land parcel in Kilifi",
        amountKsh: 650000000,
        recipientOrDestination: "Dubai DMCC Offshore Proxy Holdings",
        flaggedReason: "Registered under Seychellois nominee company to conceal beneficial owner."
      },
      {
        id: "exp-103",
        category: "Media Blitz & PR",
        itemDescription: "International lobbying firm contract for US/EU diplomatic image rebuilding",
        amountKsh: 140000000,
        recipientOrDestination: "Beltway Global Strategic Communications DC",
        flaggedReason: "Foreign lobbying expenditure omitted from public campaign expenditure filings."
      }
    ],
    eaccCharges: [
      {
        id: "eacc-101",
        caseNumber: "EACC/CR/114/2021",
        court: "Milimani Anti-Corruption Division",
        chargeTitle: "Irregular Public Land Acquisition (Weston Hotel Airspace Flight Path)",
        amountInvolvedKsh: 1200000000,
        status: "Trial Ongoing",
        docketDetails: "Alleged illegal allocation of Kenya Civil Aviation Authority (KCAA) land along Lang'ata Road.",
        sourceRef: "EACC Petition No. 2021/KCAA"
      },
      {
        id: "eacc-102",
        caseNumber: "EACC/AUD/2024/099",
        court: "Ethics & Anti-Corruption Commission",
        chargeTitle: "National Fertilizer Subsidy Procurement Audit Query",
        amountInvolvedKsh: 2100000000,
        status: "Under Audit",
        docketDetails: "Civic audit on fake/substandard fertilizer procurement distributed through NCPB depots.",
        sourceRef: "Parliamentary Agriculture Committee Audit"
      }
    ],
    internationalConnections: [
      {
        id: "intl-101",
        entityName: "Dubai Gold & Energy Logistics DMCC",
        countryOrRegion: "United Arab Emirates (Dubai)",
        connectionType: "Offshore Shell Company",
        riskLevel: "CRITICAL",
        amountOrAssetValueKsh: 4200000000,
        description: "Special Purpose Vehicle (SPV) used to hold off-shore assets and receive commission wire transfers.",
        evidenceRef: "Pandora Papers & EACC Foreign Intelligence Unit"
      },
      {
        id: "intl-102",
        entityName: "Euro-African Fertilizer & Commodity Trading AG",
        countryOrRegion: "Switzerland (Zug)",
        connectionType: "Foreign Mining / Land Lease Lobby",
        riskLevel: "HIGH",
        amountOrAssetValueKsh: 1800000000,
        description: "Commodities trader supplying subsidized inputs under tax-exempt status.",
        evidenceRef: "Audit General Report 2024"
      }
    ],
    influencesAndLobbying: [
      {
        id: "inf-exec-1",
        billIdOrClause: "FB-2024-EXEC",
        billTitle: "Finance Bill 2024 - Eco Levy, Housing Tax & Fuel Excise Restructuring",
        sponsorOrGroup: "National Treasury & Executive Cabinet",
        amountEstimatedKsh: 340000000000,
        outcome: "Bill Amendment Passed",
        summary: "Executive-driven tax revenue bill causing nationwide civil rights protests.",
        riskRating: "CRITICAL",
        evidenceRef: "Kenya Gazette Notice & National Assembly Records"
      }
    ]
  },
  {
    leaderId: "cand-1",
    leaderName: "Kimani Ichung'wah",
    declaredNetWorthKsh: 450000000,
    unexplainedWealthEstimateKsh: 850000000,
    totalDonationsReceivedKsh: 145000000,
    corruptionScoreRisk: 78,
    eaccInvestigationStatus: "Active Probe",
    topDonors: [
      {
        id: "don-1",
        donorName: "Mount Kenya Infrastructure Consortium",
        donorCategory: "Government Tenderpreneur",
        amountKsh: 45000000,
        date: "2024-05-12",
        purpose: "Campaign Logistics & Constituency Office Sponsorship",
        isFlaggedConflict: true,
        conflictReason: "Awarded KSh 3.2B national road maintenance tender 2 months after donation."
      },
      {
        id: "don-2",
        donorName: "Agri-Import Global Kenya Ltd",
        donorCategory: "Corporate / Mega-Corp",
        amountKsh: 30000000,
        date: "2024-06-01",
        purpose: "Super PAC Policy Research Grant",
        isFlaggedConflict: true,
        conflictReason: "Lobbied for Zero-Rated import duty clause amendment in Finance Bill 2024."
      },
      {
        id: "don-3",
        donorName: "Nairobi Commercial Property Holdings",
        donorCategory: "Private Equity / Real Estate",
        amountKsh: 25000000,
        date: "2024-11-20",
        purpose: "Party Event Fundraising",
        isFlaggedConflict: false
      }
    ],
    expenditures: [
      {
        id: "exp-201",
        category: "Voter Handouts & Inducement",
        itemDescription: "Constituency grassroots food basket distributions & cash envelope logistics",
        amountKsh: 38000000,
        recipientOrDestination: "Kikuyu Mobilizers Network",
        flaggedReason: "Undisclosed voter influence cash handouts ahead of parliamentary votes."
      },
      {
        id: "exp-202",
        category: "Offshore Shell Co / Real Estate",
        itemDescription: "Commercial apartment complex acquisition in Kilimani",
        amountKsh: 190000000,
        recipientOrDestination: "Apex Heights Ltd (Proxy Entity)",
        flaggedReason: "Unexplained wealth accumulation relative to parliamentary salary."
      }
    ],
    eaccCharges: [
      {
        id: "eacc-201",
        caseNumber: "EACC/CR/88/2024",
        court: "Ethics & Anti-Corruption Commission",
        chargeTitle: "Conflict of Interest & Procurement Oversight Abuse",
        amountInvolvedKsh: 450000000,
        status: "Under Audit",
        docketDetails: "Alleged insider tender awards to affiliated road contractors in Kikuyu constituency.",
        sourceRef: "EACC Public Integrity Docket #2024/88"
      }
    ],
    internationalConnections: [
      {
        id: "intl-201",
        entityName: "Aegis Maritime & Trade Ltd (Cyprus)",
        countryOrRegion: "Cyprus (Limassol)",
        connectionType: "Offshore Shell Company",
        riskLevel: "HIGH",
        amountOrAssetValueKsh: 320000000,
        description: "Offshore holding firm linked to edible oil import tax exemption lobbying.",
        evidenceRef: "Financial Intelligence Centre (FIC) Suspicious Transaction Report"
      }
    ],
    influencesAndLobbying: [
      {
        id: "inf-1",
        billIdOrClause: "FB-2024-CL14",
        billTitle: "Finance Bill 2024 - Cooking Oil & Fertilizer Excise Duty Exemption",
        sponsorOrGroup: "Edible Oils Manufacturers Syndicate",
        amountEstimatedKsh: 65000000,
        outcome: "Bill Amendment Passed",
        summary: "Pushed floor amendment exempting select edible oil importers from proposed 25% tax increase after private hotel meetings.",
        riskRating: "CRITICAL",
        evidenceRef: "Hansard debate records & EACC petition doc #2024/88"
      },
      {
        id: "inf-2",
        billIdOrClause: "FB-2025-CL08",
        billTitle: "Finance Bill 2025 - Eco-Levy Special Exemptions",
        sponsorOrGroup: "Plastics & Packaging Association",
        amountEstimatedKsh: 35000000,
        outcome: "Vote Flipped to YES",
        summary: "Whipped majority coalition MPs to vote YES on retaining eco-levy exemptions for large industrial plastic bottlers.",
        riskRating: "HIGH"
      }
    ]
  },
  {
    leaderId: "gov-tl-1",
    leaderName: "Jackson Mandago",
    declaredNetWorthKsh: 920000000,
    unexplainedWealthEstimateKsh: 1100000000,
    totalDonationsReceivedKsh: 85000000,
    corruptionScoreRisk: 91,
    eaccInvestigationStatus: "Charged in Court",
    topDonors: [
      {
        id: "don-man-1",
        donorName: "Finland Educational Agency Proxies",
        donorCategory: "Government Tenderpreneur",
        amountKsh: 45000000,
        date: "2023-08-10",
        purpose: "Overseas Education Trust Operating Expenses",
        isFlaggedConflict: true,
        conflictReason: "Directly linked to KSh 1.1 Billion student scholarship fraud."
      }
    ],
    expenditures: [
      {
        id: "exp-man-1",
        category: "Legal Defense & Bails",
        itemDescription: "Senior Counsel legal representation & cash bail fees in Nakuru Court",
        amountKsh: 25000000,
        recipientOrDestination: "Nakuru Anti-Corruption Court Registrar",
        flaggedReason: "High legal fees funded from queried municipal trust accounts."
      }
    ],
    eaccCharges: [
      {
        id: "eacc-man-1",
        caseNumber: "ACC/NK/04/2023",
        court: "Nakuru Anti-Corruption Magistrate Court",
        chargeTitle: "Conspiracy to Commit Corruption & Misappropriation of Public Funds",
        amountInvolvedKsh: 1100000000,
        status: "Trial Ongoing",
        docketDetails: "Charged alongside 3 county officials over diversion of Uasin Gishu Overseas Education Trust funds meant for university students in Finland and Canada.",
        sourceRef: "ODPP Charge Sheet File #NK-ACC-2023"
      }
    ],
    internationalConnections: [
      {
        id: "intl-man-1",
        entityName: "Nordic Education Intermediary Oy",
        countryOrRegion: "Finland (Tampere)",
        connectionType: "Foreign Super PAC / Proxy",
        riskLevel: "CRITICAL",
        amountOrAssetValueKsh: 850000000,
        description: "Foreign intermediary company receiving wire transfers from Uasin Gishu parents without university admissions.",
        evidenceRef: "ODPP Extradition & International Mutual Legal Assistance Request"
      }
    ],
    influencesAndLobbying: []
  },
  {
    leaderId: "cand-7",
    leaderName: "Johnson Sakaja",
    declaredNetWorthKsh: 780000000,
    unexplainedWealthEstimateKsh: 620000000,
    totalDonationsReceivedKsh: 180000000,
    corruptionScoreRisk: 74,
    eaccInvestigationStatus: "Active Probe",
    topDonors: [
      {
        id: "don-sak-1",
        donorName: "Nairobi Expressway Billboard Advertising Ltd",
        donorCategory: "Corporate / Mega-Corp",
        amountKsh: 50000000,
        date: "2024-03-20",
        purpose: "City Beautification & Marathon Sponsorship",
        isFlaggedConflict: true,
        conflictReason: "Granted exclusive outdoor advertising waivers along Uhuru Highway."
      },
      {
        id: "don-sak-2",
        donorName: "School Feeding Programme Caterers Consortium",
        donorCategory: "Government Tenderpreneur",
        amountKsh: 65000000,
        date: "2024-07-11",
        purpose: "Dishi na County Logistics Fund",
        isFlaggedConflict: true,
        conflictReason: "Awarded KSh 1.4B Dishi na County catering contract with single-source audit queries."
      }
    ],
    expenditures: [
      {
        id: "exp-sak-1",
        category: "Media Blitz & PR",
        itemDescription: "City billboard campaigns, PR documentaries & influencer network payments",
        amountKsh: 42000000,
        recipientOrDestination: "Nairobi Digital Media Group",
        flaggedReason: "City PR budget blended with personal political rebranding."
      }
    ],
    eaccCharges: [
      {
        id: "eacc-sak-1",
        caseNumber: "EACC/CR/204/2024",
        court: "Ethics & Anti-Corruption Commission",
        chargeTitle: "County Pending Bills Irregularity & Degree Certificate Validity Audit",
        amountInvolvedKsh: 3200000000,
        status: "Under Audit",
        docketDetails: "Auditing preferential payment of selected county contractors while withholding small business supplier payments.",
        sourceRef: "Senate County Public Accounts Committee Audit"
      }
    ],
    internationalConnections: [
      {
        id: "intl-sak-1",
        entityName: "Teams University Academic Trust",
        countryOrRegion: "Uganda (Kampala)",
        connectionType: "Foreign Government / Embassy Tie",
        riskLevel: "HIGH",
        amountOrAssetValueKsh: 0,
        description: "Controversial degree certificate verification record subject to CUE litigation.",
        evidenceRef: "High Court Judgment & CUE Records"
      }
    ],
    influencesAndLobbying: []
  },
  {
    leaderId: "cand-2",
    leaderName: "Ndindi Nyoro",
    declaredNetWorthKsh: 680000000,
    unexplainedWealthEstimateKsh: 320000000,
    totalDonationsReceivedKsh: 195000000,
    corruptionScoreRisk: 42,
    eaccInvestigationStatus: "Under Audit",
    topDonors: [
      {
        id: "don-4",
        donorName: "Central Engineering & Supply Co.",
        donorCategory: "Government Tenderpreneur",
        amountKsh: 55000000,
        date: "2024-04-10",
        purpose: "School Renovation Matching Fund",
        isFlaggedConflict: true,
        conflictReason: "Received KSh 1.1B Murang'a TVET construction contract."
      },
      {
        id: "don-5",
        donorName: "Kiharu Grassroots Business Alliance",
        donorCategory: "Grassroots / Citizen Micro-donations",
        amountKsh: 18000000,
        date: "2024-08-15",
        purpose: "Constituency Bursary Drive",
        isFlaggedConflict: false
      }
    ],
    expenditures: [
      {
        id: "exp-nyoro-1",
        category: "Campaign Rallies & Choppers",
        itemDescription: "Kiharu TVET bursary distribution rallies & sound system charters",
        amountKsh: 28000000,
        recipientOrDestination: "Highland Events & Sound Systems Ltd",
        flaggedReason: "High-frequency constituency rallies preceding budget committee hearings."
      }
    ],
    eaccCharges: [],
    internationalConnections: [],
    influencesAndLobbying: [
      {
        id: "inf-3",
        billIdOrClause: "BUD-2024-REC",
        billTitle: "National Budget Allocation 2024/25 - Roads Re-Allocation",
        sponsorOrGroup: "Highways Contractors Lobby",
        amountEstimatedKsh: 40000000,
        outcome: "Bill Amendment Passed",
        summary: "Re-routed KSh 4.5B from county health conditional grants to national trunk road construction.",
        riskRating: "MODERATE"
      }
    ]
  },
  {
    leaderId: "cand-3",
    leaderName: "Babu Owino (Paul Ongili)",
    declaredNetWorthKsh: 180000000,
    unexplainedWealthEstimateKsh: 95000000,
    totalDonationsReceivedKsh: 42000000,
    corruptionScoreRisk: 28,
    eaccInvestigationStatus: "Cleared",
    topDonors: [
      {
        id: "don-6",
        donorName: "Embakasi Small Scale Traders Association",
        donorCategory: "Grassroots / Citizen Micro-donations",
        amountKsh: 12000000,
        date: "2024-03-01",
        purpose: "Legal Defence & Youth Empowerment",
        isFlaggedConflict: false
      },
      {
        id: "don-7",
        donorName: "Youth Educational Alliance PAC",
        donorCategory: "Super PAC / Interest Group",
        amountKsh: 15000000,
        date: "2024-09-10",
        purpose: "Masterclass & Exam Revision Software",
        isFlaggedConflict: false
      }
    ],
    expenditures: [
      {
        id: "exp-babu-1",
        category: "Media Blitz & PR",
        itemDescription: "Free online mathematics masterclasses for high school candidates & venue hire",
        amountKsh: 8500000,
        recipientOrDestination: "Babu Owino Education Foundation",
        flaggedReason: "Clean social welfare expenditure."
      }
    ],
    eaccCharges: [],
    internationalConnections: [],
    influencesAndLobbying: [
      {
        id: "inf-4",
        billIdOrClause: "FB-2024-NO",
        billTitle: "Finance Bill 2024 - Complete Rejection Campaign",
        sponsorOrGroup: "Gen-Z Civic Coalition & Public Interest",
        amountEstimatedKsh: 0,
        outcome: "Clause Stripped",
        summary: "Led public opposition that forced withdrawal of bread tax and motor vehicle tax provisions.",
        riskRating: "LOW"
      }
    ]
  },
  {
    leaderId: "cand-4",
    leaderName: "Dr. Otiende Amollo",
    declaredNetWorthKsh: 220000000,
    unexplainedWealthEstimateKsh: 0,
    totalDonationsReceivedKsh: 28000000,
    corruptionScoreRisk: 5,
    eaccInvestigationStatus: "Cleared",
    topDonors: [
      {
        id: "don-8",
        donorName: "Siaya Pro-Bono Legal & Human Rights Fund",
        donorCategory: "Grassroots / Citizen Micro-donations",
        amountKsh: 14000000,
        date: "2024-01-15",
        purpose: "Onyek Wonjo Widow Housing Project",
        isFlaggedConflict: false
      }
    ],
    expenditures: [
      {
        id: "exp-oti-1",
        category: "Campaign Rallies & Choppers",
        itemDescription: "Building decent housing for vulnerable widows in Rarieda constituency",
        amountKsh: 18000000,
        recipientOrDestination: "Rarieda Widow Housing Initiative",
        flaggedReason: "Audited grassroots community development."
      }
    ],
    eaccCharges: [],
    internationalConnections: [],
    influencesAndLobbying: [
      {
        id: "inf-5",
        billIdOrClause: "LEG-2024-ART73",
        billTitle: "Leadership & Integrity Act Strict Compliance Motion",
        sponsorOrGroup: "Transparency International Kenya",
        amountEstimatedKsh: 0,
        outcome: "Under Investigation",
        summary: "Sponsored motion requiring all state officers to publish verified wealth declarations publicly.",
        riskRating: "LOW"
      }
    ]
  }
];
