import { MantineThemeColorsOverride, virtualColor } from '@mantine/core';

const colors: MantineThemeColorsOverride = {
  gray: [
    '#f2f3fd',
    '#ebedf8',
    '#f3f6f2',
    '#d8dce9',
    '#c8cede',
    '#a7afc0',
    '#808899',
    '#434a5a',
    '#2e3443',
    '#1b1f2b',
  ],
  dark: [
    '#c9c9c9',
    '#b3b3b3',
    '#9c9c9c',
    '#868686',
    '#707070',
    '#595959',
    '#434343',
    '#2d2d2d',
    '#161616',
    '#000000',
  ],
  text: virtualColor({
    name: 'text',
    dark: 'white',
    light: 'black',
  }),
};

export default colors;
