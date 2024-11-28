import { useMetagalleryStore } from "@/providers/MetagalleryProvider";
import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSearch, IconUpload } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type NewGalleryPayload = {
  template: number;
  slug: string;
  title: string;
  description: string;
};

let __shitty_toggle = false;
let __shitty_dirty_slug = false;

const normalizeName = (name: string) => {
  let normalized = name.toLowerCase().replace(/ /g, '-');
  return normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const NewGalleryForm = ({ modalKey }: { modalKey: string }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    __shitty_toggle = false;
    __shitty_dirty_slug = false;
  }, []);

  const form = useForm({
    onValuesChange(values, previous) {
      if (__shitty_toggle) {
        __shitty_toggle = false;
        return;
      }

      if (values.slug != previous.slug) {
        __shitty_dirty_slug = true;
        __shitty_toggle = false;
      }

      if (values.title != previous.title && !__shitty_dirty_slug) {
        __shitty_toggle = true;
        form.setFieldValue('slug', normalizeName(values.title));
        form.setDirty({ slug: false });
      }
    },
    initialValues: {
      title: 'Mi nueva galería',
      slug: 'mi-nueva-galeria',
      description: '',
      templateId: 0,
    },
    validate: {
      title: (value) => {
        if (value.length < 3) {
          return 'El título debe tener al menos 4 caracteres';
        }
      }
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
    useMetagalleryStore.getState().closeModal(modalKey);
  });

  const creationEnabled = form.values.title.length > 3 && form.values.slug.length > 3 && form.values.description.length > 3;

  return (
    <Stack>
      <Text size="xl" fw={700}>Crear nueva galería</Text>
      <form onSubmit={handleSubmit}>
        <div className="stack gap-lg">
          <div className="stack gap-sm">
            <TextInput
              placeholder="Título de la obra"
              variant="filled"
              description="Título de tu galería"
              required
              {...form.getInputProps('title',)}
              key={form.key('title')}
            />
            <TextInput
              placeholder="Descripción de la obra"
              variant="filled"
              description="Descripción"
              required
              {...form.getInputProps('description')}
              key={form.key('description')}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Text c={'dimmed'}>metagallery.pages.dev/</Text>
              </div>
              <div>
                <input
                  key={form.key('slug')}
                  style={{
                    border: 'none',
                  }}
                  {...form.getInputProps('slug')}
                />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={!creationEnabled}
            bg={
              creationEnabled
                ? 'black'
                : 'gray.7'
            }
          >
            Crear galería
          </Button>
        </div>
      </form>
    </Stack>
  );
}
