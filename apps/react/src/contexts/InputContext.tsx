import React from "react";

export type InputContext_Data = {
  isLocked: boolean;
};

export const InputContext = React.createContext<InputContext_Data | undefined>(
  undefined,
);
