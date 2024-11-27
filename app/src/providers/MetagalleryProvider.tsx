import { create } from 'zustand';
import { Modal, Portal } from '@mantine/core';
import { ReactNode, useEffect } from 'react';
import { MODAL_PORTAL_ID, TOKEN_LC_KEY } from '@/constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { z } from 'zod';
import { useUser } from '@/stores/useUser';

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
  const [token,] = useLocalStorage(TOKEN_LC_KEY, {
    otherwise: null,
  });

  useEffect(() => {
    console.log('🐢🐢🐢🐢', { token });
    if (token) {
      useUser.getState().loginWithToken(token);
    } else {
      useUser.getState().logout();
    }
  }, [token]);

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
