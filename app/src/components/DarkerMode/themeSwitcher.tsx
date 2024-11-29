import { ActionIcon, Group } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';

export const ThemeSwitcher = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Group
      align="center"
      justify="center" 
      style={{ marginRight: '1rem' }}
    >
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="lg"
        variant="filled"
        style={{
            backgroundColor: dark ? 'white' : 'black', 
            color: dark ? 'black' : 'white', 
          }}
        aria-label="Toggle theme"
      >
        {dark ? <IconSun size="1.25rem" /> : <IconMoonStars size="1.25rem" />}
      </ActionIcon>
    </Group>
  );
};

export default ThemeSwitcher;
