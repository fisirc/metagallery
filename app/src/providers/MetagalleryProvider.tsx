import { create } from 'zustand';
import { Modal, Portal } from '@mantine/core';
import { ReactNode, useEffect } from 'react';
import { MODAL_PORTAL_ID, TOKEN_LC_KEY } from '@/constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useUser } from '@/stores/useUser';
import { useWindowSize } from 'react-use';
import ReactConfetti from 'react-confetti';

interface MetagalleryProviderStore {
  activeModals: Set<ReactNode>,
  showingConfetti: boolean,
  confetti: (ms?: number) => void,
  openModal: (modal: ReactNode) => void,
}

export const useMetagalleryStore = create<MetagalleryProviderStore>()(
  (set, get) => ({
    activeModals: new Set(),
    showingConfetti: false,
    confetti: (ms) => {
      set({ showingConfetti: true });
      setTimeout(() => set({ showingConfetti: false }), ms ?? 1000);
    },
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
  const showingConfetti = useMetagalleryStore((m) => m.showingConfetti);
  const { width, height } = useWindowSize();
  const [token,] = useLocalStorage(TOKEN_LC_KEY, {
    otherwise: null,
  });

  useEffect(() => {
    if (token) {
      useUser.getState().loginWithToken(token);
    } else {
      useUser.getState().logout();
    }
  }, [token]);

  return (
    <>
      <div id={MODAL_PORTAL_ID} style={{ position: 'absolute' }}></div>
      <ReactConfetti
        numberOfPieces={showingConfetti ? 200 : 0}
        width={width}
        height={height}
      />
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
