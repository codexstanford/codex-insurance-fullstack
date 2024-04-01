import { createContext } from "react";

export const UserDatasetContext = createContext<
  ReturnType<typeof definemorefacts> | undefined
>(undefined);
