import Empty from '@/components/Empty';
import Masonry from 'react-responsive-masonry';
import QueryBoiler from '@/components/QueryBoiler/QueryBoiler';
import ContentSidebarElement from './ContentSidebarElement';
import { useUser } from '@/stores/useUser';
import { useMediaQuery } from '@mantine/hooks';
import { useEditorStore } from '@/stores/editorAction';
import { memo, useEffect, useState } from 'react';
import { IconSearch, IconUpload } from '@tabler/icons-react';
import { UserContentFileElement } from '@/types';
import { primaryIconProps, secondaryIconProps } from '@/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Group, Stack, TextInput, ScrollArea, FileButton, useMantineColorScheme } from '@mantine/core';

interface UploadImagePayload {
  "name": string;
  "type": number;
  "file": File;
  "hashed": number;
};

export const EditorSidebar = memo(() => {
  const [opened, setOpened] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    document.addEventListener('mouseup', useEditorStore.getState().dropFile);
    document.addEventListener('touchend', useEditorStore.getState().dropFile);

    return () => {
      document.removeEventListener('mouseup', useEditorStore.getState().dropFile);
      document.removeEventListener('touchend', useEditorStore.getState().dropFile);
    };
  }, []);

  return (
    <>
      {isLargeScreen ? (
        <Stack mih="100%" gap="sm" mb="16px" miw={300}>
          <SidebarInnerContent />
        </Stack>
      ) : (
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          padding="md"
          size={300}
          withCloseButton={false}
          opacity={0.2}
          zIndex={2000}
        >
          <SidebarInnerContent />
        </Drawer>
      )}
    </>
  );
});

/**
 * A user content media element in the sidebar
 */


const SidebarMasonry = ({ filterInput }: { filterInput: string }) => {
  const userMediaQuery = useQuery({
    queryKey: ['user/media'],
    queryFn: async () => {
      const res = await fetch('https://pandadiestro.xyz/services/stiller/file', {
        method: 'GET',
        headers: {
          'token': useUser.getState().token,
        } as any,
      });
      const data: UserContentFileElement[] = await res.json();

      for (let e of data) {
        e.url = `https://pandadiestro.xyz/services/stiller/file/dl/${e.id}/`;
      }

      return data;
    },
  });

  if (!userMediaQuery.data) return <QueryBoiler query={userMediaQuery} />

  const filteredData = userMediaQuery.data.filter((file) => {
    return file.title?.toLowerCase().includes(filterInput.toLowerCase());
  });

  if (!filteredData.length) return <Empty />

  return (
    <Masonry columnsCount={2} gutter="12px">
      {
        filteredData.map((file) => (
          <ContentSidebarElement key={file.id} element={file} />
        ))
      }
    </Masonry>
  )
}

// Sidebar content extracted for reusability
const SidebarInnerContent = () => {
  const [filterInput, setFilterInput] = useState('');
  const queryClient = useQueryClient();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const uploadFileMutation = useMutation({
    mutationFn: (data: UploadImagePayload) => {
      const formData = new FormData();
      formData.append('stiller-name', data.name);
      formData.append('stiller-type', data.type.toString());
      formData.append('stiller-file', data.file);
      formData.append('stiller-hashed', data.hashed.toString());
      const res = fetch('https://pandadiestro.xyz/services/stiller/file/new', {
        method: 'POST',
        headers: {
          'token': useUser.getState().token,
        } as any,
        body: formData,
      });
      return res;
    },
    onSuccess: () => {
      console.log('File uploaded');
      queryClient.invalidateQueries({ queryKey: ['user/media'] });
    },
    onError: (error) => {
      console.error('Error uploading file', error);
    }
  });

  const handleFileUpload = (payload: File[]) => {
    payload.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Uploading file', file.name);
        uploadFileMutation.mutate({
          "name": file.name,
          "type": 1,
          "file": file,
          "hashed": 0,
        })
      };
      reader.readAsDataURL(file);
    })
  };

  return (
    <>
      <Group>
        <TextInput
          variant="transparent"
          placeholder="¿Qué estás buscando?"
          size="xs"
          leftSection={<IconSearch {...secondaryIconProps} />}
          value={filterInput}
          onChange={(e) => setFilterInput(e.currentTarget.value)}
        />
      </Group>
      <ScrollArea
        flex={1}
        bg="gray.1"
        p={8}
        style={{
          borderRadius: 'var(--mantine-radius-md)',
          backgroundColor: dark ? '#333333' : '#e5e5e5',
          color: dark ? '#e5e5e5' : '#333333',
          border: '1px solid var(--mantine-color-gray-4)',
        }}
      >
        <SidebarMasonry filterInput={filterInput} />
      </ScrollArea>
      <FileButton
        onChange={handleFileUpload}
        multiple
      >
        {
          (props) => (
            <Button
              size="sm"
              leftSection={<IconUpload {...primaryIconProps} />}
              {...props}
              variant="outline"
              style={{
                color: 'var(--mantine-color-white-7)',
                borderColor: 'var(--mantine-color-black-7)',
              }}
            >
              Añadir contenido
            </Button>
          )
        }
      </FileButton>
    </>
  );
}
