"use client";

/**
 * Frontend-owned visual stub adapted to the frozen @depth-showcase/api contract.
 * Palette is string[]; Phenomenon has kind/intensity/label/detail (no position/id).
 * Backend does not own UI — this exists so the monorepo typechecks while FE iterates.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import {
  Suspense,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import type { Chamber, Phenomenon } from "@depth-showcase/api";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  chamber: Chamber | null;
  /** Frozen contract: string[] of hex colors */
  palette: string[] | null;
  diving: boolean;
  pointer: MutableRefObject<{ x: number; y: number }>;
};

function tone(palette: string[] | null, i: number, fallback: string): string {
  if (!palette?.length) return fallback;
  return palette[i % palette.length] ?? fallback;
}

function hashPos(label: string, index: number): [number, number, number] {
  let h = 2166136261;
  const s = `${label}:${index}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const x = ((h & 0xff) / 255 - 0.5) * 3;
  const y = (((h >> 8) & 0xff) / 255 - 0.5) * 2;
  const z = (((h >> 16) & 0xff) / 255 - 0.5) * 2 - 1;
  return [x, y, z];
}

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
  const count = reduced ? 40 : 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 2;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y = clock.elapsedTime * 0.15 * ph.intensity;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04 + ph.intensity * 0.04}
        color={color}
        transparent
        opacity={0.55 + ph.intensity * 0.35}
        sizeAttenuation
        depthWrite={false}
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
  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    const s = 0.85 + Math.sin(clock.elapsedTime * (1 + ph.intensity)) * 0.12;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.45 + ph.intensity * 0.35, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4 + ph.intensity * 0.6}
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
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
    group.current.rotation.z = clock.elapsedTime * 0.08;
    group.current.rotation.y = clock.elapsedTime * 0.12;
  });
  return (
    <group ref={group} position={position}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 5) * Math.PI]}>
          <torusGeometry args={[0.5 + i * 0.18, 0.015, 8, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function PhenomenonNode({
  ph,
  palette,
  reduced,
  index,
}: {
  ph: Phenomenon;
  palette: string[];
  reduced: boolean;
  index: number;
}) {
  const position = hashPos(ph.label, index);
  const color =
    ph.kind === "gravity" || ph.kind === "fracture"
      ? tone(palette, 4, "#e94560")
      : ph.kind === "silence" || ph.kind === "light"
        ? tone(palette, 2, "#7ec8e3")
        : ph.kind === "echo"
          ? tone(palette, 3, "#a8e6cf")
          : tone(palette, 1, "#f2a65a");

  if (ph.kind === "gravity" || ph.kind === "fracture") {
    return (
      <GravityWell ph={ph} color={color} reduced={reduced} position={position} />
    );
  }
  if (ph.kind === "echo" || ph.kind === "memory") {
    return (
      <EchoLattice ph={ph} color={color} reduced={reduced} position={position} />
    );
  }
  return (
    <ParticleWake ph={ph} color={color} reduced={reduced} position={position} />
  );
}

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
  const voidColor = tone(palette, 0, "#0b1020");
  const fogColor = useMemo(() => new THREE.Color(voidColor), [voidColor]);
  const ember = tone(palette, 1, "#f2a65a");
  const signal = tone(palette, 2, "#7ec8e3");
  const paradox = tone(palette, 4, "#e94560");

  useFrame(({ camera, clock }) => {
    if (!root.current) return;
    const t = reduced ? 0 : clock.elapsedTime;
    const px = pointer.current.x;
    const py = pointer.current.y;
    root.current.rotation.y = THREE.MathUtils.lerp(
      root.current.rotation.y,
      px * 0.35 + (reduced ? 0 : t * 0.02),
      0.04,
    );
    root.current.rotation.x = THREE.MathUtils.lerp(
      root.current.rotation.x,
      -py * 0.2,
      0.04,
    );
    const targetZ = diving ? 2.2 : 4.5 - Math.min(2, chamber.depth * 0.15);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(0, 0, -2);
  });

  return (
    <>
      <color attach="background" args={[voidColor]} />
      <fog attach="fog" args={[fogColor, 4, 18 + chamber.resonance * 8]} />
      <ambientLight intensity={0.35} />
      <pointLight
        position={[2, 3, 4]}
        intensity={1.2 + chamber.resonance}
        color={ember}
      />
      <pointLight position={[-3, -1, 2]} intensity={0.6} color={signal} />
      {!reduced && (
        <Stars
          radius={40}
          depth={30}
          count={1200}
          factor={2.5}
          saturation={0}
          fade
          speed={0.4}
        />
      )}
      <group ref={root}>
        <Float
          speed={reduced ? 0 : 1.2}
          rotationIntensity={reduced ? 0 : 0.3}
          floatIntensity={reduced ? 0 : 0.4}
        >
          <mesh position={[0, 0, -3]}>
            <icosahedronGeometry
              args={[1.1 + chamber.resonance * 0.4, chamber.paradox ? 1 : 2]}
            />
            <meshStandardMaterial
              color={chamber.paradox ? paradox : signal}
              emissive={ember}
              emissiveIntensity={0.15 + chamber.resonance * 0.35}
              wireframe={!!chamber.paradox}
              metalness={0.4}
              roughness={0.35}
              transparent
              opacity={0.85}
            />
          </mesh>
        </Float>
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

function EmptyField({ palette }: { palette: string[] | null }) {
  const voidColor = tone(palette, 0, "#05060a");
  return (
    <>
      <color attach="background" args={[voidColor]} />
      <ambientLight intensity={0.3} />
      <Stars radius={50} depth={40} count={800} factor={2} fade speed={0.2} />
      <mesh>
        <torusKnotGeometry args={[0.9, 0.18, 128, 16]} />
        <meshStandardMaterial
          color={tone(palette, 2, "#7ec8c8")}
          emissive={tone(palette, 1, "#e8a060")}
          emissiveIntensity={0.25}
          wireframe
        />
      </mesh>
    </>
  );
}

export function DepthField({ chamber, palette, diving, pointer }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="absolute inset-0" aria-hidden="true" role="presentation">
      <Canvas
        dpr={reduced ? 1 : [1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 80 }}
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
            <EmptyField palette={palette} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
