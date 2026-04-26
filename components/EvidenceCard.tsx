import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import type { Evidence } from "@/lib/types";

export function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-canvas p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="signal-badge bg-white text-teal">Evidence</span>
        <span className="signal-badge bg-white text-ink/70">{evidence.source}</span>
        <ConfidenceBadge confidence={evidence.confidence} />
      </div>
      <p className="mt-4 text-base font-semibold text-ink">{evidence.statement}</p>
      <p className="mt-3 text-sm leading-6 text-ink/75">
        <span className="font-semibold text-ink">Why this matters:</span> {evidence.whyItMatters}
      </p>
      {evidence.verificationPrompt ? (
        <p className="mt-3 rounded-2xl bg-white px-3 py-3 text-sm leading-6 text-ink/75">
          <span className="font-semibold text-ink">How to make it stronger:</span> {evidence.verificationPrompt}
        </p>
      ) : null}
    </article>
  );
}
