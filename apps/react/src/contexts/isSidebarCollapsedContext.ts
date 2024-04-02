import { createContext } from "react";

export const IsSidebarCollapsedContext = createContext<{
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isSidebarCollapsed: false, setIsSidebarCollapsed: () => {} });
