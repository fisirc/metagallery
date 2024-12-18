import Konva from 'konva';
import useImage from 'use-image';
import { Box, useMantineColorScheme } from '@mantine/core';
import { memo, useEffect, useRef, useState } from 'react';
import { Image, Layer, Rect, Stage } from 'react-konva';
import { setCursor } from '@/utils';
import { SLOTS_SCALE, ZOOM_FACTOR } from '@/constants';
import { useEditorStore } from '@/stores/useEditorStore';
import { PictureSlot } from '@/pages/Editor/components/slots/PictureSlot';
import { Model3DSlot } from '@/pages/Editor/components/slots/Model3DSlot';
import { getInitialScale, getInitialXY, saveScaleToLocalStorage, saveXYToLocalStorage } from '../utils';
import { useApi } from '@/hooks/useApi';
import { SlotVertices, StillerGallery } from '@/types';

const initialScale = getInitialScale();
const initialXY = getInitialXY();

type GalleryCanvas2DProps = {
  // The gallery unique handle to render as 2D editor view
  gallery: string;
  // A hacky boolean that parents can toggle to force re-render the canvas
  triggerReRender?: boolean;
}

export const GalleryCanvas2D = memo(({ gallery, triggerReRender }: GalleryCanvas2DProps) => {
  const [viewport, setViewport] = useState({ x: 0, y: 0 });
  const draggingElem = useEditorStore((state) => state.draggingFile);
  const stageRef = useRef<Konva.Stage>(null);
  const { response } = useApi<StillerGallery>(`/gallery/${gallery}`);

  const [topViewUrl, setTopViewUrl] = useState('');
  const [image,] = useImage(topViewUrl);

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const handleViewportResize = () => {
    const bounds = document.getElementById('canvas')?.getBoundingClientRect();
    if (bounds) setViewport({ x: bounds.width, y: bounds.height });
  };

  useEffect(() => {
    handleViewportResize();
    window.addEventListener('resize', handleViewportResize);
    stageRef.current?.scale({ x: initialScale, y: initialScale, });

    return () => {
      window.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  useEffect(() => {
    handleViewportResize();
  }, [triggerReRender]);

  useEffect(() => {
    if (response) {
      setTopViewUrl(`https://pandadiestro.xyz/services/stiller/template/info/${response.data.templateid}/topview`);
    }
  }, [response]);

  return (
    <Box
      id="canvas"
      w="100%"
      mb="16px"
      mih="100%"
      bd="1px solid var(--mantine-color-default-border)"
      bg={draggingElem ? (dark ? '#333' : '#d8d8d8') : (dark ? '#2f2f2f' : '#e4e4e4')}
      style={{
        borderRadius: 'var(--mantine-radius-md)',
        overflow: 'hidden',
      }}
    >

      <Stage
        ref={stageRef}
        width={viewport.x}
        height={viewport.y}
        x={initialXY.x ?? viewport.x / 2 - (image?.width ?? 0) / 2}
        y={initialXY.y ?? viewport.y / 2 - (image?.height ?? 0) / 2}
        draggable
        onMouseEnter={() => { setCursor('move'); }}
        onMouseLeave={() => { setCursor(null); }}
        onDragMove={() => {
          if (stageRef.current) {
            saveXYToLocalStorage(stageRef.current.x(), stageRef.current.y());
          }
        }}
        onWheel={(e) => {
          e.evt.preventDefault();
          const oldScale = stageRef.current?.scaleX() || 1;
          const newScale = e.evt.deltaY > 0 ? oldScale / ZOOM_FACTOR : oldScale * ZOOM_FACTOR;

          const oldPos = stageRef.current?.position() || { x: 0, y: 0 };
          const newPos = [
            oldPos.x - ((e.evt.offsetX - oldPos.x) * (newScale - oldScale)) / oldScale,
            oldPos.y - ((e.evt.offsetY - oldPos.y) * (newScale - oldScale)) / oldScale,
          ];
          stageRef.current?.scale({ x: newScale, y: newScale });
          saveScaleToLocalStorage(newScale);
          stageRef.current?.setPosition({
            x: newPos[0],
            y: newPos[1],
          });
        }}
      >
        { /* Base layer of the rendered top view */}
        <Layer>
          <Image image={image} />
        </Layer>
        <Layer scale={SLOTS_SCALE} offsetX={response?.data.slots.origin[0]} offsetY={response?.data.slots.origin[1]}>
          {
            response && response.data.slots.slots.map((block, i) => {
              const res = block.res !== 0 ? `https://pandadiestro.xyz/services/stiller/file/dl/${block.res}/` : null;

              if (block.type == '2d') {
                return (
                  <PictureSlot
                    key={i}
                    idRef={block.ref}
                    v={block.v as unknown as SlotVertices}
                    props={block.props}
                    title={block.title}
                    description={block.description}
                    res={res}
                  />
                );
              }
              if (block.type == '3d') {
                return (
                  <Model3DSlot
                    key={i}
                    idRef={block.ref}
                    v={block.v[0]}
                    props={block.props}
                    title={block.title}
                    description={block.description}
                    res={res}
                  />
                );
              }
            })
          }
          { /* Canvas origin dot */}
          <Rect
            fill="black"
            x={-0.05} y={-0.05}
            width={0.1} height={0.1}
          />
        </Layer>
      </Stage>
    </Box>
  );
});
