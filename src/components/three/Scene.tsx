'use client';

import { Grid, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function AnimatedBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const boxGeometry = useMemo(() => new THREE.BoxGeometry(2, 2, 8), []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('cyan'),
        metalness: 0.2,
        roughness: 0.4,
        transparent: true,
        opacity: 0.35,
      }),
    [],
  );

  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(boxGeometry), [boxGeometry]);
  const lineMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: 'cyan' }),
    [],
  );

  useFrame(({ clock }) => {
    const hue = (clock.getElapsedTime() * 5) % 360;
    material.color.setHSL(hue / 360, 1, 0.5);
    lineMaterial.color.setHSL(hue / 360, 1, 0.5);
  });

  return (
    <group position={[0, 1, 0]}>
      <mesh ref={meshRef} geometry={boxGeometry} material={material} />
      <lineSegments ref={lineRef} geometry={edgesGeometry} material={lineMaterial} />
    </group>
  );
}

function AnimatedGrid() {
  const gridRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.00025;
    }
  });

  return (
    <Grid
      ref={gridRef}
      args={[20, 40]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor="#222"
      sectionColor="#444"
      followCamera={false}
      infiniteGrid={true}
      fadeDistance={40}
    />
  );
}

export default function ThreeSceneR3F() {
  return (
    <Canvas
      camera={{ position: [10, 8, 15], fov: 45 }}
      style={{ width: '100%', height: '100vh', background: '#111' }}
    >
      <fogExp2 attach="fog" args={[0x111111, 0.04]} />

      <ambientLight intensity={0.3} />

      <AnimatedGrid />
      <AnimatedBox />

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
