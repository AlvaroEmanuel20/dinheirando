import {
  Group,
  MediaQuery,
  Modal,
  SimpleGrid,
  Skeleton,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import CategoryCard from './CategoryCard';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import NewItemCard from './NewItemCard';
import { Carousel } from '@mantine/carousel';
import { useState } from 'react';
import useCategories from '@/hooks/useCategories';
import { Category } from '@/lib/apiTypes/categories';
import { useStylesHome } from '@/hooks/styles/useStylesHome';
import { useDisclosure } from '@mantine/hooks';
import AddCategoryForm from './AddCategoryForm';

export default function CategoriesSection() {
  const { classes } = useStylesHome();
  const [incomeChecked, setIncomeChecked] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);

  const {
    data: incomeCategories,
    isLoading: isLoadingIncomeCategories,
    error: errorIncomeCategories,
  } = useCategories<Category[]>({ type: 'income' });

  const {
    data: expenseCategories,
    isLoading: isLoadingExpenseCategories,
    error: errorExpenseCategories,
  } = useCategories<Category[]>({ type: 'expense' });

  return (
    <>
      <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
        <Stack spacing={15} mt={40}>
          <Group position="apart">
            <Text size="lg" fw="bold" color="white">
              Minhas Categorias
            </Text>

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
          </Group>

          <Skeleton
            radius="6px"
            visible={isLoadingIncomeCategories || isLoadingExpenseCategories}
          >
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
              {incomeChecked &&
                incomeCategories &&
                incomeCategories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    id={category._id}
                    type={category.type}
                    name={category.name}
                  />
                ))}

              {!incomeChecked &&
                expenseCategories &&
                expenseCategories.map((category) => (
                  <CategoryCard
                    id={category._id}
                    key={category._id}
                    type={category.type}
                    name={category.name}
                  />
                ))}

              <NewItemCard height={95} openModal={open} />
            </SimpleGrid>
          </Skeleton>
        </Stack>
      </MediaQuery>

      <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
        <Stack
          spacing={15}
          mt={40}
          pr={isLoadingIncomeCategories || isLoadingExpenseCategories ? 15 : 0}
        >
          <Group
            position="apart"
            className={
              isLoadingIncomeCategories || isLoadingExpenseCategories
                ? ''
                : classes.paddingRightXs
            }
          >
            <Text size="lg" fw="bold" color="white">
              Minhas Categorias
            </Text>

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
          </Group>

          <Skeleton
            visible={isLoadingIncomeCategories || isLoadingExpenseCategories}
            radius="6px"
          >
            <Carousel
              withControls={false}
              slideGap={10}
              align="start"
              slideSize={202}
            >
              {incomeChecked &&
                incomeCategories &&
                incomeCategories.map((category) => (
                  <Carousel.Slide key={category._id}>
                    <CategoryCard
                      id={category._id}
                      type={category.type}
                      name={category.name}
                    />
                  </Carousel.Slide>
                ))}

              {!incomeChecked &&
                expenseCategories &&
                expenseCategories.map((category) => (
                  <Carousel.Slide key={category._id}>
                    <CategoryCard
                      id={category._id}
                      type={category.type}
                      name={category.name}
                    />
                  </Carousel.Slide>
                ))}

              <Carousel.Slide>
                <NewItemCard height={95} openModal={open} />
              </Carousel.Slide>
            </Carousel>
          </Skeleton>
        </Stack>
      </MediaQuery>

      <Modal centered opened={opened} onClose={close} title="Criar Categoria">
        <AddCategoryForm close={close} />
      </Modal>
    </>
  );
}
