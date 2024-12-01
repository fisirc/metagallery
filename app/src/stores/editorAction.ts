import { create } from 'zustand';
import { UserContentFileElement } from '@/types';

/**
 * Represents the state of the editor and the global actions that can be performed.
 * There is no 'dragging' state. Use {draggingFile != null} instead.
 */
interface EditorActionState {
  // Represents a sidebar element being dragged.
  gallery: string | null,
  draggingFile: UserContentFileElement | null,
  isDraggingFileVisible: boolean,
  isPreviewingGallery: boolean,
  setIsPreviewingGallery: (previewing: boolean) => void,
  startDragging: (f: UserContentFileElement) => void,
  dropFile: () => void,
  setDraggingFileVisible: (visible: boolean) => void,
}

export const useEditorStore = create<EditorActionState>()(
  (set, get) => ({
    draggingFile: null,
    isDraggingFileVisible: false,
    isPreviewingGallery: false,
    setIsPreviewingGallery: (previewing: boolean) => set({ isPreviewingGallery: previewing }),
    gallery: null,
    setGallery: (gallery: string) => set({ gallery }),
    startDragging: (file: UserContentFileElement) => set({ draggingFile: file, isDraggingFileVisible: true }),
    dropFile: () => {
      if (get().draggingFile) {
        set({ draggingFile: null, isDraggingFileVisible: false });
      }
    },
    setDraggingFileVisible: (visible: boolean) => set({ isDraggingFileVisible: visible }),
  }),
);
