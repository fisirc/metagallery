import { useEffect, useState } from 'react';
import { UserButton } from '@/components/UserButton';
import { DynamicText } from '@/components/DynamicText';
import { GalleryCanvas2D } from './components/GalleryCanvas2D';
import { BackToDashboarButton } from './components/BackToDashboarButton';
import { MainButtons } from './components/MainButtons';
import { EditorSidebar } from './components/ContentSidebar';
import { DRAG_PORTAL_ID } from '@/constants';
import { Gallery3D } from '../Gallery3D';
import { StillerGallery } from '@/types';
import { LoadingScreen } from '@/components/Overlays/LoadingScreen';
import { useApi } from '@/hooks/useApi';

export const Editor = ({ gallery }: { gallery: string }) => {
  const [previewOpened, setPreviewOpened] = useState(false);
  const { response, isLoading } = useApi<StillerGallery>(`/gallery/${gallery}`);
  const [projectName, setProjectName] = useState('Cargando galería...');

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
      <section style={{ minWidth: '420px', position: 'relative', overflow: 'hidden' }}>
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
            <MainButtons
              isPreviewing={previewOpened}
              onPreviewButton={() => {
                setPreviewOpened(true);
              }}
              closePreviewButton={() => {
                setPreviewOpened(false);
              }}
            />
            <UserButton />
          </div>
        </div>
        <div style={{ display: previewOpened ? 'none' : 'flex', flexDirection: 'row', gap: '16px', minHeight: 'calc(100vh - 70px)', maxHeight: 'calc(100vh - 70px)', paddingLeft: '16px', paddingRight: '16px' }}>
          <EditorSidebar />
          <GalleryCanvas2D gallery={gallery} triggerReRender={previewOpened} />
        </div>
        {
          previewOpened && (
            <div style={{ display: 'flex', flexDirection: 'row', minHeight: 'calc(100vh - 70px)', maxHeight: 'calc(100vh - 70px)' }}>
              <div style={{ height: 'calc(100vh - 70px)', width: '100%' }}>
                <Gallery3D gallery={gallery} />
              </div>
            </div>
          )
        }
      </section>
    </>
  );
};
