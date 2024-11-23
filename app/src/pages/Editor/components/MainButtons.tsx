import { useState } from 'react';
import { Group, Button } from '@mantine/core';
import { IconShare, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import { primaryIconProps } from '@/constants';
import { DeployModal } from './modals/DeployModal';

type Props = { onPreviewButton: () => void; closePreviewButton: () => void; isPreviewing: boolean };

export const MainButtons = ({ onPreviewButton, closePreviewButton, isPreviewing }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    setLoading(true);
    setError(null);
    try {
      // const response = await fetch('/api/deploy', { method: 'POST' });
      //if (response.ok) {
        setModalOpen(false);
        // confetti(); 
      //} else {
        //const errorData = await response.json();
        //setError(errorData.message || 'Error al desplegar');
      //}
    } catch (e) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Group gap="xs" wrap="nowrap">
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
            variant="primary"
            onClick={onPreviewButton}
            leftSection={<IconPlayerPlay {...primaryIconProps} />}
          >
            Visualizar
          </Button>
        )}
      </Group>

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
