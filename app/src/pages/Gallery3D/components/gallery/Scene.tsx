import { useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

type SceneRoomProps = {
  onLoad: () => void;
  sceneUrl: string;
};

// let loadedAndCached = false;

export const SceneRoom = ({ onLoad, sceneUrl }: SceneRoomProps) => {
  const url = sceneUrl ?? "/assets/3d/invisible.glb";

  useEffect(() => {
    onLoad();
  }, [sceneUrl]);

  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.load(url, (_) => {
      // onLoad();
    });
  });

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
