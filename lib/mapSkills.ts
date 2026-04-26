import type { CountryConfig, Evidence, SkillSignal } from "@/lib/types";

const confidenceWeights = {
  low: 1,
  medium: 2,
  high: 3,
  verified: 4
} as const;

function toVerificationStatus(source: Evidence["source"]): SkillSignal["verificationStatus"] {
  if (source === "verified") return "verified";
  if (source === "demonstrated") return "demonstrated";
  if (source === "inferred") return "inferred";
  return "self-declared";
}

function mergeConfidence(a: SkillSignal["confidence"], b: SkillSignal["confidence"]): SkillSignal["confidence"] {
  return confidenceWeights[a] >= confidenceWeights[b] ? a : b;
}

function addSkill(
  collection: Map<string, SkillSignal>,
  skill: Omit<SkillSignal, "evidenceIds"> & { evidenceIds: string[] }
) {
  const existing = collection.get(skill.skillId);
  if (!existing) {
    collection.set(skill.skillId, skill);
    return;
  }

  collection.set(skill.skillId, {
    ...existing,
    evidenceIds: Array.from(new Set([...existing.evidenceIds, ...skill.evidenceIds])),
    confidence: mergeConfidence(existing.confidence, skill.confidence),
    adjacentPathways: Array.from(new Set([...existing.adjacentPathways, ...skill.adjacentPathways]))
  });
}

export function mapEvidenceToSkills(evidence: Evidence[], countryConfig: CountryConfig): SkillSignal[] {
  const skills = new Map<string, SkillSignal>();

  for (const item of evidence) {
    if (item.type === "education_foundation") {
      const educationMapping =
        countryConfig.educationMapping[item.rawInput] ??
        countryConfig.educationMapping.secondary_certificate ?? {
          mappedLevel: "upper_secondary",
          baselineSkills: ["literacy", "numeracy"],
          confidence: "medium"
        };
      const baseline = educationMapping.baselineSkills;
      for (const baselineSkill of baseline) {
        const label = baselineSkill.replaceAll("_", " ");
        addSkill(skills, {
          skillId: baselineSkill,
          label: label.charAt(0).toUpperCase() + label.slice(1),
          category: "foundation",
          evidenceIds: [item.id],
          confidence: educationMapping.confidence,
          verificationStatus: toVerificationStatus(item.source),
          explanation: "Formal schooling is treated as foundational readiness, not direct occupational proof.",
          adjacentPathways: ["structured training readiness", "entry-level service work"]
        });
      }
    }

    if (item.type === "multilingual") {
      addSkill(skills, {
        skillId: "multilingual_communication",
        label: "Multilingual communication",
        category: "communication",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Using multiple languages is a direct signal for customer-facing and field-facing communication.",
        adjacentPathways: ["customer support", "field data collection", "community outreach", "sales"]
      });
      addSkill(skills, {
        skillId: "customer_communication",
        label: "Customer communication",
        category: "communication",
        evidenceIds: [item.id],
        confidence: "medium",
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Language flexibility improves real-time explanation and rapport with different clients.",
        adjacentPathways: ["service desk assistant", "sales support"]
      });
      addSkill(skills, {
        skillId: "local_language_mediation",
        label: "Local language mediation",
        category: "communication",
        evidenceIds: [item.id],
        confidence: "medium",
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Local language ability helps bridge formal systems and community-level trust.",
        adjacentPathways: ["community outreach", "field coordination", "local interpretation"]
      });
    }

    if (item.type === "repair_technical") {
      addSkill(skills, {
        skillId: "device_diagnostics",
        label: "Device diagnostics",
        category: "technical",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Repeated repair work strongly suggests the ability to isolate faults and test fixes.",
        adjacentPathways: ["phone repair technician", "solar repair trainee", "field service support"]
      });
      addSkill(skills, {
        skillId: "troubleshooting",
        label: "Troubleshooting",
        category: "technical",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Repair activity is direct evidence of practical troubleshooting and iterative problem solving.",
        adjacentPathways: ["electronics repair", "mechanic apprenticeship", "technical support"]
      });
      addSkill(skills, {
        skillId: "small_electronics_handling",
        label: "Small electronics handling",
        category: "technical",
        evidenceIds: [item.id],
        confidence: "medium",
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Handling delicate components indicates familiarity with tools, safety, and repair precision.",
        adjacentPathways: ["bench repair", "device servicing"]
      });
      addSkill(skills, {
        skillId: "manual_dexterity",
        label: "Manual dexterity",
        category: "technical",
        evidenceIds: [item.id],
        confidence: "medium",
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Precision repair work implies fine-motor control and steady manual technique.",
        adjacentPathways: ["appliance servicing", "mechanical repair"]
      });
    }

    if (item.type === "business_ops") {
      addSkill(skills, {
        skillId: "inventory_pricing",
        label: "Inventory and pricing",
        category: "operations",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Running a small business usually requires tracking prices, stock, and basic margins.",
        adjacentPathways: ["retail inventory assistant", "technical sales assistant", "market logistics"]
      });
      addSkill(skills, {
        skillId: "customer_service",
        label: "Customer service",
        category: "service",
        evidenceIds: [item.id],
        confidence: "medium",
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Keeping customers and repeat buyers is a practical signal of service delivery.",
        adjacentPathways: ["electronics shop assistant", "mobile money agent", "customer support"]
      });
    }

    if (item.type === "customer_service") {
      addSkill(skills, {
        skillId: "customer_service",
        label: "Customer service",
        category: "service",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Real customer or care work indicates patience, clarity, and trust handling.",
        adjacentPathways: ["customer support", "care coordination", "service desk assistant"]
      });
      addSkill(skills, {
        skillId: "customer_communication",
        label: "Customer communication",
        category: "communication",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Explaining delays, options, or care routines is meaningful service communication.",
        adjacentPathways: ["frontline support", "technical sales", "field coordination"]
      });
    }

    if (item.type === "money_inventory") {
      addSkill(skills, {
        skillId: "record_keeping",
        label: "Record keeping",
        category: "operations",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Tracking money, stock, or appointments suggests basic record discipline.",
        adjacentPathways: ["inventory assistant", "field data work", "mobile money agent"]
      });
      addSkill(skills, {
        skillId: "inventory_pricing",
        label: "Inventory and pricing",
        category: "operations",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Handling costs and stock is a direct operational skill signal.",
        adjacentPathways: ["retail operations", "market logistics"]
      });
      addSkill(skills, {
        skillId: "numeracy",
        label: "Numeracy",
        category: "foundation",
        evidenceIds: [item.id],
        confidence: "medium",
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Money handling signals functional arithmetic in work settings.",
        adjacentPathways: ["cash handling", "stock support"]
      });
    }

    if (item.type === "digital_tool_use") {
      addSkill(skills, {
        skillId: "digital_literacy",
        label: "Digital literacy",
        category: "digital",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Using phones, forms, or digital coordination tools is a direct digital readiness signal.",
        adjacentPathways: ["field data collection", "digital support", "administrative assistance"]
      });
    }

    if (item.type === "digital_learning") {
      addSkill(skills, {
        skillId: "self_directed_learning",
        label: "Self-directed learning",
        category: "digital",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Learning online shows initiative and the ability to build skills without formal instruction.",
        adjacentPathways: ["training bridge", "technical upskilling", "digital admin work"]
      });
      addSkill(skills, {
        skillId: "digital_literacy",
        label: "Digital literacy",
        category: "digital",
        evidenceIds: [item.id],
        confidence: "medium",
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Using digital learning channels also suggests comfort navigating digital interfaces.",
        adjacentPathways: ["form-based workflows", "remote support"]
      });
    }

    if (item.type === "coding_basics") {
      addSkill(skills, {
        skillId: "basic_software_logic",
        label: "Basic software logic",
        category: "digital",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Basic coding exposure supports entry-level technical and workflow-support pathways.",
        adjacentPathways: ["QA trainee", "no-code operations assistant", "digital support"]
      });
    }

    if (item.type === "peer_training") {
      addSkill(skills, {
        skillId: "peer_training",
        label: "Peer training",
        category: "leadership",
        evidenceIds: [item.id],
        confidence: item.confidence,
        verificationStatus: toVerificationStatus(item.source),
        explanation: "Helping others learn implies repeatable knowledge and communication confidence.",
        adjacentPathways: ["community navigator", "onboarding support", "training assistant"]
      });
    }
  }

  return Array.from(skills.values()).sort((a, b) => confidenceWeights[b.confidence] - confidenceWeights[a.confidence]);
}
