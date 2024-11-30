import { ActionIcon, Group } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';

export const ThemeSwitcher = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group
      align="center"
      justify="center"
      style={{ marginRight: '1rem' }}
    >
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="lg"
        variant="default"
        style={{
          backgroundColor: 'var(--mantine-color-body)',
          color: 'var(--mantine-primary-color)',
        }}
        aria-label="Toggle theme"
      >
        {colorScheme == 'dark' ? <IconSun size="1.25rem" /> : <IconMoon size="1.25rem" />}
      </ActionIcon>
    </Group>
  );
};

export default ThemeSwitcher;
