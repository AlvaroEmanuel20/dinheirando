import { createStyles, rem } from '@mantine/core';

export const useStylesHome = createStyles((theme) => ({
  mainGroup: {
    [theme.fn.smallerThan('md')]: {
      flexDirection: 'column',
    },
  },
  leftContainer: {
    maxWidth: rem(660),

    [theme.fn.largerThan('xl')]: {
      maxWidth: rem(720),
    },

    [theme.fn.smallerThan('md')]: {
      maxWidth: 'none',
      padding: `${rem(40)} ${rem(30)} 0 ${rem(30)}`,
      margin: 0,
    },
  },
  rightContainer: {
    minWidth: rem(512),

    [theme.fn.smallerThan('md')]: {
      minWidth: 'none',
      margin: 0,
      borderRadius: '10px 10px 0 0',
      minHeight: 'calc(100vh - 120px)',
    },
  },
  gridVerticalSpace: {
    [theme.fn.smallerThan('md')]: {
      rowGap: rem(10),
    },
  },
}));
