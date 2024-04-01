import { ROUTES } from "common";
import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequiresExistingClaim from "../components/RequiresExistingClaim";
import RequiresLogin from "../components/RequiresLogin";
import RequiresUserDataset from "../components/RequiresUserDataset";
import Covid19VaccineForm from "../components/forms/Covid19VaccineForm";
import { ExistingClaimContext } from "../contexts/existingClaimContext";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import { Covid19Vaccine } from "../epilog/form-adapters/_formAdapter";
import useClaimIdParam from "../hooks/useClaimIdParam";
import { useUserDataset } from "../api/userDataset";
import { LoginContext } from "../contexts/loginContext";

/* -------------------------------------------------------------------------- */
/*                               Top level comp                               */
/* -------------------------------------------------------------------------- */

export default function ClaimPage() {
  const claimId = useClaimIdParam();
  const navigate = useNavigate();

  useEffect(() => {
    if (!claimId) navigate(ROUTES.INDEX);
  });

  if (!claimId) return <></>;

  return (
    <RequiresLogin>
      <RequiresUserDataset>
        <RequiresExistingClaim claimId={claimId}>
          <RenderClaimForm />
        </RequiresExistingClaim>
      </RequiresUserDataset>
    </RequiresLogin>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Second level comp                             */
/* -------------------------------------------------------------------------- */

function RenderClaimForm() {
  /* ------------------------ Environmental conditions ------------------------ */

  const sessionUser = useContext(LoginContext);
  const userDataset = useContext(UserDatasetContext);
  const existingClaimId = useContext(ExistingClaimContext);

  if (!sessionUser || !userDataset || !existingClaimId)
    throw new Error(
      "LoginContext, UserDatasetContext and ExistingClaimContext are required. Please wrap this component in RequiresLogin, RequiresUserDataset and RequiresExistingClaim.",
    );

  /* --------------------------------- Render --------------------------------- */

  // TODO Infer the correct form from the claim reason etc. If not enough info is available in the dataset, show the corrupted callout below.

  const { formAdapter } = Covid19Vaccine;

  const initialFormValues = formAdapter.epilogToFormValues(
    userDataset,
    existingClaimId,
  );

  const { mutation } = useUserDataset(sessionUser.id);

  const onClickSave = useCallback(
    (formValues: Covid19Vaccine.FormValues) => {
      const formDataset = formAdapter.formValuesToEpilog(formValues);
      const mergedDataset = definemorefacts(formDataset, userDataset);
      mutation.mutate(mergedDataset);
      // TODO Test if, because of this mutation, a re-render of RequiresUserDataset is triggered.
    },
    [formAdapter, mutation],
  );

  return (
    <Covid19VaccineForm
      defaultValues={initialFormValues}
      onClickSave={onClickSave}
    />
  );
}

/* 
function CorruptedCallout() {
  return (
    <Callout heading="Claim data is corrupted">
      <p>
        This url refers to a claim whose data is corrupted. Unfortunately it can
        therefore not be displayed.
      </p>
      <ButtonLink href={ROUTES.INDEX}>Go to home page</ButtonLink>
    </Callout>
  );
}
 */
