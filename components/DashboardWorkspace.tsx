"use client";

import { useState } from "react";

import { CountrySwitcher } from "@/components/CountrySwitcher";
import { PolicymakerDashboard } from "@/components/PolicymakerDashboard";
import { SectionCard } from "@/components/SectionCard";
import { getProcessedProfiles } from "@/lib/demoEngine";
import { aggregatePolicySignals } from "@/lib/aggregatePolicySignals";
import { getEducationOptions, hasSkillCluster, hasVerificationStatus } from "@/lib/display";
import { loadCountryConfig } from "@/lib/loadCountryConfig";
import type { CountryCode } from "@/lib/types";

export function DashboardWorkspace() {
  const [country, setCountry] = useState<CountryCode>("GHA");
  const [gender, setGender] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");
  const [region, setRegion] = useState("all");
  const [educationLevel, setEducationLevel] = useState("all");
  const [skillCluster, setSkillCluster] = useState("all");
  const [verificationStatus, setVerificationStatus] = useState("all");
  const [opportunityType, setOpportunityType] = useState("all");

  const config = loadCountryConfig(country);
  const educationOptions = getEducationOptions(config);
  const filteredProfiles = getProcessedProfiles(country).filter((profile) => {
    const ageBucket = profile.profile.age < 22 ? "18-21" : profile.profile.age < 25 ? "22-24" : "25+";
    return (
      (gender === "all" || profile.profile.gender === gender) &&
      (ageGroup === "all" || ageBucket === ageGroup) &&
      (region === "all" || profile.profile.regionType === region) &&
      (educationLevel === "all" || profile.profile.education.highestCompleted === educationLevel) &&
      (skillCluster === "all" || hasSkillCluster(profile.skills, skillCluster)) &&
      (verificationStatus === "all" ||
        hasVerificationStatus(
          profile.skills,
          verificationStatus as typeof profile.skills[number]["verificationStatus"]
        )) &&
      (opportunityType === "all" || profile.opportunities.some((opportunity) => opportunity.type === opportunityType))
    );
  });

  const aggregate = aggregatePolicySignals(filteredProfiles);
  const econometricSignals =
    filteredProfiles[0]?.econometricSignals ?? getProcessedProfiles(country)[0]?.econometricSignals ?? [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">Policymaker Dashboard</p>
        <h1 className="mt-3 font-[var(--font-heading)] text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Aggregate hidden skills, gaps, and AI pressure.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink/80">
          The dashboard surfaces anonymized skill clusters, verification bottlenecks, opportunity bridges,
          and visible econometric context for country-specific program decisions.
        </p>
      </section>

      <div className="mt-6 space-y-6">
        <SectionCard
          eyebrow="Filters"
          title="Country and segment selector"
          description="Switch context and recompute the same logic without code changes."
        >
          <div className="space-y-4">
            <CountrySwitcher value={country} onChange={setCountry} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Gender
                <select value={gender} onChange={(event) => setGender(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                  <option value="all">All</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Age group
                <select value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                  <option value="all">All</option>
                  <option value="18-21">18-21</option>
                  <option value="22-24">22-24</option>
                  <option value="25+">25+</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Region
                <select value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                  <option value="all">All</option>
                  <option value="urban">Urban</option>
                  <option value="peri-urban">Peri-urban</option>
                  <option value="rural">Rural</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Education
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
                Verification status
                <select value={verificationStatus} onChange={(event) => setVerificationStatus(event.target.value)} className="rounded-2xl border border-line bg-white px-4 py-3">
                  <option value="all">All</option>
                  <option value="self-declared">Self-declared</option>
                  <option value="inferred">Inferred</option>
                  <option value="demonstrated">Demonstrated</option>
                  <option value="verified">Verified</option>
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
            </div>
          </div>
        </SectionCard>

        <PolicymakerDashboard
          config={config}
          aggregate={aggregate}
          econometricSignals={econometricSignals}
        />
      </div>
    </main>
  );
}
