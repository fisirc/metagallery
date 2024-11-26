import { panicIfNull } from '@/utils';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

type UseLocalStorageProps<S extends z.ZodType<any>, O> = {
    schema: S,
    otherwise: O,
};

/**
 * Try to parse the value from localStorage with the given schema.
 * Returns null when no value, invalid value, or invalid JSON.
 */
const parseValue = <T>(value: any, schema: z.ZodType<T>): T | null => {
    try {
        const unmarshalled = JSON.parse(value);
        return schema.parse(unmarshalled);
    } catch {
        return null;
    }
};

export function useLocalStorage<S extends z.ZodType<z.infer<S>>, O = z.infer<S> | null>(
    key: string, { schema, otherwise }: UseLocalStorageProps<S, O>
) {
    const [value, _setValue] = useState(() => {
        const item = window.localStorage.getItem(key);
        const parsedItem = item !== null ? parseValue(item, schema) : null;
        if (parsedItem == null) {
            window.localStorage.setItem(key, JSON.stringify(otherwise));
            return otherwise;
        }
        return parsedItem;
    });

    const setValue = (val: (O | z.TypeOf<S>) | null, opts?: { strict: boolean }) => {
        if (val === null) {
            window.localStorage.removeItem(key);
            _setValue(otherwise);
            return;
        }

        let valToSerialize: O | z.TypeOf<S> = val;
        if (opts && opts.strict) {
            valToSerialize = schema.parse(val);
        }
        window.localStorage.setItem(key, JSON.stringify(valToSerialize));
        panicIfNull(valToSerialize); // unreachable, to make typescript happy
        _setValue(valToSerialize);
    };

    const onLocalStorageChange = useCallback((e: StorageEvent) => {
        if (e.key === key) {
            const parsed = parseValue(e.newValue, schema);
            _setValue(parsed ?? otherwise);
        }
    }, [key, schema, otherwise]);

    useEffect(() => {
        window.addEventListener('storage', onLocalStorageChange);
        return () => {
            window.removeEventListener('storage', onLocalStorageChange);
        };
    }, []);

    return [value, setValue] as const;
}
