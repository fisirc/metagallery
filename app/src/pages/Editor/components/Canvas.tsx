import Konva from 'konva';
import { Box } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { WallBlock } from './blocks/WallBlock';
import { Model3DBlock } from './blocks/Model3DBlock';
import { DoorBlock } from './blocks/DoorBlock';
import { DIR_TOP, DIR_RIGHT, DIR_BOTTOM, DIR_LEFT, ZOOM_FACTOR, UNIT } from './constants';
import { PictureSlot } from './blocks/PictureSlot';
import { useEditorStore } from '@/stores/editorAction';
import { setCursor } from '@/utils';

// TRBL -> 0123

export type GenericGalleryBlock = {
  type: 'wall' | 'model3d' | 'door',
  pos: [number, number],
  props: {
    size?: number,
    dir?: 0 | 1 | 2 | 3,
    res?: string | null,
  },
};

export const Canvas = () => {
  const [viewport, setViewport] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const draggingElem = useEditorStore((state) => state.draggingFile);

  useEffect(() => {
    handleViewportResize();
    window.addEventListener('resize', handleViewportResize);

    stageRef.current?.scale({ x: 1.5, y: 1.5 });

    return () => {
      window.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  // We calculate minXY and maxXY just to define the gallery boundaries
  const minXY = useMemo(() => {
    let x = 0;
    let y = 0;

    for (const item of mockedResponse) {
      x = Math.min(x, item.pos[0]);
      y = Math.min(y, item.pos[1]);

      if (item.props.dir === DIR_TOP) {
        y = Math.min(y, item.pos[1] - item.props.size);
      }
      if (item.props.dir === DIR_LEFT) {
        x = Math.min(x, item.pos[0] - item.props.size);
      }
    }

    return [x, y];
  }, [mockedResponse]);

  const maxXY = useMemo(() => {
    let x = 0;
    let y = 0;

    for (const item of mockedResponse) {
      x = Math.max(x, item.pos[0]);
      y = Math.max(y, item.pos[1]);

      if (item.props.dir === DIR_BOTTOM) {
        y = Math.max(y, item.pos[1] + item.props.size);
      }
      if (item.props.dir === DIR_RIGHT) {
        x = Math.max(x, item.pos[0] + item.props.size);
      }
    }

    return [x - 1, y - 1];
  }, [mockedResponse]);

  // For dynamic canvas resizing
  const handleViewportResize = () => {
    const bounds = document.getElementById('canvas')?.getBoundingClientRect();

    if (bounds) {
      setViewport({
        x: bounds.width,
        y: bounds.height,
      });
    }
  };

  return (
    <Box
      id="canvas"
      w="100%"
      mb="16px"
      mih="100%"
      bd="1px solid var(--mantine-color-gray-4)"
      bg={draggingElem ? '#d8d8d8' : '#e4e4e4'}
      style={{
        borderRadius: 'var(--mantine-radius-md)',
        overflow: 'hidden',
      }}
    >
      <Stage
        ref={stageRef}
        width={viewport.x}
        height={viewport.y}
        x={100}
        y={100}
        draggable
        onMouseEnter={() => { setCursor('move'); }}
        onMouseLeave={() => { setCursor(null); }}
        onDragMove={() => { }}
        onWheel={(e) => {
          e.evt.preventDefault();
          const oldScale = stageRef.current?.scaleX() || 1;
          const newScale = e.evt.deltaY > 0 ? oldScale / ZOOM_FACTOR : oldScale * ZOOM_FACTOR;

          const oldPos = stageRef.current?.position() || { x: 0, y: 0 };
          const newPos = [
            oldPos.x - ((e.evt.offsetX - oldPos.x) * (newScale - oldScale)) / oldScale,
            oldPos.y - ((e.evt.offsetY - oldPos.y) * (newScale - oldScale)) / oldScale,
          ];
          stageRef.current?.scale({ x: newScale, y: newScale });
          stageRef.current?.setPosition({
            x: newPos[0],
            y: newPos[1],
          });
        }}
      >
        { /* White boundary background base */}
        <Layer>
          <Rect
            x={minXY[0] * UNIT}
            y={minXY[1] * UNIT}
            width={(maxXY[0] - minXY[0] + 1) * UNIT}
            height={(maxXY[1] - minXY[1] + 1) * UNIT}
            fill="white"
          />
        </Layer>
        { /* First layer of walls and doors */}
        <Layer>
          {
            mockedResponse.map((item, index) => {
              switch (item.type) {
                case 'wall':
                  return (
                    <WallBlock key={index} pos={item.pos} props={item.props} />
                  );
                case 'door':
                  return (
                    <DoorBlock key={index} pos={item.pos} props={item.props} />
                  );
                default:
                  return null;
              }
            })
          }
        </Layer>
        { /* Top layer of image and model slots */}
        <Layer>
          {
            mockedResponse.map((item, index) => {
              switch (item.type) {
                case 'wall':
                  if (!item.props.res) {
                    return null;
                  }
                  return (
                    <PictureSlot key={index} pos={item.pos} props={item.props} />
                  );
                case 'model3d':
                  return (
                    <Model3DBlock key={index} pos={item.pos} props={item.props} />
                  );
                default:
                  return null;
              }
            })
          }
        </Layer>
      </Stage>
    </Box>
  );
};
