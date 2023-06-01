import {
  MediaQuery,
  Modal,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import WalletCard from './WalletCard';
import NewItemCard from './NewItemCard';
import { Carousel } from '@mantine/carousel';
import { useStylesHome } from '@/hooks/styles/useStylesHome';
import useAccounts from '@/hooks/useAccounts';
import { Account } from '@/lib/apiTypes/accounts';
import { useDisclosure } from '@mantine/hooks';

export default function WalletSection() {
  const { classes } = useStylesHome();
  const [opened, { open, close }] = useDisclosure(false);

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: errorAccounts,
  } = useAccounts<Account[]>();

  return (
    <>
      <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
        <Stack spacing={15} mt={40}>
          <Text size="lg" fw="bold" color="white">
            Minha Carteira
          </Text>

          <Skeleton radius="6px" visible={isLoadingAccounts}>
            <SimpleGrid
              className={classes.gridVerticalSpace}
              spacing={20}
              cols={3}
              breakpoints={[
                { maxWidth: 'lgg', cols: 2 },
                { maxWidth: 'md', cols: 3, spacing: 10 },
                { maxWidth: 'lxs', cols: 2, spacing: 10 },
              ]}
            >
              {accounts &&
                accounts.map((account) => (
                  <WalletCard
                    key={account._id}
                    name={account.name}
                    amount={account.amount}
                  />
                ))}
              <NewItemCard height={130} openModal={open} />
            </SimpleGrid>
          </Skeleton>
        </Stack>
      </MediaQuery>

      <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
        <Stack spacing={15} mt={40} pr={isLoadingAccounts ? 15 : 0}>
          <Text
            className={classes.paddingRightXs}
            size="lg"
            fw="bold"
            color="white"
          >
            Minha Carteira
          </Text>

          <Skeleton visible={isLoadingAccounts} radius="6px">
            <Carousel
              withControls={false}
              slideGap={10}
              align="start"
              slideSize={202}
            >
              {accounts &&
                accounts.map((account) => (
                  <Carousel.Slide key={account._id}>
                    <WalletCard name={account.name} amount={account.amount} />
                  </Carousel.Slide>
                ))}

              <Carousel.Slide>
                <NewItemCard height={130} openModal={open} />
              </Carousel.Slide>
            </Carousel>
          </Skeleton>
        </Stack>
      </MediaQuery>

      <Modal centered opened={opened} onClose={close} title="Criar Conta">
        Oi
      </Modal>
    </>
  );
}
