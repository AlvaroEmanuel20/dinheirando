import { Button } from "@mantine/core";
import { GetServerSideProps } from "next";

export default function Home() {
  return (
    <>
      Você está logado em <br />
      <Button>Sign out</Button>
      <Button>Get user</Button>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};
