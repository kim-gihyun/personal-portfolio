"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Center, Html, useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/theme";

type Orient = { rx?: number; ry?: number; zoom?: number };

const deg = (d = 0) => (d * Math.PI) / 180;

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

function GLBModel({ src, orient }: { src: string; orient?: Orient }) {
  const { scene } = useGLTF(src);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && "metalness" in mat) {
          mat.envMapIntensity = 1.1;
        }
      }
    });
    return c;
  }, [scene]);
  // dispose the geometries we cloned (materials/textures are shared with the cache)
  useEffect(
    () => () => {
      cloned.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry?.dispose();
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

function STLModel({ src, orient }: { src: string; orient?: Orient }) {
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
        <meshStandardMaterial color="#c9ccc6" metalness={0.15} roughness={0.55} />
      </mesh>
    </group>
  );
}

function Model({ src, orient }: { src: string; orient?: Orient }) {
  const isStl = src.toLowerCase().endsWith(".stl");
  return (
    <Center>{isStl ? <STLModel src={src} orient={orient} /> : <GLBModel src={src} orient={orient} />}</Center>
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
  autoRotate = true,
  className,
  contact = true,
  label,
}: {
  src: string;
  orient?: Orient;
  autoRotate?: boolean;
  className?: string;
  contact?: boolean;
  label?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setReduced(prefersReducedMotion());
  }, []);

  return (
    <div
      ref={wrap}
      className={`model-viewer ${className ?? ""}`}
      data-cursor="drag"
      data-cursor-label="drag · scroll"
      data-lenis-prevent
      role="img"
      aria-label={
        label
          ? `Interactive 3D model of ${label}. Drag to rotate, scroll to zoom.`
          : "Interactive 3D model. Drag to rotate, scroll to zoom."
      }
    >
      {mounted && (
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.6, 5.2], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onPointerDown={() => setInteracted(true)}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-5, 2, -4]} intensity={0.5} color="#ff7a45" />
          <Suspense fallback={<Loader />}>
            <Model src={src} orient={orient} />
          </Suspense>
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>
          {contact && <ContactShadows position={[0, -1.35, 0]} opacity={0.45} scale={9} blur={2.6} far={3} />}
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom
            minDistance={3}
            maxDistance={9}
            autoRotate={autoRotate && !interacted && !reduced}
            autoRotateSpeed={0.9}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>
      )}
      <span className="model-hint readout" aria-hidden>
        drag to rotate · scroll to zoom
      </span>
    </div>
  );
}

// Preload the heavier hero models (client only — never during SSR/export build).
if (typeof window !== "undefined") {
  useGLTF.preload("/assets/robot.glb");
  useGLTF.preload("/assets/trolley.glb");
}
