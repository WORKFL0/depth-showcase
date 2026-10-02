import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { loadCockpitData } from "@/lib/server-cockpit";

export const dynamic = "force-dynamic";

export default async function Home() {
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
