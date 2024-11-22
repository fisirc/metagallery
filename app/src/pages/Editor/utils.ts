import { SlotVertex, SlotVertices } from '@/types';
import debounce from 'debounce';

export function v3tov2(v: SlotVertex): [number, number] {
    return [v[0], -v[2]];
}

export function getFrameWidth(v: SlotVertices) {
    const p1 = v3tov2(v[2]);
    const p2 = v3tov2(v[0]);
    return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
}

export function getFrameHeight(v: SlotVertices) {
    return v[0][1] - v[1][1];
}

export function getFrameAngle(v: SlotVertices) {
    const p1 = v3tov2(v[2]);
    const p2 = v3tov2(v[0]);
    const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    return angle * 180 / Math.PI;
}

export function getFrameXY(v: SlotVertices) {
    return v3tov2(v[0]);
}

/**
 * Debounced function to save scale to local storage with a delay of 500ms
 */
export const saveScaleToLocalStorage = debounce((zoom: number) => {
    console.log('saving', { zoom })
    localStorage.setItem('editor_scale', zoom.toString());
}, 500);

/**
 * Debounced function to save x and y to local storage with a delay of 500ms
 */
export const saveXYToLocalStorage = debounce((x: number, y: number) => {
    localStorage.setItem('editor_x', x.toString());
    localStorage.setItem('editor_y', y.toString());
    console.log('saving', { x, y })
}, 500);


export const getInitialScale = () => {
    const s = Number(localStorage.getItem('editor_scale'));
    if (Number.isNaN(s)) {
        return 1;
    }
    return s;
};

export const getInitialXY = () => {
    const x = Number(localStorage.getItem('editor_x'));
    const y = Number(localStorage.getItem('editor_y'));
    if (!Number.isNaN(x) && !Number.isNaN(y)) {
        return { x, y };
    }
    return { x: null, y: null };
};
