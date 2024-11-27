import useImage from 'use-image';
import { useState } from 'react';
import { Text } from '@mantine/core';
import { Image, Rect, Group, Text as Text3D } from 'react-konva';
import { setCursor } from '@/utils';
import { useEditorStore } from '@/stores/editorAction';
import { useMetagalleryStore } from '@/providers/MetagalleryProvider';
import { CORNER_RADIUS, FRAME_STROKE_WIDTH, noImageSrc } from '@/constants';
import { JSONValue, SlotVertices } from '@/types';
import { cosine, getFrameAngle, getFrameHeight, getFrameWidth, sine, v3tov2 } from '@/pages/Editor/utils';
import { mutate } from 'swr';
import { galleryResponse } from '@/hooks/useApi';

type PictureSlotProps = {
  idRef: string,
  v: SlotVertices,
  res: string | null;
  props: Record<string, JSONValue>;
};

export const PictureSlot = ({ idRef, v, res, props }: PictureSlotProps) => {
  const [hovering, setHovering] = useState(false);
  const draggingElem = useEditorStore((s) => s.draggingFile);
  const gallery = useEditorStore((s) => s.gallery);
  const dragging = draggingElem !== null;

  let src = res;
  if (hovering && dragging) {
    // Preview when user hover this slot while drawing
    src = draggingElem.url;
    useEditorStore.getState().setDraggingFileVisible(false);
  } else {
    useEditorStore.getState().setDraggingFileVisible(true);
  }

  const [image] = useImage(src ?? noImageSrc);

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
      { /* Base color and border */}
      <Rect
        x={pos[0]}
        y={pos[1]}
        width={frameWidth}
        height={frameHeight}
        rotation={rotation}
        listening
        fillAfterStrokeEnabled
        strokeHitEnabled
        cornerRadius={CORNER_RADIUS}
        stroke={hovering ? (dragging ? '#e8bb74' : '#b0b0b0') : '#c0c0c0'}
        fill={dragging ? '#fcf3de' : (hovering ? '#e1e3e5' : '#f1f3f5')}
        strokeWidth={FRAME_STROKE_WIDTH}
        onClick={() => {
          useMetagalleryStore.getState().openModal(
            <Text>Hawk tuah!</Text>
          );
        }}
        onMouseUp={() => {
          const dropped = hovering && dragging;

          if (dropped) {
            for (let e of galleryResponse.slots) {
              if (e.ref === idRef) {
                e.res = draggingElem.url;
              }
            }
          }
          mutate(`gallery/${gallery}`);
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
      { /* Rendered image */}
      {
        image && <Image
          x={pos[0] - imgOffsetY * sine(rotation) + imgOffsetX * cosine(rotation)}
          y={pos[1] + imgOffsetY * cosine(rotation) + imgOffsetX * sine(rotation)}
          width={imgWidth}
          height={imgHeight}
          listening={false}
          rotation={rotation}
          image={image}
        />
      }
      {/* <Text3D
        x={pos[0]}
        y={pos[1]}
        text={rotation.toString()}
        fontSize={0.5}
        listening={false}
        fill={'black'}
        rotation={rotation}
      /> */}
    </Group>
  );
};
