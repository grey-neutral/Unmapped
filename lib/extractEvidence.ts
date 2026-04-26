import type { EducationRecord, Evidence, GuidedAnswers } from "@/lib/types";

function addEvidence(collection: Evidence[], evidence: Evidence) {
  if (!collection.find((item) => item.id === evidence.id)) {
    collection.push(evidence);
  }
}

export function extractEvidence(
  inputText: string,
  guidedAnswers: GuidedAnswers,
  educationData: EducationRecord
): Evidence[] {
  const text = inputText.toLowerCase();
  const evidence: Evidence[] = [];

  addEvidence(evidence, {
    id: "education-foundation",
    type: "education_foundation",
    statement: `Completed ${educationData.localCertificateName || "formal schooling"} in ${educationData.yearCompleted}.`,
    source: educationData.hasProof ? "verified" : "self-declared",
    confidence: educationData.hasProof ? "verified" : "medium",
    rawInput: educationData.highestCompleted,
    inferredFrom: [
      "educationData.highestCompleted",
      "educationData.localCertificateName",
      "educationData.yearCompleted"
    ],
    whyItMatters:
      "Formal schooling provides a baseline signal for literacy, numeracy, and readiness for structured learning.",
    verificationPrompt: educationData.hasProof ? "Already marked with proof." : "Upload a certificate photo or ask a navigator to confirm completion."
  });

  if (guidedAnswers.languages.length > 1 || text.includes("speak ")) {
    const languages = guidedAnswers.languages.join(", ");
    addEvidence(evidence, {
      id: "multilingual-communication",
      type: "multilingual",
      statement: `Uses more than one language in daily life and work: ${languages}.`,
      source: "self-declared",
      confidence: guidedAnswers.languages.length >= 3 ? "high" : "medium",
      rawInput: inputText,
      inferredFrom: ["guidedAnswers.languages", "experienceText"],
      whyItMatters:
        "Multiple languages often improve customer communication, local mediation, and field-facing work.",
      verificationPrompt: "Record a short explanation in two languages or have a navigator confirm spoken fluency."
    });
  }

  if (
    guidedAnswers.repairedDevices ||
    text.includes("repair") ||
    text.includes("repaired") ||
    text.includes("spare parts") ||
    text.includes("diagnose")
  ) {
    addEvidence(evidence, {
      id: "repair-experience",
      type: "repair_technical",
      statement: text.includes("since i was 17")
        ? "Has repaired phones since age 17 and handles diagnosis and spare parts."
        : "Has practical repair experience with devices or machinery.",
      source: "self-declared",
      confidence: text.includes("since i was 17") ? "high" : "medium",
      rawInput: inputText,
      inferredFrom: ["guidedAnswers.repairedDevices", "experienceText"],
      whyItMatters:
        "Repeated repair work signals troubleshooting ability, hands-on technical practice, and practical reliability.",
      verificationPrompt: "Complete a short phone or equipment diagnosis task with a transparent rubric."
    });
  }

  if (
    guidedAnswers.soldOrRunBusiness ||
    text.includes("business") ||
    text.includes("manage prices") ||
    text.includes("sell") ||
    text.includes("market")
  ) {
    addEvidence(evidence, {
      id: "business-operations",
      type: "business_ops",
      statement: "Has sold goods or run a small business, including pricing or transaction decisions.",
      source: "self-declared",
      confidence: guidedAnswers.handledMoney ? "high" : "medium",
      rawInput: inputText,
      inferredFrom: ["guidedAnswers.soldOrRunBusiness", "experienceText"],
      whyItMatters:
        "Informal business activity often signals pricing judgment, initiative, reliability, and customer handling.",
      verificationPrompt: "Show a simple pricing example or explain how daily sales and costs are tracked."
    });
  }

  if (
    guidedAnswers.careOrCustomers ||
    text.includes("customers") ||
    text.includes("care for") ||
    text.includes("support")
  ) {
    addEvidence(evidence, {
      id: "customer-care",
      type: "customer_service",
      statement: "Has experience supporting customers, clients, or family care needs in real situations.",
      source: "self-declared",
      confidence: "medium",
      rawInput: inputText,
      inferredFrom: ["guidedAnswers.careOrCustomers", "experienceText"],
      whyItMatters:
        "Real customer or care interaction is a meaningful signal for trust, communication, and service judgment.",
      verificationPrompt: "Explain how you would respond to a delayed repair or a worried client."
    });
  }

  if (guidedAnswers.handledMoney || text.includes("prices") || text.includes("books") || text.includes("track stock")) {
    addEvidence(evidence, {
      id: "money-inventory",
      type: "money_inventory",
      statement: "Has handled money, stock, pricing, or simple records as part of work.",
      source: "self-declared",
      confidence: "medium",
      rawInput: inputText,
      inferredFrom: ["guidedAnswers.handledMoney", "experienceText"],
      whyItMatters:
        "Money and inventory handling often signal numeracy, record discipline, and operational trustworthiness.",
      verificationPrompt: "Complete a simple stock or cash record exercise."
    });
  }

  if (guidedAnswers.usedDigitalTools || text.includes("phone") || text.includes("computer") || text.includes("digital")) {
    addEvidence(evidence, {
      id: "digital-tools",
      type: "digital_tool_use",
      statement: "Uses a phone, digital forms, or basic digital tools for work or coordination.",
      source: text.includes("digital") ? "self-declared" : "inferred",
      confidence: guidedAnswers.usedDigitalTools ? "medium" : "low",
      rawInput: inputText,
      inferredFrom: ["guidedAnswers.usedDigitalTools", "experienceText"],
      whyItMatters:
        "Digital tool use improves readiness for field data, administrative support, and modern service roles.",
      verificationPrompt: "Complete a simple form, stock log, or phone-based workflow."
    });
  }

  if (guidedAnswers.learnedOnline || text.includes("youtube") || text.includes("online") || text.includes("videos")) {
    addEvidence(evidence, {
      id: "online-learning",
      type: "digital_learning",
      statement: "Has learned new work skills through YouTube, videos, or other online resources.",
      source: "self-declared",
      confidence: "high",
      rawInput: inputText,
      inferredFrom: ["guidedAnswers.learnedOnline", "experienceText"],
      whyItMatters:
        "Self-directed online learning is a strong signal of initiative and adaptability.",
      verificationPrompt: "Describe one thing you learned online and how you applied it."
    });
  }

  if (text.includes("coding") || text.includes("program") || text.includes("software logic")) {
    addEvidence(evidence, {
      id: "coding-basics",
      type: "coding_basics",
      statement: "Has explored basic coding or software logic through self-study.",
      source: "self-declared",
      confidence: "medium",
      rawInput: inputText,
      inferredFrom: ["experienceText"],
      whyItMatters:
        "Even basic exposure to coding can signal digital confidence and readiness for structured technical upskilling.",
      verificationPrompt: "Solve a simple logic or workflow task and explain the steps."
    });
  }

  if (guidedAnswers.trainedOthers || text.includes("showed") || text.includes("trained")) {
    addEvidence(evidence, {
      id: "peer-training",
      type: "peer_training",
      statement: "Has helped another person learn a task or process.",
      source: "self-declared",
      confidence: "medium",
      rawInput: inputText,
      inferredFrom: ["guidedAnswers.trainedOthers", "experienceText"],
      whyItMatters:
        "Teaching others signals communication clarity, retention, and repeatable work knowledge.",
      verificationPrompt: "Give a short demonstration or explain a task step-by-step."
    });
  }

  return evidence;
}
