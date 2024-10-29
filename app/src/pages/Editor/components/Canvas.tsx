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

type GenericGalleryBlock = {
  type: 'wall' | 'model3d' | 'door',
  pos: [number, number],
  props: {
    size?: number,
    dir?: 0 | 1 | 2 | 3,
    res?: string | null,
  },
};

// Until we have the backend, we mock
const mockedResponse = ([
  {
    type: 'wall',
    pos: [0, 0],
    props: {
      size: 2,
      dir: DIR_RIGHT,
      res: 'https://static.wikia.nocookie.net/punpun/images/3/3c/Aiko_c1p5.PNG',
    },
  },
  {
    type: 'wall',
    pos: [0, 1],
    props: {
      size: 1,
      dir: DIR_TOP,
      res: 'https://i.ytimg.com/vi/ljV7yI6UbOA/maxresdefault.jpg',
    },
  },
  {
    type: 'wall',
    pos: [2, 0],
    props: {
      size: 2,
      dir: DIR_LEFT,
      res: null,
    },
  },
  {
    type: 'wall',
    pos: [2, 0],
    props: {
      size: 2,
      dir: DIR_BOTTOM,
      res: 'https://www.bnews.com.br/media/uploads/junho_2024/imagem_materia_-_2024-06-12t151221.715.jpg',
    },
  },
  {
    type: 'wall',
    pos: [2, 0],
    props: {
      size: 1,
      dir: DIR_BOTTOM,
      res: null,
    },
  },
  {
    type: 'wall',
    pos: [0, 2],
    props: {
      size: 2,
      dir: DIR_TOP,
      res: null,
    },
  },
  {
    type: 'wall',
    pos: [2, 2],
    props: {
      size: 1,
      dir: DIR_LEFT,
      res: 'https://wallpapercat.com/w/full/1/6/d/138467-3840x2160-desktop-4k-spirited-away-wallpaper-image.jpg',
    },
  },
  {
    type: 'wall',
    pos: [0, 2],
    props: {
      size: 2,
      dir: DIR_RIGHT,
      res: null,
    },
  },
  {
    type: 'model3d',
    pos: [0.5, 1.5],
    props: {
      res: 'https://makerworld.bblmw.com/makerworld/model/US28978010208f6c/58313790/instance/plate_1.png',
      size: 1,
    },
  },
  {
    type: 'door',
    pos: [0, 1],
    props: {
      dir: DIR_RIGHT,
      size: 1,
    },
  },
  {
    type: 'door',
    pos: [1, 2],
    props: {
      dir: DIR_TOP,
      size: 1,
    },
  },
] satisfies Array<GenericGalleryBlock>).toSorted((a, b) => b.props.size - a.props.size);

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
