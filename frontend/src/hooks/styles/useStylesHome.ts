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

    [theme.fn.smallerThan('xs')]: {
      padding: `${rem(40)} 0 0 ${rem(15)}`,
    },
  },
  rightContainer: {
    minWidth: rem(512),

    [theme.fn.smallerThan('md')]: {
      minWidth: 0,
      margin: 0,
      borderRadius: '10px 10px 0 0',
      minHeight: 'calc(100vh - 350px)',
    },

    [theme.fn.smallerThan('xs')]: {
      padding: rem(15),
    },
  },
  gridVerticalSpace: {
    [theme.fn.smallerThan('md')]: {
      rowGap: rem(10),
    },
  },
  paddingRightXs: {
    [theme.fn.smallerThan('xs')]: {
      paddingRight: rem(15),
    },
  },
  totalCard: {
    [theme.fn.smallerThan('xss')]: {
      padding: rem(8),
    },
  },
  totalCardValue: {
    [theme.fn.smallerThan('xss')]: {
      fontSize: theme.fontSizes.lg,
    },
  },
  appHeaderRightSide: {
    [theme.fn.smallerThan('xss')]: {
      gap: rem(15),
    },
  },
  listOptions: {
    gap: rem(20),
  },
  transactionCard: {
    paddingLeft: rem(10),
  },
}));
