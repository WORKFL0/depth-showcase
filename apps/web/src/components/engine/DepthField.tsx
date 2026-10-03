"use client";

/**
 * Depth Field — spatial / generative chamber renderer (Frontend-owned).
 * Consumes frozen Chamber. Palette strings are not painted; colors are Workflo tokens.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Suspense,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import * as THREE from "three";
import type { Chamber, Phenomenon, PhenomenonKind } from "@depth-showcase/api";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  chamber: Chamber | null;
  palette: string[] | null;
  diving: boolean;
  pointer: MutableRefObject<{ x: number; y: number }>;
};

/**
 * Workflo paint only. API hue/palette strings are ignored so a seed
 * cannot bring copper, navy, gold, or cyber into the chamber.
 * Yellow is the scarce accent (dive + high-risk exits + paradox wire).
 */
const WF = {
  paper: "#F7F7F5",
  black: "#0A0A0A",
  ink: "#1A1A1A",
  graphite: "#2B2B2B",
  fog: "#6B6B6B",
  mist: "#D6D6D6",
  yellow: "#F2F400",
} as const;

function hash01(label: string, salt: number): number {
  let h = 2166136261 ^ salt;
  const s = `${label}:${salt}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function hashPos(label: string, index: number): [number, number, number] {
  const a = hash01(label, index);
  const b = hash01(label, index + 17);
  const c = hash01(label, index + 41);
  return [(a - 0.5) * 4.2, (b - 0.5) * 2.6, (c - 0.5) * 3.2 - 1.2];
}

function kindColor(kind: PhenomenonKind): string {
  switch (kind) {
    case "gravity":
    case "fracture":
      return WF.black;
    case "silence":
    case "light":
      return WF.ink;
    case "echo":
      return WF.graphite;
    case "memory":
    default:
      return WF.fog;
  }
}

/* ─── Phenomena ─────────────────────────────────────────────── */

function ParticleWake({
  ph,
  color,
  reduced,
  position,
}: {
  ph: Phenomenon;
  color: string;
  reduced: boolean;
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Points>(null);
  const count = reduced ? 48 : 180;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.55) * (1.1 + ph.intensity);
      const th = Math.random() * Math.PI * 2;
      const phs = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phs) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(phs) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(phs);
    }
    return arr;
  }, [count, ph.intensity]);

  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.32) * 0.06;
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035 + ph.intensity * 0.05}
        color={color}
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

function GravityWell({
  ph,
  color,
  reduced,
  position,
}: {
  ph: Phenomenon;
  color: string;
  reduced: boolean;
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.2) * 0.12;
      ref.current.rotation.x = Math.sin(t * 0.32) * 0.08;
    }
    if (halo.current) {
      halo.current.rotation.y = Math.sin(t * 0.32) * 0.1;
      halo.current.rotation.z = Math.sin(t * 0.2) * 0.06;
    }
  });
  const r = 0.42 + ph.intensity * 0.4;
  return (
    <group position={position}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[r, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55 + ph.intensity * 0.7}
          wireframe
          transparent
          opacity={0.78}
        />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[r * 1.55, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}

function EchoLattice({
  ph,
  color,
  reduced,
  position,
}: {
  ph: Phenomenon;
  color: string;
  reduced: boolean;
  position: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    const t = clock.elapsedTime;
    group.current.rotation.z = Math.sin(t * 0.2) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.32) * 0.1;
  });
  const rings = reduced ? 3 : 6;
  return (
    <group ref={group} position={position}>
      {Array.from({ length: rings }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / rings) * Math.PI]}>
          <torusGeometry args={[0.42 + i * 0.16, 0.012, 10, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.22 + (1 - i / rings) * 0.28}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function FractureShard({
  ph,
  color,
  reduced,
  position,
}: {
  ph: Phenomenon;
  color: string;
  reduced: boolean;
  position: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    const t = clock.elapsedTime;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.12;
    group.current.rotation.z = Math.sin(t * 0.32) * 0.1;
    group.current.position.x = position[0] + Math.sin(t * 0.2) * 0.03;
    group.current.position.y = position[1] + Math.sin(t * 0.32) * 0.02;
  });
  return (
    <group ref={group} position={position}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            (i - 1) * 0.22,
            Math.sin(i) * 0.15,
            (i - 1) * -0.12,
          ]}
          rotation={[i * 0.6, i * 0.4, i * 0.9]}
        >
          <tetrahedronGeometry args={[0.28 + ph.intensity * 0.15, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            flatShading
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function SilenceOrb({
  ph,
  color,
  reduced,
  position,
}: {
  ph: Phenomenon;
  color: string;
  reduced: boolean;
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.32) * 0.05;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.55 + ph.intensity * 0.25, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        transparent
        opacity={0.25}
        roughness={0.1}
        metalness={0.2}
        depthWrite={false}
      />
    </mesh>
  );
}

function PhenomenonNode({
  ph,
  palette: _palette,
  reduced,
  index,
}: {
  ph: Phenomenon;
  /** Ignored. Paint comes from WF, not the API palette. */
  palette: string[];
  reduced: boolean;
  index: number;
}) {
  const position = hashPos(ph.label, index);
  void _palette;
  const color = kindColor(ph.kind);

  if (ph.kind === "fracture") {
    return (
      <FractureShard ph={ph} color={color} reduced={reduced} position={position} />
    );
  }
  if (ph.kind === "gravity") {
    return (
      <GravityWell ph={ph} color={color} reduced={reduced} position={position} />
    );
  }
  if (ph.kind === "echo" || ph.kind === "memory") {
    return (
      <EchoLattice ph={ph} color={color} reduced={reduced} position={position} />
    );
  }
  if (ph.kind === "silence") {
    return (
      <SilenceOrb ph={ph} color={color} reduced={reduced} position={position} />
    );
  }
  return (
    <ParticleWake ph={ph} color={color} reduced={reduced} position={position} />
  );
}

/* ─── Dive tunnel ───────────────────────────────────────────── */

function DiveTunnel({
  diving,
  color,
  reduced,
}: {
  diving: boolean;
  color: string;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(
    () =>
      Array.from({ length: reduced ? 6 : 14 }).map((_, i) => ({
        z: -i * 1.35 - 1,
        r: 0.55 + i * 0.08,
      })),
    [reduced],
  );

  useFrame((_, dt) => {
    if (!group.current || reduced) return;
    if (diving) {
      group.current.position.z += dt * 14;
      if (group.current.position.z > 8) group.current.position.z = 0;
      group.current.visible = true;
    } else {
      group.current.position.z = THREE.MathUtils.lerp(
        group.current.position.z,
        0,
        0.08,
      );
      group.current.visible = diving || group.current.position.z > 0.05;
    }
  });

  return (
    <group ref={group} visible={false}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.r, 0.018, 8, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15 + (1 - i / rings.length) * 0.45}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Paradox twin, same slow drift ─────────────────────────── */

function ParadoxCore({
  chamber,
  signal,
  paradox,
  ember,
  reduced,
}: {
  chamber: Chamber;
  signal: string;
  paradox: string;
  ember: string;
  reduced: boolean;
}) {
  const drift = useRef<THREE.Group>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!drift.current) return;
    if (reduced) {
      drift.current.position.y = 0;
      drift.current.rotation.set(0, 0, 0);
      return;
    }
    const t = clock.elapsedTime;
    drift.current.position.y = Math.sin(t * 0.2) * 0.06;
    drift.current.rotation.y = Math.sin(t * 0.2) * 0.05;
    drift.current.rotation.x = Math.sin(t * 0.32) * 0.04;
    if (chamber.paradox) {
      const ox = Math.sin(t * 0.2) * 0.04;
      const oy = Math.sin(t * 0.32) * 0.03;
      if (b.current) {
        b.current.position.x = ox;
        b.current.position.y = -oy;
      }
      if (c.current) {
        c.current.position.x = -ox;
        c.current.position.y = oy;
      }
    }
  });

  const geoArgs: [number, number] = [
    1.05 + chamber.resonance * 0.45,
    chamber.paradox ? 1 : 2,
  ];
  const mainColor = chamber.paradox ? paradox : signal;

  return (
    <group ref={drift}>
      <mesh position={[0, 0, -2.6]}>
        <icosahedronGeometry args={geoArgs} />
        <meshStandardMaterial
          color={mainColor}
          emissive={ember}
          emissiveIntensity={0.2 + chamber.resonance * 0.45}
          wireframe={!!chamber.paradox}
          metalness={0.45}
          roughness={0.28}
          transparent
          opacity={0.88}
        />
      </mesh>
      {chamber.paradox ? (
        <>
          <mesh ref={b} position={[0, 0, -2.6]}>
            <icosahedronGeometry args={geoArgs} />
            <meshBasicMaterial
              color="#F2F400"
              wireframe
              transparent
              opacity={0.2}
              depthWrite={false}
              blending={THREE.NormalBlending}
            />
          </mesh>
          <mesh ref={c} position={[0, 0, -2.6]}>
            <icosahedronGeometry args={geoArgs} />
            <meshBasicMaterial
              color={WF.mist}
              wireframe
              transparent
              opacity={0.15}
              depthWrite={false}
              blending={THREE.NormalBlending}
            />
          </mesh>
        </>
      ) : null}
      <mesh position={[0, 0, -2.6]}>
        <sphereGeometry args={[geoArgs[0] * 1.35, 32, 32]} />
        <meshBasicMaterial
          color={ember}
          transparent
          opacity={0.06 + chamber.resonance * 0.08}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}

/* ─── One drift ─────────────────────────────────────────────── */

function SlowDrift({
  reduced,
  phase,
  children,
}: {
  reduced: boolean;
  phase: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (reduced) {
      ref.current.position.y = 0;
      ref.current.rotation.y = 0;
      return;
    }
    const t = clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.2 + phase) * 0.06;
    ref.current.rotation.y = Math.sin(t * 0.32 + phase) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

/* ─── Exit beacons ──────────────────────────────────────────── */

function ExitBeacons({
  chamber,
  palette,
  reduced,
}: {
  chamber: Chamber;
  palette: string[];
  reduced: boolean;
}) {
  void palette;
  const signal = WF.ink;
  return (
    <group>
      {chamber.exits.map((exit, i) => {
        const angle = (i / Math.max(1, chamber.exits.length)) * Math.PI * 2 - Math.PI / 2;
        const radius = 2.4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.55;
        const risk = exit.risk;
        const col = risk > 0.65 ? WF.yellow : signal;
        return (
          <SlowDrift key={`${exit.label}-${i}`} reduced={reduced} phase={i}>
            <mesh position={[x, y, -1.4]}>
              <ringGeometry args={[0.18, 0.28, 32]} />
              <meshBasicMaterial
                color={col}
                transparent
                opacity={0.55}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.NormalBlending}
              />
            </mesh>
            <mesh position={[x, y, -1.4]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial
                color={col}
                transparent
                opacity={0.8}
                depthWrite={false}
              />
            </mesh>
          </SlowDrift>
        );
      })}
    </group>
  );
}

/* ─── Nebula dust ───────────────────────────────────────────── */

function NebulaDust({
  color,
  reduced,
  density,
}: {
  color: string;
  reduced: boolean;
  density: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const count = reduced ? 80 : Math.floor(280 + density * 200);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.04;
    ref.current.rotation.x = Math.sin(t * 0.32) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={color}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

/* ─── Scene ─────────────────────────────────────────────────── */

function ChamberScene({
  chamber,
  palette,
  diving,
  pointer,
  reduced,
}: {
  chamber: Chamber;
  palette: string[];
  diving: boolean;
  pointer: MutableRefObject<{ x: number; y: number }>;
  reduced: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  void palette;
  const voidColor = WF.paper;
  const fogColor = useMemo(() => new THREE.Color(WF.mist), []);
  const ember = WF.ink;
  const signal = WF.graphite;
  const paradox = WF.black;
  const accent = WF.yellow;

  useFrame(({ camera, clock }) => {
    if (!root.current) return;
    const depthPull = Math.min(2.4, chamber.depth * 0.14);
    const targetZ = diving ? 1.6 : 4.8 - depthPull;
    if (reduced) {
      root.current.rotation.x = 0;
      root.current.rotation.y = 0;
      camera.position.set(0, 0, targetZ);
      camera.lookAt(0, 0, -2.2);
      return;
    }
    const t = clock.elapsedTime;
    const px = pointer.current.x;
    const py = pointer.current.y;
    root.current.rotation.y = THREE.MathUtils.lerp(
      root.current.rotation.y,
      px * 0.32 + Math.sin(t * 0.2) * 0.04,
      0.035,
    );
    root.current.rotation.x = THREE.MathUtils.lerp(
      root.current.rotation.x,
      -py * 0.18 + Math.sin(t * 0.32) * 0.03,
      0.035,
    );
    const camLerp = diving ? 0.1 : 0.04;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, camLerp);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, px * 0.28, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -py * 0.2, 0.035);
    camera.lookAt(0, 0, -2.2);
  });

  return (
    <>
      <color attach="background" args={[voidColor]} />
      <fog
        attach="fog"
        args={[fogColor, 3.2, 14 + chamber.resonance * 10 + (diving ? -4 : 0)]}
      />
      <ambientLight intensity={0.72} color={WF.paper} />
      <pointLight
        position={[2.4, 3.2, 4]}
        intensity={1.15 + chamber.resonance * 0.45}
        color={WF.paper}
        distance={28}
      />
      <pointLight
        position={[-3.2, -1.4, 2.2]}
        intensity={0.55}
        color={WF.mist}
        distance={22}
      />
      <pointLight
        position={[0, 2, -6]}
        intensity={0.35 + (chamber.paradox ? 0.25 : 0)}
        color={WF.paper}
        distance={18}
      />

      <NebulaDust
        color={signal}
        reduced={reduced}
        density={chamber.resonance}
      />

      <DiveTunnel diving={diving} color={accent} reduced={reduced} />

      <group ref={root}>
        <ParadoxCore
          chamber={chamber}
          signal={signal}
          paradox={paradox}
          ember={ember}
          reduced={reduced}
        />
        <ExitBeacons chamber={chamber} palette={palette} reduced={reduced} />
        {chamber.phenomena.map((ph, i) => (
          <PhenomenonNode
            key={`${ph.kind}-${ph.label}-${i}`}
            ph={ph}
            palette={palette}
            reduced={reduced}
            index={i}
          />
        ))}
      </group>
    </>
  );
}

function EmptyField({
  palette,
  reduced,
}: {
  palette: string[] | null;
  reduced: boolean;
}) {
  void palette;
  const voidColor = WF.paper;
  const knot = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!knot.current || reduced) return;
    const t = clock.elapsedTime;
    knot.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    knot.current.rotation.y = Math.sin(t * 0.32) * 0.1;
  });
  return (
    <>
      <color attach="background" args={[voidColor]} />
      <fog attach="fog" args={[new THREE.Color(voidColor), 6, 22]} />
      <ambientLight intensity={0.32} />
      <pointLight
        position={[2, 2, 4]}
        intensity={1}
        color={WF.paper}
      />
      <NebulaDust
        color={WF.fog}
        reduced={reduced}
        density={0.4}
      />
      <mesh ref={knot}>
        <torusKnotGeometry args={[0.95, 0.2, 160, 24]} />
        <meshStandardMaterial
          color={WF.ink}
          emissive={WF.graphite}
          emissiveIntensity={0.35}
          wireframe
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </>
  );
}

export function DepthField({ chamber, palette, diving, pointer }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="absolute inset-0 depth-field" aria-hidden="true" role="presentation">
      <Canvas
        frameloop={reduced ? "demand" : "always"}
        dpr={reduced ? 1 : (typeof window !== "undefined" && window.innerWidth < 768 ? 1 : [1, 1.5])}
        gl={{
          antialias: !reduced,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5], fov: 48, near: 0.1, far: 90 }}
      >
        <Suspense fallback={null}>
          {chamber && palette ? (
            <ChamberScene
              chamber={chamber}
              palette={palette}
              diving={diving}
              pointer={pointer}
              reduced={reduced}
            />
          ) : (
            <EmptyField palette={palette} reduced={reduced} />
          )}
        </Suspense>
      </Canvas>
      {diving ? <div className="dive-veil" /> : null}
    </div>
  );
}
