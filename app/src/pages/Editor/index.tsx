import { useState } from 'react';
import { UserButton } from '@/components/UserButton';
import { DynamicText } from '@/components/DynamicText';
import { Canvas } from './components/Canvas';
import { MenuBurger } from './components/MenuBurger';
import { MainButtons } from './components/MainButtons';
import { EditorSidebar } from './components/ContentSidebar';
import { DRAG_PORTAL_ID } from './components/constants';

export const Editor = ({ gallery }: { gallery: string }) => {
  const [projectName, setProjectName] = useState('Nueva galería');

  return (
    <section style={{ paddingLeft: '16px', paddingRight: '16px', minWidth: '420px', position: 'relative', overflow: 'hidden' }}>
      <div id={DRAG_PORTAL_ID} style={{ position: 'absolute' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', minHeight: '70px', maxHeight: '70px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
          <MenuBurger />
          <DynamicText value={projectName} setValue={setProjectName} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <MainButtons />
          <UserButton />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', minHeight: 'calc(100vh - 70px)', maxHeight: 'calc(100vh - 70px)' }}>
        <EditorSidebar />
        <Canvas gallery={gallery} />
      </div>
    </section>
  );
};
