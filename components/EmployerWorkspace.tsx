"use client";

import { useState } from "react";

import { ConfigDebugger } from "@/components/ConfigDebugger";
import { CountrySwitcher } from "@/components/CountrySwitcher";
import { SectionCard } from "@/components/SectionCard";
import { getProcessedProfiles } from "@/lib/demoEngine";
import {
  getEducationOptions,
  getPrimarySkillCluster,
  hasSkillCluster,
  hasVerificationStatus,
  trainingGapLevel
} from "@/lib/display";
import { loadCountryConfig } from "@/lib/loadCountryConfig";
import type { CountryCode, ProfileAnalysis } from "@/lib/types";

function strongestVerification(profile: ProfileAnalysis) {
  return profile.skills.find((skill) => skill.verificationStatus === "verified")
    ? "verified"
    : profile.skills.find((skill) => skill.verificationStatus === "demonstrated")
      ? "demonstrated"
      : profile.skills.find((skill) => skill.verificationStatus === "self-declared")
        ? "self-declared"
        : "inferred";
}

export function EmployerWorkspace() {
  const [country, setCountry] = useState<CountryCode>("GHA");
  const [skillCluster, setSkillCluster] = useState("all");
  const [verificationLevel, setVerificationLevel] = useState("all");
  const [location, setLocation] = useState("all");
  const [language, setLanguage] = useState("all");
  const [educationLevel, setEducationLevel] = useState("all");
  const [opportunityType, setOpportunityType] = useState("all");
  const [trainingGap, setTrainingGap] = useState("all");

  const config = loadCountryConfig(country);
  const educationOptions = getEducationOptions(config);
  const profiles = getProcessedProfiles(country).filter((profile) => {
    const matchingOpportunities = profile.opportunities.filter((opportunity) => {
      return (
        (opportunityType === "all" || opportunity.type === opportunityType) &&
        (trainingGap === "all" || trainingGapLevel(opportunity) === trainingGap)
      );
    });

    return (
      (skillCluster === "all" || hasSkillCluster(profile.skills, skillCluster)) &&
      (verificationLevel === "all" ||
        hasVerificationStatus(
          profile.skills,
          verificationLevel as typeof profile.skills[number]["verificationStatus"]
        )) &&
      (location === "all" || profile.profile.regionType === location) &&
      (language === "all" || profile.profile.languages.includes(language)) &&
      (educationLevel === "all" || profile.profile.education.highestCompleted === educationLevel) &&
      matchingOpportunities.length > 0
    );
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">Employer and Training Provider</p>
        <h1 className="mt-3 font-[var(--font-heading)] text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Search by skill signals, not polished CVs.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink/80">
          Candidate cards are anonymous by default. Evidence level, training gaps, and realistic fit come before contact.
        </p>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr,1.08fr]">
        <div className="space-y-6">
          <SectionCard
            eyebrow="Filters"
            title="Signal search"
            description="Search by skill cluster, proof level, local fit, and training bridge needs."
          >
            <div className="space-y-4">
              <CountrySwitcher value={country} onChange={setCountry} />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Skill cluster
                  <select value={skillCluster} onChange={(event) => setSkillCluster(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                    <option value="all">All</option>
                    <option value="repair">Repair</option>
                    <option value="multilingual">Multilingual</option>
                    <option value="digital">Digital</option>
                    <option value="service">Service</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Verification level
                  <select value={verificationLevel} onChange={(event) => setVerificationLevel(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                    <option value="all">All</option>
                    <option value="self-declared">Self-declared</option>
                    <option value="inferred">Inferred</option>
                    <option value="demonstrated">Demonstrated</option>
                    <option value="verified">Verified</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Location
                  <select value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                    <option value="all">All</option>
                    <option value="urban">Urban</option>
                    <option value="peri-urban">Peri-urban</option>
                    <option value="rural">Rural</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Language
                  <select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                    <option value="all">All</option>
                    {config.language.supportedLanguages.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Education level
                  <select value={educationLevel} onChange={(event) => setEducationLevel(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                    <option value="all">All</option>
                    {educationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Opportunity type
                  <select value={opportunityType} onChange={(event) => setOpportunityType(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                    <option value="all">All</option>
                    <option value="job">Job</option>
                    <option value="training">Training</option>
                    <option value="self_employment">Self-employment</option>
                    <option value="gig">Gig</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Training gap
                  <select value={trainingGap} onChange={(event) => setTrainingGap(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                    <option value="all">All</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                  </select>
                </label>
              </div>
            </div>
          </SectionCard>
          <ConfigDebugger config={config} />
        </div>

        <div className="space-y-6">
          <SectionCard
            eyebrow="Candidate Results"
            title="Anonymous candidate cards"
            description="Contact only happens with candidate consent, after signal and fit review."
          >
            <div className="grid gap-4">
              {profiles.map((profile) => {
                const relevantOpportunities = profile.opportunities.filter((opportunity) => {
                  return (
                    (opportunityType === "all" || opportunity.type === opportunityType) &&
                    (trainingGap === "all" || trainingGapLevel(opportunity) === trainingGap)
                  );
                });
                const topOpportunity = relevantOpportunities[0];
                return (
                  <article key={profile.profile.id} className="rounded-[1.5rem] border border-line bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="signal-badge bg-mist text-teal">{profile.profile.anonymousId}</span>
                      <span className="signal-badge bg-slate-100 text-slate-700">{profile.profile.regionType}</span>
                      <span className="signal-badge bg-canvas text-ink/80">
                        Fit {(topOpportunity.totalScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <h2 className="mt-4 font-[var(--font-heading)] text-2xl font-bold tracking-tight text-ink">
                      Candidate {profile.profile.anonymousId}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-ink/75">
                      <span className="font-semibold text-ink">Primary signal cluster:</span>{" "}
                      {getPrimarySkillCluster(profile.skills)}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-ink/75">
                      <span className="font-semibold text-ink">Top skills:</span>{" "}
                      {profile.skills.slice(0, 4).map((skill) => skill.label).join(" · ")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-ink/75">
                      <span className="font-semibold text-ink">Matched pathways:</span>{" "}
                      {relevantOpportunities.slice(0, 2).map((opportunity) => opportunity.title).join(" · ")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-ink/75">
                      <span className="font-semibold text-ink">Evidence level:</span> {strongestVerification(profile)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-ink/75">
                      <span className="font-semibold text-ink">Missing skill gap:</span> {topOpportunity.trainingGap}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-ink/75">
                      <span className="font-semibold text-ink">Contact:</span>{" "}
                      {profile.profile.consentToContact ? "Candidate consent available for next step." : "Contact only with candidate consent."}
                    </p>
                  </article>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Training Intake"
            title="Suggested assessments and bridge recommendations"
            description="Training providers can see which intake tasks would most efficiently strengthen each profile."
          >
            <div className="grid gap-4">
              {profiles.map((profile) => (
                <article key={`${profile.profile.id}-training`} className="rounded-[1.5rem] border border-line bg-canvas p-4">
                  <p className="font-semibold text-ink">{profile.profile.anonymousId}</p>
                  <p className="mt-2 text-sm text-ink/75">
                    <span className="font-semibold text-ink">Skills needing assessment:</span>{" "}
                    {profile.evidence
                      .filter((item) => item.source !== "verified" && item.verificationPrompt)
                      .slice(0, 2)
                      .map((item) => item.statement)
                      .join(" · ")}
                  </p>
                  <p className="mt-2 text-sm text-ink/75">
                    <span className="font-semibold text-ink">Suggested micro-assessment:</span>{" "}
                    {profile.evidence.find((item) => item.verificationPrompt)?.verificationPrompt}
                  </p>
                  <p className="mt-2 text-sm text-ink/75">
                    <span className="font-semibold text-ink">Training bridge recommendation:</span>{" "}
                    {profile.aiReadiness[0]?.resilienceRecommendations[0]}
                  </p>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
