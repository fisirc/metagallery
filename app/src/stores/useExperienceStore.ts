import { create } from 'zustand';

type HoveringInformation = {
    title: string;
    description: string;
};

interface ExperienceStoreState {
    // Represents a sidebar element being dragged.
    hovering: HoveringInformation | null,
}

export const useExperienceStore = create<ExperienceStoreState>()(
    (set, get) => ({
        hovering: null,
    }),
);
