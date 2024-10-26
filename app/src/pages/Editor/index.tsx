import { useState } from 'react';
import { UserButton } from '@/components/UserButton';
import { DynamicText } from '@/components/DynamicText';
import { Canvas } from './components/Canvas';
import { MenuBurger } from './components/MenuBurger';
import { MainButtons } from './components/MainButtons';
import { EditorSidebar } from './components/ContentSidebar';

export const Editor = () => {
  const [projectName, setProjectName] = useState('Nueva galería');

  return (
    <div style={{ paddingLeft: '16px', paddingRight: '16px', minWidth: '420px' }}>
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
        <Canvas />
      </div>
    </div>
  );
};
