import Link from "next/link";

export const FLOORS = [
  { href: "/", id: "ochtend", label: "Ochtend" },
  { href: "/brief", id: "brief", label: "Brief" },
  { href: "/atelier", id: "atelier", label: "Atelier" },
  { href: "/sales", id: "sales", label: "Sales" },
] as const;

export type FloorId = (typeof FLOORS)[number]["id"];

export function BuildingNav({ floor }: { floor: FloorId }) {
  return (
    <nav className="building-nav" aria-label="Verdiepingen" data-building="workflo">
      <Link className="building-brand" href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logos/logo-horizontal-black.png"
          alt="Workflo"
          width={156}
          height={34}
        />
      </Link>
      <div className="building-links">
        {FLOORS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-current={item.id === floor ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
