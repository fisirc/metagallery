import useSWR from 'swr';
import { UserContentFileElement } from '@/types';

type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

const mockedUserMedia = [
    {
        id: 1,
        type: 'image',
        title: 'Aiko Tanaka',
        description: 'Lorem punpuns',
        url: 'https://www.grupoeducar.cl/wp-content/uploads/2023/06/Arte-Revista-Educar-Julio-2023-edicion-274.png',
    },
    {
        id: 2,
        type: 'model3d',
        title: 'Grace en 3d',
        description: 'Modelo 3d no implementado',
        url: 'https://diario.global/wp-content/uploads/2022/02/C2015014-TOTS-SOM-EUROPA-UNIDA.jpg',
    },
    {
        id: 3,
        type: 'image',
        title: 'Xiao Pang',
        description: 'Le gusta mirar fijamente a cosas cotidianas',
        url: 'https://unidadlatina.org/wp-content/uploads/2024/04/arte-contemporaneo-latinoamerica.jpg',
    },
    {
        id: 4,
        type: 'model3d',
        title: 'Xiao Pang',
        description: 'Le gusta mirar fijamente a cosas cotidianas',
        url: 'http://localhost:5173/assets/3d/chihiro.glb',
    },
] satisfies Array<UserContentFileElement>;

export const galleryResponse = {
    "origin": [-5.01, -2],
    "slots": [
        {
            "ref": "center",
            "type": "3d",
            "props": {
                "scale": 1,
                "rotate": false,
            },
            "v": [
                [0, 0.7822, -3.103]
            ]
        },
    ]
} as const;

// const fetcher = (...args: ArgsType<typeof fetch>) => fetch(...args).then(res => res.json());
const fetcher = async (...args: ArgsType<typeof fetch>) => {
    const [path] = args;
    await new Promise(resolve => setTimeout(resolve, 200));

    if (typeof path !== 'string') {
        throw new Error('Invalid path');
    }

    if (path === 'gallery/media') {
        return mockedUserMedia;
    }
    if (path.startsWith('gallery/')) {
        // const gallery = path.split('/')[1];
        return galleryResponse;
    }

    throw new Error('404');
};

export function useApi<T, E = any>(path: string, options?: RequestInit) {
    // @ts-ignore
    const { data, error, isLoading, isValidating, mutate } = useSWR<T, E>(
        path, (key: string) => {
            return fetcher(key, options);
        }, { revalidateOnFocus: false },
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    };
}
