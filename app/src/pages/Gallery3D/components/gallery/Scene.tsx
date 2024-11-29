import { useApi } from '@/hooks/useApi';
import { useEditorStore } from '@/stores/editorAction';
import { StillerGallery } from '@/types';
import { useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const SceneRoom = () => {
  const gallery = useEditorStore((s) => s.gallery);
  console.log({
    gallery
  }, '🐢🐢🐢🐢🐢')
  const { response } = useApi<StillerGallery>(`/gallery/${gallery}`);

  const [sceneUrl, setSceneUrl] = useState<string | null>(null);

  useEffect(() => {
    if (response) {
      console.log({ response })
      console.log({ '😀': `https://pandadiestro.xyz/services/stiller/template/info/${response.data.templateid}/scene` })
      setSceneUrl(`https://pandadiestro.xyz/services/stiller/template/info/${response.data.templateid}/scene`);
    }
  }, [response]);


  const gltf = useLoader(GLTFLoader, 'https://pandadiestro.xyz/services/stiller/template/info/1/scene');

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
