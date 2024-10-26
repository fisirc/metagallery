import { Rect } from 'react-konva';
import { DIR_TOP, DIR_RIGHT, DIR_BOTTOM, DIR_LEFT, UNIT, WALL_THICKNESS, WALL_COLOR } from '../constants';

export type DoorBlockProps = {
  pos: [number, number],
  props: {
    size: number,
    dir?: number,
    res?: string,
  },
};

export const DoorBlock = ({ pos, props }: DoorBlockProps) => {
  switch (props.dir) {
    case DIR_TOP: {
      return (
        <Rect
          x={pos[0] * UNIT}
          y={pos[1] * UNIT - props.size * UNIT}
          fill={WALL_COLOR}
          width={WALL_THICKNESS}
          height={props.size * UNIT}
        />
      );
    }
    case DIR_RIGHT: {
      return (
        <Rect
          x={pos[0] * UNIT}
          y={pos[1] * UNIT}
          fill={WALL_COLOR}
          width={props.size * UNIT}
          height={WALL_THICKNESS}
        />
      );
    }
    case DIR_BOTTOM: {
      return (
        <Rect
          x={pos[0] * UNIT}
          y={pos[1] * UNIT}
          fill={WALL_COLOR}
          width={WALL_THICKNESS}
          height={props.size * UNIT}
        />
      );
    }
    case DIR_LEFT: {
      return (
        <Rect
          x={pos[0] * UNIT - props.size * UNIT}
          y={pos[1] * UNIT}
          fill={WALL_COLOR}
          width={props.size * UNIT}
          height={WALL_THICKNESS}
        />
      );
    }
    default: {
      return null;
    }
  }
};
