import { ReactNode, useContext } from "react";
import { useUserDataset } from "../api/userDataset";
import { LoginContext } from "../contexts/loginContext";
import Callout from "./Callout";
import Spinner from "./Spinner";
import { UserDatasetContext } from "../contexts/userDatasetContext";

export default function RequiresUserDataset({
  children,
}: {
  children: ReactNode;
}) {
  /* ------------------------ Environmental conditions ------------------------ */

  const sessionUser = useContext(LoginContext);

  if (!sessionUser)
    throw new Error(
      "LoginContext is required. Please wrap this component in RequiresLogin.",
    );

  /* ------------------------------ Actual check ------------------------------ */

  const { query, userDataset } = useUserDataset(sessionUser.id);

  if (query.isLoading) return <Spinner />;

  if (query.isError)
    return (
      <Callout
        heading="Network erorr"
        addGoHomeButton={true}
        wrapInFullpageContainer={true}
      >
        <p>Could not fetch your data. Please try again later.</p>
      </Callout>
    );

  return (
    <UserDatasetContext.Provider value={userDataset}>
      {children}
    </UserDatasetContext.Provider>
  );
}
