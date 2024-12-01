import { useEffect, useState } from 'react';
import { Button, Text } from '@mantine/core';
import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';
import { AppIcon } from '@/components/AppIcon';
import { createXRStore, XR } from '@react-three/xr';
import { EcctrlJoystick } from 'ecctrl';
import { useFinePointer } from '@/hooks/useFinePointer';
import { IconBadgeVr, IconMaximize, IconMaximizeOff } from '@tabler/icons-react';
import { useFullscreen } from '@mantine/hooks';

type Gallery3DProps = {
  gallery: string;
  withTopOffset?: boolean;
};

const store = createXRStore({});

export const Gallery3D = ({ gallery, withTopOffset }: Gallery3DProps) => {
  const [loading, setLoading] = useState(true);
  const hasMouse = useFinePointer();
  const { ref, toggle, fullscreen } = useFullscreen();

  useEffect(() => {
    document.body.style.backgroundColor = '#000';

    return () => {
      document.body.style.backgroundColor = '';
    };
  });

  return (
    <div ref={ref} style={{ maxHeight: '100svh', height: '100svh', width: '100svw' }}>
      {
        (!hasMouse && !loading) && (
          <>
            <Button size='compact-sm' onClick={() => store.enterVR()} style={{ position: 'absolute', zIndex: 69, top: 8, left: '3.5rem' }}>
              <IconBadgeVr />
            </Button>
            <EcctrlJoystick />
          </>
        )
      }
      <Button size='compact-sm' onClick={() => toggle()} style={{ position: 'absolute', zIndex: 69, top: 8, left: 8 }}>
        {
          fullscreen ? <IconMaximizeOff /> : <IconMaximize />
        }
      </Button>
      <Canvas
        camera={{ fov: 70 }}
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse') {
            (e.target as HTMLCanvasElement).requestPointerLock();
          }
        }}
      >
        <XR store={store}>
          <Experience
            gallery={gallery}
            onLoad={() => {
              setLoading(false);
            }}
          />
        </XR>
      </Canvas>
      {
        loading && (
          <div style={{
            position: 'absolute',
            top: withTopOffset ? 70 : 0,
            left: 0,
            width: '100vw',
            height: withTopOffset ? 'calc(100svh - 70px)' : '100svh',
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
    </div>
  );
};
