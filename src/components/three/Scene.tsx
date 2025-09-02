'use client';

import { Box, Link, Typography, useTheme } from '@mui/material';
import { Grid, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCanvasSettings } from '@/hooks/useCanvasSettings';

function ScaleBarTracker({ setScale }: { setScale: (s: { meters: number; pixels: number }) => void }) {
  const { camera, size } = useThree();

  useFrame(() => {
    const distance = camera.position.length();
    let metersPerPixel = 1;
    if ('fov' in camera) {
      // PerspectiveCamera
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
      metersPerPixel = visibleHeight / size.height;
    } else if ('top' in camera && 'bottom' in camera) {
      // OrthographicCamera
      const visibleHeight = camera.top - camera.bottom;
      metersPerPixel = visibleHeight / size.height;
    }

    const targetMeters = metersPerPixel * 100;
    const pow10 = 10 ** Math.floor(Math.log10(targetMeters));
    let niceMeters = pow10;
    if (targetMeters / pow10 >= 5) {
      niceMeters = 5 * pow10;
    } else if (targetMeters / pow10 >= 2) {
      niceMeters = 2 * pow10;
    }

    const pixels = niceMeters / metersPerPixel;
    setScale({ meters: niceMeters, pixels });
  });

  return null;
}

type ScaleBarProps = {
  meters: number;
  pixels: number;
};

function ScaleBar({ meters, pixels }: ScaleBarProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: `${pixels}px`,
          height: 10,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 2,
            height: 10,
            bgcolor: 'cyan',
            boxShadow: '0 0 6px rgba(0,255,255,0.8)',
          }}
        />
        <Box
          sx={{
            flex: 1,
            height: 2,
            bgcolor: 'cyan',
            boxShadow: '0 0 6px rgba(0,255,255,0.8)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 2,
            height: 10,
            bgcolor: 'cyan',
            boxShadow: '0 0 6px rgba(0,255,255,0.8)',
          }}
        />
      </Box>
      <Typography
        variant="caption"
        sx={{
          mt: 0.5,
          color: 'cyan',
          textShadow: '0 0 4px rgba(0,255,255,0.6)',
          fontFamily: 'monospace',
        }}
      >
        {meters}
        {' '}
        m
      </Typography>
    </Box>
  );
}

function TruckModel() {
  const gltf = useGLTF('/models/volvo_fh460.glb');

  const scale = 0.7;
  const position: [number, number, number] = [0, -0.9, 3];
  const rotation: [number, number, number] = [0, Math.PI, 0];

  return (
    <primitive
      object={gltf.scene}
      scale={[scale, scale, scale]}
      position={position}
      rotation={rotation}
    />
  );
}

function AnimatedBox() {
  const { dimensions } = useCanvasSettings();

  const scale = 0.006;
  const [w, h, l] = [dimensions.width * scale, dimensions.height * scale, dimensions.length * scale];

  const meshRef = useRef<THREE.Mesh | null>(null);
  const lineRef = useRef<THREE.LineSegments | null>(null);

  const boxGeometry = useMemo(() => new THREE.BoxGeometry(w, h, l), [w, h, l]);
  const boxMaterial = useMemo(
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
  const edgeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: 'cyan' }), []);

  useFrame(({ clock }) => {
    const hue = (clock.getElapsedTime() * 5) % 360;
    boxMaterial.color.setHSL(hue / 360, 1, 0.5);
    edgeMaterial.color.setHSL(hue / 360, 1, 0.5);
  });

  // cleanup on unmount
  useEffect(() => {
    return () => {
      boxGeometry.dispose();
      edgesGeometry.dispose();
      boxMaterial.dispose();
      (edgeMaterial as THREE.Material).dispose();
    };
  }, [boxGeometry, edgesGeometry, boxMaterial, edgeMaterial]);

  return (
    <group position={[0, 1, 0]}>
      <mesh ref={meshRef} geometry={boxGeometry} material={boxMaterial} />
      <lineSegments ref={lineRef} geometry={edgesGeometry} material={edgeMaterial} />
    </group>
  );
}

function AnimatedGrid() {
  const gridRef = useRef<THREE.Mesh | null>(null);

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

function CreditsFooter() {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '5px',
        width: '100%',
        textAlign: 'center',
        color: '#7fbfff',
        fontFamily: 'sans-serif',
        fontSize: '10px',
        pointerEvents: 'none',
        textShadow: '0 0 5px rgba(0,255,255,0.5)',
      }}
    >
      <Typography fontSize="10px" component="span" sx={{ mr: 0.5 }}>
        Truck Model:
      </Typography>
      <Link
        href="https://sketchfab.com/3d-models/volvo-fh-460-rick-modding-dcd13ab86e1e469d9daa83d4cbca669e"
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{ color: '#7fbfff', pointerEvents: 'auto' }}
      >
        Volvo FH 460 – Rick Modding
      </Link>
      <Typography fontSize="10px" component="span" sx={{ ml: 0.5 }}>
        | CC BY 4.0
      </Typography>
    </Box>
  );
}

export default function ThreeSceneR3F() {
  const theme = useTheme();
  const toolbarHeight = theme.mixins.toolbar.minHeight;

  const [scale, setScale] = useState({ meters: 1, pixels: 50 });

  return (
    <Box sx={{ width: '100%', height: `calc(100vh - ${toolbarHeight}px - 8px)`, background: '#292828', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [10, 8, 15], fov: 45 }}
      >
        <fogExp2 attach="fog" args={[0x111111, 0.04]} />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.8}
          castShadow
        />

        <AnimatedGrid />
        <TruckModel />
        <AnimatedBox />

        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>

        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
        </EffectComposer>

        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2}
        />
        <ScaleBarTracker setScale={setScale} />

      </Canvas>
      <ScaleBar meters={scale.meters} pixels={scale.pixels} />
      <CreditsFooter />
    </Box>

  );
}
