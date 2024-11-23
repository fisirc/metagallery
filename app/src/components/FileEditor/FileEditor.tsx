import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const FileEditor = () => {
  const form = useForm();

  return (
    <form>
      <div className="stack gap-sm">
        <TextInput
          label="Título"
          placeholder="Título de la obra"
        />
      </div>
    </form>  
  )
};
