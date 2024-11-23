import { primaryIconProps } from "@/constants";
import { NewGalleryForm } from "@/pages/Dashboard/components/NewGalleryForm";
import { useMetagalleryStore } from "@/providers/MetagalleryProvider";
import { Button, Text } from "@mantine/core";
import { IconPrismPlus } from "@tabler/icons-react";

export const NewGalleryButton = () => {
  return (
    <Button
      variant="primary"
      onClick={() => {
        useMetagalleryStore.getState().openModal(
          <NewGalleryForm />
        );
      }}
      leftSection={(
        <IconPrismPlus {...primaryIconProps} />
      )}
    >
      Nueva galería
    </Button>
  );
};
