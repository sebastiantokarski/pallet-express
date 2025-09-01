'use client';
import { Box, Typography, useTheme } from '@mui/material';
import { Grid, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

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
  const position: [number, number, number] = [0, -0.9, -3.1];
  const rotation: [number, number, number] = [0, 0, 0];

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

function CreditsFooter() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '5px',
        width: '100%',
        textAlign: 'center',
        color: '#646665',
        fontFamily: 'sans-serif',
        fontSize: '10px',
        pointerEvents: 'none',
        textShadow: '0 0 5px rgba(0,255,255,0.5)',
      }}
    >
      Truck Model:
      {' '}
      <a href="https://sketchfab.com/3d-models/volvo-fh-460-rick-modding-dcd13ab86e1e469d9daa83d4cbca669e" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Volvo FH 460 – Rick Modding</a>
      {' '}
      | CC BY 4.0
    </div>
  );
}

export default function ThreeSceneR3F() {
  const theme = useTheme();
  const toolbarHeight = theme.mixins.toolbar.minHeight;

  const [scale, setScale] = useState({ meters: 1, pixels: 50 });

  return (
    <Box sx={{ width: '100%', height: `calc(100vh - ${toolbarHeight}px)`, background: '#292828', position: 'relative' }}>
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
