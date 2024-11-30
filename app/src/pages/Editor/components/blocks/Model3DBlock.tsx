import { useEffect, useState } from 'react';
import { Image as KonvaImage, Rect } from 'react-konva';
import { setCursor } from '@/utils';
import { useEditorStore } from '@/stores/editorAction';
import { FRAME_STROKE_WIDTH } from '@/constants';
import { JSONValue, SlotVertex, UserContentFileElement } from '@/types';
import { v3tov2 } from '../../utils';
import { useMetagalleryStore } from '@/providers/MetagalleryProvider';
import { Text } from '@mantine/core';
import { useUser } from '@/stores/useUser';
import { mutate } from 'swr';
import { useQueryClient } from '@tanstack/react-query';
import { useForceUpdate } from '@mantine/hooks';

type Model3DBlockProps = {
  idRef: string,
  v: SlotVertex,
  res: string | null;
  props: Record<string, JSONValue>;
};

export const Model3DSlot = ({ idRef, v, res, props }: Model3DBlockProps) => {
  const [hovering, setHovering] = useState(false);
  const draggingElem = useEditorStore((state) => state.draggingFile);
  const dragging = draggingElem !== null;
  const gallery = useEditorStore((s) => s.gallery);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const i = setInterval(forceUpdate, 500);
    return () => {
      clearInterval(i);
    }
  }, []);

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(['user/media']);

  if (hovering && dragging && draggingElem.ext.includes('glb')) {
    useEditorStore.getState().setDraggingFileVisible(false);
  } else {
    useEditorStore.getState().setDraggingFileVisible(true);
  }

  let image: HTMLImageElement | undefined = undefined;

  if (data && res) {
    image = new Image();
    // parse from www.url.com/dl/number to number
    let id: number | null = null;

    if (hovering && dragging) {
      id = draggingElem.id;
    } else {
      id = parseInt(res.split('/').at(-2) ?? '0'); // extract id from url
    }
    const canvas = document.getElementById(`sidebar_canvas_${id}`)?.querySelector('canvas');

    if (canvas) {
      const img = new Image();
      img.src = canvas.toDataURL();
      image = img;
    }
  }

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
          setHovering(true);
          setCursor('pointer');
        }}
        onMouseLeave={() => {
          setHovering(false);
          setCursor(null);
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
            // setOptimisticImgSrc(draggingElem.url);
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
            mutate(`/gallery/${gallery}`);
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
};
