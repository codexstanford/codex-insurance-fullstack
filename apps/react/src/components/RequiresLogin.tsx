import { getLoginWithRedirectUrl } from "common/src/routes";
import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/loginContext";
import useSessionUser from "../hooks/useSessionUser";

export default function RequiresLogin({ children }: { children: ReactNode }) {
  const sessionUser = useSessionUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionUser) {
      navigate(getLoginWithRedirectUrl(location.pathname));
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
