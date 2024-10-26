import { Image, Rect } from 'react-konva';
import useImage from 'use-image';
import { UNIT } from '../constants';

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

  return (
    <>
      <Rect
        x={(pos[0] - 0.3) * UNIT}
        y={(pos[1] - 0.3) * UNIT}
        width={UNIT * 0.6}
        height={UNIT * 0.6}
        fill="#f1f3f5"
      />
      <Image
        x={(pos[0] - 0.3) * UNIT}
        y={(pos[1] - 0.3) * UNIT}
        image={image}
        width={UNIT * 0.6}
        height={UNIT * 0.6}
      />
    </>
  );
};
