import {
  Group,
  Button,
} from '@mantine/core';

import {
  IconShare,
  IconPlayerPlay,
  IconPlayerStop,
} from '@tabler/icons-react';

import { primaryIconProps } from '@/constants';

type Props = { onPreviewButton: () => void, closePreviewButton: () => void, isPreviewing: boolean };

export const MainButtons = ({ onPreviewButton, closePreviewButton, isPreviewing }: Props) => (
  <Group gap="xs" wrap="nowrap">
    <Button
      leftSection={(
        <IconShare {...primaryIconProps} />
      )}
    >
      Compartir
    </Button>
    {
      isPreviewing ? (
        <Button
          variant="light"
          color="red"
          onClick={closePreviewButton}
          leftSection={(
            <IconPlayerStop {...primaryIconProps} />
          )}
        >
          Cerrar Previsualización
        </Button>
      ) :
        (
          <Button
            variant="primary"
            onClick={onPreviewButton}
            leftSection={(
              <IconPlayerPlay {...primaryIconProps} />
            )}
          >
            Visualizar
          </Button>
        )
    }
  </Group>
);
