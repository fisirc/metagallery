import { useEffect, useState } from 'react';
import { ActionIcon } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { UserButton } from '@/components/UserButton';
import { DynamicText } from '@/components/DynamicText';
import { GalleryCanvas2D } from './components/GalleryCanvas2D';
import { BackToDashboarButton } from './components/BackToDashboarButton';
import { MainButtons } from './components/MainButtons';
import { EditorSidebar } from './components/ContentSidebar';
import { EditorMobileMenu } from './components/EditorMobileMenu';
import { DRAG_PORTAL_ID } from '@/constants';
import { Gallery3D } from '../Gallery3D';
import { StillerGallery } from '@/types';
import { LoadingScreen } from '@/components/Overlays/LoadingScreen';
import { useApi } from '@/hooks/useApi';
import { useEditorStore } from '@/stores/useEditorStore';
import styles from './Editor.module.css';

export const Editor = ({ gallery }: { gallery: string }) => {
  const { response, isLoading } = useApi<StillerGallery>(`/gallery/${gallery}`);
  const [projectName, setProjectName] = useState('Cargando galería...');
  const { isPreviewingGallery, setIsPreviewingGallery } = useEditorStore();

  const galleryData = response?.data;

  useEffect(() => {
    if (galleryData) {
      setProjectName(galleryData.title);
    }
  }, [isLoading])

  if (isLoading || !galleryData) {
    return <LoadingScreen />;
  }

  return (
    <>
      <section style={{ minWidth: '420px', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--mantine-color-body)' }}>
        <div id={DRAG_PORTAL_ID} style={{ position: 'absolute' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', minHeight: '70px', maxHeight: '70px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', flexWrap: 'nowrap', paddingLeft: '16px' }}>
            <BackToDashboarButton />
            <DynamicText
              value={projectName}
              setValue={setProjectName}
            // onFinishEdit={} // not implemented
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', paddingRight: '16px', }}>
            <div className={styles.desktopActions}>
              <MainButtons
                gallery={gallery}
                isPreviewing={isPreviewingGallery}
                onPreviewButton={() => {
                  setIsPreviewingGallery(true);
                }}
                onClosePreviewButton={() => {
                  setIsPreviewingGallery(false);
                }}
              />
              <ActionIcon
                component="a"
                href="https://github.com/fisirc/metagallery"
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                variant="default"
                aria-label="GitHub repository"
              >
                <IconBrandGithub size={20} />
              </ActionIcon>
              <UserButton />
            </div>
            <EditorMobileMenu 
              MainButtons={
                <MainButtons
                  gallery={gallery}
                  isPreviewing={isPreviewingGallery}
                  onPreviewButton={() => {
                    setIsPreviewingGallery(true);
                  }}
                  onClosePreviewButton={() => {
                    setIsPreviewingGallery(false);
                  }}
                />
              }
            />
          </div>
        </div>
        <div style={{ display: isPreviewingGallery ? 'none' : 'flex', flexDirection: 'row', gap: '16px', minHeight: 'calc(100vh - 70px)', maxHeight: 'calc(100vh - 70px)', paddingLeft: '16px', paddingRight: '16px' }}>
          <EditorSidebar />
          <GalleryCanvas2D gallery={gallery} triggerReRender={isPreviewingGallery} />
        </div>
        {
          isPreviewingGallery && (
            <div style={{ display: 'flex', flexDirection: 'row', minHeight: 'calc(100vh - 70px)', maxHeight: 'calc(100vh - 70px)' }}>
              <div style={{ height: 'calc(100vh - 70px)', width: '100%' }}>
                <Gallery3D gallery={gallery} withTopOffset />
              </div>
            </div>
          )
        }
      </section>
    </>
  );
};
