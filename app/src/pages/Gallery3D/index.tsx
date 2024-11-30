import { Suspense, useState } from 'react';
import { Text } from '@mantine/core';
import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';
import { AppIcon } from '@/components/AppIcon';

export const Gallery3D = ({ gallery }: { gallery: string }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Canvas
        camera={{ fov: 70 }}
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse') {
            (e.target as HTMLCanvasElement).requestPointerLock()
          }
        }}
      >
        <Experience gallery={gallery} onLoad={() => {
          setLoading(false);
        }} />
      </Canvas>
      {
        loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'all',
            flexDirection: 'column',
            backgroundColor: 'var(--mantine-color-body)',
            gap: '12px'
          }}>
            <AppIcon size={100} animated />
            <div style={{ height: '10px' }} />
            <Text ta="center" size="xl">Cargando galería 3D...</Text>
          </div>
        )
      }
    </>
  );
};
