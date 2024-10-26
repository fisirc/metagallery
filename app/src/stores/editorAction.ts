import { create } from 'zustand';
import { UserContentFileElement } from '@/types';

/**
 * Represents the state of the editor and the global actions that can be performed.
 * There is no 'dragging' state. Use {draggingFile != null} instead.
 */
interface EditorActionState {
  // Represents a sidebar element being dragged.
  draggingFile: UserContentFileElement | null,
  startDragging: (f: UserContentFileElement) => void,
  dropFile: () => void,
}

export const useEditorStore = create<EditorActionState>()(
  (set, get) => ({
    draggingFile: null,
    startDragging: (file: UserContentFileElement) => set({ draggingFile: file }),
    dropFile: () => {
      if (get().draggingFile) {
        set({ draggingFile: null });
      }
    },
  }),
);
