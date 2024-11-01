import useImage from 'use-image';
import { useState } from 'react';
import { Image, Rect } from 'react-konva';
import { setCursor } from '@/utils';
import { useEditorStore } from '@/stores/editorAction';
import { DIR_TOP, DIR_RIGHT, DIR_BOTTOM, DIR_LEFT, UNIT, WALL_THICKNESS, PICTURE_SLOT_UNIT } from '../constants';

export type PictureSlotProps = {
  pos: [number, number],
  props: {
    size: number,
    dir: 0 | 1 | 2 | 3,
    res: string,
  },
};

const HALF_THICKNESS = WALL_THICKNESS / 2;
const WALL_PADDING = 0.1;

export const PictureSlot = ({ pos, props }: PictureSlotProps) => {
  const [image] = useImage(props.res);
  const [hovering, setHovering] = useState(false);
  const draggingElem = useEditorStore((state) => state.draggingFile);

  const scaledPosX = pos[0] * UNIT - HALF_THICKNESS;
  const scaledPosY = pos[1] * UNIT - HALF_THICKNESS;
  const scaledSize = props.size * UNIT;
  const scaledSizeWithoutPadding = scaledSize * (1 - 2 * WALL_PADDING);

  if (!image) {
    return null;
  }

  const dragging = draggingElem !== null;

  const ratio = image.width / image.height;

  let x: number;
  let y: number;
  let w: number;
  let h: number;

  let ix: number;
  let iy: number;
  let iw: number;
  let ih: number;

  let corners: number[];

  let irotation: number;

  switch (props.dir) {
    case DIR_LEFT: {
      x = scaledPosX - scaledSize + 0.1 * scaledSize;
      y = scaledPosY - PICTURE_SLOT_UNIT;
      irotation = 0;
      corners = [5, 5, 0, 0];
      break;
    }
    case DIR_RIGHT: {
      x = scaledPosX + 0.1 * scaledSize;
      y = scaledPosY + WALL_THICKNESS;
      irotation = 0;
      corners = [0, 0, 5, 5];
      break;
    }
    case DIR_BOTTOM: {
      x = pos[0] * UNIT - PICTURE_SLOT_UNIT - HALF_THICKNESS;
      y = scaledPosY + 0.1 * scaledSize;
      irotation = 90;
      corners = [5, 0, 0, 5];
      break;
    }
    case DIR_TOP: {
      x = scaledPosX + WALL_THICKNESS;
      y = scaledPosY - scaledSize + 0.1 * scaledSize;
      irotation = -90;
      corners = [0, 5, 5, 0];
      break;
    }
  }

  switch (props.dir) {
    case DIR_TOP:
    case DIR_BOTTOM: {
      w = PICTURE_SLOT_UNIT;
      h = scaledSizeWithoutPadding + WALL_THICKNESS;
      iw = PICTURE_SLOT_UNIT * ratio;
      ih = PICTURE_SLOT_UNIT;
      break;
    }
    case DIR_RIGHT:
    case DIR_LEFT: {
      w = scaledSizeWithoutPadding + WALL_THICKNESS;
      h = PICTURE_SLOT_UNIT;
      iw = PICTURE_SLOT_UNIT * ratio;
      ih = PICTURE_SLOT_UNIT;
      break;
    }
  }

  switch (props.dir) {
    case DIR_BOTTOM: {
      ix = x + w;
      iy = y + h / 2 - iw / 2;
      break;
    }
    case DIR_TOP: {
      ix = x;
      iy = y + h / 2 + iw / 2;
      break;
    }
    case DIR_LEFT:
    case DIR_RIGHT: {
      ix = x + w / 2 - iw / 2;
      iy = y;
      break;
    }
  }

  return (
    <>
      { /* Base */}
      <Rect
        cornerRadius={corners}
        x={x}
        y={y}
        fill={hovering ? (dragging ? '#fcf3de' : '#e1e3e5') : '#f1f3f5'}
        width={w}
        height={h}
      />
      { /* Rendered image */}
      <Image
        x={ix}
        y={iy}
        rotation={irotation}
        width={iw}
        height={ih}
        image={image}
      />
      { /* Border */}
      <Rect
        cornerRadius={corners}
        x={x}
        y={y}
        width={w}
        height={h}
        listening
        stroke={hovering ? (dragging ? '#e8bb74' : '#b0b0b0') : '#e1e3e5'}
        onMouseEnter={() => {
          setHovering(true);
          setCursor('pointer');
        }}
        onMouseLeave={() => {
          setHovering(false);
          setCursor(null);
        }}
      />
    </>
  );
};
