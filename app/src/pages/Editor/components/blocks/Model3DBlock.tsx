import { Image, Rect } from 'react-konva';
import useImage from 'use-image';
import { useState } from 'react';
import { UNIT } from '../constants';
import { useEditorStore } from '@/stores/editorAction';

export type Model3DBlockProps = {
  pos: [number, number],
  props: {
    size?: number, // We ignore size since this is a 2d view
    dir?: number,
    res: string,
  },
};

export const Model3DBlock = ({ pos, props }: Model3DBlockProps) => {
  const [image] = useImage(props.res);
  const draggingElem = useEditorStore((state) => state.draggingFile);
  const [hovering, sethovering] = useState(false);

  const x = (pos[0] - 0.3) * UNIT;
  const y = (pos[1] - 0.3) * UNIT;
  const size = UNIT * 0.6;

  const aboutToDrop = hovering && draggingElem !== null;

  return (
    <>
      <Rect
        x={x}
        y={y}
        width={size}
        height={size}
        fill={aboutToDrop ? '#e1e3e5' : '#f1f3f5'}
        cornerRadius={5}
      />
      <Image
        x={x}
        y={y}
        image={image}
        width={size}
        height={size}
      />
      <Rect
        x={x}
        y={y}
        width={size}
        height={size}
        stroke={aboutToDrop && draggingElem !== null ? '#b0b0b0' : '#e1e3e5'}
        cornerRadius={5}
        onMouseMove={() => {
          if (draggingElem !== null) {
            sethovering(true);
          }
        }}
        onMouseLeave={() => {
          sethovering(false);
        }}
      />
    </>
  );
};
