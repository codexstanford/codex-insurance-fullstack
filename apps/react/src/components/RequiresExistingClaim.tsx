import { ReactNode, useContext } from "react";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import { getExistingIds } from "../utils/epilogUtils";
import Callout from "./Callout";
import { ExistingClaimContext } from "../contexts/existingClaimContext";

export default function RequiresExistingClaim({
  claimId,
  children,
}: {
  claimId: string;
  children?: ReactNode;
}) {
  /* ------------------------ Environmental conditions ------------------------ */

  const userDataset = useContext(UserDatasetContext);

  if (!userDataset)
    throw new Error(
      "UserDatasetContext is required. Please wrap this component in RequiresUserDataset.",
    );

  /* ------------------------------ Actual check ------------------------------ */

  const existingClaimIds = getExistingIds("claim", userDataset);

  if (!existingClaimIds.includes(claimId)) {
    return (
      <Callout
        heading="Claim not found"
        addGoHomeButton={true}
        wrapInFullpageContainer={true}
      >
        <p>
          This url refers to a claim with the id{" "}
          <span className="font-mono">{claimId}</span> which does not exist
          (anymore).
        </p>
      </Callout>
    );
  }

  return (
    <ExistingClaimContext.Provider value={claimId}>
      {children}
    </ExistingClaimContext.Provider>
  );
}
