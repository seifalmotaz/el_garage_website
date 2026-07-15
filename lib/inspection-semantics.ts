/**
 * Resolve inspection answer status the same way the dashboard does:
 * match `answerValue` to a catalog option's `semanticType`.
 *
 * Production stores option *values* (e.g. `no_defect`, `light`, `wide`,
 * or newer `opt_xxx` ids) — never raw GOOD/WARN/BAD. Guessing from
 * substrings like "no" is wrong; this module is the single place that
 * maps value → semantic type for the website.
 */

export type InspectionSemanticType = "GOOD" | "WARN" | "BAD";

export type InspectionAnswerOption = {
  value: string;
  label: string;
  semanticType: InspectionSemanticType;
};

/**
 * Legacy seed / pre-republish option values still present on live cars.
 * Mirrors the historical seed catalog (no_defect=GOOD, light/wide=WARN, deep=BAD)
 * and Arabic labels used in the admin UI.
 */
const LEGACY_VALUE_SEMANTICS: Record<string, InspectionSemanticType> = {
  // GOOD
  no_defect: "GOOD",
  no_scratches: "GOOD",
  none: "GOOD",
  without: "GOOD",
  pass: "GOOD",
  good: "GOOD",
  excellent: "GOOD",
  yes: "GOOD", // only when value is exactly yes (not "yes_defect")
  // WARN
  light: "WARN",
  minor: "WARN",
  fair: "WARN",
  wide: "WARN",
  visible: "WARN",
  medium: "WARN",
  warn: "WARN",
  // BAD
  deep: "BAD",
  heavy: "BAD",
  bad: "BAD",
  fail: "BAD",
  severe: "BAD",
  poor: "BAD",
  no: "BAD",
};

/** Arabic labels commonly used as option labels in El Garage. */
const LEGACY_LABEL_SEMANTICS: Record<string, InspectionSemanticType> = {
  "بدون خلافات": "GOOD",
  "بدون عيوب": "GOOD",
  "بدون خدوش": "GOOD",
  ممتاز: "GOOD",
  جيد: "GOOD",
  سليم: "GOOD",
  خفيف: "WARN",
  خفيفة: "WARN",
  واسع: "WARN",
  واضحة: "WARN",
  متوسط: "WARN",
  مقبول: "WARN",
  عميق: "BAD",
  عميقة: "BAD",
  ضعيف: "BAD",
  سيء: "BAD",
};

/**
 * Build a lookup from questionKey → options (from active/version catalog).
 */
export function buildOptionCatalog(
  sections: Array<{
    questions?: Array<{
      questionKey: string;
      answerOptions?: InspectionAnswerOption[];
    }>;
  }>,
): Map<string, InspectionAnswerOption[]> {
  const map = new Map<string, InspectionAnswerOption[]>();
  for (const section of sections) {
    for (const q of section.questions ?? []) {
      if (q.questionKey && q.answerOptions?.length) {
        map.set(q.questionKey, q.answerOptions);
      }
    }
  }
  return map;
}

/**
 * Resolve semantic type for one response.
 *
 * Priority (dashboard-compatible):
 * 1. Explicit `semanticType` from the car detail API (when backend ships it)
 * 2. Match answerValue against catalog options for this questionKey
 * 3. Match answerText / answerValue against known legacy values & Arabic labels
 * 4. Literal GOOD|WARN|BAD in answerValue
 * 5. WARN (never invent a false GOOD)
 */
export function resolveInspectionSemanticType(input: {
  answerValue: string;
  answerText?: string | null;
  questionKey?: string | null;
  semanticType?: InspectionSemanticType | null;
  catalog?: Map<string, InspectionAnswerOption[]>;
}): InspectionSemanticType {
  if (
    input.semanticType === "GOOD" ||
    input.semanticType === "WARN" ||
    input.semanticType === "BAD"
  ) {
    return input.semanticType;
  }

  const value = (input.answerValue ?? "").trim();
  const valueLower = value.toLowerCase();

  // Catalog match (current version options: opt_xxx or legacy values)
  if (input.questionKey && input.catalog) {
    const options = input.catalog.get(input.questionKey);
    if (options?.length) {
      const byValue = options.find(
        (o) => o.value === value || o.value.toLowerCase() === valueLower,
      );
      if (byValue) return byValue.semanticType;

      const text = (input.answerText ?? "").trim();
      if (text) {
        const byLabel = options.find(
          (o) => o.label === text || o.label.trim() === text,
        );
        if (byLabel) return byLabel.semanticType;
      }
    }
  }

  // Legacy English option values
  if (LEGACY_VALUE_SEMANTICS[valueLower]) {
    return LEGACY_VALUE_SEMANTICS[valueLower];
  }

  // Literal enum
  const upper = value.toUpperCase();
  if (upper === "GOOD" || upper === "WARN" || upper === "BAD") {
    return upper;
  }

  // Arabic labels (answerText or value)
  const label = (input.answerText ?? value).trim();
  if (LEGACY_LABEL_SEMANTICS[label]) {
    return LEGACY_LABEL_SEMANTICS[label];
  }

  return "WARN";
}

/** ✓ vs ! for the car-detail sidebar (GOOD = pass, else issue). */
export function isInspectionPass(input: {
  answerValue: string;
  answerText?: string | null;
  questionKey?: string | null;
  semanticType?: InspectionSemanticType | null;
  catalog?: Map<string, InspectionAnswerOption[]>;
}): boolean {
  return resolveInspectionSemanticType(input) === "GOOD";
}
