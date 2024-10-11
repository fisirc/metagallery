import { rem } from '@mantine/core';

const base = 40;
const scale = 1.2;

export default {
  sizes: {
    h1: { fontSize: rem(base / (scale ** 0)) },
    h2: { fontSize: rem(base / (scale ** 1)) },
    h3: { fontSize: rem(base / (scale ** 2)) },
    h4: { fontSize: rem(base / (scale ** 3)) },
    h5: { fontSize: rem(base / (scale ** 4)) },
    h6: { fontSize: rem(base / (scale ** 5)) },
  },
};
