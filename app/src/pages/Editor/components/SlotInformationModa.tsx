import { useEditorStore } from "@/stores/editorAction";
import { useUser } from "@/stores/useUser";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutate } from "swr";

type SlotInformationModalProps = {
  title: string;
  description: string;
  slotRef: string;
}

export const SlotInformationModal = ({ title, description, slotRef }: SlotInformationModalProps) => {
  const gallery = useEditorStore((s) => s.gallery);
  const queryClient = useQueryClient();

  const uploadFileMutation = useMutation({
    mutationFn: async () => {
      const vals = form.getValues();

      const res = await fetch('https://pandadiestro.xyz/services/stiller/gallery/slot', {
        method: 'PATCH',
        headers: {
          'token': useUser.getState().token,
        } as any,
        body: JSON.stringify({
          gallery: gallery,
          ref: slotRef,
          title: vals.title,
          description: vals.description,
        }),
      });
      return res;
    },
    onSuccess: () => {
      console.log('File uploaded');
      queryClient.invalidateQueries({ queryKey: ['user/media'] });
      mutate(`/gallery/${gallery}`);
    },
    onError: (error) => {
      console.error('Error uploading file', error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Failed to update slot',
      });
    }
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: title,
      description: description,
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        uploadFileMutation.mutate();
      }}
    >
      <TextInput
        label="Título de la obra"
        placeholder="Título"
        required
        {...form.getInputProps('title')}
      />
      <TextInput
        mt={12}
        label="Descripción"
        placeholder="Descripción"
        required
        {...form.getInputProps('description')}
      />
      <Button mt={16} size="sm" type="submit">Guardar</Button>
    </form>
  )
}
