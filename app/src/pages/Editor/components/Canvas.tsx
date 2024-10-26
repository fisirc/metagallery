import { Box } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Layer, Stage, Text } from 'react-konva';

// TRBL -> 0123

export const Canvas = () => {
  const mockedResponse = [
    {
      type: 'wall',
      pos: [0, 0],
      props: {
        size: 2,
        dir: 0,
        res: '<url>',
      },
    },
    {
      type: 'wall',
      pos: [0, 0],
      props: {
        size: 1,
        dir: 1,
        res: '<url>',
      },
    },
    {
      type: 'wall',
      pos: [1, 2],
      props: {
        size: 1,
        dir: 3,
        res: '<url>',
      },
    },
    {
      type: 'wall',
      pos: [1, 2],
      props: {
        size: 1,
        dir: 1,
        res: '<url>',
      },
    },
    {
      type: 'wall',
      pos: [2, 2],
      props: {
        size: 1,
        dir: 2,
        res: '<url>',
      },
    },
    {
      type: 'wall',
      pos: [2, 1],
      props: {
        size: 1,
        dir: 0,
        res: '<url>',
      },
    },
    {
      type: 'wall',
      pos: [2, 0],
      props: {
        size: 1,
        dir: 3,
        res: '<url>',
      },
    },
    {
      type: 'wall',
      pos: [2, 0],
      props: {
        size: 1,
        dir: 0,
        res: '<url>',
      },
    },
    {
      type: 'wall',
      pos: [0, 0],
      props: {
        size: 2,
        dir: 0,
        res: '<url>',
      },
    },
    {
      type: 'model',
      pos: [1.5, 1.5],
      props: {
        res: '<url>',
      },
    },
    {
      type: 'door',
      pos: [0, 1],
      props: {
        dir: 1,
      },
    },
    {
      type: 'door',
      pos: [1, 0],
      props: {
        dir: 0,
      },
    },
  ];

  const [cstate, setCstate] = useState({
    isDragging: false,
    x: 50,
    y: 50,
  });

  const [viewport, setViewport] = useState({ x: 0, y: 0 });

  useEffect(() => {
    handleViewportResize();
    window.addEventListener('resize', handleViewportResize);
    return () => {
      window.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  const handleViewportResize = () => {
    const bounds = document.getElementById('canvas')?.getBoundingClientRect();

    if (bounds) {
      setViewport({
        x: bounds.width,
        y: bounds.height,
      });
    }
  };

  // NOTE: couldn't achieve a responsive canvas
  return (
    <Box
      id="canvas"
      w="100%"
      mb="16px"
      mih="100%"
      bd="1px solid var(--mantine-color-gray-4)"
      style={{
        borderRadius: 'var(--mantine-radius-md)',
        overflow: 'hidden',
      }}
    >
      <Stage width={viewport.x} height={viewport.y}>
        <Layer>
          <Text
            text="Draggable Text"
            x={cstate.x}
            y={cstate.y}
            draggable
            fill={cstate.isDragging ? 'green' : 'black'}
            onDragStart={() => {
              setCstate({
                isDragging: true,
                x: cstate.x,
                y: cstate.y,
              });
            }}
            onDragEnd={(e) => {
              setCstate({
                isDragging: false,
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />
        </Layer>
      </Stage>
    </Box>
  );
};
