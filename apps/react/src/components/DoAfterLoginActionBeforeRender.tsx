import { useNavigate } from "react-router-dom";
import { useUserDataset } from "../api/userDataset";
import { getAfterLoginAction, setAfterLoginAction } from "../utils/storage";
import useSessionUser from "../hooks/useSessionUser";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function DoAfterLoginActionBeforeRender({
  children,
}: {
  children?: React.ReactNode;
}) {
  /* ---------------------------------- Hooks --------------------------------- */
  const actionInfo = getAfterLoginAction();
  const sessionUser = useSessionUser();
  const [wasHandled, setWasHandled] = useState(false);

  const { userDataset, mutation } = useUserDataset(sessionUser?.id || -1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!actionInfo || !sessionUser || wasHandled) {
      return;
    }

    if (actionInfo.saveToUserDataset) {
      // If userDataset wasn't fetched yet, wait for it
      if (!userDataset) return;

      // TODO Handle situations in which the logged in user already has a claim with id claim0
      // Also, the person and policy in the userDataset will currently be overwritten all the time
      // with the data that was inputted into the form when the user was not logged in.

      const mergedDataset = definemorefacts(
        actionInfo.saveToUserDataset,
        userDataset,
      );

      setWasHandled(true);

      mutation.mutateAsync(mergedDataset).then(() => {
        setAfterLoginAction(null);
        if (actionInfo.redirectPath) navigate(actionInfo.redirectPath);
      });
    } else {
      if (actionInfo.redirectPath) navigate(actionInfo.redirectPath);
    }
  });

  if (sessionUser && actionInfo) {
    // If the user is logged in and there is an action to be done after login
    // then don't render the children. Instead, show a spinner. Either way,
    // the above code will redirect to a new page. Then, actionInfo will be
    // empty so that the children will be rendered.
    return (
      <>
        <Spinner />
      </>
    );
  }

  return <>{children}</>;
}
