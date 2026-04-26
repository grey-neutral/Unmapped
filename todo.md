# UNMAPPED To-Do

## Working Rules

- [x] Consult `spec.md` before each code change
- [x] Update this file as work progresses
- [x] Run tests after each meaningful implementation milestone
- [x] Ask a fresh sub-agent to review `spec.md` and implementation gaps at roughly each major phase

## Project Setup

- [x] Create initial project scaffolding
- [x] Add Next.js, TypeScript, Tailwind, and Playwright configuration
- [x] Verify app boots locally

## Data and Configuration

- [x] Add Ghana config files
- [x] Add Bangladesh config files
- [x] Add taxonomy and labor-market sample datasets
- [x] Add sample youth profiles
- [x] Add sample opportunities by country

## Core Logic

- [x] Implement `loadCountryConfig`
- [x] Implement `extractEvidence`
- [x] Implement `mapEvidenceToSkills`
- [x] Implement `mapSkillsToTaxonomies`
- [x] Implement `calculateAIRisk`
- [x] Implement `matchOpportunities`
- [x] Implement `aggregatePolicySignals`

## UI Foundation

- [x] Build global layout and theme
- [x] Build reusable cards and badges
- [x] Build `CountrySwitcher`
- [x] Build `ConfigDebugger`

## Youth App

- [x] Build landing screen and onboarding copy
- [x] Build context selection screen
- [x] Build education input screen
- [x] Build experience input with guided answers and Amara prefill
- [x] Build evidence review screen
- [x] Build skills passport screen
- [x] Build AI readiness lens screen
- [x] Build opportunity matching screen
- [x] Build share/export summary screen

## Employer / Training Provider

- [x] Build employer search filters
- [x] Build candidate cards
- [x] Build training intake recommendations

## Policymaker Dashboard

- [x] Build aggregate KPI cards
- [x] Build hidden skills map section
- [x] Build verification funnel section
- [x] Build opportunity gap section
- [x] Build AI risk cluster section
- [x] Build training bridge recommendation section
- [x] Build econometric signal cards
- [x] Build filter bar and config inspector

## Tests

- [x] Add end-to-end test harness
- [x] Add youth flow coverage
- [x] Add country switch coverage
- [x] Add employer coverage
- [x] Add dashboard coverage
- [x] Run test loop until all pass

## Mobile Refactor

- [x] Replace landing screen with minimal mobile start screen
- [x] Replace youth route with single-page five-step state machine
- [x] Add full country picker with flags and Step 1 Swahili label toggle
- [x] Replace education screen with compact mobile controls and mock upload preview
- [x] Replace experience screen with simulated microphone capture and dynamic skill chips
- [x] Replace evidence screen with compact mobile evidence cards
- [x] Replace final screen with compact skills passport and three simple match cards
- [x] Replace policy entry with a compact mobile policy view
- [x] Rewrite e2e tests for the new mobile flow
- [x] Run build and e2e loop until green

## Dashboard Refactor

- [x] Replace the policy placeholder with a dedicated policymaker dashboard surface
- [x] Add compact country, context, region, and gender controls
- [x] Add key metrics, skill clusters, verification gap, opportunity gap, econometric signals, AI exposure, training priorities, live signals, and config sections
- [x] Wire the home-screen policy entry and `/dashboard` route to the new surface
- [x] Rewrite dashboard e2e coverage for the new interaction model
- [x] Run build and e2e loop until green

## Flow Enhancements

- [x] Replace `Community Navigator` with `Employer` on the start screen
- [x] Add a two-step employer job-posting flow with skill extraction and success state
- [x] Make Step 3 voice capture clearer with title, subtitle, recording state, and progressive transcription
- [x] Expand youth skill chips, evidence cards, and final passport content without clutter
- [x] Remove the final-screen next button and add call, message, and system-view interactions
- [x] Fix selected country carry-through to the final youth passport
- [x] Expand the policymaker dashboard to LMIC-only countries with country and context dependent metrics
- [x] Replace live signals with key insights and add a world risk map view
- [x] Rewrite e2e tests for the updated youth, employer, and dashboard flows
- [x] Run build and e2e loop until green
