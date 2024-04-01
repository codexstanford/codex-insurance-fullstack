import { ROUTES } from "common";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/loginContext";
import useSessionUser from "../hooks/useSessionUser";

export default function RequiresLogin({ children }: { children: ReactNode }) {
  const sessionUser = useSessionUser();
  const navigate = useNavigate();

  // TODO Append the current path to the login URL so that the user can be redirected back to the current page after logging in.

  if (!sessionUser) {
    navigate(ROUTES.LOGIN);
    return <></>;
  }

  return (
    <LoginContext.Provider value={sessionUser}>
      {children}
    </LoginContext.Provider>
  );
}
