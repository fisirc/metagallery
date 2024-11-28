import { create } from 'zustand';
import { Modal, ModalProps, Portal } from '@mantine/core';
import { ReactNode, useEffect } from 'react';
import { MODAL_PORTAL_ID, TOKEN_LC_KEY } from '@/constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useUser } from '@/stores/useUser';
import { useWindowSize } from 'react-use';
import ReactConfetti from 'react-confetti';

type ModalProps2 = Omit<ModalProps, 'opened' | 'onClose'> & {
  id: string,
  child: ReactNode,
  opened?: boolean,
  onClose?: () => void,
};

interface MetagalleryProviderStore {
  activeModals: Map<string, { el: ReactNode, props?: ModalProps2 }>,
  showingConfetti: boolean,
  confetti: (ms?: number) => void,
  openModal: (props: ModalProps2) => void,
  closeModal: (id: string) => boolean,
}

export const useMetagalleryStore = create<MetagalleryProviderStore>()(
  (set, get) => ({
    activeModals: new Map(),
    showingConfetti: false,
    confetti: (ms) => {
      set({ showingConfetti: true });
      setTimeout(() => set({ showingConfetti: false }), ms ?? 1000);
    },
    openModal: (props) => {
      const newModals = new Map(get().activeModals);
      console.log({ props })
      newModals.set(props.id, {
        el: props.child,
        props: props,
      });

      set({
        activeModals: newModals,
      });
    },
    closeModal: (id) => {
      const newModals = new Map(get().activeModals);

      newModals.get(id)?.props?.onClose?.();
      newModals.delete(id);

      set({
        activeModals: newModals,
      });

      return true;
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
      <Portal target={`#${MODAL_PORTAL_ID}`}>
        {
          Array.from(modals.entries()).map(([key, modal], i) => {
            const { opened, onClose, ...props } = modal.props ?? {
              opened: true,
              onClose: () => { },
            };

            console.log({ opened, onClose, props })

            return (
              <Modal
                key={i}
                style={{
                  zIndex: 69696969,
                }}
                opened={opened ?? true}
                closeOnClickOutside={true}
                onClose={() => {
                  console.log('🐢🐢🐢🐢🐢🐢', onClose)
                  const newModals = new Map(modals);
                  newModals.delete(key);

                  useMetagalleryStore.setState({
                    activeModals: newModals,
                  });

                  onClose?.();
                }}
                {...props}
              >
                {modal.el}
              </Modal>
            );
          })
        }
      </Portal>
      {children}
      <ReactConfetti
        numberOfPieces={showingConfetti ? 200 : 0}
        width={width}
        height={height}
        style={{
          width: 0, height: 0,
          overflow: 'hidden',
        }}
      />
    </>
  );
};
