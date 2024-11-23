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

interface UploadImagePayload {
  "stiller-name":   string;
  "stiller-type":   number;
  "stiller-file":   File;
  "stiller-hashed": number;
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


const ContentMasonry = () => {
  const userMediaQuery = useQuery({
    queryKey: ['user/media'],
    queryFn: async () => {
      const res = await axios.get('/file');
      const data: UserContentFileElement[] = res.data;
      return data;
    }, 
  });

  // console.log(userMediaQuery.data);
  if (!userMediaQuery.data) return <QueryBoiler query={userMediaQuery} />

  return (
    <Masonry columnsCount={2} gutter="12px">  
      {
        userMediaQuery.data.map((file) => (
          <ContentSidebarElement key={file.id} element={file} />
        ))
      }
    </Masonry>
  )
} 

// Sidebar content extracted for reusability
const SidebarContent = () => {
  const queryClient = useQueryClient();

  const uploadFileMutation = useMutation({
    mutationFn: (data: UploadImagePayload) => api.postForm('/file/new', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user/media'] });
    }
  });

  const handleFileUpload = (payload: File[]) => {
    payload.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadFileMutation.mutate({
          "stiller-name": file.name,
          "stiller-type": 1,
          "stiller-file": file,
          "stiller-hashed": 0,
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
        />
      </Group>
      <ScrollArea
        flex={1}
        bg="gray.1"
        p={8}
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
      >
        <ContentMasonry />
      </ScrollArea>
      <FileButton
        onChange={handleFileUpload}
        accept="image/png,image/jpeg"
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
