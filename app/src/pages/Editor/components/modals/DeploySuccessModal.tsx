import { useState } from 'react';
import { Modal, Button, Text, Group, TextInput, ActionIcon, Stack } from '@mantine/core';
import { IconCheck, IconCopy, IconExternalLink } from '@tabler/icons-react';

type DeploySuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deployUrl: string;
};

export const DeploySuccessModal = ({ isOpen, onClose, deployUrl }: DeploySuccessModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deployUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Compartir Galería"
      centered
      size="lg"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Comparte el enlace de tu galería con otros
        </Text>

        <Group gap="xs" wrap="nowrap">
          <TextInput
            label="Enlace de la Galería"
            value={deployUrl}
            readOnly
            style={{ flex: 1 }}
            styles={{
              input: {
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }
            }}
          />
          <ActionIcon
            color={copied ? 'teal' : 'gray'}
            variant="light"
            onClick={handleCopyLink}
            size="lg"
            style={{ marginTop: '25px' }}
          >
            {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
          </ActionIcon>
          <ActionIcon
            component="a"
            href={deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            color="blue"
            size="lg"
            style={{ marginTop: '25px' }}
          >
            <IconExternalLink size={18} />
          </ActionIcon>
        </Group>

        <Group mt="md" justify="flex-end">
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
