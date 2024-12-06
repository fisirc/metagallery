import { ActionIcon, Group, Select } from '@mantine/core';
import { IconSun, IconMoon, IconAccessible } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { z } from 'zod';
import { useEffect } from 'react';

const colorBlindnessOptionsSchema = z.enum([
  'Protanopia', 'Deuteranopia', 'Tritanopia', 'Achromatopsia',
  'Tritanomaly', 'Deuteranomaly', 'Protanomaly', 'Normal',
]);

export const ColorThemeSwitcher = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [colorBlindness, setColorBlindness] = useLocalStorage('color_blindness', {
    schema: colorBlindnessOptionsSchema,
    otherwise: colorBlindnessOptionsSchema.Values.Normal,
  })

  useEffect(() => {
    document.documentElement.className = '';
    document.documentElement.classList.add(`metagallery-${colorBlindness.toLowerCase()}`);
  }, [colorBlindness]);

  const colorOptions = Object.values(colorBlindnessOptionsSchema.enum).map((color) => ({
    value: color,
    label: color,
  }));

  return (
    <Group
      align="center"
      justify="center"
      style={{ marginRight: '0.4rem' }}
    >
      <Select
        placeholder="Select language"
        data={colorOptions}
        value={colorBlindness}
        leftSectionPointerEvents="none"
        leftSection={<IconAccessible size="1.25rem" />}
        onChange={(value) => setColorBlindness(value as any)}
        styles={{
          root: {
            maxWidth: 150,
          },
          input: {
            maxWidth: 150,
          },
          label: { fontWeight: 'bold', marginBottom: 5 },
        }}
      />
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

export default ColorThemeSwitcher;
