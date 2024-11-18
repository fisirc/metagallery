import { usePlane } from '@react-three/cannon';
import { extend } from '@react-three/fiber';
import { MeshStandardMaterial, PlaneGeometry } from 'three';

extend({ MeshStandardMaterial, PlaneGeometry });

export function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.01, 0],
  }));

  return (
    <mesh
      ref={ref as any}
    >
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial />
    </mesh>
  );
}
