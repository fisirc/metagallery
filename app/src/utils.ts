type CursorStyles = null | 'pointer' | 'grab' | 'grabbing' | 'move';

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
    return `https://pandadiestro.xyz/services/stiller/template/info/${id}/thumbnail`;
}

export function negateIf(expr: boolean, cond?: boolean) {
    if (cond === undefined) return expr;
    return cond ? !expr : expr;
}
