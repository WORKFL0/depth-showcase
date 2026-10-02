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
  sessionId: z.string().min(1).optional(),
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
  mode: z.enum(["procedural", "discovered"]).optional(),
});
export type Constellation = z.infer<typeof ConstellationSchema>;

export const StoreModeSchema = z.enum(["memory", "file"]);
export type StoreMode = z.infer<typeof StoreModeSchema>;

/** GET /api/health */
export const HealthSchema = z.object({
  ok: z.literal(true),
  service: z.literal("depth-engine"),
  version: z.string(),
  storeMode: StoreModeSchema,
});
export type Health = z.infer<typeof HealthSchema>;

/** Session discoveries — unlocked constellation subgraph */
export const SessionDiscoveriesSchema = z.object({
  nodes: z.array(ConstellationNodeSchema),
  edges: z.array(ConstellationEdgeSchema),
});
export type SessionDiscoveries = z.infer<typeof SessionDiscoveriesSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  seed: z.string(),
  hash: z.string(),
  visitedChamberIds: z.array(z.string()),
  lastChamberId: z.string(),
  diveCount: z.number().int().nonnegative(),
  discoveries: SessionDiscoveriesSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Session = z.infer<typeof SessionSchema>;

export const SessionCreateSchema = z
  .object({
    seed: z.string().max(128).optional(),
  })
  .optional();
export type SessionCreate = z.infer<typeof SessionCreateSchema>;

export const SessionPatchSchema = z.object({
  visitChamberId: z.string().min(1).optional(),
  unlockEdge: z
    .object({
      from: z.string().min(1),
      to: z.string().min(1),
      label: z.string(),
    })
    .optional(),
});
export type SessionPatch = z.infer<typeof SessionPatchSchema>;

export const SessionResponseSchema = z.object({
  session: SessionSchema,
  manifest: SeedManifestSchema.optional(),
  chamber: ChamberSchema.optional(),
  token: z.string().optional(),
});
export type SessionResponse = z.infer<typeof SessionResponseSchema>;

/** Error body for 404 / validation */
export const ErrorBodySchema = z.object({
  error: z.string(),
  hint: z.string().optional(),
});
export type ErrorBody = z.infer<typeof ErrorBodySchema>;

/* ─── CEO Day Brief panel ─── */

export const CeoDayBriefTriggerSchema = z.enum([
  "tesla_car_entry",
  "manual",
  "preview",
]);
export type CeoDayBriefTrigger = z.infer<typeof CeoDayBriefTriggerSchema>;

export const CeoDayBriefSourceSchema = z.enum([
  "calendar",
  "handoffs",
  "index_flags",
  "decisions",
  "mail_urgency",
]);
export type CeoDayBriefSource = z.infer<typeof CeoDayBriefSourceSchema>;

export const MustDoItemSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  why: z.string().max(200).optional(),
  due: z.string().optional(),
  owner: z.string().optional(),
  ref: z.string().optional(),
});
export type MustDoItem = z.infer<typeof MustDoItemSchema>;

export const StuckItemSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  blocker: z.string().max(200),
  waitingOn: z.string().optional(),
  since: z.string().optional(),
  ref: z.string().optional(),
});
export type StuckItem = z.infer<typeof StuckItemSchema>;

export const StepInItemSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  decision: z.string().max(200),
  context: z.string().max(280).optional(),
  urgency: z.enum(["today", "this_week", "when_free"]).optional(),
  ref: z.string().optional(),
});
export type StepInItem = z.infer<typeof StepInItemSchema>;

export const CeoDayBriefSchema = z.object({
  panel: z.literal("ceo_day_brief"),
  version: z.string().regex(/^\d+\.\d+$/),
  generatedAt: z.string(),
  trigger: CeoDayBriefTriggerSchema,
  headline: z.string().max(120).optional(),
  sections: z.object({
    mustDo: z.array(MustDoItemSchema).max(5),
    stuck: z.array(StuckItemSchema).max(5),
    stepIn: z.array(StepInItemSchema).max(5),
  }),
  meta: z
    .object({
      sources: z.array(CeoDayBriefSourceSchema).optional(),
      empty: z.boolean().optional(),
    })
    .optional(),
});
export type CeoDayBrief = z.infer<typeof CeoDayBriefSchema>;

/* ─── Showcase handoff card ─── */

export const HandoffListItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  owner: z.string().optional(),
});
export type HandoffListItem = z.infer<typeof HandoffListItemSchema>;

/** Inner card as served by GET /api/showcase/handoff envelope */
export const HandoffCardBodySchema = z.object({
  id: z.string(),
  version: z.string(),
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  owner: z.string(),
  status: z.enum(["draft", "confirmed", "shipped", "open"]),
  summary: z.string(),
  outcomes: z.array(HandoffListItemSchema).optional(),
  openLoops: z.array(HandoffListItemSchema).optional(),
  nextSteps: z.array(HandoffListItemSchema).optional(),
  refs: z.array(z.string()).optional(),
  sampleSessionPath: z.string().optional(),
});
export type HandoffCardBody = z.infer<typeof HandoffCardBodySchema>;

export const HandoffPanelSchema = z.object({
  panel: z.literal("handoff_card"),
  version: z.string(),
  generatedAt: z.string(),
  card: HandoffCardBodySchema,
  sessionPath: z.string().optional(),
  meta: z
    .object({
      source: z.string().optional(),
      empty: z.boolean().optional(),
    })
    .optional(),
});
export type HandoffPanel = z.infer<typeof HandoffPanelSchema>;

/** Alias: docs/handoffs/card.sample.json body */
export const HandoffCardSchema = HandoffCardBodySchema;
export type HandoffCard = HandoffCardBody;
