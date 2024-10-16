import {
  Group,
  Button,
} from '@mantine/core';

import {
  IconShare,
  IconPlayerPlay,
} from '@tabler/icons-react';

import { primaryIconProps } from '@/constants';

const MainButtons = () => (
  <Group gap="xs">
    <Button
      leftSection={(
        <IconShare {...primaryIconProps} />
      )}
    >
      Compartir
    </Button>
    <Button
      variant="primary"
      leftSection={(
        <IconPlayerPlay {...primaryIconProps} />
      )}
    >
      Visualizar
    </Button>
  </Group>
);

export default MainButtons;
