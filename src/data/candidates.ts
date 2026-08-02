import { Candidate } from '../types';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    name: "Kimani Ichung'wah",
    position: "MP",
    county: "Kiambu",
    constituency: "Kikuyu",
    party: "UDA (United Democratic Alliance)",
    isIndependent: false,
    tagColor: "red",
    tagReason: "Voted YES to Finance Bill 2024 & 2025. National Assembly Majority Leader with strong Ruto political alignment.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: false,
    ties: {
      uhuru: false,
      ruto: true,
      gachagua: true,
      details: "Leader of Majority in National Assembly, key champion for Executive revenue measures and Ruto administration bills."
    },
    votes: {
      financeBill2024: "YES",
      financeBill2025: "YES",
      notes2024: "Sponsored and rallied coalition MPs to pass the 2024 Finance Bill clauses.",
      notes2025: "Voted YES to 2025 taxation measures."
    },
    bio: "Current MP for Kikuyu and Leader of Majority in the National Assembly of Kenya.",
    termInOffice: "2013 - Present",
    keyPositionsHeld: ["Leader of Majority Party", "Member of Budget & Appropriations Committee"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-2",
    name: "Ndindi Nyoro",
    position: "MP",
    county: "Murang'a",
    constituency: "Kiharu",
    party: "UDA",
    isIndependent: false,
    tagColor: "red",
    tagReason: "Voted YES to Finance Bill 2024. Chairperson of Budget Committee closely tied to Ruto administration.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: true,
    goodLeaderHighlights: [
      "Subsidized high school education program in Kiharu (Kiharu Masomo Bora)",
      "Paved over 80km of rural access roads",
      "Constructed 45 modern ICT laboratories in local schools"
    ],
    developmentProjects: [
      {
        id: "proj-1",
        title: "Kiharu Masomo Bora School Tiling & Renovation",
        category: "Education",
        description: "Tiled floors and modernized classrooms for all public primary schools in Kiharu Constituency.",
        impact: "Benefited 32,000+ primary school pupils across Murang'a County.",
        year: "2023-2024"
      },
      {
        id: "proj-2",
        title: "Community Solar Water Boreholes",
        category: "Water & Sanitation",
        description: "Installed 12 high-capacity solar boreholes supplying clean piped water.",
        impact: "Access to clean water for 15,000 households.",
        year: "2024"
      }
    ],
    ties: {
      uhuru: false,
      ruto: true,
      gachagua: true,
      details: "Chair of Budget and Appropriations Committee key to driving Ruto Kenya Kwanza financial budget."
    },
    votes: {
      financeBill2024: "YES",
      financeBill2025: "YES",
      notes2024: "Defended revenue target figures in Parliament.",
      notes2025: "Voted YES."
    },
    bio: "MP for Kiharu and National Assembly Budget Committee Chair.",
    termInOffice: "2017 - Present",
    keyPositionsHeld: ["Chairperson Budget & Appropriations Committee"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-3",
    name: "Babu Owino (Paul Ongili)",
    position: "MP",
    county: "Nairobi",
    constituency: "Embakasi East",
    party: "ODM",
    isIndependent: false,
    tagColor: "green",
    tagReason: "Voted NO to Finance Bill 2024 & 2025. Vocal opponent of government taxation policy with clean corruption conviction record.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "alleged",
    robberyCrimeDetails: "Faced previous assault and public disturbance charges; acquitted in main firearm misfire case.",
    isGoodLeaderChampion: true,
    goodLeaderHighlights: [
      "Online university & high school revision masterclasses for underprivileged youth",
      "Full bursary distribution program covering 5,000+ Embakasi East students",
      "Built Jacaranda modern health center extension"
    ],
    developmentProjects: [
      {
        id: "proj-3",
        title: "Embakasi East Education Bursary Drive",
        category: "Education",
        description: "Equitable 100% bursary allocation for needy secondary and tertiary students.",
        impact: "Over 8,500 students supported annually.",
        year: "2022-2025"
      }
    ],
    ties: {
      uhuru: false,
      ruto: false,
      gachagua: false,
      details: "No executive coalition alignment. Consistently opposes Kenya Kwanza revenue proposals."
    },
    votes: {
      financeBill2024: "NO",
      financeBill2025: "NO",
      notes2024: "Voted NO on all second reading clauses for 2024 Finance Bill.",
      notes2025: "Voted NO to 2025 proposals."
    },
    bio: "MP for Embakasi East and youth advocate focused on education and economic accountability.",
    termInOffice: "2017 - Present",
    keyPositionsHeld: ["Member of Committee on Education"],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-4",
    name: "Dr. Otiende Amollo",
    position: "MP",
    county: "Siaya",
    constituency: "Rarieda",
    party: "ODM",
    isIndependent: false,
    tagColor: "green",
    tagReason: "Voted NO to Finance Bill 2024 & 2025. 100% Clean Integrity record, zero criminal/corruption cases, renowned community housing builder.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: true,
    goodLeaderHighlights: [
      "Onyek Wonjo Housing Project: Built over 900 decent homes for vulnerable widows and elderly citizens",
      "Zero corruption charges throughout Ombudsman and parliamentary tenure",
      "Voted NO to punitive taxes on basic goods and medical supplies"
    ],
    developmentProjects: [
      {
        id: "proj-4",
        title: "Onyek Wonjo Shelter & Decent Housing Initiative",
        category: "Infrastructure",
        description: "Constructed iron-sheet & brick homes for disadvantaged families across Rarieda.",
        impact: "Restored dignity to 950+ families in rural Siaya.",
        year: "2018-2025"
      },
      {
        id: "proj-5",
        title: "Rarieda Technical Training Institute Extension",
        category: "Education",
        description: "Expanded vocational workshops and TVET equipment for youth skill acquisition.",
        impact: "Trained 1,200 local youth in carpentry, welding, and IT.",
        year: "2023"
      }
    ],
    ties: {
      uhuru: false,
      ruto: false,
      gachagua: false,
      details: "Consistently voted against executive revenue taxation bills."
    },
    votes: {
      financeBill2024: "NO",
      financeBill2025: "NO",
      notes2024: "Voted NO and highlighted constitutional violations in eco-levy provisions.",
      notes2025: "Voted NO."
    },
    bio: "Senior Counsel and MP for Rarieda Constituency. Former Chairperson of the Commission on Administrative Justice (Ombudsman).",
    termInOffice: "2017 - Present",
    keyPositionsHeld: ["Member Justice and Legal Affairs Committee", "Former Ombudsman Chair"],
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-5",
    name: "Naisula Lesuuda",
    position: "MP",
    county: "Samburu",
    constituency: "Samburu West",
    party: "KANU",
    isIndependent: false,
    tagColor: "green",
    tagReason: "Voted NO to Finance Bill 2024 & 2025. Clean track record advocating for pastoralist peace, girl child education, zero corruption charges.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: true,
    goodLeaderHighlights: [
      "Peace Caravans reducing inter-community cattle rustling in Samburu",
      "Rescued over 400 girls from FGM and early child marriages into full secondary scholarships",
      "Clean financial audit record on NG-CDF disbursement"
    ],
    developmentProjects: [
      {
        id: "proj-6",
        title: "Samburu Girls Education & Empowerment Complex",
        category: "Education",
        description: "Constructed boarding dormitories and safe learning space for rescue girls.",
        impact: "Over 600 pastoralist girls enrolled in secondary education.",
        year: "2021-2024"
      }
    ],
    ties: {
      uhuru: false,
      ruto: false,
      gachagua: false,
      details: "Independent parliamentary voting record prioritizing pastoralist livelihoods."
    },
    votes: {
      financeBill2024: "NO",
      financeBill2025: "NO",
      notes2024: "Voted NO on second and third readings.",
      notes2025: "Voted NO."
    },
    bio: "MP for Samburu West, former journalist, and peace ambassador.",
    termInOffice: "2017 - Present",
    keyPositionsHeld: ["Chair Regional Integration Committee"],
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-6",
    name: "Grace Njeri Wanjiku",
    position: "MCA",
    county: "Nairobi",
    ward: "Roysambu Ward",
    party: "Independent",
    isIndependent: true,
    tagColor: "green",
    tagReason: "Independent MCA with 100% clean legal record. Championed ward drainage systems, youth vocational grants, and anti-corruption oversight.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: true,
    goodLeaderHighlights: [
      "Constructed Roysambu Ward Community Health Center Annex",
      "Installed 60+ street lights eliminating mugging hot-spots",
      "Transparent ward bursary vetting committee open to public audit"
    ],
    developmentProjects: [
      {
        id: "proj-7",
        title: "Roysambu Solar Street Lighting Project",
        category: "Infrastructure",
        description: "Erected solar-powered streetlights across high-density residential walkways.",
        impact: "Reduced night-time crime incidents by 65% in Mirema and Zimmerman.",
        year: "2024"
      }
    ],
    ties: {
      uhuru: false,
      ruto: false,
      gachagua: false,
      details: "Serves as an independent county assembly member without party control."
    },
    votes: {
      financeBill2024: "NOT_IN_OFFICE",
      financeBill2025: "NOT_IN_OFFICE",
      notes2024: "County Assembly member, rejected local county revenue hikes.",
      notes2025: "Opposed county land rate hikes."
    },
    bio: "Community activist and MCA for Roysambu Ward, Nairobi County.",
    termInOffice: "2022 - Present",
    keyPositionsHeld: ["Chairperson County Planning & Housing Committee"],
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-7",
    name: "Moses Kuria",
    position: "Governor",
    county: "Kiambu",
    party: "CCK / UDA",
    isIndependent: false,
    tagColor: "red",
    tagReason: "Documented hate speech allegations, EACC query files, and strong executive cabinet alignment.",
    corruptionStatus: "charged",
    corruptionDetails: "Investigated by EACC over ministry procurement anomalies and public asset disposal contracts.",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "alleged",
    robberyCrimeDetails: "Past charges related to political brawl and incitement to violence.",
    isGoodLeaderChampion: false,
    ties: {
      uhuru: true,
      ruto: true,
      gachagua: false,
      details: "Former Cabinet Secretary under Ruto and former MP under Jubilee era."
    },
    votes: {
      financeBill2024: "NOT_IN_OFFICE",
      financeBill2025: "NOT_IN_OFFICE",
      notes2024: "Supported Executive tax measures.",
      notes2025: "Cabinet endorsement."
    },
    bio: "Former Cabinet Secretary for Public Service and former Gatundu South MP.",
    termInOffice: "2014 - Present",
    keyPositionsHeld: ["Former Cabinet Secretary for Trade & Industry", "Former MP Gatundu South"],
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-8",
    name: "Jackson Mandago",
    position: "Senator",
    county: "Uasin Gishu",
    party: "UDA",
    isIndependent: false,
    tagColor: "red",
    tagReason: "Charged in magistrate court over Finland Overseas Education Fraud Scandal involving Ksh 1.1 Billion. Voted YES to Finance Bills.",
    corruptionStatus: "charged",
    corruptionDetails: "Charged alongside county officials in Nakuru Law Courts over misplacement of Ksh 1.1B student scholarship fund.",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: false,
    ties: {
      uhuru: false,
      ruto: true,
      gachagua: true,
      details: "Senior UDA leader in Uasin Gishu County."
    },
    votes: {
      financeBill2024: "YES",
      financeBill2025: "YES",
      notes2024: "Voted YES to Senate revenue allocation bills.",
      notes2025: "Voted YES."
    },
    bio: "Senator for Uasin Gishu County and former 2-term Governor.",
    termInOffice: "2013 - Present",
    keyPositionsHeld: ["Senator Uasin Gishu", "Former Governor Uasin Gishu"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-9",
    name: "James Githinji Maina",
    position: "MCA",
    county: "Nakuru",
    ward: "Viwandani Ward",
    party: "UDA",
    isIndependent: false,
    tagColor: "red",
    tagReason: "MCA charged in Nakuru Chief Magistrate Court with armed robbery and violent assault following a quarry tender dispute.",
    corruptionStatus: "alleged",
    corruptionDetails: "Under EACC inquiry over ward development fund kickbacks.",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "charged",
    robberyCrimeDetails: "Charged under Penal Code Section 296(2) (Robbery with Violence) for violent raid on competitor premises.",
    isGoodLeaderChampion: false,
    ties: {
      uhuru: false,
      ruto: true,
      gachagua: false,
      details: "Nakuru Assembly member sponsored on UDA ticket."
    },
    votes: {
      financeBill2024: "NOT_IN_OFFICE",
      financeBill2025: "NOT_IN_OFFICE",
      notes2024: "Voted FOR county tax & market fee increases.",
      notes2025: "Voted FOR fee hikes."
    },
    bio: "Member of County Assembly for Viwandani Ward, Nakuru County.",
    termInOffice: "2022 - Present",
    keyPositionsHeld: ["Member County Budget Committee"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-10",
    name: "Peter Ombati Makori",
    position: "MCA",
    county: "Kisii",
    ward: "Kiamokama Ward",
    party: "Independent",
    isIndependent: true,
    tagColor: "red",
    tagReason: "Facing criminal trial for defilement and sexual assault of a minor under the Sexual Offences Act.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "charged",
    sexualViolenceDetails: "Charged at Kisii Law Courts under Sexual Offences Act No. 3 of 2006 for alleged defilement of a 16-year-old student.",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: false,
    ties: {
      uhuru: false,
      ruto: false,
      gachagua: false,
      details: "Elected as an Independent Ward Representative."
    },
    votes: {
      financeBill2024: "NOT_IN_OFFICE",
      financeBill2025: "NOT_IN_OFFICE",
      notes2024: "Local assembly vote.",
      notes2025: "Local assembly vote."
    },
    bio: "Ward Representative for Kiamokama Ward, Kisii County.",
    termInOffice: "2022 - Present",
    keyPositionsHeld: ["Kisii Assembly Member"],
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-11",
    name: "Ferdinand Waititu (Baba Yao)",
    position: "Governor",
    county: "Kiambu",
    party: "Jubilee",
    isIndependent: false,
    tagColor: "red",
    tagReason: "Convicted / Formally impeached over Ksh 588 Million road tender corruption scandal.",
    corruptionStatus: "convicted",
    corruptionDetails: "Impeached by Senate and convicted in Milimani Anti-Corruption Court over Ksh 588M illegal tender award.",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "alleged",
    robberyCrimeDetails: "Multiple historical arrests for land grabbing brawls and public violence.",
    isGoodLeaderChampion: false,
    ties: {
      uhuru: true,
      ruto: true,
      gachagua: false,
      details: "Former Kiambu Governor with past executive party ties."
    },
    votes: {
      financeBill2024: "NOT_IN_OFFICE",
      financeBill2025: "NOT_IN_OFFICE",
      notes2024: "Not in office.",
      notes2025: "Not in office."
    },
    bio: "Former Governor of Kiambu County and former Kabete MP.",
    termInOffice: "2017 - 2020 (Impeached)",
    keyPositionsHeld: ["Former Governor Kiambu", "Former MP Kabete"],
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-12",
    name: "Dr. Wanami Wamboka",
    position: "MP",
    county: "Bungoma",
    constituency: "Bumula",
    party: "DAP-K",
    isIndependent: false,
    tagColor: "green",
    tagReason: "Voted NO to Finance Bill 2024 & 2025. Clean integrity record, led sugarcane farmer relief drives in Western Kenya.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: true,
    goodLeaderHighlights: [
      "Secured Ksh 150M bailout allocation for Nzoia Sugar factory farmers",
      "Constructed 18 modern science laboratories across Bumula secondary schools",
      "Voted NO to tax on agricultural fertilizers and farm machinery"
    ],
    developmentProjects: [
      {
        id: "proj-8",
        title: "Bumula Farmers Input Subsidies & Fertilizer Hub",
        category: "Infrastructure",
        description: "Established subsidized lime and fertilizer storage center for smallholder farmers.",
        impact: "Lowered maize production costs for 12,000 farmers.",
        year: "2023-2024"
      }
    ],
    ties: {
      uhuru: false,
      ruto: false,
      gachagua: false,
      details: "Opposition legislator championing consumer relief."
    },
    votes: {
      financeBill2024: "NO",
      financeBill2025: "NO",
      notes2024: "Publicly rejected the eco-levy and VAT on basic commodities.",
      notes2025: "Voted NO."
    },
    bio: "Bumula Constituency MP known for parliamentary oversight on government expenditure.",
    termInOffice: "2022 - Present",
    keyPositionsHeld: ["Vice Chair Public Investments Committee"],
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-13",
    name: "Samuel Mburu Njoroge",
    position: "MP",
    county: "Nakuru",
    constituency: "Molo",
    party: "Independent",
    isIndependent: true,
    tagColor: "purple",
    tagReason: "Running by himself as an Independent Candidate with no party ticket. Clean track record.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: true,
    goodLeaderHighlights: [
      "Molo Peace and Youth Talent Center Construction",
      "Voted NO to 2024 & 2025 Finance Bills to shield potato and timber farmers",
      "100% public disclosure of constituency bursary disbursements"
    ],
    developmentProjects: [
      {
        id: "proj-9",
        title: "Molo Potato Cold Storage Facility",
        category: "Infrastructure",
        description: "Built solar-powered cold room to prevent post-harvest loss for local potato farmers.",
        impact: "Increased potato farmer margins by 40%.",
        year: "2024"
      }
    ],
    ties: {
      uhuru: false,
      ruto: false,
      gachagua: false,
      details: "Unaffiliated candidate campaigning on grassroots agrarian reforms."
    },
    votes: {
      financeBill2024: "NO",
      financeBill2025: "NO",
      notes2024: "Voted NO to protecting agricultural inputs from tax hikes.",
      notes2025: "Voted NO."
    },
    bio: "Independent MP candidate representing Molo constituency.",
    termInOffice: "2022 - Present",
    keyPositionsHeld: ["Molo Constituency Representative"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-14",
    name: "Sylvanus Osoro",
    position: "MP",
    county: "Kisii",
    constituency: "South Mugirango",
    party: "UDA",
    isIndependent: false,
    tagColor: "red",
    tagReason: "Majority Chief Whip who voted YES to Finance Bill 2024 & 2025 with strong Ruto administration ties. Past violence charges.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "charged",
    robberyCrimeDetails: "Arrested & charged over violent funeral fight incident and assault of rival politicians.",
    isGoodLeaderChampion: false,
    ties: {
      uhuru: false,
      ruto: true,
      gachagua: true,
      details: "National Assembly Majority Chief Whip enforcing government coalition discipline."
    },
    votes: {
      financeBill2024: "YES",
      financeBill2025: "YES",
      notes2024: "Mobilized MPs to pass all tax clauses.",
      notes2025: "Voted YES."
    },
    bio: "MP for South Mugirango and Majority Party Whip in Parliament.",
    termInOffice: "2017 - Present",
    keyPositionsHeld: ["Majority Chief Whip"],
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "cand-15",
    name: "Wanjira Mutahi",
    position: "Presidential Aspirant",
    county: "Nairobi",
    party: "Independent",
    isIndependent: true,
    tagColor: "purple",
    tagReason: "Independent Candidate running by herself with no political party affiliation. Zero corruption cases.",
    corruptionStatus: "clean",
    sexualViolenceStatus: "clean",
    robberyCrimeStatus: "clean",
    isGoodLeaderChampion: true,
    goodLeaderHighlights: [
      "Pioneered citizen audit of national debt and public procurement",
      "Clean financial record leading non-governmental anti-corruption watchdogs"
    ],
    ties: {
      uhuru: false,
      ruto: false,
      gachagua: false,
      details: "Civic movement founder running as an independent presidential candidate."
    },
    votes: {
      financeBill2024: "NOT_IN_OFFICE",
      financeBill2025: "NOT_IN_OFFICE",
      notes2024: "Not a sitting MP, led public civic petition against the bill.",
      notes2025: "Not in office."
    },
    bio: "Economic policy specialist and anti-corruption campaigner running for top office as an independent candidate.",
    termInOffice: "Candidate for 2027",
    keyPositionsHeld: ["Founding Director, Youth Transparency Initiative"],
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300"
  }
];
