import ColorThemeSwitcher from '@/components/DarkerMode/themeSwitcher';
import { useState } from 'react';
import { Group, Button } from '@mantine/core';
import { primaryIconProps } from '@/constants';
import { DeploySuccessModal } from './modals/DeploySuccessModal';
import { IconShare, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';

type Props = {
  onPreviewButton: () => void;
  onClosePreviewButton: () => void;
  isPreviewing: boolean;
  gallery: string;
};

export const MainButtons = ({ onPreviewButton, onClosePreviewButton: closePreviewButton, isPreviewing, gallery }: Props) => {
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const deployUrl = `https://metagallery.pages.dev/${gallery}`;

  const handleDeploy = () => {
    setSuccessModalOpen(true);
  };

  return (
    <>
      <Group gap="xs" wrap="nowrap">
        <ColorThemeSwitcher />
        <Button
          leftSection={<IconShare {...primaryIconProps} />}
          onClick={handleDeploy}
        >
          Compartir
        </Button>
        {isPreviewing ? (
          <Button
            variant="light"
            color="red"
            onClick={closePreviewButton}
            leftSection={<IconPlayerStop {...primaryIconProps} />}
          >
            Cerrar Previsualización
          </Button>
        ) : (
          <Button
            style={{
            }}
            variant="filled"
            onClick={onPreviewButton}
            leftSection={<IconPlayerPlay {...primaryIconProps} />}
          >
            Visualizar
          </Button>
        )}
      </Group >

      <DeploySuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        deployUrl={deployUrl}
      />
    </>
  );
};
