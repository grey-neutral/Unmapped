# UNMAPPED Specification

## Product Intent

UNMAPPED is a working hackathon prototype that turns informal experience into explainable skill signals, maps those signals to standardized taxonomies and realistic opportunity pathways, then aggregates those signals for employers and policymakers.

Tagline:
`UNMAPPED turns real-world experience into trusted skill signals.`

Core explanation:
`Many young people have skills before they have formal proof. UNMAPPED helps translate education, informal work, and demonstrated competencies into a portable skills profile, realistic opportunities, and aggregate labor-market intelligence.`

## Primary Demo User

Amara:
- 22 years old
- Lives outside Accra, Ghana
- Holds a secondary school certificate
- Speaks English, Twi, and Ga
- Has run a phone repair business since age 17
- Learned basic coding from YouTube using a shared mobile connection

## Goals

1. Deliver a mobile-first youth workflow that converts informal evidence into a readable skills passport.
2. Show deterministic, explainable evidence extraction, skill mapping, taxonomy mapping, AI risk, and opportunity matching.
3. Provide a separate employer/training provider view that searches by skill signals rather than CVs.
4. Provide a policymaker dashboard with aggregate hidden-skills insights, opportunity gaps, and AI-risk summaries.
5. Make the system country-agnostic through JSON config for at least Ghana and Bangladesh.
6. Ground user-facing signals in labeled sample data derived from real source concepts: ISCO, ESCO, O*NET, ILOSTAT, WDI, STEP, Wittgenstein, ITU, and automation baselines.
7. Produce an end-to-end working prototype, not a static mockup.

## Non-Goals

1. Production auth, payments, or identity verification.
2. Full API integrations to live external systems.
3. Complex ML scoring or opaque LLM-only inference.
4. A perfect labor-market model.

## Stack

- Framework: Next.js App Router with TypeScript
- Styling: Tailwind CSS
- Data: local JSON and CSV sample datasets
- State: local React state with deterministic demo data loaders
- Tests: Playwright end-to-end tests in `tests/`
- Architecture prepared for future Postgres or Supabase, but no backend persistence required for MVP

## Information Architecture

Routes:
- `/` landing and entry selection
- `/youth` youth workflow shell
- `/employer` employer and training provider view
- `/dashboard` policymaker dashboard

Root directories:
- `app/`
- `components/`
- `lib/`
- `configs/ghana/`
- `configs/bangladesh/`
- `data/`
- `tests/`

## Required User Experience

### UI Redesign Override

The youth-facing prototype must now follow these stricter rules:
- mobile-first phone layout around 375px width
- minimal text only
- no long paragraphs
- one action per screen
- one state-machine flow instead of a dashboard-style layout
- progress indicator on every step
- back and next controls on every step
- mock interactions only

### Youth App

The youth flow must support this exact sequence:
1. Start screen with three buttons: Youth, Employer, Policy Dashboard
2. Step 1: Country, language, city
3. Step 2: Education
4. Step 3: Experience with simulated microphone capture and dynamic skill chips
5. Step 4: Evidence review
6. Step 5: Skills passport and matches

Step rules:
- one primary action per screen
- use stacked cards, chips, and buttons
- avoid multi-column layouts
- avoid dense dashboards
- always show `Step X of 5`
- always show `Back` and `Next`

The youth experience must:
- be mobile-first
- use large tap targets
- use simple language
- feel trustworthy and serious
- explain every inference with compact labels only
- show where each skill came from in compact form
- support incomplete credentials and assisted entry
- allow completion in under 30 seconds for the demo

Step 1 requirements:
- full country list with flag icons
- searchable or scrollable country picker
- language selector with English default
- include Swahili option
- switching to Swahili changes only this screen's labels
- city input label only

Step 2 requirements:
- title `Education`
- choices: None, Primary, Secondary, Higher
- mock upload or take photo button
- mock preview after tap
- certificate name field

Step 3 requirements:
- large microphone button
- tapping it simulates recording with a visible active state
- it progressively transcribes a longer repair-and-customer-service statement
- skill chips appear dynamically
- chips can be toggled
- allow adding another skill

Step 4 requirements:
- compact evidence cards
- each card has `self` or `inferred`
- each card shows compact strengthening actions

Step 5 requirements:
- scrollable final screen inside the phone shell
- no next button on the final screen
- show selected country and city correctly
- compact skills grid with repair, service, pricing, communication, and digital signals
- compact job cards with call and message actions
- small improvement suggestions at the bottom
- compact `System View` proof layer with evidence, taxonomy, AI risk, opportunity, and source tags

### Employer / Training Provider View

The employer route must support a compact two-step job-posting flow:
- Step 1: add a job title, city or region, phone, and job description
- allow `Use example`
- extract skill chips from the job description
- Step 2: show summary, required skills, and suggested matching profile
- allow `Add job`
- show success state
- the job can be mocked into the youth opportunity list

### Policymaker Dashboard

The dashboard route must:
- show aggregate anonymized signals only
- support country, context, and optional gender filtering
- include a world risk map, skill clusters, verification gap, AI exposure, and compact insight cards

### Policymaker Dashboard Override

The policymaker dashboard must now follow these stricter rules:
- no dense analytics-dashboard layout
- no tables
- no long explanations
- cards, bars, chips, and compact labels only
- instantly scannable in under 10 seconds
- wider than the youth phone shell, but still clean and uncluttered
- use only LMIC countries in the selector
- include a map-like world risk view for participating countries

Required sections:
1. top bar with `UNMAPPED Dashboard`, country selector, context selector
2. world risk map or map-like regional visualization
3. key metrics cards for mapped profiles, hidden skills, unverified skills, and top opportunity gap
4. horizontal skill-cluster bars under `What skills exist`
5. stacked verification-gap bars under `Where signals are weak`
6. AI exposure block with country score, exposed skills, and resilient skills
7. compact insight cards under `Key Insights`

Interaction rules:
- country switch must visibly recalculate all cards
- context filter must switch between `Urban`, `Rural`, and `Informal economy`
- a mock gender filter can be available
- all data can be hardcoded from local demo seeds or mock profile aggregates
- this redesign exposes country, context, and optional gender in the visible filter UI
- the dashboard can use a broader LMIC mock catalog beyond the config-backed Ghana and Bangladesh pair
- dashboard metrics must vary by country and by context
- dashboard replaces `Live opportunity signals` with `Key Insights`
- dashboard integrates training priorities into the insight layer rather than as a large standalone section
- skill clusters must include repair, customer service, sales and retail, languages, digital basics, agriculture, care work, logistics, construction, textiles, mobile money, and data collection

## Design System Direction

- Background: warm light neutral
- Cards: white, rounded, subtle shadow
- Accent: deep teal or blue
- Youth UI: optimistic and practical, not bureaucratic
- Dashboard UI: more analytical but still clean
- Confidence colors:
  - low: gray
  - medium: amber
  - high: green
  - verified: blue

## Country Configuration

Country-specific assumptions must live in config files and not in component logic.

Required loader:
- `loadCountryConfig(countryCode)`

Required config sets:
- `configs/ghana/`
- `configs/bangladesh/`

Required config files per country:
- `country.json`
- `education_map.json`
- `labor_market_signals.json`
- `automation_calibration.json`
- `opportunity_types.json`
- `language.json`

Visible behavior:
- Switching country in the youth flow must preserve the selected location through the final passport.
- Switching country and context in the dashboard must recalculate the visible cards, risk map summary, and insight layer.

## Data Model and Logic

### Evidence Extraction

Function:
- `extractEvidence(inputText, guidedAnswers, educationData)`

Behavior:
- use deterministic rules and keyword patterns
- derive structured evidence from education, languages, repair, business, money handling, customer support, online learning, teaching, and digital tool use
- return confidence, source, raw input, and inference trace

Return shape:
```ts
type Evidence = {
  id: string
  type: string
  statement: string
  source: "self-declared" | "inferred" | "demonstrated" | "verified"
  confidence: "low" | "medium" | "high" | "verified"
  rawInput: string
  inferredFrom: string[]
  whyItMatters: string
  verificationPrompt?: string
}
```

### Skill Mapping

Function:
- `mapEvidenceToSkills(evidence, countryConfig)`

Behavior:
- apply rule-first mapping
- preserve evidence references
- do not overclaim occupations from weak evidence
- separate direct skills from adjacent pathways

Return shape:
```ts
type SkillSignal = {
  skillId: string
  label: string
  category: string
  evidenceIds: string[]
  confidence: "low" | "medium" | "high" | "verified"
  verificationStatus: "self-declared" | "inferred" | "demonstrated" | "verified"
  explanation: string
  adjacentPathways: string[]
}
```

### Taxonomy Mapping

Function:
- `mapSkillsToTaxonomies(skills)`

Behavior:
- map sample skills to ESCO-like labels, ISCO occupations, and O*NET task clusters
- use local sample datasets in `data/`
- return confidence and explanation

### AI Risk Engine

Function:
- `calculateAIRisk(skillProfile, countryConfig, occupation)`

Formula basis:
- `automationRisk = baseExposure * digitalAdoptionFactor * taskRoutinenessFactor * infrastructureAdjustment * informalityAdjustment`

Behavior:
- show exposure level and score
- show durable skills
- show vulnerable tasks
- show resilience recommendations
- explain that the output is a lens, not a prediction

### Opportunity Matching

Function:
- `matchOpportunities(skillProfile, countryConfig, laborMarketSignals)`

Scoring:
- `0.30 * skillFit`
- `0.20 * localDemand`
- `0.15 * wageSignal`
- `0.15 * trainingGapSmallness`
- `0.10 * verificationStrength`
- `0.10 * aiResilience`

Behavior:
- sort by realistic fit
- avoid implausible leap recommendations
- surface missing skill gaps and concrete next steps
- allow compact country-sensitive demand, wage, or gap signals near the match cards when useful

### Policy Aggregation

Function:
- `aggregatePolicySignals(demoSeed, filters)`

Behavior:
- summarize hidden skill clusters
- summarize verification gaps
- summarize top opportunity gaps
- summarize country AI exposure and resilient clusters
- summarize training priorities through compact insight cards
- support filter-driven recomputation from local demo seeds or mock profiles

## Sample Data Requirements

Profiles:
1. Amara: Ghana, phone repair, multilingual, coding
2. Bangladesh rural agriculture worker with mobile money experience
3. Ghana market seller with bookkeeping
4. Young woman with caregiving and multilingual skills
5. Apprentice mechanic with no certificate

Opportunities:
- Ghana set:
  - Mobile repair technician
  - Electronics shop assistant
  - Solar repair trainee
  - Field data collector
  - Digital customer support assistant
  - Technical sales assistant
  - Retail inventory assistant
- Bangladesh set:
  - Agricultural input sales assistant
  - Mobile money agent
  - Textile quality control trainee
  - Solar irrigation technician trainee
  - Rural field data collector
  - Market logistics assistant

## Core Components

- `CountrySwitcher`
- `ConfigDebugger`
- `EvidenceCard`
- `SkillCard`
- `SkillPassport`
- `RiskLens`
- `OpportunityCard`
- `PolicymakerDashboard`

## Demo Story Requirements

The working demo must make it easy to show:
1. Load Amara example
2. Evidence extraction
3. Skill mapping
4. Taxonomy mapping
5. Skills passport
6. AI readiness lens
7. Realistic opportunity matching
8. Aggregate dashboard insight
9. Country and context switch across Ghana, Bangladesh, and broader LMIC mock countries

## Implementation Plan

1. Scaffold Next.js + Tailwind project and app routes.
2. Create country configs and local datasets.
3. Implement deterministic domain logic in `lib/`.
4. Build reusable cards and views.
5. Build youth workflow with Amara prefill.
6. Build employer view.
7. Build policymaker dashboard.
8. Build config inspector and country switcher.
9. Add Playwright e2e tests.
10. Run tests, fix failures, and tighten visual/logic gaps.

## Verification Strategy

Each acceptance criterion must have a concrete proof.

1. Start screen
   - Proof: Playwright test loads `/` and sees exactly the three primary mode buttons.
2. Step flow
   - Proof: test moves from Step 1 through Step 5 with visible `Step X of 5` progress labels and bottom navigation.
3. Country and language
   - Proof: test searches countries, selects one with a flag, switches to Swahili, and sees only Step 1 labels change.
4. Education
   - Proof: test selects a level, taps upload, and sees a mock preview state.
5. Experience
   - Proof: test taps the microphone button, sees the transcript autofill, and sees skill chips appear dynamically.
6. Skill chip interaction
   - Proof: test toggles a skill chip on and off and adds one extra custom skill.
7. Evidence review
   - Proof: test reaches Step 4 and sees compact evidence cards with `self` or `inferred` badges and strengthening actions.
8. Skills and matches
   - Proof: test reaches Step 5 and sees compact skill cards, selected location, country-sensitive signals, and realistic match cards.
9. Policy mode
   - Proof: test opens Policy Dashboard from the start screen and sees the LMIC-only country picker, world risk map, compact signal cards, and insight section.
10. Mobile-first
   - Proof: tests run on a mobile viewport and remain vertically stacked with no dependency on hover or wide layouts.
11. Demo readiness
   - Proof: `npm run build` and `npm run test:e2e` both pass.

## Definition of Done

The project is done when:
- all routes render cleanly
- all acceptance criteria are visibly satisfied
- all Playwright tests in `tests/` pass locally
- the selected youth country carries through to the final passport and the dashboard country or context filters visibly recalculate the signals
- the UI is coherent enough to demo end-to-end in a single pass
