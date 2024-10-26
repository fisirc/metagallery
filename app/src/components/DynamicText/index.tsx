import { Group, Text, TextInput } from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';
import { useState } from 'react';

import { useHover } from '@mantine/hooks';
import { primaryIconProps } from '@/constants';

export const DynamicText = ({ value, setValue }: {
  value: string;
  setValue: (value: string) => void;
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [editing, setEditing] = useState(false);
  const { hovered, ref } = useHover();

  const save = (newValue: string) => {
    setValue(newValue);
    setEditing(false);
  };

  return (
    <Group ref={ref}>
      {
        editing
          ? <TextInput
              variant="text"
              value={internalValue}
              onChange={(e) => setInternalValue(e.currentTarget.value)}
              size="md"
              onBlur={() => save(internalValue)}
              onKeyDown={(e) => e.key === 'Enter' && save(internalValue)}
              w={200}
          />
          : <Text
              onDoubleClick={() => setEditing(true)}
              w={200}
              truncate
          >
            {value}
            </Text>
      }
      {
        editing
          ? <IconCheck
              {...primaryIconProps}
              opacity={0.5}
              onClick={() => save(internalValue)}
              cursor="pointer"
              title="Guardar"
          />
          : <IconPencil
              {...primaryIconProps}
              opacity={hovered ? 0.5 : 0}
              onClick={() => setEditing(true)}
              cursor="pointer"
              title="Editar"
          />
      }
    </Group>
  );
};
