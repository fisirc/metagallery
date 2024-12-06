import ColorThemeSwitcher from '@/components/DarkerMode/themeSwitcher';
import { useState } from 'react';
import { Group, Button } from '@mantine/core';
import { primaryIconProps } from '@/constants';
import { DeployModal } from './modals/DeployModal';
import { IconShare, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';

type Props = { onPreviewButton: () => void; onClosePreviewButton: () => void; isPreviewing: boolean };

export const MainButtons = ({ onPreviewButton, onClosePreviewButton: closePreviewButton, isPreviewing }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    setLoading(true);
    setError(null);
    try {
      setModalOpen(false);
    } catch (e) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Group gap="xs" wrap="nowrap">
        <ColorThemeSwitcher />
        <Button
          leftSection={<IconShare {...primaryIconProps} />}
          onClick={() => setModalOpen(true)}
        >
          Deploy
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

      <DeployModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onDeploy={handleDeploy}
        loading={loading}
        error={error}
      />
    </>
  );
};
