import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { useApi } from '@/hooks/useApi';
import { UserContentFileElement } from '@/types';
import { Ground } from './components/gallery/Ground';
import { FPV } from './components/gallery/FPV';
import { Scene } from './components/gallery/Scene';

export const Gallery3D = ({ gallery }: { gallery: string }) => {
  const { data } = useApi<Array<UserContentFileElement>>(`gallery/${gallery}`);
  console.log('🐢🐢🐢🐢', data);

  return (
    <Canvas>
      <ambientLight intensity={2.5} />
      <spotLight
        penumbra={0.5}
        position={[10, 10, 5]}
        castShadow />
      <Physics>
        <FPV />
        <Ground />
        <Scene />
      </Physics>
      <Sky />
    </Canvas>
  );
};
