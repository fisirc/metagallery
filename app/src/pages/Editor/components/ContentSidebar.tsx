import Masonry from 'react-responsive-masonry';
import { useEffect, useRef, useState } from 'react';
import {
  rem,
  Button,
  Portal,
  Drawer,
  Group,
  Card,
  Text,
  Menu,
  Image,
  Stack,
  TextInput,
  ScrollArea,
  FileButton,
} from '@mantine/core';
import { useHover, useMediaQuery, useMouse } from '@mantine/hooks';
import { IconDots, IconDownload, IconEdit, IconSearch, IconTrash, IconUpload } from '@tabler/icons-react';
import { primaryIconProps, secondaryIconProps, smallIconProps } from '@/constants';
import { UserContentFileElement } from '@/types';
import { useEditorStore } from '@/stores/editorAction';
import { DRAG_PORTAL_ID } from '@/constants';
import { useApi } from '@/hooks/useApi';

export const EditorSidebar = () => {
  const [opened, setOpened] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 900px)');
  const { data: medias } = useApi<UserContentFileElement[]>('gallery/media');

  const onDragEnd = () => {
    useEditorStore.getState().dropFile();
  };

  useEffect(() => {
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);

    return () => {
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchend', onDragEnd);
    };
  }, []);

  if (!medias) {
    return <SidebarContent mediaContents={[]} />;
  }

  return (
    <>
      {isLargeScreen ? (
        <Stack mih="100%" gap="sm" mb="16px" miw={300}>
          <SidebarContent mediaContents={medias} />
        </Stack>
      ) : (
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          padding="md"
          size={300}
          withCloseButton={false}
          opacity={0.2}
          zIndex={2000}
        >
          <SidebarContent mediaContents={medias} />
        </Drawer>
      )}
    </>
  );
};

/**
 * A user content media element in the sidebar
 */
const UserContentSidebarElement = ({ element }: { element: UserContentFileElement }) => {
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

// Sidebar content extracted for reusability
const SidebarContent = ({ mediaContents }: { mediaContents: UserContentFileElement[] }) => {
  const handleFileUpload = (payload: File[]) => {
    payload.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        console.log(base64);
      };
      reader.readAsDataURL(file);
    })
  };

  return (
    <>
      <Group>
        <TextInput
          variant="transparent"
          placeholder="¿Qué estás buscando?"
          size="xs"
          leftSection={<IconSearch {...secondaryIconProps} />}
        />
      </Group>
      <ScrollArea
        flex={1}
        bg="gray.1"
        p={8}
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
      >
        <Masonry columnsCount={2} gutter="12px">
          {
            mediaContents.map((element) => (
              <UserContentSidebarElement key={element.id} element={element} />
            ))
          }
        </Masonry>
      </ScrollArea>
      <FileButton
        onChange={handleFileUpload}
        accept="image/png,image/jpeg"
        multiple
      >
      {
        (props) => (
          <Button
            size="sm"
            leftSection={<IconUpload {...primaryIconProps} />}
            {...props}
          >
            Añadir contenido
          </Button>
        )
      }
      </FileButton>
      {/* <Button
        size="sm"
        leftSection={<IconUpload {...primaryIconProps} />}
      >
        Añadir contenido
      </Button> */}
    </>
  );
} 
