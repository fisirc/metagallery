import { useApi } from "@/hooks/useApi";
import { TemplateListItem } from "@/types";
import { Box, Group, Image, Radio, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import styles from './TemplateList.module.css';

type TemplatesListProps = {
  onTemplateSelect: (templateId: number) => void;
};

export const TemplatesList = ({ onTemplateSelect }: TemplatesListProps) => {
  const { response, error, isLoading, isValidating, mutate } = useApi<TemplateListItem[]>('/template');
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (response?.data && response.data.length > 0 && !value) {
      onTemplateSelect(response.data[0].id);
    }
  }, [response]);


  if (error) return <Text>Estamos experimentando problemas. Inténtalo de nuevo más tarde. 😔</Text>;

  if (isLoading || !response) {
    return <Text w={600}>Cargando plantillas...</Text>;
  }

  const defaultVal = response.data[0].id.toString();

  return (
    <Radio.Group
      value={value ?? defaultVal}
      defaultValue={defaultVal}
      onChange={(val) => {
        setValue(val);
        console.log({ val })
        onTemplateSelect(Number(val));
      }}
      style={{ overflow: 'auto', paddingRight: 12 }}
    >
      {response.data.map((template, i) => (
        <Radio.Card
          className={styles.root}
          key={template.id}
          value={template.id.toString()}
          style={{
            padding: '8px'
          }}
        >
          <Group wrap="nowrap" align="flex-start">
            <Radio.Indicator />
            <Group align="flex-start">
              <Image
                alt={template.title}
                fit="contain"
                width={200}
                height={150}
                src={`https://pandadiestro.xyz/services/stiller/template/info/${template.id}/thumbnail`}
              />
              <Box flex={1}>
                <Text className={styles.label}>{template.title}</Text>
                <Text className={styles.description}>{template.description}</Text>
              </Box>
            </Group>
          </Group>
        </Radio.Card>
      ))}
    </Radio.Group>
  );
}
