import { Group, Text, TextInput } from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { useHover } from '@mantine/hooks';
import { primaryIconProps } from '@/constants';

type OnFinishEdit = (value: string) => void;

export const DynamicText = ({ value, setValue, onFinishEdit }: {
  value: string;
  setValue: (value: string) => void;
  onFinishEdit?: OnFinishEdit;
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [editing, setEditing] = useState(false);
  const { hovered, ref } = useHover();

  const save = (newValue: string) => {
    setValue(newValue);
    setEditing(false);
  };

  useEffect(() => {
    setInternalValue(value);
  }, [value])

  return (
    <Group ref={ref} wrap="nowrap">
      {
        editing
          ? <TextInput
            variant="filled"
            value={internalValue}
            onChange={(e) => setInternalValue(e.currentTarget.value)}
            size="md"
            onBlur={() => save(internalValue)}
            onKeyDown={(e) => e.key === 'Enter' && save(internalValue)}
            w={180}
          />
          : <Text
            onDoubleClick={() => setEditing(true)}
            w={180}
            onClick={() => setEditing(true)}
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
