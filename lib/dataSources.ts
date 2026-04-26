import bangladeshAutomation from "@/configs/bangladesh/automation_calibration.json";
import bangladeshCountry from "@/configs/bangladesh/country.json";
import bangladeshEducation from "@/configs/bangladesh/education_map.json";
import bangladeshLanguage from "@/configs/bangladesh/language.json";
import bangladeshLabor from "@/configs/bangladesh/labor_market_signals.json";
import bangladeshOpportunityTypes from "@/configs/bangladesh/opportunity_types.json";
import ghanaAutomation from "@/configs/ghana/automation_calibration.json";
import ghanaCountry from "@/configs/ghana/country.json";
import ghanaEducation from "@/configs/ghana/education_map.json";
import ghanaLanguage from "@/configs/ghana/language.json";
import ghanaLabor from "@/configs/ghana/labor_market_signals.json";
import ghanaOpportunityTypes from "@/configs/ghana/opportunity_types.json";
import escoSkillsData from "@/data/esco_sample_skills.json";
import freyOsborneData from "@/data/frey_osborne_sample.json";
import iscoOccupationsData from "@/data/isco_sample_occupations.json";
import onetTasksData from "@/data/onet_sample_tasks.json";
import sampleOpportunitiesData from "@/data/sample_opportunities.json";
import sampleProfilesData from "@/data/sample_profiles.json";
import wdiData from "@/data/worldbank_wdi_sample.json";
import wittgensteinData from "@/data/wittgenstein_sample.json";

import type { CandidateProfile, CountryCode, OpportunityDefinition } from "@/lib/types";

export const countryConfigModules = {
  GHA: {
    country: ghanaCountry,
    education: ghanaEducation,
    labor: ghanaLabor,
    automation: ghanaAutomation,
    opportunityTypes: ghanaOpportunityTypes,
    language: ghanaLanguage
  },
  BGD: {
    country: bangladeshCountry,
    education: bangladeshEducation,
    labor: bangladeshLabor,
    automation: bangladeshAutomation,
    opportunityTypes: bangladeshOpportunityTypes,
    language: bangladeshLanguage
  }
} as const;

export const escoSkills = escoSkillsData as Array<{
  skillId: string;
  label: string;
  escoId: string;
  escoLabel: string;
  relatedOccupations: string[];
  onetTaskClusters: string[];
}>;

export const iscoOccupations = iscoOccupationsData as Array<{
  code: string;
  title: string;
  sector: string;
  manualComponent: number;
  routineness: number;
}>;

export const onetTasks = onetTasksData as Array<{
  occupationCode: string;
  cluster: string;
  tasks: string[];
}>;

export const automationBaselines = freyOsborneData as Array<{
  occupationCode: string;
  title: string;
  baseExposure: number;
  routineness: number;
  manualComponent: number;
  digitalTaskShare: number;
}>;

export const sampleProfiles = sampleProfilesData as CandidateProfile[];
export const sampleOpportunities = sampleOpportunitiesData as OpportunityDefinition[];
export const worldBankIndicators = wdiData as Array<{
  countryCode: CountryCode;
  indicator: string;
  label: string;
  value: number;
  year: number;
  source: string;
}>;
export const educationSignals = wittgensteinData as Array<{
  countryCode: CountryCode;
  year: number;
  signal: string;
  source: string;
}>;
