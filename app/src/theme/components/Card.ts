import { MantineThemeComponent, Card } from '@mantine/core';
import classes from './Card.module.css';

export const CustomCard: MantineThemeComponent = {
  ...Card.extend({ classNames: classes }),
  defaultProps: {},
};
