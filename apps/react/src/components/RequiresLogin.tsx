import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/loginContext";
import useSessionUser from "../hooks/useSessionUser";
import { ROUTES } from "common";
import { setAfterLoginAction } from "../utils/storage";

export default function RequiresLogin({ children }: { children: ReactNode }) {
  const sessionUser = useSessionUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionUser) {
      setAfterLoginAction({ redirectPath: location.pathname });
      navigate(ROUTES.LOGIN);
    }
  }, [sessionUser]);

  if (!sessionUser) {
    return <></>;
  }

  return (
    <LoginContext.Provider value={sessionUser}>
      {children}
    </LoginContext.Provider>
  );
}
