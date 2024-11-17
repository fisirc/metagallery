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
import { useApi } from '@/hooks/useApi';
import { GenericGalleryBlock, isDoorBlock, isModel3DBlock, isWallBlock, PictureSlotProps } from '@/types';

export const Canvas = ({ gallery }: { gallery: string }) => {
  const [viewport, setViewport] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const draggingElem = useEditorStore((state) => state.draggingFile);
  let { data: blocks } = useApi<GenericGalleryBlock[]>(`gallery/${gallery}`);

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
    if (!blocks) {
      return [0, 0];
    }

    let x = 0;
    let y = 0;

    for (const item of blocks) {
      const size = item.props.size ?? 1;
      x = Math.min(x, item.pos[0]);
      y = Math.min(y, item.pos[1]);

      if (item.props.dir === DIR_TOP) {
        y = Math.min(y, item.pos[1] - size);
      }
      if (item.props.dir === DIR_LEFT) {
        x = Math.min(x, item.pos[0] - size);
      }
    }

    return [x, y];
  }, [blocks]);

  const maxXY = useMemo(() => {
    let x = 0;
    let y = 0;

    if (!blocks) {
      return [0, 0];
    }

    for (const item of blocks) {
      const size = item.props.size ?? 1;
      x = Math.max(x, item.pos[0]);
      y = Math.max(y, item.pos[1]);

      if (item.props.dir === DIR_BOTTOM) {
        y = Math.max(y, item.pos[1] + size);
      }
      if (item.props.dir === DIR_RIGHT) {
        x = Math.max(x, item.pos[0] + size);
      }
    }

    return [x - 1, y - 1];
  }, [blocks]);

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

  if (!blocks) {
    blocks = [];
  }

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
            blocks.map((item, index) => {
              if (isWallBlock(item)) {
                return (
                  <WallBlock key={index} block={item} />
                );
              }
              if (isDoorBlock(item)) {
                return (
                  <DoorBlock key={index} block={item} />
                );
              }

              return null;
            })
          }
        </Layer>
        { /* Top layer of image and model slots */}
        <Layer>
          {
            blocks.map((item, index) => {
              if (isWallBlock(item)) {
                if (!item.props.res) {
                  return null;
                }
                return (
                  <PictureSlot key={index} block={item as PictureSlotProps} />
                );
              }
              if (isModel3DBlock(item)) {
                return (
                  <Model3DBlock key={index} block={item} />
                );
              }
              return null;
            })
          }
        </Layer>
      </Stage>
    </Box>
  );
};
