import { MantineThemeComponent, TextInput } from '@mantine/core';

import classes from './TextInput.module.css';

export const CustomTextInput: MantineThemeComponent = {
  ...TextInput.extend({ classNames: classes }),
  defaultProps: {},
};
