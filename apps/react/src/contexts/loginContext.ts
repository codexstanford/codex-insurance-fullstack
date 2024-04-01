import { SessionUser } from "common";
import { createContext } from "react";

export const LoginContext = createContext<SessionUser | undefined>(undefined);
