import { DRAG_PORTAL_ID, smallIconProps } from "@/constants";
import { useEditorStore } from "@/stores/editorAction";
import { UserContentFileElement } from "@/types";
import { Button, Card, Image, Menu, Portal, rem, Text } from "@mantine/core";
import { useHover, useMouse } from "@mantine/hooks";
import { IconDots, IconDownload, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";

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
                opacity: 0.8,
                width: imageRef.current?.width,
                height: imageRef.current?.height,
              }}
            >
              <Image m={0} src={element.url} alt={element.title} radius={5} />
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
          <Image ref={imageRef} m={0} src={element.url} alt={element.title} style={{ height: '100%', display: 'block' }} />
        </Card.Section>
        <Text size="xs" fw={700} mt={8}>{element.title}</Text>
        <Text size="xs" mt={4}>{element.description}</Text>
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
                  <Menu.Item leftSection={<IconEdit style={{ width: rem(14) }} />}>
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
