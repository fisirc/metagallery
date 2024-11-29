import { Perf } from 'r3f-perf';
import Ecctrl, { } from 'ecctrl';
import { KeyboardControls, Sky, Sparkles } from '@react-three/drei';
import { useApi } from '@/hooks/useApi';
import { SceneRoom } from './components/gallery/Scene';
import { BallCollider, Physics } from '@react-three/rapier';
import { useEffect, useState } from 'react';
import { DynamicPainting } from './components/gallery/DynamicPainting';
import { DynamicSculpture } from './components/gallery/DynamicSculpture';
import { StillerGallery } from '@/types';

export const Experience = ({ gallery }: { gallery: string }) => {
  const { response } = useApi<StillerGallery>(`/gallery/${gallery}`);

  const [gravityEnabled, setGravityEnabled] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      setGravityEnabled(true);
    }, 1000);
  }, [])

  return (
    <>
      <Perf position="top-right" minimal />
      <ambientLight intensity={0.6} />
      {/* <axesHelper args={[10]} /> */}
      {
        response && response.data.slots.slots.map((slot) => {
          const res = slot.res !== 0 ? `https://pandadiestro.xyz/services/stiller/file/dl/${slot.res}` : null;

          if (slot.type == '2d') {
            return (
              <DynamicPainting
                key={slot.ref}
                imageUrl={res || "/assets/empty_slot.png"}
                vertices={slot.v}
              />
            );
          }
          if (slot.type == '3d') {
            return (
              <DynamicSculpture
                key={slot.ref}
                position={slot.v[0] as any}
                glbUrl="/assets/3d/chihiro.glb"
                rotation={[0, Math.PI / 4, 0]}
                scale={[slot.props.scale, slot.props.scale, slot.props.scale] as any}
                rotate={slot.props.rotate as boolean}
              />
            );
          }
        })
      }
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'w', 'W'], },
          { name: 'backward', keys: ['ArrowDown', 's', 'S'], },
          { name: 'leftward', keys: ['ArrowLeft', 'a', 'A'], },
          { name: 'rightward', keys: ['ArrowRight', 'd', 'D'], },
          { name: 'jump', keys: ['Space'], },
          { name: 'run', keys: ['Shift'], },
        ]}
      >
        <Sparkles count={200} scale={[20, 20, 10]} size={3} speed={2} />
        <spotLight
          penumbra={0.5}
          position={[10, 10, 5]}
          castShadow
        />
        <Physics gravity={[0, gravityEnabled ? -9 : 0, 0]} timeStep={'vary'} >
          {/* <Player /> */}
          {/* <Ground /> */}
          <Ecctrl
            type='dynamic'
            animated={false}
            camCollision={false} // disable camera collision detect (useless in FP mode)
            camInitDis={-0.01}
            camMinDis={-0.01}
            camMaxDis={-0.01}
            maxVelLimit={5}
            camFollowMult={1000}
            camLerpMult={1000}
            turnVelMultiplier={1} // Turning speed same as moving speed
            turnSpeed={100} // big turning speed to prevent turning wait time
            dampingC={0.3}
            autoBalanceDampingC={0.03}
            springK={0.3}
            autoBalanceSpringK={0.3}
            position={[0, 1.2, 0]}
            mode="CameraBasedMovement" // character's rotation will follow camera's rotation in this mode
          >
            <BallCollider args={[0.8]} />
          </Ecctrl>
          <SceneRoom />
        </Physics>
        <Sky />
        {/* <PointerLockControls /> */}
      </KeyboardControls>
    </>
  );
};
