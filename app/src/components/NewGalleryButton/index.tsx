import { primaryIconProps } from "@/constants";
import { NewGalleryForm } from "@/pages/Dashboard/components/NewGalleryForm";
import { useMetagalleryStore } from "@/providers/MetagalleryProvider";
import { Button } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";

export const NewGalleryButton = () => {
  return (
    <Button
      variant="primary"
      onClick={() => {
        useMetagalleryStore.getState().openModal({
          id: 'new-gallery-modal',
          centered: true,
          withCloseButton: false,
          overlayProps: {
            backgroundOpacity: 0.55,
            blur: 3,
          },
          child: (
            <NewGalleryForm modalKey={'new-gallery-modal'} />
          ),
        });
      }}
      leftSection={(
        <IconSparkles {...primaryIconProps} />
      )}
    >
      Nueva galería
    </Button>
  );
};
