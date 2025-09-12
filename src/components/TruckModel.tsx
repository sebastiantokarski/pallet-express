import type { FC } from 'react';
import { useGLTF } from '@react-three/drei';

export type TruckModelProps = {
  trailerDimensions: { length: number; width: number; height: number };
};

const truckModelPath = '/models/volvo_fh460.glb';

const TruckModel: FC<TruckModelProps> = ({ trailerDimensions }) => {
  const scale = 0.006; // same scale used for box (cm -> world units)
  const trailerLengthWorld = trailerDimensions.length * scale;
  const truckOffset = -0.9;
  const truckZ = trailerLengthWorld / 2 + truckOffset;

  const gltf = useGLTF(truckModelPath);

  const truckScale = 0.7;
  const position: [number, number, number] = [0, -0.9, truckZ];
  const rotation: [number, number, number] = [0, Math.PI, 0];

  return (
    <primitive
      object={gltf.scene}
      scale={[truckScale, truckScale, truckScale]}
      position={position}
      rotation={rotation}
    />
  );
};

export default TruckModel;
