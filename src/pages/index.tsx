import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const session = useSession();
  const member = api.redis.getAll.useQuery();

  const handleLogin = () => {
    return session.status === "authenticated" ? signOut() : signIn();
  };

  if (!member.data) <div>No data</div>;
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        {member.data}
        <button onClick={handleLogin}>
          {session.status !== "authenticated" ? "Log In" : "Log Out"}
        </button>
      </div>
    </>
  );
};

export default Home;
