import { useEffect, useState } from 'react';

/**
 * @returns Whether the device support mouse, like a desktop computer.
 */
export function useFinePointer() {
    const [isFinePointer, setIsFinePointer] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(pointer: fine)');
        const updatePointerType = () => setIsFinePointer(mediaQuery.matches);

        updatePointerType(); // Initialize state
        mediaQuery.addEventListener('change', updatePointerType);

        return () => mediaQuery.removeEventListener('change', updatePointerType);
    }, []);

    return isFinePointer;
}

