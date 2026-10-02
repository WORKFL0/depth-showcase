"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import "./morning-depth.css";

type Props = {
  displayClass: string;
  monoClass: string;
};

const MARKS = [
  { time: "06:40", line: "Eerste licht op de zaak." },
  { time: "07:15", line: "De brief, nog zonder mail." },
  { time: "08:00", line: "Dan pas de dag zelf." },
];

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function drawField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  px: number,
  py: number,
  reduced: boolean,
) {
  const drift = reduced ? 0 : time;
  ctx.clearRect(0, 0, w, h);

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#1a242e");
  sky.addColorStop(0.4, "#101820");
  sky.addColorStop(1, "#080d12");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const vx = w * (0.7 + px * 0.04);
  const vy = h * (0.42 + py * 0.028);

  const dawn = ctx.createRadialGradient(vx, vy, 0, vx, vy, Math.max(w, h) * 0.58);
  dawn.addColorStop(0, "rgba(222, 186, 158, 0.22)");
  dawn.addColorStop(0.28, "rgba(168, 118, 88, 0.07)");
  dawn.addColorStop(1, "rgba(8, 13, 18, 0)");
  ctx.fillStyle = dawn;
  ctx.fillRect(0, 0, w, h);

  const slabs = 13;
  const paintSlabs = (dir: 1 | -1) => {
    for (let i = 0; i < slabs; i++) {
      const p = i / (slabs - 1);
      const e = easeOut(p);
      const breathe = reduced ? 0 : Math.sin(drift * 0.32 + i * 0.5) * (1.5 + e * 5);
      const reach = dir === 1 ? h * 0.74 : h * 0.5;
      const y = vy + dir * (14 + e * reach) + breathe * 0.2;
      const span = w * 0.045 + e * w * 1.18;
      const left = vx - span * 0.6;
      const right = vx + span * 0.42;
      const thick = dir === 1 ? 1 + e * e * 20 : 0.8 + e * 7;
      const y2 = y + dir * thick;
      const pinch = 0.9;

      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.lineTo(vx + (right - vx) * pinch, y2);
      ctx.lineTo(vx + (left - vx) * pinch, y2);
      ctx.closePath();

      const alpha = 0.045 + e * 0.22;
      const fill = ctx.createLinearGradient(left, y, right, y);
      fill.addColorStop(0, `rgba(140, 164, 176, ${alpha * 0.35})`);
      fill.addColorStop(0.45, `rgba(220, 230, 236, ${alpha})`);
      fill.addColorStop(1, `rgba(110, 132, 144, ${alpha * 0.3})`);
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.strokeStyle = `rgba(236, 242, 246, ${0.08 + e * 0.38})`;
      ctx.lineWidth = e > 0.88 ? 1.35 : 1;
      ctx.stroke();

      if (dir === 1 && i === slabs - 1) {
        ctx.strokeStyle = "rgba(201, 132, 90, 0.9)";
        ctx.lineWidth = 1.75;
        ctx.stroke();
      }
    }
  };

  paintSlabs(-1);
  paintSlabs(1);

  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    const u = (i / 8) * 2 - 1;
    const sway = reduced ? 0 : Math.sin(drift * 0.2 + i) * 4;
    ctx.beginPath();
    ctx.moveTo(vx + u * w * 0.16, vy);
    ctx.lineTo(vx + u * w * 0.7 + sway, h + 8);
    ctx.strokeStyle = `rgba(231, 238, 242, ${0.045 + Math.abs(u) * 0.05})`;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(vx + u * w * 0.12, vy);
    ctx.lineTo(vx + u * w * 0.34, -8);
    ctx.strokeStyle = "rgba(231, 238, 242, 0.035)";
    ctx.stroke();
  }

  const shaft = ctx.createLinearGradient(vx, 0, vx, h);
  shaft.addColorStop(0, "rgba(236, 226, 214, 0.02)");
  shaft.addColorStop(0.38, "rgba(222, 186, 156, 0.16)");
  shaft.addColorStop(1, "rgba(201, 132, 90, 0.04)");
  ctx.fillStyle = shaft;
  ctx.beginPath();
  ctx.moveTo(vx - 28, 0);
  ctx.lineTo(vx + 70, 0);
  ctx.lineTo(vx + 160, h);
  ctx.lineTo(vx - 70, h);
  ctx.closePath();
  ctx.fill();

  if (!reduced) {
    for (let i = 0; i < 42; i++) {
      const seed = ((i * 97) % 1000) / 1000;
      const speed = 10 + (i % 5) * 6;
      const x = (seed * w * 1.2 + drift * speed) % (w + 20) - 10;
      const yBase = (seed * 1.3 + i * 0.017) % 1;
      const y = h - ((yBase + drift * 0.035) % 1) * (h + 20);
      ctx.beginPath();
      ctx.arc(x, y, 0.55 + (i % 3) * 0.4, 0, Math.PI * 2);
      ctx.fillStyle =
        i % 8 === 0 ? "rgba(201, 132, 90, 0.7)" : "rgba(231, 238, 242, 0.38)";
      ctx.fill();
    }
  }

  const veil = ctx.createLinearGradient(0, 0, w * 0.58, 0);
  veil.addColorStop(0, "rgba(12, 18, 24, 0.82)");
  veil.addColorStop(0.48, "rgba(12, 18, 24, 0.34)");
  veil.addColorStop(1, "rgba(12, 18, 24, 0)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, w, h);

  const floor = ctx.createLinearGradient(0, h * 0.62, 0, h);
  floor.addColorStop(0, "rgba(8, 13, 18, 0)");
  floor.addColorStop(1, "rgba(8, 13, 18, 0.62)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, w, h);
}

export function MorningDepth({ displayClass, monoClass }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const start = performance.now();

    const paint = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawField(
        ctx,
        w,
        h,
        (now - start) / 1000,
        pointer.current.x,
        pointer.current.y,
        reduced,
      );
      if (!reduced) raf = requestAnimationFrame(paint);
    };

    raf = requestAnimationFrame(paint);
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <section
      className={`morning-depth ${displayClass}`}
      data-surface="morning-depth"
      onPointerMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      }}
    >
      <canvas
        ref={canvasRef}
        className="morning-depth__canvas"
        aria-hidden="true"
      />
      <div className="morning-depth__grain" aria-hidden="true" />
      <nav className={`morning-depth__nav ${monoClass}`} aria-label="Workflo">
        <Link className="morning-depth__brand" href="/">
          Workflo
        </Link>
        <div className="morning-depth__links">
          <Link href="/" aria-current="page">
            Diepte
          </Link>
          <Link href="/brief">Brief</Link>
          <Link href="/atelier">Experiment</Link>
        </div>
      </nav>
      <div className="morning-depth__stage">
        <div>
          <p className={`morning-depth__kicker morning-depth__rise ${monoClass}`}>
            Workflo B.V. · Amsterdam
          </p>
          <h1 className="morning-depth__rise morning-depth__rise--2">
            De ochtend ligt dieper dan de inbox.
          </h1>
          <p className="morning-depth__lede morning-depth__rise morning-depth__rise--3">
            Het bedrijf staat al overeind voordat de eerste mail open gaat.
            Kijk eerst hoe de dag eronder ligt. De brief wacht één verdieping lager.
          </p>
          <div className="morning-depth__actions morning-depth__rise morning-depth__rise--4">
            <Link className="morning-depth__cta" href="/brief">
              Open de ochtendbrief
              <span className="morning-depth__cta-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 11L11 3M11 3H5.5M11 3V8.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </span>
            </Link>
            <Link className="morning-depth__quiet" href="/atelier">
              Atelier, als experiment
            </Link>
          </div>
        </div>
        <aside className="morning-depth__rail" aria-label="Ochtend, in drie lagen">
          <ol className={monoClass}>
            {MARKS.map((mark) => (
              <li key={mark.time}>
                <span className="morning-depth__time">{mark.time}</span>
                <p className={displayClass}>{mark.line}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <p className={`morning-depth__foot ${monoClass}`}>
        Snede door de ochtend · geen dashboard
      </p>
    </section>
  );
}
