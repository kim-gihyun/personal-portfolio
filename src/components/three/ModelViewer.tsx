"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Center, Html, useGLTF } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";

// Renders a burst of frames when the model (re)loads, then goes idle. With
// frameloop="demand" this keeps GPU at ~0 unless the user is dragging.
function LoadBurst() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let n = 0;
    let id = requestAnimationFrame(function tick() {
      invalidate();
      if (++n < 40) id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [invalidate]);
  return null;
}

type Orient = { rx?: number; ry?: number; zoom?: number };

const deg = (d = 0) => (d * Math.PI) / 180;

// cool brushed-steel tint so the CAD reads as a rendered part, not white plastic
const TINT = "#7c8aa6";

/** Normalize any object to ~2.2 units across its largest axis, centered. */
function useNormalizedScale(obj: THREE.Object3D | null) {
  return useMemo(() => {
    if (!obj) return 1;
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const max = Math.max(size.x, size.y, size.z) || 1;
    return 2.2 / max;
  }, [obj]);
}

function GLBModel({ src, orient, tint }: { src: string; orient?: Orient; tint: string }) {
  const { scene } = useGLTF(src);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        // clone the material so we recolour this instance without touching the cache
        const src = m.material as THREE.MeshStandardMaterial;
        const mat = src?.clone?.() as THREE.MeshStandardMaterial | undefined;
        if (mat) {
          if ("color" in mat) mat.color.set(tint);
          if ("metalness" in mat) mat.metalness = 0.55;
          if ("roughness" in mat) mat.roughness = 0.5;
          mat.envMapIntensity = 1.1;
          mat.map = null; // drop any baked white texture
          m.material = mat;
        }
      }
    });
    return c;
  }, [scene, tint]);
  // dispose the geometries + materials we cloned (source stays in the cache)
  useEffect(
    () => () => {
      cloned.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry?.dispose();
          (m.material as THREE.Material)?.dispose?.();
        }
      });
    },
    [cloned],
  );
  const scale = useNormalizedScale(cloned);
  return (
    <group rotation={[deg(orient?.rx), deg(orient?.ry), 0]} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

function STLModel({ src, orient, tint }: { src: string; orient?: Orient; tint: string }) {
  const geom = useLoader(STLLoader, src);
  const prepared = useMemo(() => {
    const g = geom.clone();
    g.center();
    g.computeVertexNormals();
    return g;
  }, [geom]);
  const obj = useMemo(() => new THREE.Mesh(prepared), [prepared]);
  useEffect(() => () => prepared.dispose(), [prepared]);
  const scale = useNormalizedScale(obj);
  return (
    <group rotation={[deg(orient?.rx), deg(orient?.ry), 0]} scale={scale}>
      <mesh geometry={prepared} castShadow receiveShadow>
        <meshStandardMaterial color={tint} metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Model({ src, orient, tint }: { src: string; orient?: Orient; tint: string }) {
  const isStl = src.toLowerCase().endsWith(".stl");
  return (
    <Center>
      {isStl ? <STLModel src={src} orient={orient} tint={tint} /> : <GLBModel src={src} orient={orient} tint={tint} />}
    </Center>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="model-loading readout">
        <span className="model-spinner" /> loading geometry
      </div>
    </Html>
  );
}

export function ModelViewer({
  src,
  orient,
  className,
  label,
  hint = true,
  tint = TINT,
  preview = false,
}: {
  src: string;
  orient?: Orient;
  className?: string;
  label?: string;
  hint?: boolean;
  tint?: string;
  /** non-interactive, click-through preview */
  preview?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  const interactive = !preview;

  return (
    <div
      ref={wrap}
      className={`model-viewer ${preview ? "model-viewer--preview" : ""} ${className ?? ""}`}
      {...(interactive ? { "data-cursor": "drag", "data-cursor-label": "drag · zoom", "data-lenis-prevent": "" } : {})}
      role="img"
      aria-label={
        label
          ? `${interactive ? "Interactive " : ""}3D model of ${label}.${interactive ? " Drag to rotate, scroll to zoom." : ""}`
          : "3D model."
      }
    >
      {mounted && (
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.5, 4.5], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.75} />
          <hemisphereLight args={["#dfe8f5", "#1a2740", 0.6]} />
          <directionalLight position={[4, 6, 5]} intensity={1.4} />
          <directionalLight position={[-5, 2, -4]} intensity={0.6} color="#6fa8e0" />
          <Suspense fallback={<Loader />}>
            <Model src={src} orient={orient} tint={tint} />
            <LoadBurst />
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan={false}
            enableRotate={interactive}
            enableZoom={interactive}
            minDistance={3}
            maxDistance={9}
            enableDamping={false}
          />
        </Canvas>
      )}
      {hint && interactive && (
        <span className="model-hint readout" aria-hidden>
          drag to rotate · scroll to zoom
        </span>
      )}
    </div>
  );
}

// Preload the heavier hero models (client only — never during SSR/export build).
if (typeof window !== "undefined") {
  useGLTF.preload("/assets/robot.glb");
  useGLTF.preload("/assets/trolley.glb");
}
