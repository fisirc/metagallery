import { Suspense } from 'react';
import { Text } from '@mantine/core';
import { Canvas } from '@react-three/fiber';
import { Loading } from './Loading';
import { Experience } from './Experience';
import { AppIcon } from '@/components/AppIcon';

export const Gallery3D = ({ gallery }: { gallery: string }) => {

  return (
    <>
      <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', flexDirection: 'column', gap: '12px' }}>
        <AppIcon size={100} animated />
        <div style={{ height: '10px' }} />
        <Text ta="center" size="xl">Cargando galería 3D...</Text>
      </div>
      <Canvas
        camera={{ fov: 70 }}
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse') {
            (e.target as HTMLCanvasElement).requestPointerLock()
          }
        }}
      >
        <Suspense fallback={<Loading />}>
          <Experience gallery={gallery} />
        </Suspense>
      </Canvas>
    </>
  );
};
