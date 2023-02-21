import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery();

  if (!hello.data) <div>No data</div>;

  return <>{hello.data?.membner}</>;
};

export default Home;
