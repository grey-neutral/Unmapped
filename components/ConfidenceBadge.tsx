import type { ConfidenceLevel } from "@/lib/types";

const confidenceClasses: Record<ConfidenceLevel, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-emerald-100 text-emerald-700",
  verified: "bg-sky-100 text-sky-700"
};

export function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
  return <span className={`signal-badge ${confidenceClasses[confidence]}`}>{confidence.replace("-", " ")}</span>;
}
