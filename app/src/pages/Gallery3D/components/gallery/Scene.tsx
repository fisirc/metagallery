import { useApi } from '@/hooks/useApi';
import { useEditorStore } from '@/stores/editorAction';
import { StillerGallery } from '@/types';
import { useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

type SceneRoomProps = {
  onLoad: () => void;
};

export const SceneRoom = ({ onLoad }: SceneRoomProps) => {
  const gallery = useEditorStore((s) => s.gallery);
  const { response } = useApi<StillerGallery>(`/gallery/${gallery}`);
  const [sceneUrl, setSceneUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (response) {
      setSceneUrl(`https://pandadiestro.xyz/services/stiller/template/info/${response.data.templateid}/scene`);
    }
  }, [response]);

  const url = sceneUrl ?? "/assets/3d/invisible.glb";

  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.load(url, (_) => {
      if (response) {
        onLoad();
        setLoaded(true);
      }
    });
  });

  if (!loaded) {
    return null;
  }

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
