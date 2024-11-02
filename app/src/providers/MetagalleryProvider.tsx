import { create } from 'zustand';
import { Modal, Portal } from '@mantine/core';
import { ReactNode } from 'react';
import { MODAL_PORTAL_ID } from '@/pages/Editor/components/constants';

interface MetagalleryProviderStore {
  activeModals: Set<ReactNode>,
  openModal: (modal: ReactNode) => void,
}

export const useMetagalleryStore = create<MetagalleryProviderStore>()(
  (set, get) => ({
    activeModals: new Set(),
    openModal: (modal) => {
      const newModals = new Set(get().activeModals);
      newModals.add(modal);

      set({
        activeModals: newModals,
      });
    },
  }),
);

export const MetagalleryProvider = ({ children }: { children: ReactNode }) => {
  const modals = useMetagalleryStore((m) => m.activeModals);

  return (
    <>
      <div id={MODAL_PORTAL_ID} style={{ position: 'absolute' }}></div>
      <Portal target={`#${MODAL_PORTAL_ID}`}>
        {
          Array.from(modals.values()).map((modal, i) => {
            return (
              <Modal
                key={i}
                opened
                onClose={() => {
                  const newModals = new Set(modals);
                  newModals.delete(modal);

                  useMetagalleryStore.setState({
                    activeModals: newModals,
                  });
                }}>
                {modal}
              </Modal>
            );
          })
        }
      </Portal>
      {children}
    </>
  );
};
