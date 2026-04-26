import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import type { EnrichedSkillSignal, Evidence } from "@/lib/types";

export function SkillCard({
  skill,
  evidenceLookup
}: {
  skill: EnrichedSkillSignal;
  evidenceLookup: Record<string, Evidence>;
}) {
  const provenance = skill.evidenceIds
    .map((evidenceId) => evidenceLookup[evidenceId])
    .filter((evidence): evidence is Evidence => Boolean(evidence));

  return (
    <article className="rounded-[1.5rem] border border-line bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="signal-badge bg-mist text-teal">{skill.category}</span>
        <ConfidenceBadge confidence={skill.confidence} />
        <span className="signal-badge bg-slate-100 text-slate-700">{skill.verificationStatus}</span>
      </div>
      <h3 className="mt-4 font-[var(--font-heading)] text-xl font-bold tracking-tight text-ink">{skill.label}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/75">{skill.explanation}</p>

      <div className="mt-4 rounded-[1.25rem] bg-warm p-4 text-sm text-ink/75">
        <p className="font-semibold text-ink">What this came from</p>
        <div className="mt-3 grid gap-2">
          {provenance.map((evidence) => (
            <p key={evidence.id}>
              <span className="font-medium text-ink">{evidence.statement}</span> ({evidence.source}, {evidence.confidence})
            </p>
          ))}
        </div>
      </div>

      {skill.taxonomy ? (
        <div className="mt-4 grid gap-3 rounded-[1.25rem] bg-canvas p-4 text-sm text-ink/75">
          <p>
            <span className="font-semibold text-ink">ESCO match:</span> {skill.taxonomy.escoMatch.label} (
            {skill.taxonomy.escoMatch.id})
          </p>
          <p>
            <span className="font-semibold text-ink">ISCO candidates:</span>{" "}
            {skill.taxonomy.iscoOccupationCandidates.map((candidate) => `${candidate.code} ${candidate.title}`).join(" · ")}
          </p>
          <p>
            <span className="font-semibold text-ink">O*NET cluster:</span> {skill.taxonomy.onetTaskClusters.join(" · ")}
          </p>
          <p>
            <span className="font-semibold text-ink">Confidence:</span>{" "}
            {(skill.taxonomy.confidence * 100).toFixed(0)}%
          </p>
          <p>
            <span className="font-semibold text-ink">Explanation:</span> {skill.taxonomy.explanation}
          </p>
        </div>
      ) : null}

      <div className="mt-4">
        <p className="text-sm font-semibold text-ink">Where this could lead</p>
        <p className="mt-2 text-sm leading-6 text-ink/75">{skill.adjacentPathways.join(" · ")}</p>
      </div>
    </article>
  );
}
