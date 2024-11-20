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
import { DynamicPainting } from './components/gallery/DynamicPainting';
import { DynamicSculpture } from './components/gallery/DynamicSculpture';

export const Gallery3D = ({ gallery }: { gallery: string }) => {
  const { data, isLoading } = useApi<Array<UserContentFileElement>>(`gallery/${gallery}`);
  console.log('🐢🐢🐢🐢', data);

  const paintingVertices = [
    [-2.190093, 2.930420, 1.957159], // Vertex 1
    [-2.190091, 1.010420, 1.957159], // Vertex 2
    [-3.686093, 2.930418, 1.957160], // Vertex 3
    [-3.686091, 1.010419, 1.957160], // Vertex 4
  ];

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
          castShadow
        />
        <DynamicPainting
          imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tux_Droid_1.jpg/1200px-Tux_Droid_1.jpg"
          vertices={paintingVertices}
        />
        <DynamicSculpture
          glbUrl="/assets/3d/chihiro.glb"
          position={[2, 0, 0]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[1, 1, 1]}
          rotate={true}
        />
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
