import useSWR from 'swr';
import { UserContentFileElement } from '@/types';

type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

const mockedUserMedia = [
    {
        id: 1,
        title: 'Aiko Tanaka',
        description: 'Lorem punpuns',
        url: 'https://www.grupoeducar.cl/wp-content/uploads/2023/06/Arte-Revista-Educar-Julio-2023-edicion-274.png',
    },
    {
        id: 2,
        title: 'Grace en 3d',
        description: 'Modelo 3d no implementado',
        url: 'https://diario.global/wp-content/uploads/2022/02/C2015014-TOTS-SOM-EUROPA-UNIDA.jpg',
    },
    {
        id: 3,
        title: 'Xiao Pang',
        description: 'Le gusta mirar fijamente a cosas cotidianas',
        url: 'https://unidadlatina.org/wp-content/uploads/2024/04/arte-contemporaneo-latinoamerica.jpg',
    },
    {
        id: 4,
        title: 'Xiao Pang',
        description: 'Le gusta mirar fijamente a cosas cotidianas',
        url: 'http://localhost:5173/assets/3d/chihiro.glb',
    },
] satisfies Array<UserContentFileElement>;

export const galleryResponse = {
    "origin": [-7.8, -4.34],
    "slots": [
        {
            "ref": "wall1",
            "type": "2d",
            "res": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/68ce2653-f36c-4c90-aa2e-ca3fd6aea4b1/dheugf9-6158600e-9219-4b68-a317-dca56309e034.jpg/v1/fit/w_828,h_1172,q_70,strp/frieren_fern_by_lailaroever_dheugf9-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY4Y2UyNjUzLWYzNmMtNGM5MC1hYTJlLWNhM2ZkNmFlYTRiMVwvZGhldWdmOS02MTU4NjAwZS05MjE5LTRiNjgtYTMxNy1kY2E1NjMwOWUwMzQuanBnIiwiaGVpZ2h0IjoiPD0xODExIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvNjhjZTI2NTMtZjM2Yy00YzkwLWFhMmUtY2EzZmQ2YWVhNGIxXC9sYWlsYXJvZXZlci00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.OG7dkZbNa8ac0uc0deM0AF9tkaleW9TuPqNeKD8zqXw",
            "props": {},
            "v": [
                [1.878, 1.752, -3.911],
                [1.878, 0.65, -3.911],
                [2.657, 1.752, -3.911],
                [2.657, 0.65, -3.911]
            ]
        },
        {
            "ref": "wall2",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [3.216, 1.672, -3.536],
                [3.216, 1.132, -3.536],
                [3.216, 1.672, -2.773],
                [3.216, 1.132, -2.773]
            ]
        },
        {
            "ref": "wall3",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [3.213, 1.671, -2.281],
                [3.213, 0.855, -2.281],
                [3.213, 1.671, -1.703],
                [3.213, 0.855, -1.703]

            ]
        },
        {
            "ref": "wall4",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [3.178, 1.746, 2.103],
                [3.178, 0.906, 2.103],
                [3.178, 1.746, 3.289],
                [3.178, 0.906, 3.289]
            ]
        },
        {
            "ref": "wall5",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [2.78, 2.017, 4.0],
                [2.78, 0.74, 4.0],
                [1.877, 2.017, 4.0],
                [1.877, 0.74, 4.0]
            ]
        },
        {
            "ref": "wall6",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [0.802, 2.023, 3.988],
                [0.802, 0.793, 3.988],
                [-0.937, 2.023, 3.988],
                [-0.937, 0.793, 3.988]
            ]
        },
        {
            "ref": "wall7",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [

                [-1.852, 1.735, 3.999],
                [-1.852, 1.207, 3.999],
                [-2.599, 1.735, 3.999],
                [-2.599, 1.207, 3.999]
            ]
        },
        {
            "ref": "wall8",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [-3.148, 1.842, 3.367],
                [-3.148, 0.612, 3.367],
                [-3.148, 1.842, -0.455],
                [-3.148, 0.612, -0.455]
            ]
        },
        {
            "ref": "wall9",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [-7.185, 1.316, -3.016],
                [-7.185, 0.619, -3.016],
                [-6.2, 1.316, -3.016],
                [-6.2, 0.619, -3.016]
            ]
        },
        {
            "ref": "wall10",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [-7.608, 1.585, -3.78],
                [-7.608, 0.33, -3.78],
                [-7.608, 1.585, -4.667],
                [-7.608, 0.33, -4.667]
            ]
        },
        {
            "ref": "wall11",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [-6.742, 1.405, -5.029],
                [-6.742, 0.553, -5.029],
                [-5.537, 1.405, -5.029],
                [-5.537, 0.553, -5.029]
            ]
        },
        {
            "ref": "wall12",
            "type": "2d",
            "res": "",
            "props": {},
            "v": [
                [-2.717, 1.807, -3.868],
                [-2.717, 1.11, -3.868],
                [-1.732, 1.807, -3.868],
                [-1.732, 1.11, -3.868]
            ]
        },
        {
            "ref": "big_model",
            "type": "3d",
            "res": "",
            "props": {
                "scale": 0.3,
                "rotate": true
            },
            "v": [
                [-6.234, 0.23441, -1.7944]
            ]
        },
        {
            "ref": "small_model",
            "type": "3d",
            "res": "",
            "props": {
                "scale": 1,
                "rotate": true
            },
            "v": [
                [0, 0, -9.2139]
            ]
        }
    ]
};

// const fetcher = (...args: ArgsType<typeof fetch>) => fetch(...args).then(res => res.json());
const fetcher = async (...args: ArgsType<typeof fetch>) => {
    const [path] = args;
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log('REFETCHING SHIT', galleryResponse.slots)

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
