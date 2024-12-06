import FileEditor from "@/components/FileEditor";
import { useMouse } from "@mantine/hooks";
import { Canvas } from "@react-three/fiber";
import { UserContentFileElement } from "@/types";
import { memo, RefObject, useRef, useState } from "react";
import { useEditorStore } from "@/stores/useEditorStore";
import { DRAG_PORTAL_ID, smallIconProps } from "@/constants";
import { useMetagalleryStore } from "@/providers/MetagalleryProvider";
import { IconDots, IconDownload, IconEdit, IconTrash } from "@tabler/icons-react";
import { DynamicSculpture } from "@/pages/Gallery3D/components/gallery/DynamicSculpture";
import { Box, Button, Card, Image, MantineStyleProp, Menu, Portal, rem, Text } from "@mantine/core";

type UserContentPreviewProps = {
  innerRef: RefObject<any>;
  contentId: number;
  title: string;
  url: string;
  ext: string;
  isDraggingPreview: boolean;
  style: MantineStyleProp;
}

const UserContentPreview = memo(({ innerRef, title, isDraggingPreview, contentId, url, ext, style }: UserContentPreviewProps) => {
  if (ext.includes('glb')) {
    return (
      <Box
        ref={innerRef}
        bg='var(--mantine-color-default-hover)'
        w={isDraggingPreview ? 150 : undefined}
        h={isDraggingPreview ? 150 : undefined}
        style={style}
      >
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          id={`sidebar_canvas_${contentId}`}
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={1} />
          <DynamicSculpture
            position={[0, -1.5, 0]}
            glbUrl={url}
            rotation={[0, 0, 0]}
            scale={[2, 2, 2] as any}
            rotate={true}
          />
        </Canvas>
      </Box>
    );
  }

  return (
    <Image
      ref={innerRef}
      src={url}
      alt={title}
      style={style}
    />
  );
}, (prev, next) => {
  return prev.contentId === next.contentId;
});

const ContentSidebarElement = ({ element }: { element: UserContentFileElement }) => {
  const { x, y } = useMouse();
  const [isHovered, setIsHovered] = useState(false);
  const [opened, setOpened] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const draggingElem = useEditorStore((state) => state.draggingFile);
  const isDraggingFileVisible = useEditorStore((state) => state.isDraggingFileVisible);

  return (
    <>
      {
        (draggingElem === element && isDraggingFileVisible) && (
          <Portal target={`#${DRAG_PORTAL_ID}`}>
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                top: y - 20,
                left: x - 40,
                zIndex: 6969,
                // border: '1px solid black',
                opacity: 0.8,
                width: imageRef.current?.width ?? 100,
                height: imageRef.current?.height ?? 100,
              }}
            >
              <UserContentPreview
                isDraggingPreview={true}
                innerRef={imageRef}
                title={element.title}
                url={element.url}
                contentId={element.id}
                ext={element.ext}
                style={{ borderRadius: 5 }}
              />
            </div>
          </Portal>
        )
      }
      <Card
        p="xs"
        draggable
        onMouseOver={() => setIsHovered(true)}
        opacity={draggingElem === element ? 0.4 : 1}
        style={{ userSelect: 'none', position: 'relative', cursor: 'pointer' }}
        onDragStart={(e) => {
          e.preventDefault();
          useEditorStore.getState().startDragging(element);
        }}
      >
        <Card.Section>
          <UserContentPreview
            isDraggingPreview={false}
            innerRef={imageRef}
            url={element.url}
            title={element.title}
            contentId={element.id}
            ext={element.ext}
            style={{
              height: '100%',
              display: 'block'
            }}
          />
        </Card.Section>
        <Text size="xs" fw={700} mt={8}>{element.title || 'Sin título'}</Text>
        <Text size="xs" mt={4}>{element.description || 'Sin descripción'}</Text>
        {
          (opened || isHovered) && (
            <div style={{ position: 'absolute', top: '2px', right: '2px' }}>
              <Menu position="bottom-start" onOpen={() => setOpened(true)} onClose={() => setOpened(false)} openDelay={0}>
                <Menu.Target>
                  <Button size="compact-xs">
                    <IconDots {...smallIconProps} />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit style={{ width: rem(14) }} />}
                    onClick={() => {
                      useMetagalleryStore.getState().openModal({
                        id: 'file-editor-modal',
                        child: <FileEditor element={element} />
                      })
                    }}
                  >
                    Editar
                  </Menu.Item>
                  <Menu.Item leftSection={<IconDownload style={{ width: rem(14) }} />}>
                    Descargar
                  </Menu.Item>
                  <Menu.Item color="red" leftSection={<IconTrash style={{ width: rem(14) }} />}>
                    Eliminar
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          )
        }
      </Card>
    </>
  );
};

export default ContentSidebarElement;
