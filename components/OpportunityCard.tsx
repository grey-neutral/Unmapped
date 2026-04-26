import type { OpportunityMatch } from "@/lib/types";

function percentage(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function OpportunityCard({ opportunity }: { opportunity: OpportunityMatch }) {
  return (
    <article className="rounded-[1.5rem] border border-line bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="signal-badge bg-mist text-teal">{opportunity.type.replaceAll("_", " ")}</span>
        <span className="signal-badge bg-slate-100 text-slate-700">ISCO {opportunity.iscoCode}</span>
        <span className="signal-badge bg-ocean/10 text-ocean">Fit {percentage(opportunity.skillFit)}</span>
      </div>
      <h3 className="mt-4 font-[var(--font-heading)] text-xl font-bold tracking-tight text-ink">{opportunity.title}</h3>
      <p className="mt-3 text-sm leading-6 text-ink/75">{opportunity.whyRealistic}</p>

      <div className="mt-4 grid gap-3 rounded-[1.25rem] bg-canvas p-4 text-sm text-ink/75 sm:grid-cols-2">
        <p><span className="font-semibold text-ink">Skill fit score:</span> {percentage(opportunity.skillFit)}</p>
        <p><span className="font-semibold text-ink">Local demand signal:</span> {percentage(opportunity.demandSignal)}</p>
        <p><span className="font-semibold text-ink">Wage proxy:</span> {percentage(opportunity.wageSignal)}</p>
        <p><span className="font-semibold text-ink">AI resilience:</span> {percentage(opportunity.aiResilience)}</p>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-ink/75">
        <p><span className="font-semibold text-ink">Missing skill gap:</span> {opportunity.trainingGap}</p>
        <p><span className="font-semibold text-ink">Next step:</span> {opportunity.nextStep}</p>
        <p><span className="font-semibold text-ink">Why this match is realistic:</span> {opportunity.explanation}</p>
        <p><span className="font-semibold text-ink">Score explanation:</span> Opportunity score = 30% skill fit + 20% demand + 15% wage + 15% small training gap + 10% verification + 10% AI resilience.</p>
        <p><span className="font-semibold text-ink">Sources:</span> {opportunity.sourceLabels.join(" · ")}</p>
      </div>
    </article>
  );
}
