import type { CountryConfig, OpportunityMatch, SkillSignal, VerificationStatus } from "@/lib/types";

function titleCase(value: string) {
  return value
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export function getEducationOptions(config: CountryConfig) {
  return Object.keys(config.educationMapping).map((key) => ({
    value: key,
    label: key === "secondary_certificate" ? config.secondaryCredentialName : titleCase(key)
  }));
}

export function hasSkillCluster(skills: SkillSignal[], cluster: string) {
  if (cluster === "repair") {
    return skills.some((skill) => ["device_diagnostics", "troubleshooting", "manual_dexterity"].includes(skill.skillId));
  }
  if (cluster === "multilingual") {
    return skills.some((skill) => skill.skillId === "multilingual_communication");
  }
  if (cluster === "digital") {
    return skills.some((skill) =>
      ["digital_literacy", "basic_software_logic", "self_directed_learning"].includes(skill.skillId)
    );
  }
  if (cluster === "service") {
    return skills.some((skill) =>
      ["customer_service", "customer_communication", "local_language_mediation"].includes(skill.skillId)
    );
  }
  return true;
}

export function getPrimarySkillCluster(skills: SkillSignal[]) {
  if (hasSkillCluster(skills, "repair")) return "Repair and troubleshooting";
  if (hasSkillCluster(skills, "multilingual")) return "Multilingual communication";
  if (hasSkillCluster(skills, "digital")) return "Digital self-learning";
  return "Service and coordination";
}

export function hasVerificationStatus(skills: SkillSignal[], status: VerificationStatus) {
  return skills.some((skill) => skill.verificationStatus === status);
}

export function trainingGapLevel(opportunity: OpportunityMatch) {
  return opportunity.missingSkills.length <= 1 ? "small" : "medium";
}
