import { Ingredieint } from "@prisma/client";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const session = useSession();

  const ing = api.redis.getAll.useQuery();
  const newIng = api.ingredients.addIngredient.useMutation();

  const handleLogin = () => {
    return session.status === "authenticated" ? signOut() : signIn();
  };

  const handleAddIng = () => {
    newIng.mutate({
      addIngredientSchema: {
        abvLevel: 0,
        acidLevel: 0,
        bottleCost: 20,
        bottleMesure: "ml",
        bottleSize: 700,
        brixLevel: 0,
        homemade: false,
        name: "Beefeater",
        notes: "",
        type: "Gin",
      },
    });
  };

  if (!ing.data) return <div>No data</div>;

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <>{ing.data.name}</>
        <button onClick={handleLogin}>
          {session.status !== "authenticated" ? "Log In" : "Log Out"}
        </button>
        <button onClick={handleAddIng}>Add ing</button>
      </div>
    </>
  );
};

export default Home;
