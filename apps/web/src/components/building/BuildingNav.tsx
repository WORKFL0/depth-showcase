import Link from "next/link";

export const FLOORS = [
  { href: "/", id: "diepte", label: "Diepte" },
  { href: "/brief", id: "brief", label: "Brief" },
  { href: "/atelier", id: "experiment", label: "Experiment" },
  { href: "/sales", id: "sales", label: "Sales" },
] as const;

export type FloorId = (typeof FLOORS)[number]["id"];

/** Shared pill. The string data-building="een-gebouw" is the live marker. */
export function BuildingNav({
  floor,
  monoClass,
}: {
  floor: FloorId;
  monoClass: string;
}) {
  return (
    <nav
      className={`building-nav ${monoClass}`}
      aria-label="Verdiepingen"
      data-building="een-gebouw"
    >
      <Link className="building-brand" href="/">
        Workflo
      </Link>
      <div className="building-pills">
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
