type CursorStyles = null | 'pointer' | 'grab' | 'grabbing' | 'move';

let lastCursor: CursorStyles = null;

export function setCursor(cursor: CursorStyles) {
    const current = document.body.style.cursor as CursorStyles;
    document.body.style.cursor = cursor ?? lastCursor ?? 'unset';
    lastCursor = current;
}
