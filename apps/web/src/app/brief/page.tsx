import type { Metadata } from "next";
import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { loadCockpitData } from "@/lib/server-cockpit";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ochtendbrief",
  description:
    "CEO cockpit voor Florian: moet vandaag, vastgelopen, instappen. Company OS, sales craft, bots.",
};

export default async function BriefPage() {
  const data = await loadCockpitData();
  return (
    <CockpitShell
      initialBrief={data.brief}
      initialHealth={data.health}
      initialHandoff={data.handoff}
      initialProjects={data.projects}
      initialOsHeadline={data.osHeadline}
      initialOfferte={data.offerte}
    />
  );
}
