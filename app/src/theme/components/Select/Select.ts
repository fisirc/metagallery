import {
  MantineThemeComponent,
  Select,
} from '@mantine/core';

import classes from './Select.module.css';

const Component: MantineThemeComponent = {
  ...Select.extend({ classNames: classes }),
  defaultProps: {},
};

export default Component;
