import { z } from "zod";

/** POST /api/seed — optional body; empty/missing seed → server generates one */
export const SeedRequestSchema = z
  .object({
    seed: z.string().max(128).optional(),
  })
  .optional();
export type SeedRequest = z.infer<typeof SeedRequestSchema>;

/** SeedManifest — frozen contract */
export const SeedManifestSchema = z.object({
  seed: z.string(),
  hash: z.string(),
  palette: z.array(z.string()),
  rootChamberId: z.string(),
  laws: z.array(z.string()),
  createdAt: z.string(),
});
export type SeedManifest = z.infer<typeof SeedManifestSchema>;

/** Phenomenon kinds — frozen */
export const PhenomenonKindSchema = z.enum([
  "light",
  "echo",
  "gravity",
  "memory",
  "silence",
  "fracture",
]);
export type PhenomenonKind = z.infer<typeof PhenomenonKindSchema>;

export const PhenomenonSchema = z.object({
  kind: PhenomenonKindSchema,
  intensity: z.number().min(0).max(1),
  label: z.string(),
  detail: z.string().optional(),
});
export type Phenomenon = z.infer<typeof PhenomenonSchema>;

export const ExitSchema = z.object({
  label: z.string(),
  targetIdHint: z.string(),
  risk: z.number().min(0).max(1),
});
export type Exit = z.infer<typeof ExitSchema>;

/** Chamber — frozen contract */
export const ChamberSchema = z.object({
  id: z.string(),
  depth: z.number(),
  title: z.string(),
  seed: z.string(),
  phenomena: z.array(PhenomenonSchema),
  exits: z.array(ExitSchema),
  resonance: z.number(),
  paradox: z.boolean().optional(),
  whisper: z.string().optional(),
});
export type Chamber = z.infer<typeof ChamberSchema>;

/** POST /api/dive */
export const DiveRequestSchema = z.object({
  fromChamberId: z.string().min(1),
  choiceIndex: z.number().int().optional(),
  intensity: z.number().optional(),
});
export type DiveRequest = z.infer<typeof DiveRequestSchema>;

/** SSE DiveEvent — frozen discriminated union */
export const DiveEventEnterSchema = z.object({
  type: z.literal("enter"),
  chamber: ChamberSchema,
  at: z.string(),
});
export const DiveEventPhenomenonSchema = z.object({
  type: z.literal("phenomenon"),
  phenomenon: PhenomenonSchema,
  at: z.string(),
});
export const DiveEventWhisperSchema = z.object({
  type: z.literal("whisper"),
  text: z.string(),
  at: z.string(),
});
export const DiveEventForkSchema = z.object({
  type: z.literal("fork"),
  exits: z.array(ExitSchema),
  at: z.string(),
});
export const DiveEventSurfaceSchema = z.object({
  type: z.literal("surface"),
  reason: z.string(),
  at: z.string(),
});

export const DiveEventSchema = z.discriminatedUnion("type", [
  DiveEventEnterSchema,
  DiveEventPhenomenonSchema,
  DiveEventWhisperSchema,
  DiveEventForkSchema,
  DiveEventSurfaceSchema,
]);
export type DiveEvent = z.infer<typeof DiveEventSchema>;

/** GET /api/constellation */
export const ConstellationNodeSchema = z.object({
  id: z.string(),
  depth: z.number(),
  title: z.string(),
  paradox: z.boolean().optional(),
});
export type ConstellationNode = z.infer<typeof ConstellationNodeSchema>;

export const ConstellationEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string(),
});
export type ConstellationEdge = z.infer<typeof ConstellationEdgeSchema>;

export const ConstellationSchema = z.object({
  seed: z.string(),
  nodes: z.array(ConstellationNodeSchema),
  edges: z.array(ConstellationEdgeSchema),
});
export type Constellation = z.infer<typeof ConstellationSchema>;

/** GET /api/health */
export const HealthSchema = z.object({
  ok: z.literal(true),
  service: z.literal("depth-engine"),
  version: z.string(),
});
export type Health = z.infer<typeof HealthSchema>;

/** Error body for 404 / validation */
export const ErrorBodySchema = z.object({
  error: z.string(),
  hint: z.string().optional(),
});
export type ErrorBody = z.infer<typeof ErrorBodySchema>;
