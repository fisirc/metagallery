import {
  Group,
  Stack,
  Text,
} from '@mantine/core';

import MenuBurger from './components/MenuBurger';
import MainButtons from './components/MainButtons';
import UserButton from '@/components/UserButton';

import ContentSidebar from './components/ContentSidebar';
import Canvas from './components/Canvas';

const Editor = () => (
  <>
    <Stack p="xl" h="100%" gap="xl" miw={800}>
      <Group justify="space-between">
        <Group>
          <MenuBurger />
          <Text>
            Nueva galería
          </Text>
        </Group>
        <Group gap="lg">
          <MainButtons />
          <UserButton />
        </Group>
      </Group>
      <Group grow preventGrowOverflow={false} flex={1} gap="sm">
        <ContentSidebar />
        <Canvas />
      </Group>
    </Stack>
  </>
);

export default Editor;
