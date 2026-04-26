import { escoSkills, iscoOccupations } from "@/lib/dataSources";
import type { SkillSignal, TaxonomyMatch } from "@/lib/types";

const confidenceScores = {
  low: 0.58,
  medium: 0.72,
  high: 0.86,
  verified: 0.94
} as const;

export function mapSkillsToTaxonomies(skills: SkillSignal[]): TaxonomyMatch[] {
  const matches: TaxonomyMatch[] = [];

  for (const skill of skills) {
    const esco = escoSkills.find((item) => item.skillId === skill.skillId);
    if (!esco) {
      continue;
    }

    matches.push({
      skillId: skill.skillId,
      escoMatch: {
        id: esco.escoId,
        label: esco.escoLabel
      },
      iscoOccupationCandidates: esco.relatedOccupations
        .map((code) => iscoOccupations.find((occupation) => occupation.code === code))
        .filter((occupation): occupation is (typeof iscoOccupations)[number] => Boolean(occupation))
        .map((occupation) => ({ code: occupation.code, title: occupation.title })),
      onetTaskClusters: esco.onetTaskClusters,
      confidence: confidenceScores[skill.confidence],
      explanation: `${skill.label} is mapped through the local sample taxonomy to show how informal evidence can be translated into recognizable occupational language.`
    });
  }

  return matches;
}
