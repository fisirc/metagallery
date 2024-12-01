import { useMetagalleryStore } from "@/providers/MetagalleryProvider";
import { Button, Text, Textarea, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconInfoCircle, IconSparkles } from "@tabler/icons-react";
import { TemplatesList } from "./TemplatesList";
import { useMediaQuery } from "@mantine/hooks";
import { useUser } from "@/stores/useUser";
import { useLocation } from "wouter";
import { AutosizeInput } from "./AutosizeInput";

type NewGalleryPayload = {
  template: number;
  slug: string;
  title: string;
  description: string;
};

const normalizeName = (name: string) => {
  let normalized = name.toLowerCase().replace(/ +/g, '-');
  return normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const NewGalleryForm = ({ modalKey }: { modalKey: string }) => {
  const smallScreen = useMediaQuery('(max-width: 1020px)');
  const [, setLocation] = useLocation();

  const form = useForm({
    onValuesChange(values, previous) {
      if (values.title !== previous.title) {
        form.setFieldValue('slug', normalizeName(values.title));
        form.setDirty({ slug: false });
      }
      if (values.slug !== previous.slug) {
        form.setFieldValue('slug', normalizeName(values.slug));
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


  const handleSubmit = form.onSubmit(async (values) => {
    const body = {
      template: values.templateId,
      slug: values.slug,
      title: values.title,
      description: values.description,
    } satisfies NewGalleryPayload;

    try {
      const res = await fetch('https://pandadiestro.xyz/services/stiller/gallery/new', {
        method: 'POST',
        headers: {
          'token': useUser.getState().token,
        } as any,
        body: JSON.stringify(body),
      });
      if (res.status === 409) {
        form.setFieldError('slug', 'URL ya existe');
        return;
      }
      setLocation(`/${values.slug}/edit`);
      useMetagalleryStore.getState().closeModal(modalKey);
      useMetagalleryStore.getState().confetti(2000);
    } catch {
      form.setFieldError('slug', 'Error al crear galería');
    }
  });

  return (
    <form onSubmit={handleSubmit} style={{ padding: '4px 14px' }}>
      <Text size="xl" fw={700} mb={12} styles={{ root: { fontSize: '1.7rem' } }}>Crear nueva galería</Text>
      <div
        style={{
          display: 'flex',
          flexDirection: smallScreen ? 'column' : 'row',
        }}
      >
        <div className="stack gap-lg" style={{ alignSelf: 'stretch', flexGrow: 1, marginRight: smallScreen ? 0 : '1rem' }}>
          <TextInput
            placeholder="Título de la obra"
            variant="filled"
            description="Título de tu galería"
            required
            autoFocus
            {...form.getInputProps('title',)}
            key={form.key('title')}
          />
          <Textarea
            placeholder="Descripción de la obra"
            variant="filled"
            description="Descripción"
            required
            autosize
            minRows={4}
            maxRows={4}
            {...form.getInputProps('description')}
            key={form.key('description')}
          />
        </div>
        <div>
          <Text size="xl" fw={700} mb={12} mt={12}>Plantillas disponibles</Text>
          <div style={{ alignSelf: 'stretch' }}>
            <TemplatesList onTemplateSelect={(t) => {
              form.setFieldValue('templateId', t);
            }} />
          </div>
        </div>
      </div>
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          marginTop: 12,
          backgroundColor: 'var(--mantine-color-body)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {
            form.getInputProps('slug').error && (
              <span style={{ color: 'var(--mantine-color-error)', marginRight: 8, fontSize: '0.9rem' }}>
                {form.getInputProps('slug').error}
              </span>
            )
          }
          <Tooltip
            label="Así lucirá la URL de tu galería"
            position="top"
            withArrow
          >
            <IconInfoCircle size={18} />
          </Tooltip>
          <div style={{ marginLeft: 6 }}>
            <Text c={'dimmed'}>metagallery.pages.dev/</Text>
          </div>
          <div style={{
            marginRight: 16,
            textWrap: 'nowrap',
          }}>
            <AutosizeInput
              value={form.getInputProps('slug').value ?? form.getInputProps('slug').defaultValue}
              style={{
                border: 'none',
                outline: 'none',
                borderBottom: '1px solid var(--mantine-color-bright)',
              }}
              onChange={(e) => {
                form.getInputProps('slug').onChange(e);
              }}
              onBlur={form.getInputProps('slug').onBlur}
              onFocus={form.getInputProps('slug').onFocus}
            />
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          leftSection={<IconSparkles size={14} />}
          w={200}
          bg={'black'}
        >
          Crear galería
        </Button>
      </footer>
    </form>
  );
}
