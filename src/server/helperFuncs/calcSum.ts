import { SpecWithId } from "../serverTypes/SpecWithId";

const calcSum = (ingredieintsWithAmounts: SpecWithId[]) => {
  const amounts: number[] = ingredieintsWithAmounts.map((ing) => ing.amount);
  return amounts.reduce((acc, cv) => acc + cv, 0);
};
export default calcSum;
