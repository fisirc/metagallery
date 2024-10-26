import { Rect } from 'react-konva';
import { DIR_TOP, DIR_RIGHT, DIR_BOTTOM, DIR_LEFT, UNIT, WALL_THICKNESS, WALL_COLOR } from '../constants';

export type WallBlockProps = {
  pos: [number, number],
  props: {
    size: number,
    dir: 0 | 1 | 2 | 3,
    res?: string | null,
  },
};

const HALF_THICKNESS = WALL_THICKNESS / 2;

export const WallBlock = ({ pos, props }: WallBlockProps) => {
  const scaledPosX = pos[0] * UNIT - HALF_THICKNESS;
  const scaledPosY = pos[1] * UNIT - HALF_THICKNESS;
  const scaledSize = props.size * UNIT;

  switch (props.dir) {
    case DIR_TOP: {
      return (
        <Rect
          x={scaledPosX}
          y={scaledPosY - scaledSize}
          fill={WALL_COLOR}
          width={WALL_THICKNESS}
          height={scaledSize + WALL_THICKNESS}
        />
      );
    }
    case DIR_RIGHT: {
      return (
        <Rect
          x={scaledPosX}
          y={scaledPosY}
          fill={WALL_COLOR}
          width={scaledSize + WALL_THICKNESS}
          height={WALL_THICKNESS}
        />
      );
    }
    case DIR_BOTTOM: {
      return (
        <Rect
          x={scaledPosX}
          y={scaledPosY}
          fill={WALL_COLOR}
          width={WALL_THICKNESS}
          height={scaledSize + WALL_THICKNESS}
        />
      );
    }
    case DIR_LEFT: {
      return (
        <Rect
          x={scaledPosX - scaledSize}
          y={scaledPosY}
          fill={WALL_COLOR}
          width={scaledSize + WALL_THICKNESS}
          height={WALL_THICKNESS}
        />
      );
    }
    default: {
      return null;
    }
  }
};
