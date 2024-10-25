import { Home } from './Home/Home';
import { Editor } from './Editor/Editor';

export default [
  {
    href: '/',
    label: 'Welcome',
    component: Home,
  },
  {
    href: '/editor',
    label: 'Editor',
    component: Editor,
  },
];
