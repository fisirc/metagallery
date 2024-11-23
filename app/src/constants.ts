import { IconProps } from '@tabler/icons-react';

export const primaryIconProps: IconProps = {
  size: '18px',
  stroke: 1.5,
} as const;

export const secondaryIconProps: IconProps = {
  size: '16px',
  stroke: 1.5,
} as const;

export const smallIconProps: IconProps = {
  size: '14px',
  stroke: 1.5,
} as const;

export const noImageSrc = '';

export const CORNER_RADIUS = [0.02, 0.02, 0.02, 0.02];
export const FRAME_STROKE_WIDTH = 0.12;

// 🎨 2D Editor constants

export const ZOOM_FACTOR = 1.08;

export const WALL_COLOR = '#c0c0c0';

export const DRAG_PORTAL_ID = 'drag-portal';
export const MODAL_PORTAL_ID = 'modal-portal';

/**
 * The mult factor to convert from px to meters.
 * Actually, 37.8 is for centimeters, but I chose it to be meters because 378 would be too much.
 *
 * <https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#lengths>
 */
export const PX_TO_METERS_FACTOR = 37.8;
export const SLOTS_SCALE = { x: PX_TO_METERS_FACTOR, y: PX_TO_METERS_FACTOR };
