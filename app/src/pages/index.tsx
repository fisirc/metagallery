import { Home } from './Home';
import { Editor } from './Editor';
import { Gallery3D } from './Gallery3D';

export const routes = [
  {
    href: '/',
    label: 'Welcome',
    component: Home,
  },
  {
    href: ':gallery/edit',
    label: 'Editor',
    component: ({ params }: { params: { gallery: string } }) => {
      const { gallery } = params;
      return <Editor gallery={gallery}></Editor>;
    },
  },
  {
    href: ':handle/',
    label: 'Handle router',
    component: ({ params }: { params: { handle: string } }) => {
      const { handle } = params;

      if (handle.startsWith('@')) {
        return <div>User {handle}</div>;
      }
      return <Gallery3D gallery={handle}></Gallery3D>;
    },
  },
];
