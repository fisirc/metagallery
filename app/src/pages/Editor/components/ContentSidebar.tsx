import { useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { Button, Group, ScrollArea, Stack, TextInput, Drawer, Card, Image, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSearch, IconUpload } from '@tabler/icons-react';
import { primaryIconProps, secondaryIconProps } from '@/constants';
import { UserContentFileElement } from '@/types';

const mockedResponse = [
  {
    id: 1,
    type: 'image',
    title: 'Grace en internet',
    description: 'Está en internet',
    url: 'https://static.wikia.nocookie.net/punpun/images/3/3c/Aiko_c1p5.PNG',
  },
  {
    id: 2,
    type: 'model3d',
    title: 'Grace en 3d',
    description: 'Está en 3d',
    url: 'https://i.ytimg.com/vi/ljV7yI6UbOA/maxresdefault.jpg',
  },
  {
    id: 3,
    type: 'image',
    title: 'Xiao Pang',
    description: 'Le gusta mirar fijamente a cosas cotidianas',
    url: 'https://www.bnews.com.br/media/uploads/junho_2024/imagem_materia_-_2024-06-12t151221.715.jpg',
  },
] satisfies Array<UserContentFileElement>;

export const EditorSidebar = () => {
  const [opened, setOpened] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 900px)');

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

const UserContentSidebarElement = ({ element }: { element: UserContentFileElement }) => {
  return (
    <Card p="xs">
      <Card.Section>
        <Image m={0} src={element.url} alt={element.title} style={{ width: '100%', display: 'block' }} />
      </Card.Section>
      <Text size="xs" fw={700} mt={4}>{element.title}</Text>
      <Text size="xs">{element.description}</Text>
    </Card>
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
