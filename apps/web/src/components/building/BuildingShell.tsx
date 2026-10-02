import type { ReactNode } from "react";
import { depthDisplay, depthMono } from "@/lib/depth-fonts";
import { BuildingNav, type FloorId } from "./BuildingNav";
import "./building.css";

export function BuildingShell({
  floor,
  variant = "floor",
  children,
}: {
  floor: FloorId;
  variant?: "floor" | "canvas";
  children: ReactNode;
}) {
  return (
    <div
      className={`building building--${variant} ${depthDisplay.className}`}
      data-building="een-gebouw"
      data-floor={floor}
      style={{
        ["--font" as string]: depthDisplay.style.fontFamily,
        ["--mono" as string]: depthMono.style.fontFamily,
      }}
    >
      {variant === "floor" ? (
        <div className="building-shaft" aria-hidden="true">
          <div className="building-shaft__glow" />
          <div className="building-shaft__filament" />
          <div className="building-shaft__floors" />
        </div>
      ) : null}
      <BuildingNav floor={floor} monoClass={depthMono.className} />
      <div className="building-floor">{children}</div>
    </div>
  );
}
