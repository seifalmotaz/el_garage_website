/**
 * Public inspection catalog — used to resolve answerValue → semanticType
 * the same way the dashboard does (match option value on the question).
 *
 *   GET /api/v1/inspection/version/active  (@Public)
 *   GET /api/v1/inspection/version/:id     (@Public)
 */
import { z } from "zod";
import { fetcher } from "./client";

const SemanticSchema = z.enum(["GOOD", "WARN", "BAD"]);

const AnswerOptionSchema = z.object({
  id: z.string().optional(),
  value: z.string(),
  label: z.string(),
  semanticType: SemanticSchema,
  order: z.number().int().optional(),
});

const QuestionSchema = z.object({
  id: z.string(),
  questionKey: z.string(),
  questionText: z.string(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
  answerOptions: z.array(AnswerOptionSchema).optional().default([]),
});

const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string().nullable().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
  questions: z.array(QuestionSchema).optional().default([]),
});

export const InspectionVersionSchema = z.object({
  id: z.string(),
  versionNumber: z.number().int().optional(),
  name: z.string().optional(),
  sections: z.array(SectionSchema).optional().default([]),
});

export type InspectionVersion = z.infer<typeof InspectionVersionSchema>;

export function getActiveInspectionVersion(): Promise<InspectionVersion> {
  return fetcher(
    "/inspection/version/active",
    { method: "GET" },
    InspectionVersionSchema,
  );
}

export function getInspectionVersionById(
  id: string,
): Promise<InspectionVersion> {
  return fetcher(
    `/inspection/version/${encodeURIComponent(id)}`,
    { method: "GET" },
    InspectionVersionSchema,
  );
}
