import { createContext } from "react";

export const ExistingClaimContext = createContext<string | undefined>(
  undefined,
);
