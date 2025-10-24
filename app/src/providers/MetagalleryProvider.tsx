import { create } from 'zustand';
import { Modal, ModalProps, Portal } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { MODAL_PORTAL_ID } from '@/constants';
import { useWindowSize } from 'react-use';
import ReactConfetti from 'react-confetti';

type ModalProps2 = Omit<ModalProps, 'opened' | 'onClose'> & {
  id: string,
  child: ReactNode,
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

const ModalWrapper = ({ modalKey, modalProps, children }: { modalKey: string, modalProps?: ModalProps2, children: ReactNode }) => {
  const modals = useMetagalleryStore((m) => m.activeModals);
  const [isOpen, setOpened] = useState(false);

  useEffect(() => {
    setOpened(true);
  }, []);

  const { onClose, ...props } = modalProps ?? {
    opened: true,
    onClose: () => { },
  };

  return (
    <Modal
      style={{
        zIndex: 69696969,
      }}
      opened={isOpen}
      closeOnClickOutside={true}
      onExitTransitionEnd={() => {
        const newModals = new Map(modals);
        newModals.delete(modalKey);

        useMetagalleryStore.setState({
          activeModals: newModals,
        });

        onClose?.();
      }}
      onClose={() => {
        setOpened(false);
      }}
      {...props}
    >
      {children}
    </Modal>
  );
}

export const MetagalleryProvider = ({ children }: { children: ReactNode }) => {
  const modals = useMetagalleryStore((m) => m.activeModals);
  const showingConfetti = useMetagalleryStore((m) => m.showingConfetti);
  const { width, height } = useWindowSize();

  return (
    <>
      <div id={MODAL_PORTAL_ID} style={{ position: 'absolute' }}></div>
      <Portal target={`#${MODAL_PORTAL_ID}`}>
        {
          Array.from(modals.entries()).map(([key, modal], i) => {
            return (
              <ModalWrapper key={key} modalKey={key} modalProps={modal.props}>
                {modal.el}
              </ModalWrapper>
            );
          })
        }
      </Portal>
      {children}
      <ReactConfetti
        numberOfPieces={showingConfetti ? 200 : 0}
        width={width - 24}
        height={height}
      />
    </>
  );
};
