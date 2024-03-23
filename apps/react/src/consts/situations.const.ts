export const SITUATIONS = {
  covidVaccine: "COVID-19 Vaccine",
  contraceptives: "Contraceptives",
} as const satisfies Record<string, string>;

export type Sitation = keyof typeof SITUATIONS;
