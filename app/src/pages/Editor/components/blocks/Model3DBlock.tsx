import { memo, useEffect, useMemo, useState } from 'react';
import { Image as KonvaImage, Rect } from 'react-konva';
import { setCursor } from '@/utils';
import { useEditorStore } from '@/stores/editorAction';
import { FRAME_STROKE_WIDTH } from '@/constants';
import { JSONValue, SlotVertex } from '@/types';
import { v3tov2 } from '../../utils';
import { useMetagalleryStore } from '@/providers/MetagalleryProvider';
import { Text } from '@mantine/core';
import { useUser } from '@/stores/useUser';
import { mutate } from 'swr';
import { useQueryClient } from '@tanstack/react-query';
import { useForceUpdate } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

type Model3DBlockProps = {
  idRef: string,
  v: SlotVertex,
  res: string | null;
  props: Record<string, JSONValue>;
};

export const Model3DSlot = memo(({ idRef, v, res, props }: Model3DBlockProps) => {
  const [hovering, setHovering] = useState(false);
  const draggingElem = useEditorStore((state) => state.draggingFile);
  const dragging = draggingElem !== null && draggingElem.ext.includes('glb');
  const graggingInvalid = draggingElem !== null && !draggingElem.ext.includes('glb');
  const gallery = useEditorStore((s) => s.gallery);
  const [forced, forceUpdate] = useState(false);
  const [optimisticResId, setOptimisticResId] = useState<number | null>(null);
  const isPreviewingGallery = useEditorStore((s) => s.isPreviewingGallery);

  useEffect(() => {
    const i = setInterval(() => {
      if (!isPreviewingGallery) {
        forceUpdate(s => !s); // too heavy to use while previewing
      }
    }, 100);
    return () => {
      clearInterval(i);
    }
  }, [isPreviewingGallery]);

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(['user/media']); // Data loaded in the sidebar

  if (hovering && dragging) {
    useEditorStore.getState().setDraggingFileVisible(false);
  }

  let image: HTMLImageElement | undefined = useMemo(() => {
    if (data && res) {
      // We convert the canvas rendered in the sidebar to an image
      const img = new Image();

      // parse from www.url.com/dl/number to number
      let id: number | null = null;

      if (hovering && dragging) {
        id = draggingElem.id;
      } else {
        id = optimisticResId ?? parseInt(res.split('/').at(-2) ?? '0'); // extract id from url
      }
      const canvas = document.getElementById(`sidebar_canvas_${id}`)?.querySelector('canvas');

      if (canvas) {
        img.src = canvas.toDataURL();
        return img;
      }
      return undefined;
    }
    return undefined;
  }, [data, res, optimisticResId, hovering, dragging, forced]);

  // console.log({ forced })

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
        onMouseEnter={() => {
          if (!graggingInvalid) {
            setHovering(true);
            setCursor('pointer');
          } else {
            setCursor('not-allowed');
          }
        }}
        onMouseLeave={() => {
          setHovering(false);
          setCursor(null);
          useEditorStore.getState().setDraggingFileVisible(true);
        }}
        onClick={() => {
          useMetagalleryStore.getState().openModal({
            id: 'picture-slot-modal',
            child: <Text>Hawk tuah!</Text>
          });
        }}
        onMouseUp={async () => {
          const dropped = hovering && dragging;

          if (dropped) {
            setOptimisticResId(parseInt(draggingElem.url.split('/').at(-2) ?? '0'));
            try {
              const response = await fetch('https://pandadiestro.xyz/services/stiller/gallery/slot', {
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
              console.log('UPDATING TO', draggingElem.id, 'MUTATING', `/gallery/${gallery}`)
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
      />
      <KonvaImage
        x={x}
        y={y}
        image={image}
        width={size}
        height={size}
        listening={false}
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
        listening={false}
      />
    </>
  );
}, (prev, next) => {
  return prev.res === next.res;
});

