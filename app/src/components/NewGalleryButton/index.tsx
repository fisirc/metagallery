import { primaryIconProps } from "@/constants";
import { NewGalleryForm } from "@/pages/Dashboard/components/NewGalleryForm";
import { useMetagalleryStore } from "@/providers/MetagalleryProvider";
import { Button, Group } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import ThemeSwitcher from "../DarkerMode/themeSwitcher";

export const NewGalleryButton = () => {
  return (
    <Group align="center">
      <ThemeSwitcher />
      <Button
        variant="filled"
        color="dark"
        onClick={() => {
          useMetagalleryStore.getState().openModal({
            id: 'new-gallery-modal',
            centered: true,
            withCloseButton: false,
            size: 'auto',
            overlayProps: {
              backgroundOpacity: 0.55,
              blur: 3,
            },
            style: {
              overflow: 'hidden',
            },
            pos: 'relative',
            child: <NewGalleryForm modalKey={'new-gallery-modal'} />,
          });
        }}
        leftSection={<IconSparkles {...primaryIconProps} />}
      >
        Nueva galería
      </Button>
    </Group>
  );
};
