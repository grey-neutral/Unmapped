export type CountryCode = "GHA" | "BGD";
export type RegionType = "urban" | "peri-urban" | "rural";
export type DeviceAccess = "own_phone" | "shared_phone" | "no_regular_internet";
export type LookingFor = "job" | "training" | "self_employment" | "not_sure" | "apprenticeship" | "gig";
export type ConfidenceLevel = "low" | "medium" | "high" | "verified";
export type EvidenceSource = "self-declared" | "inferred" | "demonstrated" | "verified";
export type VerificationStatus = "self-declared" | "inferred" | "demonstrated" | "verified";
export type OpportunityKind = "job" | "training" | "apprenticeship" | "self_employment" | "gig";

export type EducationRecord = {
  highestCompleted: string;
  localCertificateName: string;
  yearCompleted: number;
  hasProof: boolean;
};

export type GuidedAnswers = {
  soldOrRunBusiness: boolean;
  repairedDevices: boolean;
  careOrCustomers: boolean;
  usedDigitalTools: boolean;
  learnedOnline: boolean;
  trainedOthers: boolean;
  handledMoney: boolean;
  languages: string[];
};

export type CandidateProfile = {
  id: string;
  anonymousId: string;
  displayName: string;
  age: number;
  gender: string;
  countryCode: CountryCode;
  regionType: RegionType;
  preferredLanguage: string;
  deviceAccess: DeviceAccess;
  lookingFor: LookingFor;
  education: EducationRecord;
  languages: string[];
  guidedAnswers: GuidedAnswers;
  experienceText: string;
  consentToContact: boolean;
};

export type Evidence = {
  id: string;
  type: string;
  statement: string;
  source: EvidenceSource;
  confidence: ConfidenceLevel;
  rawInput: string;
  inferredFrom: string[];
  whyItMatters: string;
  verificationPrompt?: string;
};

export type SkillSignal = {
  skillId: string;
  label: string;
  category: string;
  evidenceIds: string[];
  confidence: ConfidenceLevel;
  verificationStatus: VerificationStatus;
  explanation: string;
  adjacentPathways: string[];
};

export type TaxonomyMatch = {
  skillId: string;
  escoMatch: {
    id: string;
    label: string;
  };
  iscoOccupationCandidates: Array<{ code: string; title: string }>;
  onetTaskClusters: string[];
  confidence: number;
  explanation: string;
};

export type EnrichedSkillSignal = SkillSignal & {
  taxonomy?: TaxonomyMatch;
};

export type CountrySignal = {
  value: number;
  unit: string;
  source: string;
};

export type CountryConfig = {
  countryCode: CountryCode;
  countryName: string;
  defaultCityContext: string;
  defaultLanguage: string;
  secondaryCredentialName: string;
  regionOptions: RegionType[];
  sectorPriorities: string[];
  educationMapping: Record<
    string,
    {
      mappedLevel: string;
      baselineSkills: string[];
      confidence: ConfidenceLevel;
    }
  >;
  laborMarketSignals: Record<string, CountrySignal>;
  automationCalibration: {
    connectivityConstraint: "low" | "medium" | "high";
    informalityAdjustment: number;
    physicalTaskProtection: number;
    digitalSubstitutionAcceleration: number;
    digitalAdoptionFactor: number;
  };
  opportunityTypes: string[];
  language: {
    defaultLanguage: string;
    supportedLanguages: string[];
    youthLabel: string;
    lowBandwidthNote: string;
  };
};

export type OpportunityDefinition = {
  id: string;
  countryCode: CountryCode;
  title: string;
  type: OpportunityKind;
  iscoCode: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minEducationLevel: string;
  localDemand: number;
  wageSignal: number;
  sourceLabels: string[];
  whyRealistic: string;
};

export type OpportunityMatch = {
  id: string;
  title: string;
  type: OpportunityKind;
  iscoCode: string;
  skillFit: number;
  demandSignal: number;
  wageSignal: number;
  educationFit: number;
  aiResilience: number;
  trainingGap: string;
  verificationNeeded: string;
  totalScore: number;
  explanation: string;
  nextStep: string;
  whyRealistic: string;
  sourceLabels: string[];
  missingSkills: string[];
};

export type AIRiskResult = {
  targetId: string;
  targetTitle: string;
  exposureLevel: "Low" | "Medium" | "High";
  exposureScore: number;
  durableSkills: string[];
  vulnerableTasks: string[];
  resilienceRecommendations: string[];
  explanation: string;
};

export type PassportSection = {
  title: string;
  items: string[];
};

export type ProfileAnalysis = {
  profile: CandidateProfile;
  countryConfig: CountryConfig;
  evidence: Evidence[];
  skills: EnrichedSkillSignal[];
  opportunities: OpportunityMatch[];
  aiReadiness: AIRiskResult[];
  econometricSignals: Array<{ title: string; value: string; description: string; source: string }>;
  passportSections: PassportSection[];
};

export type AggregatedPolicySignals = {
  totalYouthMapped: number;
  informalBusinessShare: number;
  repairSkillShare: number;
  multilingualShare: number;
  digitalSelfLearningShare: number;
  topMissingVerification: string;
  topOpportunityGap: string;
  bestShortTrainingROI: string;
  skillClusters: Array<{ label: string; count: number; percentage: number }>;
  verificationLevels: Array<{ label: string; count: number }>;
  opportunityGaps: Array<{ label: string; count: number }>;
  aiRiskClusters: Array<{ label: string; share: number; explanation: string }>;
  trainingRecommendations: Array<{ label: string; count: number; reason: string }>;
  demographicBreakdowns: {
    gender: Array<{ label: string; count: number }>;
    ageGroup: Array<{ label: string; count: number }>;
    region: Array<{ label: string; count: number }>;
  };
};
