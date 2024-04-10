import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDataset } from "../api/userDataset";
import useSessionUser from "../hooks/useSessionUser";
import { getAfterLoginAction, setAfterLoginAction } from "../utils/storage";
import Spinner from "./Spinner";
import { ROUTES } from "common";

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
      // TODO The person and policy in the userDataset will currently be overwritten all the time
      // with the data that was inputted into the form when the user was not logged in.

      // Get all claim ids already in dataset

      let claimIds = compfinds("C", read("claim.service_type(C, T)"), userDataset, []) as string[];

      // If claim0 is present, change claim0 in saveToUserDataset to the first claim id not taken.
      if (claimIds.includes("claim0")) {
        let newClaimNum = 1;
        let newClaimId = "claim" + newClaimNum;
        while (claimIds.includes("claim" + newClaimNum)) {
          newClaimNum++;
          newClaimId = "claim" + newClaimNum;
        }
        

        // Update saveToUserDataset and redirectPath
        actionInfo.saveToUserDataset = actionInfo.saveToUserDataset.map((fact, _) => {
          return fact.map((epilogSymbol, _) => {
            return epilogSymbol === "claim0" ? "claim" + newClaimNum : epilogSymbol ;
          });
        });

        actionInfo.redirectPath = ROUTES.getClaimUrl(newClaimId + "")
      }



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
      if (actionInfo.redirectPath) {
        setWasHandled(true);
        setAfterLoginAction(null);
        navigate(actionInfo.redirectPath);
      }
    }
  }, [actionInfo, sessionUser, userDataset, wasHandled, mutation, navigate]);

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
