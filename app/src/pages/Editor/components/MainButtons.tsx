import { useState } from 'react';
import { Group, Button, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconShare, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import { primaryIconProps } from '@/constants';
import { DeployModal } from './modals/DeployModal';
import ThemeSwitcher from '@/components/DarkerMode/themeSwitcher';

type Props = { onPreviewButton: () => void; closePreviewButton: () => void; isPreviewing: boolean };

export const MainButtons = ({ onPreviewButton, closePreviewButton, isPreviewing }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

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
        <ThemeSwitcher />
        <Button
          leftSection={<IconShare {...primaryIconProps} />}
          onClick={() => setModalOpen(true)}
          color="black"
          variant="outline"
          style={{ color: 'var(--mantine-color-black-7)', borderColor: 'var(--mantine-color-black-7)' }}
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
              backgroundColor: dark ? 'white' : 'black',
              color: dark ? 'black' : 'white',            
              border: 'none',                             
            }}
            variant="filled" 
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
