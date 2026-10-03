import type { ReactNode } from "react";
import { BuildingNav, type FloorId } from "./BuildingNav";
import "./building.css";

export function BuildingShell({
  floor,
  children,
}: {
  floor: FloorId;
  children: ReactNode;
}) {
  return (
    <div
      className="building"
      data-building="workflo"
      data-floor={floor}
      data-type="Navigo"
      style={{ fontFamily: "Navigo, system-ui, sans-serif", ["--wf-yellow" as string]: "#F2F400" }}
    >
      <BuildingNav floor={floor} />
      <div className="building-floor">{children}</div>
    </div>
  );
}
