// Represents a row in the 'file' table
export interface UserContentFileElement {
  id: number,
  url: string,
  title?: string,
  description?: string,
  type: 'model3d' | 'image',
}

export type GenericGalleryBlock = {
  type: 'wall' | 'model3d' | 'door',
  pos: [number, number],
  props: {
    size?: number,
    dir?: 0 | 1 | 2 | 3,
    res?: string | null,
  },
};

export type WallBlockProps = {
  type: 'wall',
  pos: [number, number],
  props: {
    size: number,
    dir: 0 | 1 | 2 | 3,
    res?: string | null,
  },
};

export type PictureSlotProps = {
  type: 'wall',
  pos: [number, number],
  props: {
    size: number,
    dir: 0 | 1 | 2 | 3,
    res?: string,
  },
};

export type Model3DBlockProps = {
  type: 'model3d',
  pos: [number, number],
  props: {
    size?: number,
    dir?: 0 | 1 | 2 | 3,
    res?: string,
  },
};

export type DoorBlockProps = {
  type: 'door',
  pos: [number, number],
  props: {
    size: number,
    dir?: 0 | 1 | 2 | 3,
    res?: string,
  },
};

export const isWallBlock = (block: GenericGalleryBlock): block is WallBlockProps => {
  return block.type === 'wall';
};

export const isPictureSlotBlock = (block: GenericGalleryBlock): block is WallBlockProps => {
  return block.type === 'wall' && block.props.res !== null;
};

export const isModel3DBlock = (block: GenericGalleryBlock): block is Model3DBlockProps => {
  return block.type === 'model3d';
};

export const isDoorBlock = (block: GenericGalleryBlock): block is DoorBlockProps => {
  return block.type === 'door';
};
