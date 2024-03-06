import { Group, MediaQuery, SimpleGrid, Skeleton, Stack } from '@mantine/core';
import TotalCard from './TotalCard';
import TotalCardTransparent from './TotalCardTransparent';
import { useStylesHome } from '@/hooks/useStylesHome';
import useSWR from 'swr';
import { TransactionsTotals } from '@/lib/apiTypes/transactions';
import { fetcher } from '@/lib/apiInstance';
import { notifications } from '@mantine/notifications';
import { AccountsTotal } from '@/lib/apiTypes/accounts';

export default function TotalsSection() {
  const { classes } = useStylesHome();

  const {
    data: totals,
    error: errorTotals,
    isLoading: isLoadingTotals,
  } = useSWR<TransactionsTotals>('/transactions/total', fetcher, {
    onError(err, key, config) {
      notifications.show({
        color: 'red',
        title: 'Erro inesperado',
        message: 'Houve um erro ao carregar os totais de transações',
      });
    },
  });

  const {
    data: accountsTotal,
    error: errorAccountTotal,
    isLoading: isLoadingAccountTotal,
  } = useSWR<AccountsTotal>('/accounts/total', fetcher, {
    onError(err, key, config) {
      notifications.show({
        color: 'red',
        title: 'Erro inesperado',
        message: 'Houve um erro ao carregar o saldo total',
      });
    },
  });

  return (
    <>
      <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
        <SimpleGrid
          className={classes.gridVerticalSpace}
          mt={40}
          spacing={20}
          cols={3}
          breakpoints={[
            { maxWidth: 'lgg', cols: 2 },
            { maxWidth: 'md', cols: 3, spacing: 10 },
            { maxWidth: 'lxs', cols: 2, spacing: 10 },
          ]}
        >
          <Skeleton visible={isLoadingAccountTotal} radius="6px">
            <TotalCard
              label="Saldo total"
              value={accountsTotal ? accountsTotal.total : 0}
            />
          </Skeleton>
          <Skeleton visible={isLoadingTotals} radius="6px">
            <TotalCard
              label="Ganhos totais"
              value={totals ? totals.totalIncome : 0}
            />
          </Skeleton>
          <Skeleton visible={isLoadingTotals} radius="6px">
            <TotalCard
              label="Gastos totais"
              value={totals ? totals.totalExpense : 0}
            />
          </Skeleton>
        </SimpleGrid>
      </MediaQuery>

      <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
        <Stack mt={40} spacing={20} className={classes.paddingRightXs}>
          <Skeleton width="50%" radius="6px" visible={isLoadingAccountTotal}>
            <TotalCardTransparent
              label="Saldo total"
              value={accountsTotal ? accountsTotal.total : 0}
            />
          </Skeleton>

          <Group spacing={10} grow position="apart">
            <Skeleton radius="6px" visible={isLoadingTotals}>
              <TotalCard
                label="Ganhos totais"
                value={totals ? totals.totalIncome : 0}
              />
            </Skeleton>
            <Skeleton radius="6px" visible={isLoadingTotals}>
              <TotalCard
                label="Gastos totais"
                value={totals ? totals.totalExpense : 0}
              />
            </Skeleton>
          </Group>
        </Stack>
      </MediaQuery>
    </>
  );
}
