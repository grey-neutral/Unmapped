import { allCountries } from "@/lib/countryDataset";

export const skillClusters = [
  "Repair & Technical",
  "Customer Service",
  "Sales & Retail",
  "Languages",
  "Digital Basics",
  "Agriculture",
  "Care Work",
  "Logistics",
  "Construction",
  "Textiles",
  "Mobile Money",
  "Data Collection"
] as const;

const lmicCountryCodes = [
  "GH",
  "KE",
  "NG",
  "TZ",
  "UG",
  "RW",
  "ET",
  "SN",
  "BD",
  "NP",
  "PK",
  "IN",
  "ID",
  "PH",
  "VN",
  "KH",
  "MA",
  "EG",
  "JO",
  "BO",
  "GT",
  "HN"
] as const;

export type PolicyCountryCode = (typeof lmicCountryCodes)[number];
export type PolicyContext = "Urban" | "Rural" | "Informal economy";
export type PolicyGender = "All" | "Women" | "Men";
export type SkillCluster = (typeof skillClusters)[number];

type PolicySeed = {
  code: PolicyCountryCode;
  region: "Africa" | "Asia" | "MENA" | "Latin America";
  mapCol: number;
  mapRow: number;
  profilesBase: number;
  hiddenMultiplier: number;
  unverifiedBase: number;
  riskBase: number;
  topGaps: Record<PolicyContext, string>;
  exposed: string[];
  resilient: string[];
  bestTraining: Record<PolicyContext, string>;
  emphasis: Partial<Record<SkillCluster, number>>;
};

const countryLookup = new Map(allCountries.map((country) => [country.code, country]));

const seeds: PolicySeed[] = [
  {
    code: "GH",
    region: "Africa",
    mapCol: 3,
    mapRow: 3,
    profilesBase: 1240,
    hiddenMultiplier: 3.05,
    unverifiedBase: 63,
    riskBase: 49,
    topGaps: {
      Urban: "Repair / Customer Service",
      Rural: "Solar Repair / Field Service",
      "Informal economy": "Repair / Retail"
    },
    exposed: ["Translation", "Basic retail admin", "Routine data entry"],
    resilient: ["Repair", "Field service", "Care work"],
    bestTraining: {
      Urban: "Device diagnostics",
      Rural: "Solar repair",
      "Informal economy": "Retail pricing"
    },
    emphasis: {
      "Repair & Technical": 34,
      "Customer Service": 24,
      "Sales & Retail": 22,
      "Digital Basics": 18,
      Languages: 12,
      "Mobile Money": 10
    }
  },
  {
    code: "KE",
    region: "Africa",
    mapCol: 5,
    mapRow: 4,
    profilesBase: 1540,
    hiddenMultiplier: 3.5,
    unverifiedBase: 64,
    riskBase: 50,
    topGaps: {
      Urban: "Repair / Customer Service",
      Rural: "Solar Repair / Agri Services",
      "Informal economy": "Repair / Mobile Money"
    },
    exposed: ["Translation", "Basic retail admin", "Routine data entry"],
    resilient: ["Repair", "Field service", "Care work"],
    bestTraining: {
      Urban: "Customer + repair",
      Rural: "Solar repair",
      "Informal economy": "Mobile money tools"
    },
    emphasis: {
      "Repair & Technical": 36,
      "Customer Service": 26,
      "Sales & Retail": 20,
      Agriculture: 18,
      "Digital Basics": 18,
      "Data Collection": 16
    }
  },
  {
    code: "NG",
    region: "Africa",
    mapCol: 4,
    mapRow: 3,
    profilesBase: 2100,
    hiddenMultiplier: 3.2,
    unverifiedBase: 61,
    riskBase: 56,
    topGaps: {
      Urban: "Repair / Logistics",
      Rural: "Agri Services / Construction",
      "Informal economy": "Sales / Repair"
    },
    exposed: ["Routine clerical work", "Retail admin", "Translation"],
    resilient: ["Repair", "Construction", "Logistics"],
    bestTraining: {
      Urban: "Service operations",
      Rural: "Construction basics",
      "Informal economy": "Inventory tracking"
    },
    emphasis: {
      "Repair & Technical": 28,
      "Customer Service": 18,
      "Sales & Retail": 26,
      Logistics: 24,
      Construction: 20,
      "Digital Basics": 14
    }
  },
  {
    code: "TZ",
    region: "Africa",
    mapCol: 5,
    mapRow: 5,
    profilesBase: 1180,
    hiddenMultiplier: 2.8,
    unverifiedBase: 66,
    riskBase: 47,
    topGaps: {
      Urban: "Customer Service / Logistics",
      Rural: "Agri Services / Solar Repair",
      "Informal economy": "Sales / Mobile Money"
    },
    exposed: ["Translation", "Routine admin", "Basic sales support"],
    resilient: ["Field service", "Agricultural services", "Care work"],
    bestTraining: {
      Urban: "Service tools",
      Rural: "Agri equipment repair",
      "Informal economy": "Mobile money support"
    },
    emphasis: {
      Agriculture: 30,
      "Customer Service": 18,
      "Sales & Retail": 20,
      "Mobile Money": 14,
      "Data Collection": 14,
      "Repair & Technical": 18
    }
  },
  {
    code: "UG",
    region: "Africa",
    mapCol: 5,
    mapRow: 4,
    profilesBase: 1090,
    hiddenMultiplier: 2.75,
    unverifiedBase: 67,
    riskBase: 46,
    topGaps: {
      Urban: "Repair / Customer Service",
      Rural: "Agri Services / Care Work",
      "Informal economy": "Retail / Mobile Money"
    },
    exposed: ["Retail admin", "Translation", "Routine entry"],
    resilient: ["Agri services", "Repair", "Care work"],
    bestTraining: {
      Urban: "Repair intake",
      Rural: "Agri services",
      "Informal economy": "Customer handling"
    },
    emphasis: {
      Agriculture: 28,
      "Care Work": 20,
      "Sales & Retail": 18,
      "Repair & Technical": 18,
      "Customer Service": 16,
      "Mobile Money": 16
    }
  },
  {
    code: "RW",
    region: "Africa",
    mapCol: 6,
    mapRow: 4,
    profilesBase: 920,
    hiddenMultiplier: 2.55,
    unverifiedBase: 59,
    riskBase: 45,
    topGaps: {
      Urban: "Digital Basics / Repair",
      Rural: "Solar Repair / Care Work",
      "Informal economy": "Customer Service / Data Collection"
    },
    exposed: ["Routine clerical work", "Translation", "Basic admin"],
    resilient: ["Repair", "Care work", "Field support"],
    bestTraining: {
      Urban: "Digital support",
      Rural: "Solar repair",
      "Informal economy": "Field data tools"
    },
    emphasis: {
      "Digital Basics": 24,
      "Repair & Technical": 18,
      "Customer Service": 18,
      "Care Work": 16,
      "Data Collection": 18
    }
  },
  {
    code: "ET",
    region: "Africa",
    mapCol: 6,
    mapRow: 3,
    profilesBase: 1440,
    hiddenMultiplier: 2.9,
    unverifiedBase: 70,
    riskBase: 44,
    topGaps: {
      Urban: "Construction / Repair",
      Rural: "Agriculture / Logistics",
      "Informal economy": "Sales / Construction"
    },
    exposed: ["Routine clerical work", "Basic translation", "Retail admin"],
    resilient: ["Agriculture", "Construction", "Repair"],
    bestTraining: {
      Urban: "Construction safety",
      Rural: "Agri services",
      "Informal economy": "Stock handling"
    },
    emphasis: {
      Agriculture: 34,
      Construction: 26,
      Logistics: 20,
      "Repair & Technical": 16,
      "Sales & Retail": 14
    }
  },
  {
    code: "SN",
    region: "Africa",
    mapCol: 2,
    mapRow: 3,
    profilesBase: 980,
    hiddenMultiplier: 2.65,
    unverifiedBase: 62,
    riskBase: 48,
    topGaps: {
      Urban: "Customer Service / Repair",
      Rural: "Agri Services / Data Collection",
      "Informal economy": "Sales / Languages"
    },
    exposed: ["Translation", "Basic admin", "Retail checks"],
    resilient: ["Customer-facing service", "Data collection", "Repair"],
    bestTraining: {
      Urban: "Service desk basics",
      Rural: "Field data",
      "Informal economy": "Sales records"
    },
    emphasis: {
      Languages: 24,
      "Customer Service": 22,
      "Sales & Retail": 18,
      Agriculture: 18,
      "Data Collection": 16
    }
  },
  {
    code: "BD",
    region: "Asia",
    mapCol: 9,
    mapRow: 3,
    profilesBase: 1680,
    hiddenMultiplier: 3.1,
    unverifiedBase: 68,
    riskBase: 61,
    topGaps: {
      Urban: "Textiles / Digital Support",
      Rural: "Solar Repair / Agri Services",
      "Informal economy": "Mobile Money / Customer Service"
    },
    exposed: ["Routine textile checks", "Basic clerical work", "Translation"],
    resilient: ["Agricultural services", "Mobile money agents", "Solar repair"],
    bestTraining: {
      Urban: "Textile quality + digital tools",
      Rural: "Solar repair",
      "Informal economy": "Mobile money support"
    },
    emphasis: {
      Textiles: 34,
      "Sales & Retail": 18,
      "Mobile Money": 18,
      Agriculture: 18,
      "Digital Basics": 16,
      "Customer Service": 14
    }
  },
  {
    code: "NP",
    region: "Asia",
    mapCol: 9,
    mapRow: 2,
    profilesBase: 880,
    hiddenMultiplier: 2.45,
    unverifiedBase: 65,
    riskBase: 46,
    topGaps: {
      Urban: "Customer Service / Logistics",
      Rural: "Solar Repair / Construction",
      "Informal economy": "Retail / Data Collection"
    },
    exposed: ["Translation", "Routine admin", "Retail entry"],
    resilient: ["Construction", "Repair", "Field support"],
    bestTraining: {
      Urban: "Service operations",
      Rural: "Solar repair",
      "Informal economy": "Data tools"
    },
    emphasis: {
      Construction: 24,
      "Repair & Technical": 18,
      Logistics: 18,
      "Customer Service": 16,
      "Data Collection": 16
    }
  },
  {
    code: "PK",
    region: "Asia",
    mapCol: 8,
    mapRow: 3,
    profilesBase: 1490,
    hiddenMultiplier: 2.95,
    unverifiedBase: 67,
    riskBase: 58,
    topGaps: {
      Urban: "Textiles / Repair",
      Rural: "Agri Services / Mobile Money",
      "Informal economy": "Sales / Logistics"
    },
    exposed: ["Routine clerical work", "Textile checks", "Translation"],
    resilient: ["Repair", "Agricultural services", "Mobile money"],
    bestTraining: {
      Urban: "Repair intake",
      Rural: "Agri support",
      "Informal economy": "Mobile money operations"
    },
    emphasis: {
      Textiles: 26,
      Agriculture: 22,
      Logistics: 20,
      "Repair & Technical": 20,
      "Mobile Money": 16
    }
  },
  {
    code: "IN",
    region: "Asia",
    mapCol: 8,
    mapRow: 4,
    profilesBase: 2040,
    hiddenMultiplier: 3,
    unverifiedBase: 60,
    riskBase: 59,
    topGaps: {
      Urban: "Logistics / Customer Service",
      Rural: "Agri Services / Construction",
      "Informal economy": "Sales / Mobile Money"
    },
    exposed: ["Routine back office work", "Translation", "Data entry"],
    resilient: ["Logistics", "Repair", "Field service"],
    bestTraining: {
      Urban: "Service + logistics tools",
      Rural: "Agri equipment support",
      "Informal economy": "Mobile money support"
    },
    emphasis: {
      Logistics: 28,
      "Customer Service": 22,
      "Sales & Retail": 24,
      Agriculture: 20,
      "Mobile Money": 18,
      "Repair & Technical": 18
    }
  },
  {
    code: "ID",
    region: "Asia",
    mapCol: 11,
    mapRow: 5,
    profilesBase: 1760,
    hiddenMultiplier: 2.7,
    unverifiedBase: 57,
    riskBase: 53,
    topGaps: {
      Urban: "Customer Service / Logistics",
      Rural: "Agri Services / Repair",
      "Informal economy": "Retail / Mobile Money"
    },
    exposed: ["Retail admin", "Translation", "Routine support"],
    resilient: ["Logistics", "Repair", "Care work"],
    bestTraining: {
      Urban: "Logistics support",
      Rural: "Equipment repair",
      "Informal economy": "Mobile money support"
    },
    emphasis: {
      Logistics: 26,
      "Sales & Retail": 24,
      Agriculture: 18,
      "Customer Service": 18,
      "Repair & Technical": 16,
      "Mobile Money": 14
    }
  },
  {
    code: "PH",
    region: "Asia",
    mapCol: 12,
    mapRow: 4,
    profilesBase: 1380,
    hiddenMultiplier: 2.6,
    unverifiedBase: 56,
    riskBase: 57,
    topGaps: {
      Urban: "Customer Service / Data Collection",
      Rural: "Care Work / Field Service",
      "Informal economy": "Sales / Digital Support"
    },
    exposed: ["Routine customer admin", "Translation", "Clerical support"],
    resilient: ["Care work", "Field service", "Repair"],
    bestTraining: {
      Urban: "Customer service tools",
      Rural: "Care support",
      "Informal economy": "Digital support"
    },
    emphasis: {
      "Customer Service": 28,
      "Digital Basics": 22,
      "Sales & Retail": 20,
      "Care Work": 18,
      "Data Collection": 16
    }
  },
  {
    code: "VN",
    region: "Asia",
    mapCol: 10,
    mapRow: 4,
    profilesBase: 1320,
    hiddenMultiplier: 2.5,
    unverifiedBase: 54,
    riskBase: 55,
    topGaps: {
      Urban: "Textiles / Digital Basics",
      Rural: "Agri Services / Construction",
      "Informal economy": "Sales / Logistics"
    },
    exposed: ["Routine textile tasks", "Basic admin", "Translation"],
    resilient: ["Construction", "Repair", "Field support"],
    bestTraining: {
      Urban: "Textile quality + devices",
      Rural: "Construction tools",
      "Informal economy": "Inventory handling"
    },
    emphasis: {
      Textiles: 28,
      Logistics: 18,
      Agriculture: 18,
      "Digital Basics": 18,
      Construction: 16
    }
  },
  {
    code: "KH",
    region: "Asia",
    mapCol: 10,
    mapRow: 5,
    profilesBase: 940,
    hiddenMultiplier: 2.4,
    unverifiedBase: 61,
    riskBase: 52,
    topGaps: {
      Urban: "Textiles / Customer Service",
      Rural: "Agri Services / Solar Repair",
      "Informal economy": "Sales / Mobile Money"
    },
    exposed: ["Routine textile checks", "Translation", "Basic admin"],
    resilient: ["Agricultural services", "Repair", "Mobile money"],
    bestTraining: {
      Urban: "Factory digital basics",
      Rural: "Solar repair",
      "Informal economy": "Mobile money tools"
    },
    emphasis: {
      Textiles: 30,
      Agriculture: 20,
      "Sales & Retail": 18,
      "Customer Service": 14,
      "Mobile Money": 16
    }
  },
  {
    code: "MA",
    region: "MENA",
    mapCol: 2,
    mapRow: 2,
    profilesBase: 1100,
    hiddenMultiplier: 2.45,
    unverifiedBase: 55,
    riskBase: 51,
    topGaps: {
      Urban: "Customer Service / Repair",
      Rural: "Construction / Agri Services",
      "Informal economy": "Sales / Logistics"
    },
    exposed: ["Translation", "Retail admin", "Routine back office work"],
    resilient: ["Repair", "Construction", "Customer-facing service"],
    bestTraining: {
      Urban: "Repair support",
      Rural: "Construction safety",
      "Informal economy": "Logistics tools"
    },
    emphasis: {
      "Customer Service": 20,
      Construction: 20,
      Logistics: 16,
      "Repair & Technical": 18,
      Agriculture: 12,
      Languages: 18
    }
  },
  {
    code: "EG",
    region: "MENA",
    mapCol: 4,
    mapRow: 2,
    profilesBase: 1600,
    hiddenMultiplier: 2.7,
    unverifiedBase: 58,
    riskBase: 57,
    topGaps: {
      Urban: "Repair / Logistics",
      Rural: "Construction / Agri Services",
      "Informal economy": "Sales / Mobile Money"
    },
    exposed: ["Routine clerical work", "Translation", "Back office support"],
    resilient: ["Repair", "Construction", "Field service"],
    bestTraining: {
      Urban: "Repair logistics",
      Rural: "Construction basics",
      "Informal economy": "Customer sales"
    },
    emphasis: {
      Logistics: 24,
      Construction: 22,
      "Repair & Technical": 20,
      "Sales & Retail": 18,
      "Customer Service": 16
    }
  },
  {
    code: "JO",
    region: "MENA",
    mapCol: 5,
    mapRow: 2,
    profilesBase: 760,
    hiddenMultiplier: 2.2,
    unverifiedBase: 53,
    riskBase: 60,
    topGaps: {
      Urban: "Customer Service / Digital Support",
      Rural: "Field Service / Care Work",
      "Informal economy": "Sales / Logistics"
    },
    exposed: ["Translation", "Routine office support", "Basic admin"],
    resilient: ["Care work", "Field service", "Repair"],
    bestTraining: {
      Urban: "Digital support",
      Rural: "Field service",
      "Informal economy": "Sales systems"
    },
    emphasis: {
      "Customer Service": 22,
      "Digital Basics": 20,
      Logistics: 16,
      "Care Work": 14,
      Languages: 18
    }
  },
  {
    code: "BO",
    region: "Latin America",
    mapCol: 2,
    mapRow: 6,
    profilesBase: 830,
    hiddenMultiplier: 2.25,
    unverifiedBase: 57,
    riskBase: 48,
    topGaps: {
      Urban: "Repair / Customer Service",
      Rural: "Agriculture / Construction",
      "Informal economy": "Sales / Logistics"
    },
    exposed: ["Translation", "Retail admin", "Routine clerical work"],
    resilient: ["Repair", "Construction", "Agricultural services"],
    bestTraining: {
      Urban: "Repair support",
      Rural: "Construction tools",
      "Informal economy": "Sales records"
    },
    emphasis: {
      Agriculture: 20,
      Construction: 22,
      "Repair & Technical": 18,
      "Sales & Retail": 18
    }
  },
  {
    code: "GT",
    region: "Latin America",
    mapCol: 1,
    mapRow: 5,
    profilesBase: 910,
    hiddenMultiplier: 2.35,
    unverifiedBase: 59,
    riskBase: 50,
    topGaps: {
      Urban: "Customer Service / Repair",
      Rural: "Agriculture / Care Work",
      "Informal economy": "Sales / Mobile Money"
    },
    exposed: ["Translation", "Retail admin", "Routine data entry"],
    resilient: ["Repair", "Care work", "Agricultural services"],
    bestTraining: {
      Urban: "Service operations",
      Rural: "Care support",
      "Informal economy": "Mobile money basics"
    },
    emphasis: {
      Agriculture: 22,
      "Customer Service": 18,
      "Sales & Retail": 18,
      "Care Work": 18,
      "Repair & Technical": 16
    }
  },
  {
    code: "HN",
    region: "Latin America",
    mapCol: 1,
    mapRow: 6,
    profilesBase: 780,
    hiddenMultiplier: 2.3,
    unverifiedBase: 61,
    riskBase: 49,
    topGaps: {
      Urban: "Repair / Sales",
      Rural: "Agriculture / Logistics",
      "Informal economy": "Sales / Construction"
    },
    exposed: ["Routine clerical work", "Translation", "Retail admin"],
    resilient: ["Repair", "Logistics", "Construction"],
    bestTraining: {
      Urban: "Repair intake",
      Rural: "Logistics basics",
      "Informal economy": "Sales and pricing"
    },
    emphasis: {
      "Sales & Retail": 22,
      Agriculture: 18,
      Logistics: 18,
      Construction: 18,
      "Repair & Technical": 16
    }
  }
];

const contextAdjustments: Record<
  PolicyContext,
  {
    profileScale: number;
    hiddenScale: number;
    unverifiedDelta: number;
    riskDelta: number;
    clusterBoosts: Partial<Record<SkillCluster, number>>;
  }
> = {
  Urban: {
    profileScale: 1.18,
    hiddenScale: 1.34,
    unverifiedDelta: -5,
    riskDelta: 4,
    clusterBoosts: {
      "Customer Service": 10,
      "Sales & Retail": 8,
      "Digital Basics": 8,
      Logistics: 6,
      Textiles: 4,
      Agriculture: -12
    }
  },
  Rural: {
    profileScale: 0.68,
    hiddenScale: 0.92,
    unverifiedDelta: 7,
    riskDelta: -6,
    clusterBoosts: {
      Agriculture: 18,
      "Data Collection": 8,
      "Care Work": 6,
      Construction: 8,
      "Sales & Retail": -6,
      "Digital Basics": -4,
      Textiles: -4
    }
  },
  "Informal economy": {
    profileScale: 1,
    hiddenScale: 1.18,
    unverifiedDelta: 2,
    riskDelta: 1,
    clusterBoosts: {
      "Sales & Retail": 12,
      "Mobile Money": 10,
      "Repair & Technical": 8,
      "Customer Service": 6,
      Logistics: 4,
      Construction: 2
    }
  }
};

const verificationPenalty: Record<SkillCluster, number> = {
  "Repair & Technical": 5,
  "Customer Service": 7,
  "Sales & Retail": 8,
  Languages: 9,
  "Digital Basics": 7,
  Agriculture: 10,
  "Care Work": 8,
  Logistics: 7,
  Construction: 10,
  Textiles: 9,
  "Mobile Money": 6,
  "Data Collection": 7
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function riskLabel(score: number) {
  if (score >= 65) return "High";
  if (score >= 55) return "Medium-High";
  if (score >= 48) return "Medium";
  if (score >= 40) return "Low-Medium";
  return "Low";
}

function riskTone(score: number) {
  if (score >= 65) return "red" as const;
  if (score >= 48) return "yellow" as const;
  return "green" as const;
}

function countryMeta(code: PolicyCountryCode) {
  const match = countryLookup.get(code);
  return {
    name: match?.name ?? code,
    flag: match?.flag ?? code
  };
}

function clusterShare(seed: PolicySeed, cluster: SkillCluster, context: PolicyContext) {
  const base = 18 + (seed.emphasis[cluster] ?? 0);
  const boost = contextAdjustments[context].clusterBoosts[cluster] ?? 0;
  return clamp(base + boost, 8, 92);
}

function buildInsights(seed: PolicySeed, context: PolicyContext) {
  const gap = seed.topGaps[context];
  const training = seed.bestTraining[context];
  const insightTwoTitle =
    context === "Rural"
      ? "Rural youth show strong agri-service skills"
      : context === "Urban"
        ? "Urban repair demand exceeds verified supply"
        : "Informal sales skills are common but weakly verified";
  const insightTwoSignal =
    context === "Rural"
      ? "Training bridge opportunity"
      : context === "Urban"
        ? "High demand / low verification"
        : "Verification gap";

  return [
    {
      title: `${gap} demand is rising`,
      signal: "Demand / supply mismatch",
      tone: "yellow" as const
    },
    {
      title: insightTwoTitle,
      signal: insightTwoSignal,
      tone: "green" as const
    },
    {
      title: `Best short training: ${training}`,
      signal: "High demand + small skill gap",
      tone: "red" as const
    }
  ];
}

export function aggregatePolicySignals({
  country,
  context,
  gender
}: {
  country: PolicyCountryCode;
  context: PolicyContext;
  gender: PolicyGender;
}) {
  const seed = seeds.find((item) => item.code === country) ?? seeds[0];
  const meta = countryMeta(seed.code);
  const adjustment = contextAdjustments[context];
  const genderScale = gender === "All" ? 1 : 0.49;

  const profilesMapped = Math.round(seed.profilesBase * adjustment.profileScale * genderScale);
  const hiddenSkills = Math.round(seed.profilesBase * seed.hiddenMultiplier * adjustment.hiddenScale * genderScale);
  const unverifiedSkills = clamp(seed.unverifiedBase + adjustment.unverifiedDelta + (gender === "Women" ? 2 : gender === "Men" ? -1 : 0), 42, 82);
  const aiScore = clamp(seed.riskBase + adjustment.riskDelta + (gender === "Women" ? 1 : 0), 34, 78);

  const clusterCounts = skillClusters.map((cluster) => ({
    cluster,
    relative: clusterShare(seed, cluster, context)
  }));

  const verificationRows = skillClusters.map((cluster) => {
    const inferredWidth = clamp(unverifiedSkills + verificationPenalty[cluster] - (seed.emphasis[cluster] ?? 0) / 4, 24, 94);
    return {
      cluster,
      inferredWidth,
      verifiedWidth: 100 - inferredWidth
    };
  });

  const mapCountries = seeds.map((item) => {
    const score = clamp(item.riskBase + contextAdjustments[context].riskDelta, 34, 78);
    const itemMeta = countryMeta(item.code);

    return {
      code: item.code,
      name: itemMeta.name,
      flag: itemMeta.flag,
      gap: item.topGaps[context],
      score,
      label: riskLabel(score),
      tone: riskTone(score),
      mapCol: item.mapCol,
      mapRow: item.mapRow
    };
  });

  return {
    countries: seeds.map((item) => {
      const itemMeta = countryMeta(item.code);
      return { code: item.code, name: itemMeta.name, flag: itemMeta.flag };
    }),
    selectedCountry: {
      code: seed.code,
      name: meta.name,
      flag: meta.flag
    },
    metrics: [
      {
        label: "Profiles mapped",
        value: profilesMapped.toLocaleString(),
        trend: adjustment.profileScale >= 1 ? "↑" : "↓",
        tone: adjustment.profileScale >= 1 ? "green" as const : "yellow" as const
      },
      {
        label: "Hidden skills detected",
        value: hiddenSkills.toLocaleString(),
        trend: "↑",
        tone: "green" as const
      },
      {
        label: "Unverified skills",
        value: `${unverifiedSkills}%`,
        trend: unverifiedSkills >= 65 ? "↓" : "→",
        tone: unverifiedSkills >= 65 ? "red" as const : "yellow" as const
      },
      {
        label: "Top opportunity gap",
        value: seed.topGaps[context],
        trend: "→",
        tone: "yellow" as const
      }
    ],
    mapCountries,
    clusterCounts,
    verificationRows,
    aiOverview: {
      score: aiScore,
      label: riskLabel(aiScore),
      exposed: seed.exposed,
      resilient: seed.resilient
    },
    insights: buildInsights(seed, context)
  };
}
