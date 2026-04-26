import { automationBaselines, onetTasks } from "@/lib/dataSources";
import type { AIRiskResult, CountryConfig, OpportunityDefinition, SkillSignal } from "@/lib/types";

function clamp(value: number) {
  return Math.max(0.08, Math.min(0.95, value));
}

function connectivityFactor(level: CountryConfig["automationCalibration"]["connectivityConstraint"]) {
  if (level === "low") return 0.9;
  if (level === "high") return 1.08;
  return 0.98;
}

export function calculateAIRisk(
  skillProfile: SkillSignal[],
  countryConfig: CountryConfig,
  occupation: Pick<OpportunityDefinition, "id" | "title" | "iscoCode" | "requiredSkills" | "preferredSkills">
): AIRiskResult {
  const baseline =
    automationBaselines.find((item) => item.occupationCode === occupation.iscoCode) ??
    automationBaselines.find((item) => item.occupationCode === occupation.id) ??
    automationBaselines.find((item) => item.title.toLowerCase() === occupation.title.toLowerCase());

  const matchedSkills = skillProfile.filter((skill) =>
    [...occupation.requiredSkills, ...occupation.preferredSkills].includes(skill.skillId)
  );

  const digitalIntensity = baseline?.digitalTaskShare ?? 0.5;
  const routineness = baseline?.routineness ?? 0.5;
  const manualComponent = baseline?.manualComponent ?? 0.3;
  const baseExposure = baseline?.baseExposure ?? 0.5;
  const calibration = countryConfig.automationCalibration;

  const taskRoutinenessFactor = 0.75 + routineness * 0.55;
  const infrastructureAdjustment = connectivityFactor(calibration.connectivityConstraint);
  const physicalProtectionFactor = 1 - manualComponent * (1 - calibration.physicalTaskProtection);
  const digitalAdoptionFactor = calibration.digitalAdoptionFactor + digitalIntensity * 0.08;

  const exposureScore = clamp(
    baseExposure *
      calibration.digitalSubstitutionAcceleration *
      taskRoutinenessFactor *
      infrastructureAdjustment *
      calibration.informalityAdjustment *
      physicalProtectionFactor *
      digitalAdoptionFactor
  );

  const exposureLevel = exposureScore >= 0.66 ? "High" : exposureScore >= 0.42 ? "Medium" : "Low";
  const durableSkills = matchedSkills
    .filter((skill) =>
      ["manual_dexterity", "device_diagnostics", "customer_service", "local_language_mediation", "troubleshooting"].includes(
        skill.skillId
      )
    )
    .map((skill) => skill.label);

  const taskCluster = onetTasks.find((item) => item.occupationCode === occupation.iscoCode);
  const vulnerableTasks =
    taskCluster?.tasks.slice(0, 2) ??
    ["Routine digital form entry", "Repeated scripted information handling"];

  const resilienceRecommendations =
    exposureLevel === "High"
      ? [
          "Combine the skill with customer trust, local language work, or field execution.",
          "Add a verification artifact so the role depends on more than routine digital tasks."
        ]
      : exposureLevel === "Medium"
        ? [
            "Pair the skill with sector-specific tools or physical service tasks.",
            "Strengthen proof through a short assessment or work sample."
          ]
        : [
            "Add an adjacent certification or equipment skill to increase earning power.",
            "Document the practical evidence behind the skill to improve portability."
          ];

  return {
    targetId: occupation.id,
    targetTitle: occupation.title,
    exposureLevel,
    exposureScore,
    durableSkills: durableSkills.length > 0 ? durableSkills : matchedSkills.slice(0, 2).map((skill) => skill.label),
    vulnerableTasks,
    resilienceRecommendations,
    explanation: `This is a local risk lens, not a prediction. ${occupation.title} combines a base automation exposure of ${Math.round(
      baseExposure * 100
    )}% with ${countryConfig.countryName}'s connectivity and informality context, then reduces risk where hands-on work is harder to automate.`
  };
}
