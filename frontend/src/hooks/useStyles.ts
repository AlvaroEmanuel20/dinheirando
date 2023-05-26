import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  container: {
    [theme.fn.largerThan('sm')]: {
      maxWidth: '100%',
    },
  },
  innerContainer: {
    [theme.fn.largerThan('sm')]: {
      maxWidth: rem(930),
      margin: '0 auto',
    },
  },
  innerAppHeader: {
    [theme.fn.largerThan('sm')]: {
      maxWidth: rem(930),
      margin: '0 auto',
    },
  },
  appFooter: {
    [theme.fn.largerThan('sm')]: {
      background: 'none',
      right: 20,
      bottom: 20,
    },
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },
  appFooterBtn: {
    [theme.fn.largerThan('sm')]: {
      width: rem(60),
      height: rem(60),
    },
  },
}));
