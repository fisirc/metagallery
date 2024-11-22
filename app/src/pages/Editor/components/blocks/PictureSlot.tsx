import useImage from 'use-image';
import { useState } from 'react';
import { Text } from '@mantine/core';
import { Image, Rect, Group } from 'react-konva';
import { setCursor } from '@/utils';
import { useEditorStore } from '@/stores/editorAction';
import { useMetagalleryStore } from '@/providers/MetagalleryProvider';
import { cornerRadius, FRAME_STROKE_WIDTH, noImageSrc } from '@/constants';
import { JSONValue, SlotVertices } from '@/types';
import { getFrameAngle, getFrameHeight, getFrameWidth, v3tov2 } from '@/pages/Editor/utils';

type PictureSlotProps = {
  id: number,
  v: SlotVertices,
  res: string | null;
  props: Record<string, JSONValue>;
};

export const PictureSlot = ({ id, v, res, props }: PictureSlotProps) => {
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

  const pos = v3tov2(v[2]);
  const rotation = getFrameAngle(v);

  const frameWidth = getFrameWidth(v);
  const frameHeight = getFrameHeight(v);

  const frameRatio = frameWidth / frameHeight;
  const imageRatio = image ? image.width / image.height : 1;

  let imgWidth = frameWidth;
  let imgHeight = frameHeight;
  let imgOffsetX = 0;
  let imgOffsetY = 0;

  if (frameRatio > imageRatio) {
    imgWidth = imgHeight * imageRatio;
    imgOffsetX = frameWidth / 2 - imgWidth / 2;
  }
  else {
    imgHeight = imgWidth / imageRatio;
    imgOffsetY = frameHeight / 2 - imgHeight / 2;
  }

  return (
    <Group>
      { /* Base */}
      <Rect
        x={pos[0]}
        y={pos[1]}
        width={frameWidth}
        height={frameHeight}
        rotation={rotation}
        cornerRadius={cornerRadius}
        fill={dragging ? '#fcf3de' : (hovering ? '#e1e3e5' : '#f1f3f5')}
      />
      { /* Rendered image */}
      {
        image && <Image
          x={pos[0] + imgOffsetX}
          y={pos[1] + imgOffsetY}
          width={imgWidth}
          height={imgHeight}
          rotation={rotation}
          image={image}
        />
      }
      { /* Border */}
      <Rect
        x={pos[0] - FRAME_STROKE_WIDTH / 2}
        y={pos[1] - FRAME_STROKE_WIDTH / 2}
        width={frameWidth + FRAME_STROKE_WIDTH}
        height={frameHeight + FRAME_STROKE_WIDTH}
        listening
        cornerRadius={cornerRadius}
        rotation={rotation}
        stroke={hovering ? (dragging ? '#e8bb74' : '#b0b0b0') : '#c0c0c0'}
        strokeWidth={FRAME_STROKE_WIDTH}
        onClick={() => {
          useMetagalleryStore.getState().openModal(
            <Text>Hawk tuah!</Text>
          );
        }}
        onMouseEnter={() => {
          setHovering(true);
          setCursor('pointer');
        }}
        onMouseLeave={() => {
          setHovering(false);
          setCursor(null);
        }}
      />
    </Group>
  );
};
