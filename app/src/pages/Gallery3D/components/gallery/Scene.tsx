import { Sparkles } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const Scene = () => {
  const gltf = useLoader(GLTFLoader, '/assets/3d/gallery.glb');

  return (
    <group>
      <Sparkles count={200} scale={[20, 20, 10]} size={3} speed={2} />
      <primitive
        object={gltf.scene}
        position={[0, 0, 0]}
        children-0-castShadow
      />
    </group>
  );
};
