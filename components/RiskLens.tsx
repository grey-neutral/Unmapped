import type { AIRiskResult } from "@/lib/types";

const levelClasses = {
  Low: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-rose-100 text-rose-700"
} as const;

export function RiskLens({ items }: { items: AIRiskResult[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.targetId} className="rounded-[1.5rem] border border-line bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-[var(--font-heading)] text-xl font-bold tracking-tight text-ink">{item.targetTitle}</h3>
            <span className={`signal-badge ${levelClasses[item.exposureLevel]}`}>{item.exposureLevel} exposure</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/75">
            <span className="font-semibold text-ink">Score:</span> {(item.exposureScore * 100).toFixed(0)}%
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/75">{item.explanation}</p>
          <div className="mt-4 rounded-[1.25rem] bg-canvas p-4 text-sm text-ink/75">
            <p><span className="font-semibold text-ink">Durable value:</span> {item.durableSkills.join(" · ")}</p>
            <p className="mt-2"><span className="font-semibold text-ink">Risk reason:</span> {item.vulnerableTasks.join(" · ")}</p>
            <p className="mt-2"><span className="font-semibold text-ink">Resilience step:</span> {item.resilienceRecommendations[0]}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
