import { Container, Group, Burger } from "@mantine/core";
import { ReactNode } from "react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useDisclosure } from "@mantine/hooks";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);
  const label = opened ? "Close navigation" : "Open navigation";

  return (
    <>
      <Container py={30} bg="gray.8" sx={{ borderRadius: "0 0 15px 15px" }}>
        <Group position="apart">
          <Burger color="white" opened={opened} onClick={toggle} aria-label={label} />
          <ThemeToggle />
        </Group>
      </Container>

      {children}
    </>
  );
}