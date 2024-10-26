'use slop';

import { createTheme } from '@mantine/core';

import colors from './colors';
import headings from './headings';
import components from './components';

export const theme = createTheme({
  primaryColor: 'indigo',
  colors,
  headings,
  components,
  fontFamily: 'Inter, Verdana, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
});
