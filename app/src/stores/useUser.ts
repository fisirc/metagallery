import { create } from 'zustand';
import { UserContentFileElement } from '@/types';

type MetagalleryUser = {
    username: string;
    fullname: string;
    email: string;
    token: string;
};

/**
 * Represents the state of the editor and the global actions that can be performed.
 * There is no 'dragging' state. Use {draggingFile != null} instead.
 */
interface MetagalleryUserState {
  // Represents a sidebar element being dragged.
  draggingFile: UserContentFileElement | null,
  isDraggingFileVisible: boolean,
  startDragging: (f: UserContentFileElement) => void,
  dropFile: () => void,
  setDraggingFileVisible: (visible: boolean) => void,
}

export const useUser = create<MetagalleryUserState>()(
  (set, get) => ({
    draggingFile: null,
    isDraggingFileVisible: false,
    startDragging: (file: UserContentFileElement) => set({ draggingFile: file, isDraggingFileVisible: true }),
    dropFile: () => {
      if (get().draggingFile) {
        set({ draggingFile: null, isDraggingFileVisible: false });
      }
    },
    setDraggingFileVisible: (visible: boolean) => set({ isDraggingFileVisible: visible }),
  }),
);
