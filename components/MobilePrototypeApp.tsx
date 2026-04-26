"use client";

import { useEffect, useMemo, useState } from "react";

import { PolicyDashboardSurface } from "@/components/PolicyDashboardSurface";
import { allCountries } from "@/lib/countryDataset";

type AppMode = "home" | "youth" | "employer" | "policy";
type FlowStep = 1 | 2 | 3 | 4 | 5;
type EmployerStep = 1 | 2;
type EducationLevel = "" | "None" | "Primary" | "Secondary" | "Higher";
type LanguageCode = "English" | "Swahili";
type RecordingStage = "idle" | "recording" | "transcribing" | "done";
type EmployerJob = {
  title: string;
  city: string;
  phone: string;
  description: string;
  skills: string[];
  employer: string;
};
type MatchCard = {
  title: string;
  metaOne: string;
  metaTwo: string;
  ownerLabel: string;
  owner: string;
};
type SignalCard = {
  label: string;
  value: string;
};
type SystemRow = {
  evidence: string;
  skill: string;
  taxonomy: string;
  risk: string;
  opportunity: string;
};

const EMPLOYER_JOB_KEY = "unmapped-employer-job";
const voiceTranscript =
  "I repair phones and help customers in a small shop. I diagnose charging problems, replace screens, manage spare parts, and explain repair costs to customers.";
const generatedSkills = [
  "Phone repair",
  "Troubleshooting",
  "Screen replacement",
  "Customer service",
  "Spare parts",
  "Pricing",
  "Sales",
  "Communication"
];
const employerExtractedSkills = [
  "Phone repair",
  "Troubleshooting",
  "Customer service",
  "Spare parts",
  "Pricing",
  "Communication"
];

const stepOneLabels = {
  English: {
    country: "Country",
    language: "Language",
    city: "City",
    search: "Search",
    back: "Back",
    next: "Next"
  },
  Swahili: {
    country: "Nchi",
    language: "Lugha",
    city: "Mji",
    search: "Tafuta",
    back: "Rudi",
    next: "Ifuatayo"
  }
} as const;

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-10 w-10 ${active ? "text-white" : "text-ink"}`} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <path d="M12 18v3" />
      <path d="M8 21h8" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h3l2-2h6l2 2h3v11H4Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 16V5" />
      <path d="M8 9l4-4 4 4" />
      <path d="M5 19h14" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72l.38 2.66a2 2 0 0 1-.57 1.69L7.1 9.9a16 16 0 0 0 7 7l1.83-1.82a2 2 0 0 1 1.69-.57l2.66.38A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

function SignalChip({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-teal text-white shadow-sm" : "bg-slate-100 text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function StatusDots() {
  return (
    <div className="inline-flex items-center gap-1">
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"
          style={{ animationDelay: `${item * 160}ms` }}
        />
      ))}
    </div>
  );
}

function StepShell({
  step,
  total,
  onBack,
  onNext,
  canNext = true,
  backLabel = "Back",
  nextLabel = "Next",
  showNext = true,
  contentScrollable = false,
  footer,
  children
}: {
  step: number;
  total: number;
  onBack: () => void;
  onNext?: () => void;
  canNext?: boolean;
  backLabel?: string;
  nextLabel?: string;
  showNext?: boolean;
  contentScrollable?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[720px] flex-col rounded-[32px] bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between px-1 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-ink"
          aria-label="Back"
        >
          <BackIcon />
        </button>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-ink">
          Step {step} of {total}
        </div>
        <div className="w-10" />
      </div>

      <div className={`flex-1 ${contentScrollable ? "overflow-y-auto pr-1" : ""}`}>{children}</div>

      {footer ? (
        <div className="mt-6">{footer}</div>
      ) : showNext ? (
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            data-testid="flow-back"
            className="h-14 flex-1 rounded-2xl bg-slate-100 text-sm font-semibold text-ink"
          >
            {backLabel}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            data-testid="flow-next"
            className={`h-14 flex-1 rounded-2xl text-sm font-semibold ${
              canNext ? "bg-teal text-white" : "bg-slate-200 text-slate-400"
            }`}
          >
            {nextLabel}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onBack}
          data-testid="flow-back"
          className="mt-6 h-14 w-full rounded-2xl bg-slate-100 text-sm font-semibold text-ink"
        >
          {backLabel}
        </button>
      )}
    </div>
  );
}

function buildEvidence() {
  return [
    { label: "Phone repair experience", confidence: "self" as const },
    { label: "Customer interaction", confidence: "inferred" as const },
    { label: "Spare parts handling", confidence: "self" as const },
    { label: "Pricing / sales", confidence: "inferred" as const }
  ];
}

function buildPassportCards(selectedSkills: string[]) {
  const selected = new Set(selectedSkills);

  return [
    { label: "Repair", badge: selected.has("Phone repair") ? "high" : "medium", icon: "RP" },
    { label: "Troubleshooting", badge: selected.has("Troubleshooting") ? "high" : "medium", icon: "TS" },
    { label: "Customer Service", badge: selected.has("Customer service") ? "high" : "medium", icon: "CS" },
    { label: "Sales", badge: selected.has("Sales") ? "medium" : "inferred", icon: "SL" },
    { label: "Communication", badge: selected.has("Communication") ? "medium" : "inferred", icon: "CM" },
    { label: "Parts Management", badge: selected.has("Spare parts") ? "medium" : "inferred", icon: "PM" },
    { label: "Pricing", badge: selected.has("Pricing") ? "medium" : "inferred", icon: "PR" },
    { label: "Digital Basics", badge: "medium", icon: "DB" }
  ];
}

function buildYouthMatches(countryCode: string, city: string, employerJob: EmployerJob | null) {
  const matchesByCountry: Record<string, MatchCard[]> = {
    GH: [
      {
        title: "Phone Repair Assistant",
        metaOne: "Match: 86%",
        metaTwo: "Distance: 3 km",
        ownerLabel: "Employer",
        owner: "QuickFix Mobile"
      },
      {
        title: "Electronics Shop Assistant",
        metaOne: "Match: 78%",
        metaTwo: "Distance: 5 km",
        ownerLabel: "Employer",
        owner: "CityTech Repairs"
      },
      {
        title: "Solar Repair Trainee",
        metaOne: "Match: 72%",
        metaTwo: "Duration: 4 weeks",
        ownerLabel: "Provider",
        owner: "Green Skills Hub"
      }
    ],
    KE: [
      {
        title: "Phone Repair Assistant",
        metaOne: "Match: 86%",
        metaTwo: "Distance: 3 km",
        ownerLabel: "Employer",
        owner: "QuickFix Mobile"
      },
      {
        title: "Electronics Shop Assistant",
        metaOne: "Match: 78%",
        metaTwo: "Distance: 5 km",
        ownerLabel: "Employer",
        owner: "CityTech Repairs"
      },
      {
        title: "Solar Repair Trainee",
        metaOne: "Match: 72%",
        metaTwo: "Duration: 4 weeks",
        ownerLabel: "Provider",
        owner: "Green Skills Hub"
      }
    ],
    BD: [
      {
        title: "Phone Repair Assistant",
        metaOne: "Match: 82%",
        metaTwo: "Distance: 4 km",
        ownerLabel: "Employer",
        owner: "Dhaka Device Care"
      },
      {
        title: "Electronics Shop Assistant",
        metaOne: "Match: 76%",
        metaTwo: "Distance: 6 km",
        ownerLabel: "Employer",
        owner: "CityTech Repairs"
      },
      {
        title: "Solar Repair Trainee",
        metaOne: "Match: 74%",
        metaTwo: "Duration: 4 weeks",
        ownerLabel: "Provider",
        owner: "Green Skills Hub"
      }
    ]
  };

  const matches = [...(matchesByCountry[countryCode] ?? matchesByCountry.KE)];

  if (employerJob) {
    matches.unshift({
      title: employerJob.title,
      metaOne: "Match: 88%",
      metaTwo: `Distance: ${city ? "2 km" : "Nearby"}`,
      ownerLabel: "Employer",
      owner: employerJob.employer
    });
  }

  return matches.slice(0, 4);
}

function buildYouthSignals(countryCode: string): SignalCard[] {
  const signalsByCountry: Record<string, SignalCard[]> = {
    GH: [
      { label: "Demand", value: "Repair up" },
      { label: "Wage", value: "1.2x retail" },
      { label: "Gap", value: "Verified repair" }
    ],
    KE: [
      { label: "Demand", value: "Repair up" },
      { label: "Wage", value: "1.2x retail" },
      { label: "Gap", value: "Customer proof" }
    ],
    BD: [
      { label: "Demand", value: "Service roles" },
      { label: "Wage", value: "1.1x retail" },
      { label: "Gap", value: "Solar basics" }
    ]
  };

  return signalsByCountry[countryCode] ?? signalsByCountry.KE;
}

function buildSystemRows(countryCode: string): SystemRow[] {
  if (countryCode === "BD") {
    return [
      {
        evidence: "repairs phones",
        skill: "troubleshooting",
        taxonomy: "ISCO 7422 / ESCO electronics repair",
        risk: "Low-Medium",
        opportunity: "Phone Repair Assistant"
      },
      {
        evidence: "helps customers",
        skill: "customer service",
        taxonomy: "ISCO 5223",
        risk: "Medium",
        opportunity: "Electronics Shop Assistant"
      },
      {
        evidence: "manages parts and pricing",
        skill: "inventory / pricing",
        taxonomy: "O*NET retail task cluster",
        risk: "Medium",
        opportunity: "Solar Repair Trainee"
      }
    ];
  }

  return [
    {
      evidence: "repairs phones",
      skill: "troubleshooting",
      taxonomy: "ISCO 7422 / ESCO electronics repair",
      risk: "Low-Medium",
      opportunity: "Phone Repair Assistant"
    },
    {
      evidence: "helps customers",
      skill: "customer service",
      taxonomy: "ISCO 5223",
      risk: "Medium",
      opportunity: "Electronics Shop Assistant"
    },
    {
      evidence: "manages parts and pricing",
      skill: "inventory / pricing",
      taxonomy: "O*NET retail task cluster",
      risk: "Medium",
      opportunity: "Shop Assistant"
    }
  ];
}

function extractEmployerSkills(description: string) {
  const normalized = description.toLowerCase();
  const result = employerExtractedSkills.filter((skill) => {
    const key = skill.toLowerCase();
    return (
      normalized.includes("repair") ||
      normalized.includes("customer") ||
      normalized.includes("spare") ||
      normalized.includes("price") ||
      normalized.includes("commun")
    )
      ? true
      : normalized.includes(key);
  });

  return result.length > 0 ? result : employerExtractedSkills;
}

export function MobilePrototypeApp({ initialMode = "home" }: { initialMode?: AppMode }) {
  const [mode, setMode] = useState<AppMode>(initialMode);

  const [step, setStep] = useState<FlowStep>(1);
  const [countrySearch, setCountrySearch] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("English");
  const [city, setCity] = useState("");
  const [education, setEducation] = useState<EducationLevel>("");
  const [certificateName, setCertificateName] = useState("");
  const [hasPreview, setHasPreview] = useState(false);
  const [recordingStage, setRecordingStage] = useState<RecordingStage>("idle");
  const [experienceText, setExperienceText] = useState("");
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [draftSkill, setDraftSkill] = useState("");
  const [showSystemView, setShowSystemView] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [employerStep, setEmployerStep] = useState<EmployerStep>(1);
  const [employerTitle, setEmployerTitle] = useState("");
  const [employerCity, setEmployerCity] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");
  const [employerDescription, setEmployerDescription] = useState("");
  const [employerSkillOptions, setEmployerSkillOptions] = useState<string[]>([]);
  const [employerSelectedSkills, setEmployerSelectedSkills] = useState<string[]>([]);
  const [employerSubmitted, setEmployerSubmitted] = useState(false);
  const [postedEmployerJob, setPostedEmployerJob] = useState<EmployerJob | null>(null);

  const labels = stepOneLabels[language];
  const filteredCountries = allCountries.filter((country) =>
    `${country.name} ${country.code}`.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const selectedCountry = allCountries.find((country) => country.code === countryCode);
  const evidenceCards = buildEvidence();
  const passportCards = buildPassportCards(selectedSkills.length > 0 ? selectedSkills : generatedSkills);
  const youthMatches = buildYouthMatches(countryCode, city, postedEmployerJob);
  const youthSignals = buildYouthSignals(countryCode);
  const recordingActive = recordingStage === "recording" || recordingStage === "transcribing";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedJob = window.localStorage.getItem(EMPLOYER_JOB_KEY);

    if (storedJob) {
      setPostedEmployerJob(JSON.parse(storedJob) as EmployerJob);
    }
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(""), 1600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (recordingStage !== "recording") return;
    const timer = window.setTimeout(() => setRecordingStage("transcribing"), 950);
    return () => window.clearTimeout(timer);
  }, [recordingStage]);

  useEffect(() => {
    if (recordingStage !== "transcribing") return;

    const chunks = [
      "I repair phones and help customers in a small shop.",
      "I repair phones and help customers in a small shop. I diagnose charging problems, replace screens,",
      "I repair phones and help customers in a small shop. I diagnose charging problems, replace screens, manage spare parts,",
      voiceTranscript
    ];

    const timers = chunks.map((chunk, index) =>
      window.setTimeout(() => {
        setExperienceText(chunk);

        if (index === chunks.length - 1) {
          setSkillOptions(generatedSkills);
          setSelectedSkills(generatedSkills);
          setRecordingStage("done");
        }
      }, 620 * (index + 1))
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [recordingStage]);

  const canAdvanceStepOne = countryCode.length > 0 && city.trim().length > 0;
  const canAdvanceStepTwo = education.length > 0;
  const canAdvanceStepThree = experienceText.trim().length > 0 && selectedSkills.length > 0;
  const canAdvanceEmployerOne =
    employerTitle.trim().length > 0 &&
    employerCity.trim().length > 0 &&
    employerPhone.trim().length > 0 &&
    employerDescription.trim().length > 0 &&
    employerSelectedSkills.length > 0;

  function resetYouthFlow() {
    setStep(1);
    setCountrySearch("");
    setCountryCode("");
    setLanguage("English");
    setCity("");
    setEducation("");
    setCertificateName("");
    setHasPreview(false);
    setRecordingStage("idle");
    setExperienceText("");
    setSkillOptions([]);
    setSelectedSkills([]);
    setDraftSkill("");
    setShowSystemView(false);
  }

  function resetEmployerFlow() {
    setEmployerStep(1);
    setEmployerTitle("");
    setEmployerCity("");
    setEmployerPhone("");
    setEmployerDescription("");
    setEmployerSkillOptions([]);
    setEmployerSelectedSkills([]);
    setEmployerSubmitted(false);
  }

  function openMode(nextMode: AppMode) {
    setMode(nextMode);

    if (nextMode === "youth") {
      resetYouthFlow();
    }

    if (nextMode === "employer") {
      resetEmployerFlow();
    }
  }

  function handleYouthBack() {
    if (step === 1) {
      setMode("home");
      return;
    }

    setStep((current) => (current - 1) as FlowStep);
  }

  function handleYouthNext() {
    if (step === 5) return;
    setStep((current) => (current + 1) as FlowStep);
  }

  function handleMicTap() {
    if (recordingActive) return;
    setRecordingStage("recording");
    setExperienceText("");
    setSkillOptions([]);
    setSelectedSkills([]);
  }

  function toggleYouthSkill(skill: string) {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  }

  function addYouthSkill() {
    const nextSkill = draftSkill.trim();
    if (!nextSkill) return;

    if (!skillOptions.includes(nextSkill)) {
      setSkillOptions((current) => [...current, nextSkill]);
    }

    if (!selectedSkills.includes(nextSkill)) {
      setSelectedSkills((current) => [...current, nextSkill]);
    }

    setDraftSkill("");
  }

  function handleEmployerBack() {
    if (employerStep === 1) {
      setMode("home");
      return;
    }

    if (employerSubmitted) {
      setEmployerSubmitted(false);
      return;
    }

    setEmployerStep(1);
  }

  function handleEmployerNext() {
    if (employerStep === 1) {
      setEmployerStep(2);
    }
  }

  function useEmployerExample() {
    setEmployerTitle("Phone Repair Assistant");
    setEmployerCity("Nairobi");
    setEmployerPhone("+254 700 000 111");
    setEmployerDescription(
      "We need someone who can repair phones, talk to customers, manage spare parts, and explain prices clearly."
    );
  }

  function extractJobSkills() {
    const extracted = extractEmployerSkills(employerDescription);
    setEmployerSkillOptions(extracted);
    setEmployerSelectedSkills(extracted);
  }

  function toggleEmployerSkill(skill: string) {
    setEmployerSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  }

  function addEmployerJob() {
    const nextJob: EmployerJob = {
      title: employerTitle,
      city: employerCity,
      phone: employerPhone,
      description: employerDescription,
      skills: employerSelectedSkills,
      employer: employerTitle.includes("Assistant") ? "Employer Nearby" : "Local Employer"
    };

    setPostedEmployerJob(nextJob);
    setEmployerSubmitted(true);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(EMPLOYER_JOB_KEY, JSON.stringify(nextJob));
    }
  }

  const systemRows = useMemo(() => buildSystemRows(countryCode), [countryCode]);

  if (mode === "policy") {
    return <PolicyDashboardSurface onBack={() => setMode("home")} />;
  }

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[420px] items-start justify-center px-3 py-6">
        {mode === "home" ? (
          <div className="flex min-h-[720px] w-full flex-col rounded-[32px] bg-white p-5 shadow-soft">
            <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              UNMAPPED
            </div>
            <div className="mt-8">
              <h1 className="font-[var(--font-heading)] text-3xl font-bold tracking-tight text-ink">
                Trusted skill signals
              </h1>
              <p className="mt-3 text-sm font-medium text-ink/70">Real experience. Ready fast.</p>
            </div>
            <div className="mt-8 flex flex-1 flex-col gap-4">
              <button
                type="button"
                onClick={() => openMode("youth")}
                className="rounded-[28px] bg-teal px-5 py-5 text-left text-lg font-semibold text-white"
              >
                Youth
              </button>
              <button
                type="button"
                onClick={() => openMode("employer")}
                className="rounded-[28px] bg-slate-100 px-5 py-5 text-left text-lg font-semibold text-ink"
              >
                Employer
              </button>
              <button
                type="button"
                onClick={() => setMode("policy")}
                className="rounded-[28px] bg-slate-100 px-5 py-5 text-left text-lg font-semibold text-ink"
              >
                Policy Dashboard
              </button>
            </div>
          </div>
        ) : null}

        {mode === "youth" ? (
          <div className="w-full">
            {step === 1 ? (
              <StepShell
                step={1}
                total={5}
                onBack={handleYouthBack}
                onNext={handleYouthNext}
                canNext={canAdvanceStepOne}
                backLabel={labels.back}
                nextLabel={labels.next}
              >
                <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                  Youth
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-ink">{labels.country}</div>
                    <input
                      value={countrySearch}
                      onChange={(event) => setCountrySearch(event.target.value)}
                      placeholder={labels.search}
                      className="h-12 w-full rounded-2xl border border-line bg-slate-50 px-4 text-sm text-ink outline-none"
                    />
                    <div className="mt-3 max-h-52 overflow-auto rounded-[28px] bg-slate-50 p-2">
                      {filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => setCountryCode(country.code)}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm ${
                            countryCode === country.code ? "bg-white shadow-sm" : "text-ink"
                          }`}
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="font-medium">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {countryCode ? (
                    <>
                      <div>
                        <div className="mb-2 text-sm font-semibold text-ink">{labels.language}</div>
                        <div className="flex gap-3">
                          {(["English", "Swahili"] as LanguageCode[]).map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setLanguage(item)}
                              className={`h-12 flex-1 rounded-2xl text-sm font-semibold ${
                                language === item ? "bg-teal text-white" : "bg-slate-100 text-ink"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-semibold text-ink">{labels.city}</div>
                        <input
                          value={city}
                          onChange={(event) => setCity(event.target.value)}
                          className="h-12 w-full rounded-2xl border border-line bg-slate-50 px-4 text-sm text-ink outline-none"
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </StepShell>
            ) : null}

            {step === 2 ? (
              <StepShell step={2} total={5} onBack={handleYouthBack} onNext={handleYouthNext} canNext={canAdvanceStepTwo}>
                <div className="text-center">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">Education</div>
                </div>
                <div className="mt-6 grid gap-3">
                  {(["None", "Primary", "Secondary", "Higher"] as Exclude<EducationLevel, "">[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setEducation(item)}
                      className={`h-14 rounded-2xl text-sm font-semibold ${
                        education === item ? "bg-teal text-white" : "bg-slate-100 text-ink"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-5 space-y-4">
                  <button
                    type="button"
                    onClick={() => setHasPreview(true)}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-semibold text-ink"
                  >
                    <UploadIcon />
                    Upload / Take Photo
                  </button>
                  {hasPreview ? (
                    <div className="flex h-24 items-center justify-center rounded-[28px] bg-slate-50 text-sm font-semibold text-ink">
                      Photo ready
                    </div>
                  ) : null}
                  <input
                    value={certificateName}
                    onChange={(event) => setCertificateName(event.target.value)}
                    placeholder="Certificate name"
                    className="h-12 w-full rounded-2xl border border-line bg-slate-50 px-4 text-sm text-ink outline-none"
                  />
                </div>
              </StepShell>
            ) : null}

            {step === 3 ? (
              <StepShell
                step={3}
                total={5}
                onBack={handleYouthBack}
                onNext={handleYouthNext}
                canNext={canAdvanceStepThree}
              >
                <div className="text-center">
                  <div className="text-xl font-bold tracking-tight text-ink">Tell us what you can do</div>
                  <div className="mt-2 text-sm text-ink/65">Record your work, skills, or experience.</div>
                </div>
                <div className="mt-5 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleMicTap}
                    className={`flex h-32 w-32 items-center justify-center rounded-full transition ${
                      recordingActive ? "animate-pulse bg-teal" : "bg-slate-100"
                    }`}
                    aria-label="Record experience"
                  >
                    <MicIcon active={recordingActive} />
                  </button>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                    {recordingStage === "recording" ? (
                      <>
                        Recording...
                        <StatusDots />
                      </>
                    ) : recordingStage === "transcribing" ? (
                      <>
                        Listening...
                        <StatusDots />
                      </>
                    ) : (
                      "Tap to record"
                    )}
                  </div>
                </div>
                <textarea
                  value={experienceText}
                  onChange={(event) => setExperienceText(event.target.value)}
                  className="mt-5 h-32 w-full rounded-[28px] border border-line bg-slate-50 px-4 py-3 text-sm text-ink outline-none"
                />
                <div className="mt-5 flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <SignalChip
                      key={skill}
                      active={selectedSkills.includes(skill)}
                      label={skill}
                      onClick={() => toggleYouthSkill(skill)}
                    />
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <input
                    value={draftSkill}
                    onChange={(event) => setDraftSkill(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addYouthSkill();
                      }
                    }}
                    placeholder="Add another skill"
                    className="h-12 flex-1 rounded-2xl border border-line bg-slate-50 px-4 text-sm text-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={addYouthSkill}
                    className="h-12 rounded-2xl bg-slate-100 px-4 text-sm font-semibold text-ink"
                  >
                    Add
                  </button>
                </div>
              </StepShell>
            ) : null}

            {step === 4 ? (
              <StepShell step={4} total={5} onBack={handleYouthBack} onNext={handleYouthNext}>
                <div className="space-y-3">
                  {evidenceCards.map((card) => (
                    <div key={card.label} className="rounded-[28px] bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-ink">{card.label}</div>
                        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">
                          {card.confidence}
                        </div>
                      </div>
                      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                        Make stronger
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-ink">
                          Upload proof
                        </button>
                        <button type="button" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-ink">
                          <span className="inline-flex items-center gap-1">
                            <CameraIcon />
                            Take photo
                          </span>
                        </button>
                        <button type="button" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-ink">
                          Add example
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </StepShell>
            ) : null}

            {step === 5 ? (
              <StepShell
                step={5}
                total={5}
                onBack={handleYouthBack}
                showNext={false}
                contentScrollable
                backLabel="Back"
              >
                <div className="space-y-5">
                  <div className="rounded-[28px] bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Skills Passport</div>
                    <div className="mt-2 text-lg font-bold text-ink">
                      {selectedCountry ? `${selectedCountry.name} · ${city}` : city}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSystemView(true)}
                      className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm"
                    >
                      System View
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {passportCards.map((card) => (
                      <div key={card.label} className="rounded-[24px] bg-slate-50 p-4">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-teal">
                          {card.icon}
                        </div>
                        <div className="mt-3 text-sm font-semibold text-ink">{card.label}</div>
                        <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70">
                          {card.badge}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-ink">Available Jobs</div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {youthSignals.map((item) => (
                        <div key={item.label} className="rounded-[20px] bg-slate-50 p-3">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">{item.label}</div>
                          <div className="mt-2 text-sm font-semibold text-ink">{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-3">
                      {youthMatches.map((card) => (
                        <div key={`${card.title}-${card.owner}`} className="rounded-[28px] border border-line bg-white p-4 shadow-sm">
                          <div className="text-sm font-bold text-ink">{card.title}</div>
                          <div className="mt-2 text-sm text-ink/70">{card.metaOne}</div>
                          <div className="mt-1 text-sm text-ink/70">{card.metaTwo}</div>
                          <div className="mt-1 text-sm text-ink/70">
                            {card.ownerLabel}: {card.owner}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setToastMessage("Calling employer...")}
                              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-semibold text-ink"
                            >
                              <PhoneIcon />
                              Call
                            </button>
                            <button
                              type="button"
                              onClick={() => setToastMessage("Message request sent")}
                              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-teal text-sm font-semibold text-white"
                            >
                              <MessageIcon />
                              Message
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-ink">Improve your profile</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Verify repair skill", "Upload certificate", "Add work example"].map((item) => (
                        <div key={item} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-ink">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </StepShell>
            ) : null}
          </div>
        ) : null}

        {mode === "employer" ? (
          <div className="w-full">
            {employerStep === 1 ? (
              <StepShell
                step={1}
                total={2}
                onBack={handleEmployerBack}
                onNext={handleEmployerNext}
                canNext={canAdvanceEmployerOne}
              >
                <div className="text-center">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">Add a job</div>
                </div>
                <div className="mt-5 space-y-3">
                  <input
                    value={employerTitle}
                    onChange={(event) => setEmployerTitle(event.target.value)}
                    placeholder="Job title"
                    className="h-12 w-full rounded-2xl border border-line bg-slate-50 px-4 text-sm text-ink outline-none"
                  />
                  <input
                    value={employerCity}
                    onChange={(event) => setEmployerCity(event.target.value)}
                    placeholder="City / region"
                    className="h-12 w-full rounded-2xl border border-line bg-slate-50 px-4 text-sm text-ink outline-none"
                  />
                  <input
                    value={employerPhone}
                    onChange={(event) => setEmployerPhone(event.target.value)}
                    placeholder="Phone number"
                    className="h-12 w-full rounded-2xl border border-line bg-slate-50 px-4 text-sm text-ink outline-none"
                  />
                  <textarea
                    value={employerDescription}
                    onChange={(event) => setEmployerDescription(event.target.value)}
                    placeholder="Job description"
                    className="h-32 w-full rounded-[28px] border border-line bg-slate-50 px-4 py-3 text-sm text-ink outline-none"
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={useEmployerExample}
                    className="h-12 flex-1 rounded-2xl bg-slate-100 text-sm font-semibold text-ink"
                  >
                    Use example
                  </button>
                  <button
                    type="button"
                    onClick={extractJobSkills}
                    className="h-12 flex-1 rounded-2xl bg-teal text-sm font-semibold text-white"
                  >
                    Extract skills
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {employerSkillOptions.map((skill) => (
                    <SignalChip
                      key={skill}
                      active={employerSelectedSkills.includes(skill)}
                      label={skill}
                      onClick={() => toggleEmployerSkill(skill)}
                    />
                  ))}
                </div>
              </StepShell>
            ) : null}

            {employerStep === 2 ? (
              <StepShell
                step={2}
                total={2}
                onBack={handleEmployerBack}
                showNext={false}
                footer={
                  employerSubmitted ? (
                    <button
                      type="button"
                      onClick={() => setMode("home")}
                      className="h-14 w-full rounded-2xl bg-teal text-sm font-semibold text-white"
                    >
                      Back to start
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleEmployerBack}
                        className="h-14 flex-1 rounded-2xl bg-slate-100 text-sm font-semibold text-ink"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={addEmployerJob}
                        className="h-14 flex-1 rounded-2xl bg-teal text-sm font-semibold text-white"
                      >
                        Add job
                      </button>
                    </div>
                  )
                }
              >
                {employerSubmitted ? (
                  <div className="rounded-[28px] bg-slate-50 p-5 text-center">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">Job added</div>
                    <div className="mt-3 text-lg font-bold text-ink">Matching candidates can now contact you</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-[28px] bg-slate-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Summary</div>
                      <div className="mt-3 space-y-2 text-sm text-ink">
                        <div className="font-semibold text-ink">{employerTitle}</div>
                        <div>{employerCity}</div>
                        <div>{employerPhone}</div>
                      </div>
                    </div>

                    <div className="rounded-[28px] bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-ink">Required skills</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {employerSelectedSkills.map((skill) => (
                          <div key={skill} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[28px] bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-ink">Suggested matching profile</div>
                      <div className="mt-2 text-sm text-ink/70">
                        Best matched to youth with repair + customer service skills
                      </div>
                    </div>
                  </div>
                )}
              </StepShell>
            ) : null}
          </div>
        ) : null}
      </main>

      {showSystemView ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/25 px-3 pb-4">
          <div className="w-full max-w-[420px] rounded-[28px] bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-ink">How this was matched</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                  Evidence → Skill → Taxonomy → Risk → Opportunity
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSystemView(false)}
                className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-ink"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {systemRows.map((row) => (
                <div key={row.evidence} className="rounded-[24px] bg-slate-50 p-4 text-sm">
                  <div className="font-semibold text-ink">Evidence: {row.evidence}</div>
                  <div className="mt-1 text-ink/70">Skill: {row.skill}</div>
                  <div className="mt-1 text-ink/70">Taxonomy: {row.taxonomy}</div>
                  <div className="mt-1 text-ink/70">AI risk: {row.risk}</div>
                  <div className="mt-1 text-ink/70">Opportunity: {row.opportunity}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["ISCO sample", "ESCO sample", "O*NET sample", "ILOSTAT sample", "World Bank WDI sample"].map((item) => (
                <div key={item} className="rounded-full bg-slate-100 px-3 py-2 text-[11px] font-semibold text-ink/70">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-24px)] max-w-[360px] -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-soft">
          {toastMessage}
        </div>
      ) : null}
    </>
  );
}
