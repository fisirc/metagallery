import { Redirect } from 'wouter';
import { Home } from './Home';
import { Editor } from './Editor';
import { Gallery3D } from './Gallery3D';
import { GalleryDashboard, TrashView } from './Dashboard/Dashboard';
import { useUser } from '@/stores/useUser';
import { LoadingScreen } from '@/components/Overlays/LoadingScreen';
import { useEditorStore } from '@/stores/useEditorStore';

export const routes = [
  {
    href: '/',
    label: 'Welcome',
    component: () => {
      const { loading, user } = useUser();

      if (loading || user) {
        return <Redirect to="/dashboard" />;
      }
      return <Home />;
    },
  },
  {
    href: '/dashboard',
    label: 'Dashboard router',
    component: () => {
      const { loading, user } = useUser();

      if (!loading && !user) {
        return <Redirect to="/" />;
      }

      if (loading) {
        return <LoadingScreen />
      }
      return <GalleryDashboard />;
    },
  },
  {
    href: '/trash',
    label: 'Trash can router',
    component: () => {
      const { loading, user } = useUser();

      if (!loading && !user) {
        return <Redirect to="/" />;
      }

      if (loading) {
        return <LoadingScreen />
      }
      return <TrashView />;
    },
  },
  {
    href: ':gallery/edit',
    label: 'Editor',
    component: ({ params }: { params: { gallery: string } }) => {
      const { loading, user } = useUser();

      if (!loading && !user) {
        return <Redirect to="/" />;
      }

      const { gallery } = params;
      useEditorStore.setState({ gallery: gallery });
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

      useEditorStore.setState({ gallery: handle });
      return <Gallery3D gallery={handle}></Gallery3D>;
    },
  },
  {
    href: '',
    label: '404',
    component: () => {
      return <Redirect to="/" />;
    },
  }
];
