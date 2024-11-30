import { MantineThemeComponent, Select } from '@mantine/core';
import classes from './Select.module.css';

export const CustomSelect: MantineThemeComponent = {
  ...Select.extend({ classNames: classes }),
  defaultProps: {},
};
