import { UserContentFileElement } from "@/types";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const FileEditor = ({ element }: {
  element: UserContentFileElement
}) => {
  const queryClient = useQueryClient();

  const updateFileMutation = useMutation({
    mutationFn: (values) => fetch(`https://pandadiestro.xyz/services/stiller/file`, {
      method: 'PATCH',
      body: JSON.stringify(values)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user/media'] })
    }
  });

  const form = useForm({
    initialValues: {
      title: element.title,
      description: element.description
    }
  });

  const handleSubmit = form.onSubmit(async (values) => {
    await updateFileMutation.mutateAsync({ ...values, id: element.id } as any);
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
            placeholder="Descripción de la obra"
            {...form.getInputProps('description')}
            key={form.key('description')}
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
  )
};

export default FileEditor;
