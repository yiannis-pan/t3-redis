import { Ingredieint } from "@prisma/client";

const densityCalculator = (ing: Ingredieint) => {
  if (ing.brixLevel != 0) {
    const sg =
      0.00000005785037196 * ing.brixLevel * ing.brixLevel * ing.brixLevel +
      0.00001261831344 * ing.brixLevel * ing.brixLevel +
      0.003873042366 * ing.brixLevel +
      0.9999994636;
    const s = Math.round(sg * 100000) / 100000;
    return s;
  } else {
    //Density = density of alcohol + density of water.
    return (ing.abvLevel / 100) * 0.789 + (1 - ing.abvLevel / 100);
  }
};

export default densityCalculator;
