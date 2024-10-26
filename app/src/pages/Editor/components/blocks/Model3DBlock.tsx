import { Image } from 'react-konva';
import useImage from 'use-image';
import { UNIT } from '../constants';

export type Model3DBlockProps = {
  pos: [number, number],
  props: {
    size?: number,
    dir?: number,
    res: string,
  },
};

export const Model3DBlock = ({ pos, props }: Model3DBlockProps) => {
  const [image] = useImage(props.res);

  return (
    <Image
      x={(pos[0] - 0.4) * UNIT}
      y={(pos[1] - 0.4) * UNIT}
      image={image}
      width={UNIT * 0.8}
      height={UNIT * 0.8}
    />
  );
};
