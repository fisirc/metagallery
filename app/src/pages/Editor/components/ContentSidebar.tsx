import { useState } from 'react';
import { Button, Group, ScrollArea, Stack, TextInput, Drawer } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSearch, IconUpload } from '@tabler/icons-react';
import { primaryIconProps, secondaryIconProps } from '@/constants';

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
      style={{ borderRadius: 'var(--mantine-radius-md)' }}
    />
    <Button size="sm" leftSection={<IconUpload {...primaryIconProps} />}>
      Añadir contenido
    </Button>
  </>
);
