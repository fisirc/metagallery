import { Button, Group, ScrollArea, Stack, TextInput } from '@mantine/core';

import {
  IconSearch,
  IconUpload,
} from '@tabler/icons-react';

import {
  primaryIconProps,
  secondaryIconProps,
} from '@/constants';

const ContentSidebar = () => (
  <Stack h="100%" gap="sm" flex={1} miw={300}>
    <Group>
      <TextInput
        variant="transparent"
        placeholder="¿Qué estás buscando?"
        size="xs"
        leftSection={(
          <IconSearch {...secondaryIconProps} />
        )}
      />
    </Group>
    <ScrollArea
      flex={1}
      bg="gray.1"
      style={{
        borderRadius: 'var(--mantine-radius-md)',
      }}
    >
    </ScrollArea>
    <Button
      size="sm"
      leftSection={(
        <IconUpload {...primaryIconProps} />
      )}
    >
      Añadir contenido
    </Button>
  </Stack>
);

export default ContentSidebar;
