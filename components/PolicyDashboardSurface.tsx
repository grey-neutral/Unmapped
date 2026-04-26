"use client";

import { useMemo, useState } from "react";

import {
  aggregatePolicySignals,
  type PolicyContext,
  type PolicyCountryCode,
  type PolicyGender,
  type SkillCluster
} from "@/lib/policyMock";

const contextOptions: PolicyContext[] = ["Urban", "Rural", "Informal economy"];
const genderOptions: PolicyGender[] = ["All", "Women", "Men"];

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function chipClasses(active: boolean) {
  return active ? "bg-teal text-white shadow-sm" : "bg-slate-100 text-ink";
}

function toneBadge(tone: "green" | "yellow" | "red") {
  if (tone === "green") return "bg-emerald-100 text-emerald-700";
  if (tone === "yellow") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function toneFill(tone: "green" | "yellow" | "red" | "blue" | "slate") {
  if (tone === "green") return "bg-emerald-500";
  if (tone === "yellow") return "bg-amber-400";
  if (tone === "red") return "bg-rose-500";
  if (tone === "blue") return "bg-sky-500";
  return "bg-slate-300";
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function clusterTone(cluster: SkillCluster) {
  if (cluster === "Repair & Technical") return "green" as const;
  if (cluster === "Customer Service") return "yellow" as const;
  if (cluster === "Sales & Retail") return "yellow" as const;
  if (cluster === "Languages") return "blue" as const;
  if (cluster === "Digital Basics") return "green" as const;
  if (cluster === "Agriculture") return "green" as const;
  if (cluster === "Care Work") return "green" as const;
  return "red" as const;
}

function MapCountryButton({
  active,
  flag,
  label,
  code,
  tone,
  onClick
}: {
  active: boolean;
  flag: string;
  label: string;
  code: string;
  tone: "green" | "yellow" | "red";
  onClick: () => void;
}) {
  const toneClasses =
    tone === "green"
      ? "bg-emerald-50 border-emerald-300"
      : tone === "yellow"
        ? "bg-amber-50 border-amber-300"
        : "bg-rose-50 border-rose-300";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-testid={`map-country-${code}`}
      className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg shadow-sm transition ${
        active ? "scale-105 border-teal bg-teal/10" : toneClasses
      }`}
    >
      {flag}
    </button>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] bg-slate-50 p-4 sm:p-5">
      <div className="text-sm font-semibold text-ink">{title}</div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function PolicyDashboardSurface({ onBack }: { onBack?: () => void }) {
  const [country, setCountry] = useState<PolicyCountryCode>("GH");
  const [context, setContext] = useState<PolicyContext>("Informal economy");
  const [gender, setGender] = useState<PolicyGender>("All");
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);

  const data = aggregatePolicySignals({ country, context, gender });
  const selectedMapCountry = useMemo(
    () => data.mapCountries.find((item) => item.code === country) ?? data.mapCountries[0],
    [country, data.mapCountries]
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1080px] px-4 py-6">
      <div className="rounded-[32px] bg-white p-4 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-ink"
                  aria-label="Back"
                >
                  <BackIcon />
                </button>
              ) : null}
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">UNMAPPED</div>
                <h1 className="mt-1 font-[var(--font-heading)] text-2xl font-bold tracking-tight text-ink">
                  UNMAPPED Dashboard
                </h1>
              </div>
            </div>

            <div className="grid gap-3 lg:min-w-[520px] lg:grid-cols-[220px_1fr]">
              <div className="relative rounded-[24px] bg-slate-50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">Country</div>
                <button
                  type="button"
                  onClick={() => setCountryMenuOpen((current) => !current)}
                  aria-label="Country"
                  data-testid="country-selector"
                  className="mt-2 flex h-11 w-full items-center justify-between rounded-2xl bg-white px-3 text-sm font-semibold text-ink"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="text-lg">{data.selectedCountry.flag}</span>
                    {data.selectedCountry.name}
                  </span>
                  <span className="text-ink/50">▾</span>
                </button>

                {countryMenuOpen ? (
                  <div className="absolute left-0 right-0 top-[88px] z-30 rounded-[24px] border border-line bg-white p-3 shadow-soft">
                    <div className="grid max-h-80 gap-2 overflow-auto sm:grid-cols-2">
                      {data.countries.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setCountry(item.code);
                            setCountryMenuOpen(false);
                          }}
                          data-testid={`country-option-${item.code}`}
                          className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm ${
                            country === item.code ? "bg-slate-100 font-semibold text-ink" : "text-ink"
                          }`}
                        >
                          <span className="text-lg">{item.flag}</span>
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-[24px] bg-slate-50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">Context</div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {contextOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setContext(option)}
                      data-testid={`context-${slugify(option)}`}
                      className={`rounded-2xl px-3 py-3 text-xs font-semibold sm:text-sm ${chipClasses(
                        context === option
                      )}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-[24px] bg-slate-50 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">Gender</div>
            {genderOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGender(option)}
                data-testid={`gender-${slugify(option)}`}
                className={`rounded-full px-4 py-2 text-xs font-semibold sm:text-sm ${chipClasses(gender === option)}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5">
          <Section title="World risk map">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[24px] bg-white p-4 shadow-sm">
                <div className="overflow-x-auto">
                  <div className="grid min-w-[640px] grid-cols-12 gap-2">
                    {data.mapCountries.map((item) => (
                      <div
                        key={item.code}
                        className="flex justify-center"
                        style={{ gridColumn: item.mapCol, gridRow: item.mapRow }}
                      >
                        <MapCountryButton
                          active={item.code === country}
                          flag={item.flag}
                          label={item.name}
                          code={item.code}
                          tone={item.tone}
                          onClick={() => {
                            setCountry(item.code);
                            setCountryMenuOpen(false);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { tone: "green" as const, label: "Lower" },
                    { tone: "yellow" as const, label: "Medium" },
                    { tone: "red" as const, label: "Higher" }
                  ].map((item) => (
                    <div key={item.label} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-ink">
                      <span className={`h-2.5 w-2.5 rounded-full ${toneFill(item.tone)}`} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] bg-white p-4 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-ink">
                  <span className="text-lg">{selectedMapCountry.flag}</span>
                  {selectedMapCountry.name}
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-ink">{selectedMapCountry.score}</div>
                <div className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70 bg-slate-100">
                  {selectedMapCountry.label}
                </div>
                <div className="mt-4 text-sm font-semibold text-ink">{selectedMapCountry.gap}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">Top opportunity gap</div>
              </div>
            </div>
          </Section>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[24px] bg-slate-50 p-4" data-testid="policy-metric-card">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">{metric.label}</div>
                  <div className={`rounded-full px-2 py-1 text-xs font-semibold ${toneBadge(metric.tone)}`}>{metric.trend}</div>
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight text-ink">{metric.value}</div>
              </div>
            ))}
          </div>

          <Section title="What skills exist">
            <div className="space-y-4">
              {data.clusterCounts.map((row) => (
                <div key={row.cluster}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-ink">{row.cluster}</div>
                    <div className="text-sm font-semibold text-ink/65">{row.relative}%</div>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-white">
                    <div
                      className={`h-3 rounded-full ${toneFill(clusterTone(row.cluster))}`}
                      style={{ width: `${row.relative}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Where signals are weak">
            <div className="flex flex-wrap gap-2">
              <div className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">inferred</div>
              <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">verified</div>
            </div>
            <div className="mt-4 space-y-4">
              {data.verificationRows.map((row) => (
                <div key={row.cluster}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-ink">{row.cluster}</div>
                    <div className="text-xs font-semibold text-ink/55">{row.verifiedWidth}% verified</div>
                  </div>
                  <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-white">
                    <div className={`h-3 ${toneFill("slate")}`} style={{ width: `${row.inferredWidth}%` }} />
                    <div className={`h-3 ${toneFill("blue")}`} style={{ width: `${row.verifiedWidth}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="AI exposure">
            <div className="grid gap-4 lg:grid-cols-[0.45fr_0.55fr]">
              <div className="rounded-[24px] bg-white p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">Country AI exposure score</div>
                <div className="mt-3 text-4xl font-bold tracking-tight text-ink">{data.aiOverview.score}</div>
                <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneBadge(data.aiOverview.score >= 65 ? "red" : data.aiOverview.score >= 48 ? "yellow" : "green")}`}>
                  {data.aiOverview.label}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-ink">Top exposed skills</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.aiOverview.exposed.map((item) => (
                      <div key={item} className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-ink">Most resilient skills</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.aiOverview.resilient.map((item) => (
                      <div key={item} className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Key insights">
            <div className="grid gap-3 lg:grid-cols-3">
              {data.insights.map((insight) => (
                <div key={insight.title} className="rounded-[24px] bg-white p-4 shadow-sm">
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneBadge(insight.tone)}`}>
                    {insight.signal}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-ink">{insight.title}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
