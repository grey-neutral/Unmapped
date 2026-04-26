import type { AggregatedPolicySignals, ProfileAnalysis } from "@/lib/types";

function percentage(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

function countBy<T extends string>(items: T[]) {
  return items.reduce<Record<T, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function ageGroup(age: number) {
  if (age < 22) return "18-21";
  if (age < 25) return "22-24";
  return "25+";
}

export function aggregatePolicySignals(profiles: ProfileAnalysis[]): AggregatedPolicySignals {
  const totalYouthMapped = profiles.length;
  const informalBusinessProfiles = profiles.filter((profile) =>
    profile.evidence.some((item) => item.type === "business_ops")
  ).length;
  const repairProfiles = profiles.filter((profile) =>
    profile.skills.some((skill) => ["device_diagnostics", "troubleshooting", "manual_dexterity"].includes(skill.skillId))
  ).length;
  const multilingualProfiles = profiles.filter((profile) =>
    profile.skills.some((skill) => skill.skillId === "multilingual_communication")
  ).length;
  const selfLearningProfiles = profiles.filter((profile) =>
    profile.skills.some((skill) => skill.skillId === "self_directed_learning")
  ).length;

  const missingVerificationCounts = countBy(
    profiles
      .flatMap((profile) => profile.evidence)
      .filter((item) => item.source !== "verified" && item.verificationPrompt)
      .map((item) => item.verificationPrompt as string)
  );
  const topMissingVerification =
    Object.entries(missingVerificationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "No verification gaps detected";

  const opportunityGapCounts = countBy(
    profiles
      .flatMap((profile) => profile.opportunities.slice(0, 3))
      .flatMap((match) => match.missingSkills)
      .map((skill) => skill.replaceAll("_", " "))
  );
  const topOpportunityGap =
    Object.entries(opportunityGapCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "No major opportunity gap detected";

  const trainingRecommendationCounts = countBy(
    profiles
      .flatMap((profile) => profile.aiReadiness)
      .flatMap((risk) => risk.resilienceRecommendations)
  );
  const bestShortTrainingROI =
    Object.entries(trainingRecommendationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Add short verification tasks";

  const skillClusters = [
    {
      label: "Repair and troubleshooting",
      count: repairProfiles,
      percentage: percentage(repairProfiles, totalYouthMapped)
    },
    {
      label: "Multilingual communication",
      count: multilingualProfiles,
      percentage: percentage(multilingualProfiles, totalYouthMapped)
    },
    {
      label: "Digital self-learning",
      count: selfLearningProfiles,
      percentage: percentage(selfLearningProfiles, totalYouthMapped)
    },
    {
      label: "Informal business operations",
      count: informalBusinessProfiles,
      percentage: percentage(informalBusinessProfiles, totalYouthMapped)
    }
  ];

  const verificationLevels = Object.entries(
    countBy(profiles.flatMap((profile) => profile.skills.map((skill) => skill.verificationStatus)))
  ).map(([label, count]) => ({ label, count }));

  const opportunityGaps = Object.entries(opportunityGapCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const aiRiskClusters = ["High", "Medium", "Low"].map((level) => {
    const hits = profiles.flatMap((profile) => profile.aiReadiness).filter((risk) => risk.exposureLevel === level).length;
    return {
      label: `${level} exposure pathways`,
      share: percentage(hits, Math.max(1, profiles.flatMap((profile) => profile.aiReadiness).length)),
      explanation:
        level === "High"
          ? "These pathways rely more on routine digital tasks and need strong complements."
          : level === "Medium"
            ? "These pathways stay viable when paired with physical, local, or trust-based work."
            : "These pathways are buffered by practical manual or high-trust service work."
    };
  });

  const trainingRecommendations = Object.entries(trainingRecommendationCounts)
    .map(([label, count]) => ({
      label,
      count,
      reason: "Appears frequently across candidate pathways and would strengthen portability."
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return {
    totalYouthMapped,
    informalBusinessShare: percentage(informalBusinessProfiles, totalYouthMapped),
    repairSkillShare: percentage(repairProfiles, totalYouthMapped),
    multilingualShare: percentage(multilingualProfiles, totalYouthMapped),
    digitalSelfLearningShare: percentage(selfLearningProfiles, totalYouthMapped),
    topMissingVerification,
    topOpportunityGap,
    bestShortTrainingROI,
    skillClusters,
    verificationLevels,
    opportunityGaps,
    aiRiskClusters,
    trainingRecommendations,
    demographicBreakdowns: {
      gender: Object.entries(countBy(profiles.map((profile) => profile.profile.gender))).map(([label, count]) => ({
        label,
        count
      })),
      ageGroup: Object.entries(countBy(profiles.map((profile) => ageGroup(profile.profile.age)))).map(([label, count]) => ({
        label,
        count
      })),
      region: Object.entries(countBy(profiles.map((profile) => profile.profile.regionType))).map(([label, count]) => ({
        label,
        count
      }))
    }
  };
}
