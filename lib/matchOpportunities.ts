import { sampleOpportunities } from "@/lib/dataSources";
import { calculateAIRisk } from "@/lib/calculateAIRisk";
import type { CountryConfig, OpportunityMatch, SkillSignal } from "@/lib/types";

const confidenceScores = {
  low: 0.45,
  medium: 0.62,
  high: 0.8,
  verified: 0.96
} as const;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function friendlySkill(skillId: string) {
  return skillId.replaceAll("_", " ");
}

export function matchOpportunities(
  skillProfile: SkillSignal[],
  countryConfig: CountryConfig,
  highestEducationLevel: string
): OpportunityMatch[] {
  const opportunities = sampleOpportunities.filter((item) => item.countryCode === countryConfig.countryCode);

  return opportunities
    .map((opportunity) => {
      const requiredMatches = opportunity.requiredSkills.filter((requiredSkill) =>
        skillProfile.some((skill) => skill.skillId === requiredSkill)
      );
      const preferredMatches = opportunity.preferredSkills.filter((preferredSkill) =>
        skillProfile.some((skill) => skill.skillId === preferredSkill)
      );
      const missingSkills = opportunity.requiredSkills.filter(
        (requiredSkill) => !skillProfile.some((skill) => skill.skillId === requiredSkill)
      );

      const matchedSignals = skillProfile.filter((skill) =>
        [...requiredMatches, ...preferredMatches].includes(skill.skillId)
      );

      const skillFit = clamp(
        (requiredMatches.length * 0.82 + preferredMatches.length * 0.3) /
          Math.max(1, opportunity.requiredSkills.length + opportunity.preferredSkills.length * 0.35)
      );

      const verificationStrength =
        matchedSignals.reduce((total, skill) => total + confidenceScores[skill.confidence], 0) /
        Math.max(1, matchedSignals.length);

      const trainingGapSmallness = clamp(1 - missingSkills.length / Math.max(1, opportunity.requiredSkills.length));
      const educationFit =
        opportunity.minEducationLevel === highestEducationLevel ||
        (highestEducationLevel === "upper_secondary" && opportunity.minEducationLevel === "lower_secondary")
          ? 1
          : 0.72;

      const aiLens = calculateAIRisk(skillProfile, countryConfig, opportunity);
      const aiResilience = clamp(1 - aiLens.exposureScore);

      const totalScore =
        0.3 * skillFit +
        0.2 * opportunity.localDemand +
        0.15 * opportunity.wageSignal +
        0.15 * trainingGapSmallness +
        0.1 * verificationStrength +
        0.1 * aiResilience;

      const verificationNeeded =
        missingSkills.length === 0
          ? "A short practical assessment would make this profile stronger."
          : `Verify ${friendlySkill(missingSkills[0])} next to strengthen this match.`;

      const nextStep =
        missingSkills.length === 0
          ? "Request a work sample or micro-assessment to make the signal portable."
          : `Build or verify ${friendlySkill(missingSkills[0])} through a short task or bridge training.`;

      return {
        id: opportunity.id,
        title: opportunity.title,
        type: opportunity.type,
        iscoCode: opportunity.iscoCode,
        skillFit,
        demandSignal: opportunity.localDemand,
        wageSignal: opportunity.wageSignal,
        educationFit,
        aiResilience,
        trainingGap:
          missingSkills.length === 0
            ? "Small training gap"
            : `Missing ${missingSkills.length} core signal${missingSkills.length > 1 ? "s" : ""}: ${missingSkills
                .slice(0, 2)
                .map(friendlySkill)
                .join(", ")}.`,
        verificationNeeded,
        totalScore,
        explanation: `${opportunity.whyRealistic} This score combines skill fit, local demand, wage signal, training gap size, signal strength, and AI resilience in plain language.`,
        nextStep,
        whyRealistic: opportunity.whyRealistic,
        sourceLabels: opportunity.sourceLabels,
        missingSkills
      } satisfies OpportunityMatch;
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}
