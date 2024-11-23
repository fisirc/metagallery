import Masonry from 'react-responsive-masonry';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Drawer,
  Group,
  Stack,
  TextInput,
  ScrollArea,
  FileButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSearch, IconUpload } from '@tabler/icons-react';
import { primaryIconProps, secondaryIconProps } from '@/constants';
import { UserContentFileElement } from '@/types';
import { useEditorStore } from '@/stores/editorAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import QueryBoiler from '@/components/QueryBoiler/QueryBoiler';
import axios from 'axios';
import ContentSidebarElement from './ContentSidebarElement';
import Empty from '@/components/Empty';

interface UploadImagePayload {
  "name":   string;
  "type":   number;
  "file":   File;
  "hashed": number;
};

export const EditorSidebar = () => {
  const [opened, setOpened] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 900px)');

  const onDragEnd = () => {
    useEditorStore.getState().dropFile();
  };

  useEffect(() => {
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);

    return () => {
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchend', onDragEnd);
    };
  }, []);

  return (
    <>
      {isLargeScreen ? (
        <Stack mih="100%" gap="sm" mb="16px" miw={300}>
          <SidebarContent />
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
          <SidebarContent />
        </Drawer>
      )}
    </>
  );
};

/**
 * A user content media element in the sidebar
 */


const ContentMasonry = ({ filterInput }: { filterInput: string }) => {
  const userMediaQuery = useQuery({
    queryKey: ['user/media'],
    queryFn: async () => {
      const res = await fetch('https://pandadiestro.xyz/services/stiller/file', {
        method: 'GET',
        headers: {
          'token': localStorage.getItem('metagallery-token'),
        } as any,
      });
      const data: UserContentFileElement[] = await res.json();
      return data;
    }, 
  });

  if (!userMediaQuery.data) return <QueryBoiler query={userMediaQuery} />

  const filteredData = userMediaQuery.data.filter((file) => {
    return file.title?.toLowerCase().includes(filterInput.toLowerCase());
  });

  console.log(filteredData);

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
const SidebarContent = () => {
  const [filterInput, setFilterInput] = useState('');
  const queryClient = useQueryClient();

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
          'token': localStorage.getItem('metagallery-token'),
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
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
      >
        <ContentMasonry filterInput={filterInput} />
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
          >
            Añadir contenido
          </Button>
        )
      }
      </FileButton>
    </>
  );
} 
