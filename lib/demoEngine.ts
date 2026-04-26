import { aggregatePolicySignals } from "@/lib/aggregatePolicySignals";
import { calculateAIRisk } from "@/lib/calculateAIRisk";
import { extractEvidence } from "@/lib/extractEvidence";
import { educationSignals, sampleProfiles } from "@/lib/dataSources";
import { loadCountryConfig } from "@/lib/loadCountryConfig";
import { mapSkillsToTaxonomies } from "@/lib/mapOccupations";
import { mapEvidenceToSkills } from "@/lib/mapSkills";
import { matchOpportunities } from "@/lib/matchOpportunities";
import type { AIRiskResult, CandidateProfile, CountryCode, PassportSection, ProfileAnalysis } from "@/lib/types";

function enrichPassport(profile: CandidateProfile, evidenceCount: number, strongestSkills: string[]): PassportSection[] {
  return [
    {
      title: "My strongest skills",
      items: strongestSkills
    },
    {
      title: "Evidence behind my skills",
      items: [
        `${evidenceCount} evidence signals were translated from schooling, work, language, and learning history.`,
        "Each skill card shows where the signal came from and how strong it is."
      ]
    },
    {
      title: "Jobs where these skills are useful",
      items: ["Repair and servicing", "Customer-facing support", "Field coordination and digital admin support"]
    },
    {
      title: "Skills I should verify next",
      items: ["Phone or equipment diagnostics", "Customer explanation under delay", "Basic digital workflow task"]
    },
    {
      title: "Skills I can build next",
      items: ["Solar or appliance repair basics", "Digital CRM or form tools", "Inventory and stock records"]
    },
    {
      title: "Download or share profile",
      items: [`Portable profile prepared for ${profile.displayName}'s next conversation with an employer or training provider.`]
    }
  ];
}

function buildReadinessLens(
  skills: ProfileAnalysis["skills"],
  countryCode: CountryCode,
  countryConfig: ProfileAnalysis["countryConfig"]
): AIRiskResult[] {
  const lenses = [];

  if (skills.some((skill) => skill.skillId === "multilingual_communication")) {
    lenses.push({
      id: "TRANS-01",
      title: "Language-only translation tasks",
      iscoCode: "TRANS-01",
      requiredSkills: ["multilingual_communication", "customer_communication"],
      preferredSkills: ["local_language_mediation"]
    });
  }

  if (skills.some((skill) => skill.skillId === "device_diagnostics")) {
    lenses.push({
      id: `${countryCode}-repair-lens`,
      title: "Phone repair and diagnostics",
      iscoCode: "7422",
      requiredSkills: ["device_diagnostics", "troubleshooting", "manual_dexterity"],
      preferredSkills: ["customer_service"]
    });
  }

  if (skills.some((skill) => skill.skillId === "customer_service")) {
    lenses.push({
      id: `${countryCode}-support-lens`,
      title: "Customer service and coordination",
      iscoCode: "4225",
      requiredSkills: ["customer_service", "customer_communication"],
      preferredSkills: ["digital_literacy", "multilingual_communication"]
    });
  }

  return lenses.map((lens) => calculateAIRisk(skills, countryConfig, lens));
}

function buildEconometricCards(analysis: Omit<ProfileAnalysis, "econometricSignals" | "passportSections">) {
  const signals = analysis.countryConfig.laborMarketSignals;
  const wittSignal = educationSignals.find((item) => item.countryCode === analysis.countryConfig.countryCode);

  return [
    {
      title: "Youth NEET context",
      value: `${signals.youthNEET.value}${signals.youthNEET.unit}`,
      description: "High youth exclusion means verified practical evidence matters more than schooling alone.",
      source: signals.youthNEET.source
    },
    {
      title: "Informality share",
      value: `${signals.informalEmployment.value}${signals.informalEmployment.unit}`,
      description: "A large informal economy means many real skills remain unmapped unless they are translated.",
      source: signals.informalEmployment.source
    },
    {
      title: "Repair and service wage proxy",
      value: `${signals.repairWageProxy.value}${signals.repairWageProxy.unit}`,
      description: "Entry-level repair and service pathways can sit above baseline informal retail income.",
      source: signals.repairWageProxy.source
    },
    {
      title: "Education supply signal",
      value: wittSignal ? `${wittSignal.year} outlook` : "2030 outlook",
      description: wittSignal?.signal ?? "Secondary attainment is rising, but practical proof still matters.",
      source: wittSignal?.source ?? "Wittgenstein Centre education projection sample"
    }
  ];
}

export function buildProfileAnalysis(profile: CandidateProfile, countryOverride?: CountryCode): ProfileAnalysis {
  const appliedCountry = countryOverride ?? profile.countryCode;
  const countryConfig = loadCountryConfig(appliedCountry);
  const adjustedProfile: CandidateProfile = {
    ...profile,
    countryCode: appliedCountry,
    preferredLanguage: countryConfig.defaultLanguage
  };

  const evidence = extractEvidence(adjustedProfile.experienceText, adjustedProfile.guidedAnswers, adjustedProfile.education);
  const rawSkills = mapEvidenceToSkills(evidence, countryConfig);
  const taxonomy = mapSkillsToTaxonomies(rawSkills);
  const skills = rawSkills.map((skill) => ({
    ...skill,
    taxonomy: taxonomy.find((match) => match.skillId === skill.skillId)
  }));
  const educationLevel =
    countryConfig.educationMapping[adjustedProfile.education.highestCompleted]?.mappedLevel ?? "lower_secondary";
  const opportunities = matchOpportunities(skills, countryConfig, educationLevel);
  const aiReadiness = buildReadinessLens(skills, appliedCountry, countryConfig);
  const strongestSkills = skills.slice(0, 5).map((skill) => skill.label);
  const passportSections = enrichPassport(adjustedProfile, evidence.length, strongestSkills);

  const base = {
    profile: adjustedProfile,
    countryConfig,
    evidence,
    skills,
    opportunities,
    aiReadiness
  };

  return {
    ...base,
    econometricSignals: buildEconometricCards(base),
    passportSections
  };
}

export function getProfileById(profileId: string) {
  return sampleProfiles.find((profile) => profile.id === profileId);
}

export function getProcessedProfiles(countryCode?: CountryCode) {
  return sampleProfiles
    .filter((profile) => (countryCode ? profile.countryCode === countryCode : true))
    .map((profile) => buildProfileAnalysis(profile, countryCode ?? profile.countryCode));
}

export function getPolicyAggregation(countryCode?: CountryCode) {
  return aggregatePolicySignals(getProcessedProfiles(countryCode));
}
