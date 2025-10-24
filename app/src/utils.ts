import { API_URL } from './constants';
import { StillerGallery } from './types';

type CursorStyles = null | 'pointer' | 'grab' | 'grabbing' | 'move' | 'not-allowed';

let lastCursor: CursorStyles = null;

export function setCursor(cursor: CursorStyles) {
    const current = document.body.style.cursor as CursorStyles;
    document.body.style.cursor = cursor ?? lastCursor ?? 'unset';
    lastCursor = current;
}

export function panicIfNull<T>(value: T): asserts value is NonNullable<T> {
    if (value == null) throw Error(`panic: null assertion failed`);
}

export function thumbnailSrcFromTemplateId(id: number) {
    return `${API_URL}/template/info/${id}/thumbnail`;
}

export function negateIf(expr: boolean, cond?: boolean) {
    if (cond === undefined) return expr;
    return cond ? !expr : expr;
}

export function copyGalleryWithSlotResId(gallery: StillerGallery, slotRef: string, resId: number) {
    const newSlots = gallery.slots.slots.map((slot) => {
        if (slot.ref === slotRef) {
            return {
                ...slot,
                res: resId,
            };
        }
        return slot;
    });

    return {
        ...gallery,
        slots: {
            ...gallery.slots,
            slots: newSlots,
        },
    };
}
