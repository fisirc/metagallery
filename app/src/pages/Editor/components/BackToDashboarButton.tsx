import { CloseButton, Tooltip } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { primaryIconProps } from '@/constants';
import { useLocation } from 'wouter';

export const BackToDashboarButton = () => {
  const [, setLocation] = useLocation();

  return (
    <Tooltip label="Volver al dashboard">
      <CloseButton
        aria-label="Volver al dashboard"
        onClick={() => setLocation('/dashboard')}
        icon={<IconChevronLeft {...primaryIconProps} />}
      />
    </Tooltip>
  );
};
