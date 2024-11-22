import { useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const SceneRoom = () => {
  const gltf = useLoader(GLTFLoader, '/assets/3d/vegetable_gallery.glb');

  return (
    <group>
      <RigidBody type='fixed' colliders='trimesh'>
        <primitive
          object={gltf.scene}
          position={[0, 0, 0]}
          children-0-castShadow
        />
      </RigidBody>
    </group>
  );
};
