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
    "origin": [-9.4, -29.5],
    "slots": [
        {
            "ref": "wall1",
            "type": "2d",
            "props": {},
            "v": [
                [7.393, 6.677, 29.855],
                [7.393, 2.979, 29.855],
                [5.211, 6.677, 29.855],
                [5.211, 2.979, 29.855]
            ]
        },
        {
            "ref": "wall2",
            "type": "2d",
            "props": {},
            "v": [
                [3.192, 6.677, 29.855],
                [3.192, 2.979, 29.855],
                [1.009, 6.677, 29.855],
                [1.009, 2.979, 29.855]
            ]
        },
        {
            "ref": "wall3",
            "type": "2d",
            "props": {},
            "v": [
                [-1.009, 6.677, 29.855],
                [-1.009, 2.979, 29.855],
                [-3.192, 6.677, 29.855],
                [-3.192, 2.979, 29.855]
            ]
        },
        {
            "ref": "wall4",
            "type": "2d",
            "props": {},
            "v": [
                [-5.211, 6.677, 29.855],
                [-5.211, 2.979, 29.855],
                [-7.393, 6.677, 29.855],
                [-7.393, 2.979, 29.855]
            ]
        },
        {
            "ref": "center",
            "type": "3d",
            "props": {
                "scale": 2,
                "rotate": true
            },
            "v": [
                [0, 1.170, 10.706]
            ]
        }
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
