import { createTheme, rem, virtualColor } from '@mantine/core';
import components from './components';

const base = 40;
const scale = 1.2;

export const theme = createTheme({
  colors: {
    text: virtualColor({
      name: 'text',
      dark: 'white',
      light: 'black',
    }),
  },
  headings: {
    sizes: {
      h1: { fontSize: rem(base / (scale ** 0)) },
      h2: { fontSize: rem(base / (scale ** 1)) },
      h3: { fontSize: rem(base / (scale ** 2)) },
      h4: { fontSize: rem(base / (scale ** 3)) },
      h5: { fontSize: rem(base / (scale ** 4)) },
      h6: { fontSize: rem(base / (scale ** 5)) },
    }
  },
  components,
  fontFamily: 'Inter, Verdana, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
});
