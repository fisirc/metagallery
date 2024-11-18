import { Text } from '@mantine/core';
import { Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { useApi } from '@/hooks/useApi';
import { UserContentFileElement } from '@/types';
import { Ground } from './components/gallery/Ground';
import { FPV } from './components/gallery/FPV';
import { Scene } from './components/gallery/Scene';
import { Loader } from '@mantine/core';

export const Gallery3D = ({ gallery }: { gallery: string }) => {
  const { data, isLoading } = useApi<Array<UserContentFileElement>>(`gallery/${gallery}`);
  console.log('🐢🐢🐢🐢', data);

  if (isLoading) {
    return <Loader color="rgba(0, 0, 0, 1)" />;
  }

  return (
    <>
      <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', flexDirection: 'column', gap: '12px' }}>
        <Loader color="rgba(0, 0, 0, 1)" />
        <Text ta="center" size="xl">Cargando previsualización...</Text>
        <div style={{ height: '100px' }} />
      </div>
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
    </>
  );
};
