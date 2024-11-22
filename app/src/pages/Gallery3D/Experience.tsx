import { Perf } from 'r3f-perf';
import Ecctrl, { } from 'ecctrl';
import { KeyboardControls, Sky, Sparkles } from '@react-three/drei';
import { useApi } from '@/hooks/useApi';
import { UserContentFileElement } from '@/types';
import { SceneRoom } from './components/gallery/Scene';
import { BallCollider, CapsuleCollider, Physics } from '@react-three/rapier';
import { useEffect, useState } from 'react';
import { DynamicPainting } from './components/gallery/DynamicPainting';
import { DynamicSculpture } from './components/gallery/DynamicSculpture';

const template1 = [
  {
    "id": "muro1",
    "type": "2d",
    "props": {},
    "v": [
      [-15.7062, 3.4598, 0.7131 + 0.01],
      [-15.7062, 0.87639, 0.7131 + 0.01],
      [-13.8400, 3.4598, 0.7131 + 0.01],
      [-13.8400, 0.87639, 0.7131 + 0.01],
    ]
  },
  {
    "id": "muro2",
    "type": "2d",
    "props": {},
    "v": [
      [-5.4976, 3.4598, 0.7131 + 0.01], // tl
      [-5.4976, 0.87639, 0.7131 + 0.01], // bl
      [-3.6313, 3.4598, 0.7131 + 0.01], // tr
      [-3.6313, 0.87639, 0.7131 + 0.01], // br
    ]
  },
  {
    "id": "muro3",
    "type": "2d",
    "props": {},
    "v": [
      [4.2209, 3.4598, 0.7131 + 0.01], // tl
      [4.2209, 0.87639, 0.7131 + 0.01], // bl
      [6.0872, 3.4598, 0.7131 + 0.01], // tr
      [6.0872, 0.87639, 0.7131 + 0.01], // br
    ]
  },
  {
    "id": "front1",
    "type": "2d",
    "props": {},
    "v": [
      [-15.283, 3.460, -10.064],
      [-15.283, 0.876, -10.064],
      [-17.149, 3.460, -10.064],
      [-17.149, 0.876, -10.064],
    ]
  },
  {
    "id": "front2",
    "type": "2d",
    "props": {},
    "v": [
      [-10.596, 2.611, -10.064],
      [-10.596, 1.523, -10.064],
      [-13.533, 2.611, -10.064],
      [-13.533, 1.523, -10.064],
    ]
  },
  {
    "id": "front3",
    "type": "2d",
    "props": {},
    "v": [
      [-7.381, 3.46, -10.069],
      [-7.381, 0.876, -10.069],
      [-9.247, 3.46, -10.069],
      [-9.247, 0.876, -10.069],
    ]
  },
  {
    "id": "front4",
    "type": "2d",
    "props": {},
    "v": [
      [1.49, 3.46, -10.069],
      [1.49, 0.876, -10.069],
      [-6.008, 3.46, -10.069],
      [-6.008, 0.876, -10.069],
    ]
  },
  {
    "id": "front5",
    "type": "2d",
    "props": {},
    "v": [
      [6.688, 3.46, -10.069],
      [6.688, 0.876, -10.069],
      [2.884, 3.497, -10.064],
      [2.884, 0.914, -10.064],
    ]
  },
];

const template7 = [
  {
    "ref": "wall1",
    "type": "2d",
    "props": {},
    "v": [
      [7.393, 6.677, 29.855],
      [7.393, 2.979, 29.855],
      [5.211, 6.677, 29.855],
      [5.211, 2.979, 29.855],
    ]
  },
  {
    "ref": "wall2",
    "type": "2d",
    "props": {},
    "v": [
      [3.192, 6.677, 29.855],
      [3.192, 2.979, 29.855],
      [1.009, 6.677, 29.855],
      [1.009, 2.979, 29.855],
    ]
  },
  {
    "ref": "wall3",
    "type": "2d",
    "props": {},
    "v": [
      [-3.192, 6.677, 29.855],
      [-3.192, 2.979, 29.855],
      [-1.009, 6.677, 29.855],
      [-1.009, 2.979, 29.855],
    ]
  },
  {
    "ref": "wall4",
    "type": "2d",
    "props": {},
    "v": [
      [-5.211, 6.677, 29.855],
      [-5.211, 2.979, 29.855],
      [-7.393, 6.677, 29.855],
      [-7.393, 2.979, 29.855],
    ]
  },
  {
    "ref": "center",
    "type": "3d",
    "props": {
      "scale": 1,
      "rotate": true,
    },
    "v": [
      [0, 1.170, 10.706],
    ]
  },
] as const;

export const Experience = ({ gallery }: { gallery: string }) => {
  const { data, isLoading } = useApi<Array<UserContentFileElement>>(`gallery/${gallery}`);

  const [gravityEnabled, setGravityEnabled] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      setGravityEnabled(true);
    }, 500);
  }, [])

  return (
    <>
      <Perf position="top-right" minimal />
      <ambientLight intensity={0.6} />
      <axesHelper args={[10]} />
      {
        template7.map((slots) => {
          if (slots.type == '2d') {
            return (
              <DynamicPainting
                key={slots.ref}
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tux_Droid_1.jpg/1200px-Tux_Droid_1.jpg"
                vertices={slots.v}
              />
            );
          }
          if (slots.type == '3d') {
            return (
              <DynamicSculpture
                position={slots.v[0]}
                glbUrl="/assets/3d/chihiro.glb"
                rotation={[0, Math.PI / 4, 0]}
                scale={[slots.props.scale, slots.props.scale, slots.props.scale]}
                rotate={slots.props.rotate}
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
