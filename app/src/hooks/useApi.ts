import useSWR from 'swr';
import { UserContentFileElement } from '@/types';
import { GenericGalleryBlock } from '@/pages/Editor/components/Canvas';
import { DIR_BOTTOM, DIR_LEFT, DIR_RIGHT, DIR_TOP } from '@/pages/Editor/components/constants';

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
] satisfies Array<UserContentFileElement>;

const mockedGalleryBlocks = ([
    {
        type: 'wall',
        pos: [0, 0],
        props: {
            size: 2,
            dir: DIR_RIGHT,
            res: 'https://patrimoniocultural.bogota.unal.edu.co/wp-content/uploads/2023/galeria-arte-contemp/1903_1-scaled.jpg',
        },
    },
    {
        type: 'wall',
        pos: [0, 1],
        props: {
            size: 1,
            dir: DIR_TOP,
            res: 'https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2017/02/24/14879498132987.jpg',
        },
    },
    {
        type: 'wall',
        pos: [2, 0],
        props: {
            size: 2,
            dir: DIR_LEFT,
            res: null,
        },
    },
    {
        type: 'wall',
        pos: [2, 0],
        props: {
            size: 2,
            dir: DIR_BOTTOM,
            res: 'https://ibizartguide.com/que-es-arte-contemporaneo/picasso-guernica/',
        },
    },
    {
        type: 'wall',
        pos: [2, 0],
        props: {
            size: 1,
            dir: DIR_BOTTOM,
            res: null,
        },
    },
    {
        type: 'wall',
        pos: [0, 2],
        props: {
            size: 2,
            dir: DIR_TOP,
            res: null,
        },
    },
    {
        type: 'wall',
        pos: [2, 2],
        props: {
            size: 1,
            dir: DIR_LEFT,
            res: 'https://www.grupoeducar.cl/wp-content/uploads/2023/09/Arte-Revista-Educar-octubre-2023-edicion-277.jpg',
        },
    },
    {
        type: 'wall',
        pos: [0, 2],
        props: {
            size: 2,
            dir: DIR_RIGHT,
            res: null,
        },
    },
    {
        type: 'model3d',
        pos: [0.5, 1.5],
        props: {
            res: 'https://cdn3d.iconscout.com/3d/premium/thumb/balloon-dog-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--birthday-party-pack-celebration-illustrations-4712928.png?f=webp',
            size: 0.6,
        },
    },
    {
        type: 'door',
        pos: [0, 1],
        props: {
            dir: DIR_RIGHT,
            size: 1,
        },
    },
    {
        type: 'door',
        pos: [1, 2],
        props: {
            dir: DIR_TOP,
            size: 1,
        },
    },
] satisfies Array<GenericGalleryBlock>).toSorted((a, b) => b.props.size - a.props.size);

// const fetcher = (...args: ArgsType<typeof fetch>) => fetch(...args).then(res => res.json());
const fetcher = (...args: ArgsType<typeof fetch>) => {
    const [path] = args;

    if (typeof path !== 'string') {
        throw new Error('Invalid path');
    }

    if (path.startsWith('gallery/')) {
        // const gallery = path.split('/')[1];
        return mockedGalleryBlocks;
    }
    if (path === 'gallery/media') {
        return mockedUserMedia;
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
