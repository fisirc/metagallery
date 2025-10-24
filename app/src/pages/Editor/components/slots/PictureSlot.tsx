import useImage from 'use-image';
import { memo, useState } from 'react';
import { Image, Rect, Group } from 'react-konva';
import { setCursor } from '@/utils';
import { useEditorStore } from '@/stores/useEditorStore';
import { useMetagalleryStore } from '@/providers/MetagalleryProvider';
import { API_URL, CORNER_RADIUS, FRAME_STROKE_WIDTH, noImageSrc } from '@/constants';
import { JSONValue, SlotVertices } from '@/types';
import { cosine, getFrameAngle, getFrameHeight, getFrameWidth, medianPoint, sine, v3tov2 } from '@/pages/Editor/utils';
import { useUser } from '@/stores/useUser';
import { mutate } from 'swr';
import { notifications } from '@mantine/notifications';
import { SlotInformationModal } from '../SlotInformationModa';

type PictureSlotProps = {
  idRef: string,
  v: SlotVertices,
  res: string | null;
  props: Record<string, JSONValue>;
  title: string;
  description: string;
};

export const PictureSlot = memo(({ idRef, v, res, title, description, props }: PictureSlotProps) => {
  const [hovering, setHovering] = useState(false);
  const draggingElem = useEditorStore((s) => s.draggingFile);
  const gallery = useEditorStore((s) => s.gallery);
  const dragging = draggingElem !== null && !draggingElem.ext.includes('glb');
  const draggingInvalid = draggingElem !== null && draggingElem.ext.includes('glb');
  const [optimisticImgSrc, setOptimisticImgSrc] = useState<string | null>(null);

  let src = res;
  if (hovering && dragging) {
    // Preview when user hover this slot while drawing
    src = draggingElem.url;
    useEditorStore.getState().setDraggingFileVisible(false);
  }
  else if (optimisticImgSrc) {
    src = optimisticImgSrc;
  }

  const [image] = useImage(src ?? noImageSrc);

  // const pos = v3tov2(v[3]);
  const pos = medianPoint(v3tov2(v[1]), v3tov2(v[3]));
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

  const x = -pos[0];
  const y = pos[1];

  return (
    <Group>
      { /* Base color and border */}

      <Rect
        x={x}
        y={y}
        offsetX={+frameWidth / 2}
        offsetY={+frameHeight / 2}
        width={frameWidth}
        height={frameHeight}
        // rotation={rotation}
        listening
        fillAfterStrokeEnabled
        strokeHitEnabled
        cornerRadius={CORNER_RADIUS}
        stroke={hovering ? (dragging ? '#e8bb74' : '#b0b0b0') : '#c0c0c0'}
        fill={dragging ? '#fcf3de' : (hovering ? '#e1e3e5' : '#f1f3f5')}
        strokeWidth={FRAME_STROKE_WIDTH}
        onClick={() => {
          useMetagalleryStore.getState().openModal({
            id: 'picture-slot-modal',
            child: (
              <SlotInformationModal
                id='picture-slot-modal'
                title={title}
                description={description}
                slotRef={idRef}
              />
            )
          });
        }}
        onMouseUp={async () => {
          const dropped = hovering && dragging;

          if (dropped) {
            setOptimisticImgSrc(draggingElem.url);
            try {
              const r = await fetch(`${API_URL}/gallery/slot`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'token': useUser.getState().token ?? 'invalid-token',
                },
                body: JSON.stringify({
                  gallery: gallery,
                  ref: idRef,
                  title: draggingElem.title,
                  description: draggingElem.description,
                  res: draggingElem.id,
                }),
              });
            } catch {
              notifications.show({
                color: 'red',
                title: 'Error',
                message: 'Failed to update slot',
              });
            } finally {
              mutate(`/gallery/${gallery}`);
            }
          }
        }}
        onMouseEnter={() => {
          if (!draggingInvalid) {
            setHovering(true);
            setCursor('pointer');
          } else {
            setCursor('not-allowed');
          }
        }}
        onMouseLeave={() => {
          useEditorStore.getState().setDraggingFileVisible(true);
          setHovering(false);
          setCursor(null);
        }}
      />
      { /* Rendered image */}
      {
        image && <Image
          x={x - imgOffsetY * sine(rotation) + imgOffsetX * cosine(rotation)}
          y={y + imgOffsetY * cosine(rotation) + imgOffsetX * sine(rotation)}
          offsetX={+frameWidth / 2}
          offsetY={+frameHeight / 2}

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
}, (prev, next) => {
  return prev.res === next.res && prev.title === next.title && prev.description === next.description;
});
