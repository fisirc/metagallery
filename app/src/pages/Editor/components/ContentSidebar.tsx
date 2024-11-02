import Masonry from 'react-responsive-masonry';
import { useEffect, useRef, useState } from 'react';
import { Button, Group, ScrollArea, Stack, TextInput, Drawer, Card, Image, Text, Menu, rem, Portal } from '@mantine/core';
import { useHover, useMediaQuery, useMouse } from '@mantine/hooks';
import { IconDots, IconDownload, IconEdit, IconSearch, IconTrash, IconUpload } from '@tabler/icons-react';
import { primaryIconProps, secondaryIconProps, smallIconProps } from '@/constants';
import { UserContentFileElement } from '@/types';
import { useEditorStore } from '@/stores/editorAction';
import { DRAG_PORTAL_ID } from './constants';

const mockedResponse = [
  {
    id: 1,
    type: 'image',
    title: 'Aiko Tanaka',
    description: 'Lorem punpuns',
    url: 'https://www.grupoeducar.cl/wp-content/uploads/2023/06/Arte-Revista-Educar-Julio-2023-edicion-274.png',
  },
  {
    id: 2,
    type: 'model3d',
    title: 'Grace en 3d',
    description: 'Modelo 3d no implementado',
    url: 'https://diario.global/wp-content/uploads/2022/02/C2015014-TOTS-SOM-EUROPA-UNIDA.jpg',
  },
  {
    id: 3,
    type: 'image',
    title: 'Xiao Pang',
    description: 'Le gusta mirar fijamente a cosas cotidianas',
    url: 'https://unidadlatina.org/wp-content/uploads/2024/04/arte-contemporaneo-latinoamerica.jpg',
  },
] satisfies Array<UserContentFileElement>;

export const EditorSidebar = () => {
  const [opened, setOpened] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 900px)');

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

  return (
    <>
      {isLargeScreen ? (
        <Stack mih="100%" gap="sm" mb="16px" miw={300}>
          <SidebarContent />
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
          <SidebarContent />
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

  return (
    <>
      {
        draggingElem === element && (
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
const SidebarContent = () => (
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
          mockedResponse.map((element) => (
            <UserContentSidebarElement key={element.id} element={element} />
          ))
        }
      </Masonry>
    </ScrollArea>
    <Button size="sm" leftSection={<IconUpload {...primaryIconProps} />}>
      Añadir contenido
    </Button>
  </>
);
