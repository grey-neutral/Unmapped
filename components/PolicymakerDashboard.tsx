import { ConfigDebugger } from "@/components/ConfigDebugger";
import { SectionCard } from "@/components/SectionCard";
import type { AggregatedPolicySignals, CountryConfig } from "@/lib/types";

export function PolicymakerDashboard({
  config,
  aggregate,
  econometricSignals
}: {
  config: CountryConfig;
  aggregate: AggregatedPolicySignals;
  econometricSignals: Array<{ title: string; value: string; description: string; source: string }>;
}) {
  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Dashboard Summary"
        title={`${config.countryName} hidden skills map`}
        description="Aggregate, anonymized labor-market signals based on sample youth profiles and deterministic mapping logic."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[1.5rem] border border-line bg-canvas p-4">
            <p className="text-sm text-ink/70">Youth mapped</p>
            <p className="mt-2 font-[var(--font-heading)] text-3xl font-bold">{aggregate.totalYouthMapped}</p>
          </article>
          <article className="rounded-[1.5rem] border border-line bg-canvas p-4">
            <p className="text-sm text-ink/70">Informal business experience</p>
            <p className="mt-2 font-[var(--font-heading)] text-3xl font-bold">{aggregate.informalBusinessShare}%</p>
          </article>
          <article className="rounded-[1.5rem] border border-line bg-canvas p-4">
            <p className="text-sm text-ink/70">Repair or technical skills</p>
            <p className="mt-2 font-[var(--font-heading)] text-3xl font-bold">{aggregate.repairSkillShare}%</p>
          </article>
          <article className="rounded-[1.5rem] border border-line bg-canvas p-4">
            <p className="text-sm text-ink/70">Multilingual youth</p>
            <p className="mt-2 font-[var(--font-heading)] text-3xl font-bold">{aggregate.multilingualShare}%</p>
          </article>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Econometric Signals"
        title="Labor-market context"
        description="Visible country signals are shown directly instead of being buried in the scoring logic."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {econometricSignals.map((signal) => (
            <article key={signal.title} className="rounded-[1.5rem] border border-line bg-white p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal">{signal.title}</p>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-bold tracking-tight text-ink">{signal.value}</p>
              <p className="mt-2 text-sm leading-6 text-ink/75">{signal.description}</p>
              <p className="mt-2 text-xs text-ink/55">Source: {signal.source}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <SectionCard
          eyebrow="Skill Clusters"
          title="Hidden skills signals"
          description="Where non-formal experience is most concentrated."
        >
          <div className="grid gap-3">
            {aggregate.skillClusters.map((cluster) => (
              <article key={cluster.label} className="rounded-[1.25rem] border border-line bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{cluster.label}</p>
                  <span className="signal-badge bg-mist text-teal">{cluster.percentage}%</span>
                </div>
                <p className="mt-2 text-sm text-ink/70">{cluster.count} of {aggregate.totalYouthMapped} mapped youth.</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Verification Funnel"
          title="Where proof is weakest"
          description="Visible bottlenecks that keep real skills from traveling."
        >
          <div className="grid gap-3">
            {aggregate.verificationLevels.map((level) => (
              <article key={level.label} className="rounded-[1.25rem] border border-line bg-white p-4">
                <p className="font-semibold capitalize text-ink">{level.label}</p>
                <p className="mt-2 text-sm text-ink/70">{level.count} skill signals</p>
              </article>
            ))}
            <article className="rounded-[1.25rem] border border-line bg-warm p-4 text-sm text-ink/75">
              <span className="font-semibold text-ink">Top missing verification:</span> {aggregate.topMissingVerification}
            </article>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          eyebrow="Opportunity Gaps"
          title="Bridge skills still missing"
          description="Short gaps blocking otherwise realistic transitions."
        >
          <div className="grid gap-3">
            {aggregate.opportunityGaps.map((gap) => (
              <article key={gap.label} className="rounded-[1.25rem] border border-line bg-white p-4 text-sm text-ink/75">
                <span className="font-semibold text-ink">{gap.label}</span>: {gap.count} top-match appearances
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="AI Risk"
          title="AI exposure by skill cluster"
          description="Local task exposure after infrastructure and informality calibration."
        >
          <div className="grid gap-3">
            {aggregate.aiRiskClusters.map((cluster) => (
              <article key={cluster.label} className="rounded-[1.25rem] border border-line bg-white p-4 text-sm text-ink/75">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-ink">{cluster.label}</span>
                  <span className="signal-badge bg-slate-100 text-slate-700">{cluster.share}%</span>
                </div>
                <p className="mt-2">{cluster.explanation}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Training ROI"
          title="Best short-training bridges"
          description="Frequent next steps with high leverage."
        >
          <div className="grid gap-3">
            {aggregate.trainingRecommendations.map((recommendation) => (
              <article key={recommendation.label} className="rounded-[1.25rem] border border-line bg-white p-4 text-sm text-ink/75">
                <p className="font-semibold text-ink">{recommendation.label}</p>
                <p className="mt-2">{recommendation.count} mentions. {recommendation.reason}</p>
              </article>
            ))}
            <article className="rounded-[1.25rem] border border-line bg-mist p-4 text-sm text-ink/75">
              <span className="font-semibold text-ink">Best short-training ROI:</span> {aggregate.bestShortTrainingROI}
            </article>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        eyebrow="Demographics"
        title="Anonymized breakdowns"
        description="Only aggregate views are shown. No personally identifiable information is displayed."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(aggregate.demographicBreakdowns).map(([key, values]) => (
            <article key={key} className="rounded-[1.25rem] border border-line bg-white p-4">
              <p className="font-semibold capitalize text-ink">{key}</p>
              <div className="mt-3 grid gap-2 text-sm text-ink/75">
                {values.map((value) => (
                  <p key={value.label}>
                    <span className="font-medium text-ink">{value.label}</span>: {value.count}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <ConfigDebugger config={config} />
    </div>
  );
}
