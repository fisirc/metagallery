import {
  MantineThemeComponent,
  Card,
} from '@mantine/core';

import classes from './Card.module.css';

const Component: MantineThemeComponent = {
  ...Card.extend({ classNames: classes }),
  defaultProps: {},
};

export default Component;
