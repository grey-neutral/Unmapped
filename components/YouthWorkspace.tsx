"use client";

import { useState } from "react";

import { ConfigDebugger } from "@/components/ConfigDebugger";
import { CountrySwitcher } from "@/components/CountrySwitcher";
import { EvidenceCard } from "@/components/EvidenceCard";
import { OpportunityCard } from "@/components/OpportunityCard";
import { RiskLens } from "@/components/RiskLens";
import { SectionCard } from "@/components/SectionCard";
import { SkillCard } from "@/components/SkillCard";
import { SkillPassport } from "@/components/SkillPassport";
import { buildProfileAnalysis, getProfileById } from "@/lib/demoEngine";
import { getEducationOptions } from "@/lib/display";
import { loadCountryConfig } from "@/lib/loadCountryConfig";
import type { CandidateProfile, CountryCode, Evidence, GuidedAnswers } from "@/lib/types";

const baseProfile = getProfileById("amara") as CandidateProfile;

const promptLabels: Array<{ key: keyof GuidedAnswers; label: string }> = [
  { key: "soldOrRunBusiness", label: "Have you sold things or run a small business?" },
  { key: "repairedDevices", label: "Have you repaired devices, machines, bikes, solar panels, or appliances?" },
  { key: "careOrCustomers", label: "Have you cared for people or supported customers?" },
  { key: "usedDigitalTools", label: "Have you used a phone or computer for work?" },
  { key: "learnedOnline", label: "Have you learned anything online?" },
  { key: "trainedOthers", label: "Have you trained someone else?" },
  { key: "handledMoney", label: "Have you handled money, inventory, or supplies?" }
];

const progressSteps = ["1 Context", "2 Evidence", "3 Skills", "4 Risk", "5 Opportunities"];

export function YouthWorkspace({ initialMode = "youth" }: { initialMode?: "youth" | "navigator" }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(baseProfile.countryCode);
  const [entryMode, setEntryMode] = useState<"youth" | "navigator">(initialMode);
  const [regionType, setRegionType] = useState(baseProfile.regionType);
  const [preferredLanguage, setPreferredLanguage] = useState(baseProfile.preferredLanguage);
  const [deviceAccess, setDeviceAccess] = useState(baseProfile.deviceAccess);
  const [lookingFor, setLookingFor] = useState(baseProfile.lookingFor);
  const [education, setEducation] = useState(baseProfile.education);
  const [guidedAnswers, setGuidedAnswers] = useState<GuidedAnswers>(baseProfile.guidedAnswers);
  const [experienceText, setExperienceText] = useState(baseProfile.experienceText);

  const config = loadCountryConfig(selectedCountry);
  const currentProfile: CandidateProfile = {
    ...baseProfile,
    countryCode: selectedCountry,
    regionType,
    preferredLanguage,
    deviceAccess,
    lookingFor,
    education,
    guidedAnswers,
    experienceText
  };

  const analysis = buildProfileAnalysis(currentProfile, selectedCountry);
  const educationOptions = getEducationOptions(config);
  const evidenceLookup = Object.fromEntries(analysis.evidence.map((item) => [item.id, item])) as Record<string, Evidence>;
  const verificationTasks = analysis.evidence
    .filter((item) => item.verificationPrompt)
    .slice(0, 4)
    .map((item) => {
      if (item.type === "repair_technical") {
        return {
          id: item.id,
          title: "Phone diagnostics",
          prompt: "Customer says the phone does not charge. List three likely causes and what you would test first.",
          rubric: ["Beginner", "Working knowledge", "Strong", "Verified"]
        };
      }
      if (item.type === "customer_service") {
        return {
          id: item.id,
          title: "Customer service",
          prompt: "Write or say how you would explain a delayed repair without losing the customer's trust.",
          rubric: ["Beginner", "Working knowledge", "Strong", "Verified"]
        };
      }
      if (item.type === "multilingual") {
        return {
          id: item.id,
          title: "Language evidence",
          prompt: "Record a 30-second explanation in two languages about the same work task.",
          rubric: ["Beginner", "Working knowledge", "Strong", "Verified"]
        };
      }
      return {
        id: item.id,
        title: "Digital skill check",
        prompt: "Complete a basic form or simple workflow logic task and explain what you are doing.",
        rubric: ["Beginner", "Working knowledge", "Strong", "Verified"]
      };
    });

  function handleCountryChange(countryCode: CountryCode) {
    const nextConfig = loadCountryConfig(countryCode);
    setSelectedCountry(countryCode);
    setPreferredLanguage(nextConfig.defaultLanguage);
    setEducation((current) => ({
      ...current,
      localCertificateName:
        current.highestCompleted === "secondary_certificate"
          ? nextConfig.secondaryCredentialName
          : current.localCertificateName
    }));
  }

  function resetToAmara() {
    setSelectedCountry(baseProfile.countryCode);
    setRegionType(baseProfile.regionType);
    setPreferredLanguage(baseProfile.preferredLanguage);
    setDeviceAccess(baseProfile.deviceAccess);
    setLookingFor(baseProfile.lookingFor);
    setEducation(baseProfile.education);
    setGuidedAnswers(baseProfile.guidedAnswers);
    setExperienceText(baseProfile.experienceText);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">Youth App</p>
            <h1 className="mt-3 font-[var(--font-heading)] text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Your skills may be real even if they are not on a certificate.
            </h1>
            <p className="mt-4 text-base leading-7 text-ink/80">
              UNMAPPED helps turn what you have done into a portable skills profile with evidence,
              explainability, realistic opportunities, and a future-readiness lens.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={resetToAmara}
              className="rounded-2xl bg-teal px-5 py-4 text-sm font-semibold text-white transition hover:bg-ocean"
            >
              Load Amara example
            </button>
            <button
              type="button"
              onClick={() => setEntryMode("navigator")}
              className="rounded-2xl border border-line bg-canvas px-5 py-4 text-sm font-semibold text-ink"
            >
              Continue with community navigator
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {progressSteps.map((step) => (
            <span key={step} className="signal-badge bg-canvas text-ink/80">
              {step}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <div className="space-y-6">
          {entryMode === "navigator" ? (
            <SectionCard
              eyebrow="Navigator Mode"
              title="Assisted entry and proof capture"
              description="Community navigators can help translate informal work, upload proof later, and guide short verification tasks."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-[1.5rem] border border-line bg-canvas p-4 text-sm leading-6 text-ink/75">
                  <p className="font-semibold text-ink">Navigator checklist</p>
                  <p className="mt-3">Confirm identity and context, capture local certificate name, and note any missing proof.</p>
                  <p className="mt-2">Use guided prompts to translate hidden work into plain evidence statements.</p>
                </article>
                <article className="rounded-[1.5rem] border border-line bg-white p-4 text-sm leading-6 text-ink/75">
                  <p className="font-semibold text-ink">Proof capture controls</p>
                  <p className="mt-3">Certificate photo upload: demo-ready later</p>
                  <p>Navigator verification note: demo-ready later</p>
                  <button
                    type="button"
                    onClick={() => setEntryMode("youth")}
                    className="mt-4 rounded-2xl border border-line bg-canvas px-4 py-3 font-semibold text-ink"
                  >
                    Return to youth-only view
                  </button>
                </article>
              </div>
            </SectionCard>
          ) : null}

          <SectionCard
            eyebrow="Step 1"
            title="Context"
            description="Choose the local context, device reality, and opportunity goal before translating skills."
          >
            <div className="space-y-4">
              <CountrySwitcher value={selectedCountry} onChange={handleCountryChange} />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Region or city type
                  <select
                    value={regionType}
                    onChange={(event) => setRegionType(event.target.value as CandidateProfile["regionType"])}
                    className="rounded-2xl border border-line bg-white px-4 py-3 text-ink"
                  >
                    {config.regionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  {config.language.youthLabel}
                  <select
                    value={preferredLanguage}
                    onChange={(event) => setPreferredLanguage(event.target.value)}
                    className="rounded-2xl border border-line bg-white px-4 py-3 text-ink"
                  >
                    {config.language.supportedLanguages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Device access
                  <select
                    value={deviceAccess}
                    onChange={(event) => setDeviceAccess(event.target.value as CandidateProfile["deviceAccess"])}
                    className="rounded-2xl border border-line bg-white px-4 py-3 text-ink"
                  >
                    <option value="own_phone">Own phone</option>
                    <option value="shared_phone">Shared phone</option>
                    <option value="no_regular_internet">No regular internet</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Looking for
                  <select
                    value={lookingFor}
                    onChange={(event) => setLookingFor(event.target.value as CandidateProfile["lookingFor"])}
                    className="rounded-2xl border border-line bg-white px-4 py-3 text-ink"
                  >
                    <option value="job">Job</option>
                    <option value="training">Training</option>
                    <option value="self_employment">Self-employment</option>
                    <option value="apprenticeship">Apprenticeship</option>
                    <option value="not_sure">Not sure</option>
                  </select>
                </label>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Step 2"
            title="Education"
            description="Schooling is treated as a baseline capability signal, not proof of job readiness."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Highest education completed
                <select
                  value={education.highestCompleted}
                  onChange={(event) =>
                    setEducation((current) => ({ ...current, highestCompleted: event.target.value }))
                  }
                  className="rounded-2xl border border-line bg-white px-4 py-3 text-ink"
                >
                  {educationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Local certificate name
                <input
                  value={education.localCertificateName}
                  onChange={(event) =>
                    setEducation((current) => ({ ...current, localCertificateName: event.target.value }))
                  }
                  className="rounded-2xl border border-line bg-white px-4 py-3 text-ink"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Year completed
                <input
                  type="number"
                  value={education.yearCompleted}
                  onChange={(event) =>
                    setEducation((current) => ({ ...current, yearCompleted: Number(event.target.value) }))
                  }
                  className="rounded-2xl border border-line bg-white px-4 py-3 text-ink"
                />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4 py-3 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={education.hasProof}
                  onChange={(event) =>
                    setEducation((current) => ({ ...current, hasProof: event.target.checked }))
                  }
                />
                Upload or confirm proof later
              </label>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Step 3"
            title="Experience"
            description="Use guided prompts, free text, or a voice placeholder to capture informal work and learning."
          >
            <div className="space-y-4">
              <div className="grid gap-3">
                {promptLabels.map((prompt) => (
                  <label
                    key={prompt.key}
                    className="flex items-start gap-3 rounded-2xl border border-line bg-canvas px-4 py-3 text-sm text-ink"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(guidedAnswers[prompt.key])}
                      onChange={(event) =>
                        setGuidedAnswers((current) => ({ ...current, [prompt.key]: event.target.checked }))
                      }
                    />
                    <span>{prompt.label}</span>
                  </label>
                ))}
              </div>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Languages used
                <input
                  value={guidedAnswers.languages.join(", ")}
                  onChange={(event) =>
                    setGuidedAnswers((current) => ({
                      ...current,
                      languages: event.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                    }))
                  }
                  className="rounded-2xl border border-line bg-white px-4 py-3 text-ink"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Free text experience
                <textarea
                  value={experienceText}
                  onChange={(event) => setExperienceText(event.target.value)}
                  rows={7}
                  className="rounded-[1.5rem] border border-line bg-white px-4 py-3 text-ink"
                />
              </label>

              <button
                type="button"
                className="rounded-2xl border border-dashed border-line bg-white px-4 py-4 text-sm font-semibold text-ink/75"
              >
                Voice placeholder: record evidence sample
              </button>
            </div>
          </SectionCard>

          <ConfigDebugger config={analysis.countryConfig} />
        </div>

        <div className="space-y-6">
          <SectionCard
            eyebrow="Step 4"
            title="Evidence review"
            description="What you told us becomes evidence cards with source labels, confidence, and an explanation."
          >
            <div className="grid gap-4">
              {analysis.evidence.map((item) => (
                <EvidenceCard key={item.id} evidence={item} />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Step 5"
            title="Skills passport"
            description="Direct skills are mapped from evidence, then translated into standardized reference language."
          >
            <SkillPassport sections={analysis.passportSections} />
            <div className="mt-6 grid gap-4">
              {analysis.skills.map((skill) => (
                <SkillCard key={skill.skillId} skill={skill} evidenceLookup={evidenceLookup} />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Verification"
            title="Make key skills stronger"
            description="Use short, transparent micro-assessments to move from self-declared evidence toward demonstrated or verified signals."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {verificationTasks.map((task) => (
                <article key={task.id} className="rounded-[1.5rem] border border-line bg-canvas p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">{task.title}</p>
                  <p className="mt-3 text-sm leading-6 text-ink/75">{task.prompt}</p>
                  <div className="mt-4 rounded-[1.25rem] bg-white p-4 text-sm text-ink/75">
                    <p className="font-semibold text-ink">Transparent rubric</p>
                    <p className="mt-2">{task.rubric.join(" -> ")}</p>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Step 6"
            title="AI readiness lens"
            description="Which of your skills are future-resilient? This is a risk lens based on task exposure and local context, not a prediction."
          >
            <RiskLens items={analysis.aiReadiness} />
          </SectionCard>

          <SectionCard
            eyebrow="Step 7"
            title="Opportunity matches"
            description="Realistic roles are ranked by skill fit, local demand, wage signal, training gap, proof strength, and AI resilience."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.econometricSignals.map((signal) => (
                <article key={signal.title} className="rounded-[1.5rem] border border-line bg-canvas p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal">{signal.title}</p>
                  <p className="mt-3 font-[var(--font-heading)] text-3xl font-bold tracking-tight text-ink">
                    {signal.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/75">{signal.description}</p>
                  <p className="mt-2 text-xs text-ink/55">Source: {signal.source}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-4">
              {analysis.opportunities.slice(0, 6).map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Step 8"
            title="Share and export"
            description="A low-bandwidth portable profile keeps the explanation attached to the signal."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.5rem] border border-line bg-canvas p-4 text-sm leading-6 text-ink/75">
                <p className="font-semibold text-ink">Portable summary</p>
                <p className="mt-3">
                  You have strong evidence of practical repair and customer-facing skills. Your phone
                  repair experience may be useful in electronics repair, technical sales, field service,
                  and device support roles.
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-line bg-white p-4 text-sm leading-6 text-ink/75">
                <p className="font-semibold text-ink">Export options</p>
                <p className="mt-3">Download passport PDF (demo)</p>
                <p>Share profile link with consent (demo)</p>
                <p>Navigator print-friendly version (demo)</p>
              </article>
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
