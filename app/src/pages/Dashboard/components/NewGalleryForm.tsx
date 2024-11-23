import { Button, FileButton, Group, ScrollArea, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSearch, IconUpload } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type NewGalleryPayload = {
  template: number;
  slug: string;
  title: string;
  description: string;
};

export const NewGalleryForm = () => {
  const [filterInput, setFilterInput] = useState('');
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      title: 'Mi nueva galería',
      slug: '',
      description: '',
      templateId: 0,
    }
  });

  const uploadFileMutation = useMutation({
    mutationFn: (data: NewGalleryPayload) => {
      // const res = fetch('https://pandadiestro.xyz/services/stiller/gallery/new', {
      //   method: 'POST',
      //   headers: {
      //     'token': localStorage.getItem('metagallery-token'),
      //   } as any,
      //   body: JSON.stringify(data),
      // });
      // return res;
      console.log(data)
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log('Gallery created 🎊');
      queryClient.invalidateQueries({ queryKey: [`gallery/${form.values.slug}`] });
    },
    onError: (error) => {
      console.error('Error uploading file', error);
    }
  });

  const handleSubmit = form.onSubmit(async (values) => {
    await uploadFileMutation.mutateAsync({
      title: values.title,
      slug: values.slug,
      description: values.description,
      template: values.templateId,
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="stack gap-lg">
        <div className="stack gap-sm">
          <TextInput
            label="Título"
            placeholder="Título de la obra"
            required
            {...form.getInputProps('title')}
            key={form.key('title')}
          />
          <TextInput
            label="Descripción"
            required
            placeholder="Descripción de la obra"
            {...form.getInputProps('description')}
            key={form.key('description')}
          />
          <TextInput
            label="URL"
            placeholder="mi-galeria"
            required
            styles={{
              section: {
                width: 60,
                color: 'gray',
              },
              input: {
                paddingInlineStart: 187,
              }
            }}
            {...form.getInputProps('slug')}
            leftSection={<Text w={40}>metagallery.pages.dev/</Text>}
            key={form.key('slug')}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!form.isDirty()}
          bg={form.isDirty() ? 'black' : 'gray.7'}
        >
          Actualizar
        </Button>
      </div>
    </form>
  );
}
