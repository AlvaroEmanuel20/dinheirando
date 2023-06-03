import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  //AUTH
  authFormContainer: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: '40px',
    },
  },
}));
