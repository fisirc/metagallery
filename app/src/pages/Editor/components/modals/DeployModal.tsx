import React, { useState } from 'react';
import { Modal, Button, Text, Loader, Notification, Group } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

type DeployModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const DeployModal = ({ isOpen, onClose, onDeploy, loading, error }: DeployModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleDeploy = async () => {
    setShowConfetti(false); // Reset confetti
    await onDeploy();
    setShowConfetti(true); // Show confetti on success
    setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 3 seconds
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} />}
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
