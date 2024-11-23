import useImage from 'use-image';
import { useState } from 'react';
import { Image, Rect } from 'react-konva';
import { setCursor } from '@/utils';
import { useEditorStore } from '@/stores/editorAction';
import { FRAME_STROKE_WIDTH, noImageSrc } from '@/constants';
import { JSONValue, SlotVertex } from '@/types';
import { v3tov2 } from '../../utils';

type Model3DBlockProps = {
  id: number,
  v: SlotVertex,
  res: string | null;
  props: Record<string, JSONValue>;
};

export const Model3DSlot = ({ id, v, res, props }: Model3DBlockProps) => {
  const [hovering, setHovering] = useState(false);
  const draggingElem = useEditorStore((state) => state.draggingFile);
  const dragging = draggingElem !== null;

  let src = res;
  if (hovering && dragging) {
    // Preview when user hover this slot while drawing
    src = draggingElem.url;
    useEditorStore.getState().setDraggingFileVisible(false);
  } else {
    useEditorStore.getState().setDraggingFileVisible(true);
  }

  const [image] = useImage(src ?? '');

  const pos = v3tov2(v);
  const size = 2 * (props.scale as number | null ?? 1);
  const x = pos[0] - size / 2;
  const y = pos[1] - size / 2;

  return (
    <>
      <Rect
        x={x}
        y={y}
        width={size}
        height={size}
        fill={dragging ? '#fcf3de' : (hovering ? '#e1e3e5' : '#f1f3f5')}
        cornerRadius={1.2}
      />
      <Image
        x={x}
        y={y}
        image={image}
        width={size}
        height={size}
      />
      {/* Border stroke */}
      <Rect
        x={x}
        y={y}
        width={size}
        height={size}
        stroke={hovering ? (dragging ? '#e8bb74' : '#b0b0b0') : '#c0c0c0'}
        strokeWidth={FRAME_STROKE_WIDTH / 2}
        cornerRadius={1.2}
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
