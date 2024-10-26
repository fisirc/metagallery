import { useState } from 'react';
import { Group, Stack } from '@mantine/core';
import { MenuBurger } from './components/MenuBurger';
import { MainButtons } from './components/MainButtons';
import { UserButton } from '@/components/UserButton';

import { ContentSidebar } from './components/ContentSidebar';
import { Canvas } from './components/Canvas';
import { DynamicText } from '@/components/DynamicText';

export const Editor = () => {
  const [projectName, setProjectName] = useState('Nueva galería');

  return (
    <>
      <Stack p="xl" h="100%" gap="xl" miw={800}>
        <Group justify="space-between">
          <Group gap="md">
            <MenuBurger />
            <DynamicText value={projectName} setValue={setProjectName} />
          </Group>
          <Group gap="lg">
            <MainButtons />
            <UserButton />
          </Group>
        </Group>
        <Group gap="sm" h="100%">
          <ContentSidebar />
          <Canvas />
        </Group>
      </Stack>
    </>
  );
};
