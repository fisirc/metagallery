import FileEditor from "@/components/FileEditor";
import { DRAG_PORTAL_ID, smallIconProps } from "@/constants";
import { DynamicSculpture } from "@/pages/Gallery3D/components/gallery/DynamicSculpture";
import { useMetagalleryStore } from "@/providers/MetagalleryProvider";
import { useEditorStore } from "@/stores/editorAction";
import { UserContentFileElement } from "@/types";
import { Button, Card, Image, MantineStyleProp, Menu, Portal, rem, Text } from "@mantine/core";
import { useHover, useMouse } from "@mantine/hooks";
import { Canvas } from "@react-three/fiber";
import { IconDots, IconDownload, IconEdit, IconTrash } from "@tabler/icons-react";
import { RefObject, useRef, useState } from "react";

type UserContentPreviewProps = {
  ref: RefObject<any>;
  contentId: number;
  title: string;
  url: string;
  ext: string;
  style: MantineStyleProp;
}

const UserContentPreview = ({ ref, title, contentId, url, ext, style }: UserContentPreviewProps) => {
  if (ext.includes('glb')) {
    return (
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        id={`sidebar_canvas_${contentId}`}
        ref={ref}
        style={{ pointerEvents: 'none' }}
      >
        <DynamicSculpture
          position={[0, -1.5, 0]}
          glbUrl={url}
          rotation={[0, Math.PI / 4, 0]}
          scale={[2, 2, 2] as any}
          rotate={true}
        />
      </Canvas>
    );
  }

  return (
    <Image
      ref={ref}
      src={url}
      alt={title}
      style={style}
    />
  );
}

const ContentSidebarElement = ({ element }: { element: UserContentFileElement }) => {
  const { hovered, ref } = useHover();
  const { x, y } = useMouse();
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
                border: '1px solid black',
                opacity: 0.8,
                width: imageRef.current?.width ?? 100,
                height: imageRef.current?.height ?? 100,
              }}
            >
              <UserContentPreview
                ref={imageRef}
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
        ref={ref}
        p="xs"
        opacity={draggingElem === element ? 0.4 : 1}
        style={{ userSelect: 'none', position: 'relative', cursor: 'pointer' }}
        draggable
        onDragStart={(e) => {
          e.preventDefault();
          useEditorStore.getState().startDragging(element);
        }}
      >
        <Card.Section>
          {/* <Image
            ref={imageRef}
            src={element.url}
            alt={element.title}
            style={{
              height: '100%',
              display: 'block'
            }}
          /> */}
          <UserContentPreview
            ref={imageRef}
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
          (opened || hovered) && (
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
