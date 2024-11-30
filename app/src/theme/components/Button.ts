import { MantineThemeComponent, Button } from '@mantine/core';
import classes from './Button.module.css';

export const CustomButton: MantineThemeComponent = {
  ...Button.extend({ classNames: classes }),
  defaultProps: {
    variant: 'default',
    size: 'sm',
  },
};
