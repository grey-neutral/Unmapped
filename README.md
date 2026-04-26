# 🌍 UNMAPPED — Skills Infrastructure for Invisible Talent

> **We don't build better CVs — we remove the need for them.**

---

## What is UNMAPPED?

UNMAPPED is a **mobile-first, configurable AI infrastructure layer** that translates informal, real-world experience into **portable, explainable skill signals** — and connects them to **real economic opportunities**.

It is designed for environments where:

- Skills exist before credentials
- Work happens informally
- Devices are shared
- Data is incomplete

---

## Why This Matters

In many low- and middle-income countries:

- Youth have **real skills**, but no formal proof
- Employers **cannot verify candidates**
- Matching happens through **informal networks**
- AI is reshaping jobs faster than systems can adapt

The problem is not lack of talent. The problem is **lack of translation between skills and opportunity**.

---

## Core Idea

UNMAPPED creates a **translation pipeline**:

```
Real Experience → Evidence → Skills → Standardized Mapping → AI Risk + Resilience → Opportunities → Policy Insights
```

---

## Product Overview

UNMAPPED consists of three connected interfaces:

**1. Youth Interface (Mobile-first)**
- Input: experience, voice, simple forms
- Output: Skills Passport + job matches
- Goal: empower individuals

**2. Employer Interface**
- Input: job description
- Output: required skills + matched profiles
- Goal: reduce hiring friction

**3. Policy Dashboard**
- Input: aggregated system data
- Output: insights, gaps, risks
- Goal: guide decisions at scale

### Why Different Interfaces?

| Interface | Designed For | Focus |
|---|---|---|
| Youth Interface | Low bandwidth + mobile use | Clarity and accessibility |
| Policy Dashboard | Decision-making | Patterns, gaps, and actionability |

Same data. Different abstraction levels.

---

## User Flow (Youth)

1. Select Country + Language
2. Add Education
3. Record Experience
4. Extract Skills
5. Review Evidence
6. Skills Passport
7. Job Matches

---

## Skills Signal Engine

The system converts raw input into structured skill signals:

```
User Input → Evidence Extraction → Skill Inference → Confidence Layer → Skills Passport
```

**Key features:**

- Evidence-based (not claims-based)
- Confidence levels: self-declared / inferred / verified
- Human-readable output

---

## AI Readiness Lens

Not all skills are equal in an AI-driven world. We evaluate:

```
Skills → Task Mapping → Automation Risk → Local Calibration → Resilience Suggestions
```

**Output:**
- What is at risk
- What is durable
- What to learn next

---

## Opportunity Matching

We don't recommend ideal jobs — we recommend **reachable opportunities**.

Matching considers: skill fit, local demand, distance, wage signals, training gaps, and AI resilience.

```
Skills ──┐
         ├──→ Matching Engine → Jobs / Training / Opportunities
Labor    ┤
Data ────┘
AI Risk ─┘
```

---

## Employer Flow

Employers don't need taxonomies. They:

1. Write a job description
2. System extracts required skills
3. Matching happens automatically

---

## Policy Dashboard

The dashboard turns individual data into **system-level intelligence**.

**Shows:**
- Hidden skill clusters
- Verification gaps
- Demand vs. supply mismatch
- AI exposure patterns
- Training priorities

### Global Risk View

Countries are mapped with AI exposure scores, color-coded to surface policy insights. Different countries show different risk levels, skill distributions, and opportunity gaps.

---

## Architecture Overview

```
Frontend (React / Next.js)
    └── Input Layer
            ├── Evidence Extraction
            ├── Skills Engine
            │       └── Taxonomy Mapping
            │               ├── AI Risk Engine
            │               └── Matching Engine → User Output
            └── Policy Aggregation → Dashboard

Config Layer (Country Data) feeds into:
    Evidence Extraction, AI Risk Engine, Matching Engine, Dashboard
```

---

## Configurable by Design

UNMAPPED is not hardcoded. Everything is driven by configuration:

- Country
- Education system
- Language
- Labor market data
- AI calibration
- Opportunity types

One core engine. Many country contexts. No code changes required to switch.

---

## Data Sources

| Source | Coverage |
|---|---|
| ISCO | Occupations |
| ESCO | Skills taxonomy |
| O*NET | Task structure |
| ILOSTAT | Labor data |
| World Bank WDI | Economic signals |
| Frey-Osborne | Automation risk |

---

## Key Insights Behind the Design

- Most users don't have CVs → use experience as input
- Most users don't use laptops → mobile-first
- Employers need trust → confidence layers
- Matching must be realistic, not aspirational
- AI risk is local, not global
- Systems must be configurable, not fixed

---

## Outcome

| Stakeholder | Benefit |
|---|---|
| Youth | Access to real opportunities |
| Employers | Lower hiring uncertainty |
| Policymakers | Actionable labor insights |
