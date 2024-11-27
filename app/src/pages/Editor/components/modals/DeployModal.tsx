import { Modal, Button, Text, Loader, Notification, Group } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useMetagalleryStore } from '@/providers/MetagalleryProvider';

type DeployModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const DeployModal = ({ isOpen, onClose, onDeploy, loading, error }: DeployModalProps) => {
  const handleDeploy = async () => {
    await onDeploy();
    useMetagalleryStore.getState().confetti(2000);
  };

  return (
    <>
      <Modal opened={isOpen} onClose={onClose} title="Confirmar Despliegue" centered>
        <Text>¿Estás seguro de que quieres desplegar el proyecto?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleDeploy} disabled={loading}>
            {loading ? <Loader size="sm" /> : 'Desplegar'}
          </Button>
        </Group>
        {error && (
          <Notification color="red" mt="md" icon={<IconX size={18} />}>
            Error: {error}
          </Notification>
        )}
      </Modal>
    </>
  );
};
