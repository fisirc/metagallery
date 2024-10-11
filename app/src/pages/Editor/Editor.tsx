import {
  Burger,
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core';

import UserButton from '@/components/UserButton';

const Editor = () => (
  <>
    <Stack
      p="xl"
    >
      <Group justify="space-between">
        <Group>
          <Burger
            size="xs"
          />
          <Text>
            Nueva galería
          </Text>
        </Group>
        <Group gap="lg">
          <Group gap="xs">
            <Button>
              Compartir
            </Button>
            <Button variant="primary">
              Visualizar
            </Button>
          </Group>
          <UserButton />
        </Group>
      </Group>
    </Stack>
  </>
);

export default Editor;
