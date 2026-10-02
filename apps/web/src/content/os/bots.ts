/** Static Workflo bot roster — no fake status APIs. */
export type BotChip = {
  id: string;
  name: string;
  role: string;
};

export const WORKFLO_BOTS: BotChip[] = [
  { id: "jurre", name: "Jurre", role: "Orchestratie" },
  { id: "backend", name: "Backend", role: "API / Zod" },
  { id: "frontend", name: "Frontend", role: "Atelier UI" },
  { id: "motion", name: "Motion", role: "Beweging" },
  { id: "quote-helper", name: "Quote Helper", role: "Sales craft" },
  { id: "handoff-runner", name: "Handoff Runner", role: "Sessie-log" },
  { id: "accessibility", name: "Accessibility", role: "A11y QA" },
  { id: "performance", name: "Performance", role: "Budgets" },
  { id: "seo-sea", name: "SEO SEA", role: "Search craft" },
  { id: "brand-image", name: "Brand Image", role: "Stills / mark" },
  { id: "daily-ceo", name: "Daily CEO Copilot", role: "Ochtendbrief" },
  { id: "decision-clerk", name: "Decision Clerk", role: "ADR" },
  { id: "os-cartographer", name: "OS Cartographer", role: "INDEX" },
];
