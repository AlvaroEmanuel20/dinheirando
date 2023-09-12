import {
  ActionIcon,
  Button,
  Center,
  Group,
  Modal,
  Select,
  Skeleton,
  Stack,
  Switch,
  useMantineColorScheme,
} from '@mantine/core';
import ListTransactionsTransfersMenu from './ListTransactionsTransfersMenu';
import {
  IconArrowsSort,
  IconCalendar,
  IconCalendarSearch,
  IconCirclePlus,
  IconMinus,
  IconPlus,
  IconSortDescending2,
} from '@tabler/icons-react';
import TransactionCard from './TransactionCard';
import NewItemCard from './NewItemCard';
import TransferCard from './TransferCard';
import { useStylesHome } from '@/hooks/styles/useStylesHome';
import { useState } from 'react';
import useTransactions from '@/hooks/useTransactions';
import { Transaction } from '@/lib/apiTypes/transactions';
import { Transfer } from '@/lib/apiTypes/transfers';
import useTransfers from '@/hooks/useTransfers';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import AddTransactionForm from './AddTransactionForm';
import AddTransferForm from './AddTransferForm';

export default function TransactionsTransfersSection() {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStylesHome();
  const [opened, { open, close }] = useDisclosure(false);

  const [menuSelected, setMenuSelected] = useState<
    'transactions' | 'transfers'
  >('transactions');
  const [incomeChecked, setIncomeChecked] = useState(true);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [sortBy, setSortBy] = useState<string | null>('desc');
  const [limitTransactions, setLimitTransactions] = useState(10);
  const [limitTransfers, setLimitTransfers] = useState(10);

  const {
    data: incomeTransactions,
    isLoading: isLoadingIncomeTransactions,
    error: errorIncomeTransactions,
  } = useTransactions<Transaction[]>({
    limit: limitTransactions,
    type: 'income',
    sort: sortBy,
    fromDate: dateRange[0],
    toDate: dateRange[1],
  });

  const {
    data: expenseTransactions,
    isLoading: isLoadingExpenseTransactions,
    error: errorExpenseTransactions,
  } = useTransactions<Transaction[]>({
    limit: limitTransactions,
    type: 'expense',
    sort: sortBy,
    fromDate: dateRange[0],
    toDate: dateRange[1],
  });

  const {
    data: transfers,
    isLoading: isLoadingTransfers,
    error: errorTransfers,
  } = useTransfers<Transfer[]>({
    limit: limitTransfers,
    sort: sortBy,
    fromDate: dateRange[0],
    toDate: dateRange[1],
  });

  return (
    <>
      <Stack spacing={20} pb={20}>
        <Group position="apart">
          <ListTransactionsTransfersMenu
            menuSelected={menuSelected}
            setMenuSelected={setMenuSelected}
          />

          <Group spacing={25} className={classes.listOptions}>
            <Group spacing={10}>
              {menuSelected === 'transactions' && (
                <Switch
                  checked={incomeChecked}
                  onChange={(event) =>
                    setIncomeChecked(event.currentTarget.checked)
                  }
                  color="teal.9"
                  thumbIcon={
                    !incomeChecked ? (
                      <IconMinus color="red" size="0.7rem" />
                    ) : (
                      <IconPlus color="teal" size="0.7rem" />
                    )
                  }
                />
              )}

              <ActionIcon
                onClick={() => setShowDateFilter(!showDateFilter)}
                variant="transparent"
                color={colorScheme === 'dark' ? 'gray.0' : 'gray.6'}
              >
                <IconCalendarSearch size="1.56rem" />
              </ActionIcon>

              <ActionIcon
                onClick={() => setShowSortFilter(!showSortFilter)}
                variant="transparent"
                color={colorScheme === 'dark' ? 'gray.0' : 'gray.6'}
              >
                <IconSortDescending2 size="1.56rem" />
              </ActionIcon>
            </Group>

            <ActionIcon
              onClick={open}
              variant="transparent"
              color={colorScheme === 'dark' ? 'gray.0' : 'violet.6'}
            >
              <IconCirclePlus size="1.56rem" />
            </ActionIcon>
          </Group>
        </Group>

        {showDateFilter && (
          <Stack>
            <DatePickerInput
              clearable
              label="Filtre por data"
              icon={<IconCalendar size="1rem" />}
              valueFormat="DD/MM/YYYY"
              type="range"
              placeholder="Selecione um período"
              value={dateRange}
              onChange={setDateRange}
              labelSeparator="até"
              weekdayFormat="ddd"
              styles={(theme) => ({
                input: {
                  '&:focus-within': {
                    borderColor: theme.colors.violet[6],
                  },
                },
                day: {
                  '&[data-selected]': {
                    backgroundColor: theme.colors.violet[6],
                  },
                },
              })}
            />
          </Stack>
        )}

        {showSortFilter && (
          <Stack>
            <Select
              clearable
              label="Ordene por"
              placeholder="Ordene por"
              value={sortBy}
              onChange={setSortBy}
              data={[
                { value: 'desc', label: 'Mais recentes' },
                { value: 'asc', label: 'Mais antigas' },
              ]}
              icon={<IconArrowsSort size="1rem" />}
              styles={(theme) => ({
                input: {
                  '&:focus-within': {
                    borderColor: theme.colors.violet[6],
                  },
                },
                item: {
                  '&[data-selected]': {
                    '&, &:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark'
                          ? theme.colors.gray[8]
                          : theme.colors.gray[2],
                      color:
                        theme.colorScheme === 'dark'
                          ? theme.white
                          : theme.colors.dark,
                    },
                  },
                },
              })}
            />
          </Stack>
        )}

        {menuSelected === 'transactions' && (
          <Skeleton
            radius="6px"
            visible={
              isLoadingIncomeTransactions || isLoadingExpenseTransactions
            }
          >
            {incomeChecked &&
              incomeTransactions &&
              incomeTransactions.length > 0 && (
                <Stack spacing={10}>
                  {incomeTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction._id}
                      id={transaction._id}
                      name={transaction.name}
                      category={transaction.category}
                      account={transaction.account}
                      value={transaction.value}
                      type={transaction.type}
                      createdAt={new Date(transaction.createdAt)}
                    />
                  ))}
                </Stack>
              )}

            {!incomeChecked &&
              expenseTransactions &&
              expenseTransactions.length > 0 && (
                <Stack spacing={10}>
                  {expenseTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction._id}
                      id={transaction._id}
                      name={transaction.name}
                      category={transaction.category}
                      account={transaction.account}
                      value={transaction.value}
                      type={transaction.type}
                      createdAt={new Date(transaction.createdAt)}
                    />
                  ))}
                </Stack>
              )}

            {incomeChecked && incomeTransactions?.length === 0 && (
              <NewItemCard height={57} openModal={open} />
            )}

            {!incomeChecked && expenseTransactions?.length === 0 && (
              <NewItemCard height={57} openModal={open} />
            )}

            {incomeChecked &&
              incomeTransactions &&
              incomeTransactions.length >= limitTransactions && (
                <Center mt={20}>
                  <Button
                    onClick={() => setLimitTransactions(limitTransactions + 5)}
                    color="teal.9"
                    size="sm"
                    compact
                    variant="light"
                    loading={isLoadingIncomeTransactions}
                  >
                    Carregar mais
                  </Button>
                </Center>
              )}

            {!incomeChecked &&
              expenseTransactions &&
              expenseTransactions.length >= limitTransactions && (
                <Center mt={20}>
                  <Button
                    color="red"
                    size="sm"
                    compact
                    variant="light"
                    loading={isLoadingExpenseTransactions}
                  >
                    Carregar mais
                  </Button>
                </Center>
              )}
          </Skeleton>
        )}

        {menuSelected === 'transfers' && (
          <Skeleton radius="6px" visible={isLoadingTransfers}>
            {transfers && transfers.length > 0 ? (
              <Stack spacing={10}>
                {transfers.map((transfer) => (
                  <TransferCard
                    key={transfer._id}
                    id={transfer._id}
                    fromAccount={transfer.fromAccount}
                    toAccount={transfer.toAccount}
                    value={transfer.value}
                    createdAt={new Date(transfer.createdAt)}
                  />
                ))}
              </Stack>
            ) : (
              <NewItemCard height={61} openModal={open} />
            )}

            {transfers && transfers.length >= limitTransfers && (
              <Center mt={20}>
                <Button
                  onClick={() => setLimitTransfers(limitTransfers + 5)}
                  color={colorScheme === 'dark' ? 'violet.6' : 'gray.7'}
                  size="sm"
                  compact
                  variant="light"
                  loading={isLoadingTransfers}
                >
                  Carregar mais
                </Button>
              </Center>
            )}
          </Skeleton>
        )}
      </Stack>

      <Modal
        centered
        opened={opened}
        onClose={close}
        title={
          menuSelected === 'transactions'
            ? 'Criar Transação'
            : 'Criar Transferência'
        }
      >
        {menuSelected === 'transactions' ? (
          <AddTransactionForm close={close} />
        ) : (
          <AddTransferForm close={close} />
        )}
      </Modal>
    </>
  );
}
