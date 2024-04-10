import { ROUTES } from "common";
import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequiresExistingClaim from "../components/RequiresExistingClaim";
import RequiresLogin from "../components/RequiresLogin";
import RequiresUserDataset from "../components/RequiresUserDataset";
import Covid19VaccineForm from "../components/forms/Covid19VaccineForm";
import ContraceptivesForm from "../components/forms/ContraceptivesForm";
import { ExistingClaimContext } from "../contexts/existingClaimContext";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import { Covid19Vaccine, Contraceptives } from "../epilog/form-adapters/_formAdapter";
import useIdParam from "../hooks/useClaimIdParam";
import { useUserDataset } from "../api/userDataset";
import { LoginContext } from "../contexts/loginContext";
import Container from "../components/Container";

/* -------------------------------------------------------------------------- */
/*                               Top level comp                               */
/* -------------------------------------------------------------------------- */

export default function ClaimPage() {
  const claimId = useIdParam("claim");
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

  console.log("render claim form is being called")
  const sessionUser = useContext(LoginContext);
  const userDataset = useContext(UserDatasetContext);
  const existingClaimId = useContext(ExistingClaimContext);

  if (!sessionUser || !userDataset || !existingClaimId)
    throw new Error(
      "LoginContext, UserDatasetContext and ExistingClaimContext are required. Please wrap this component in RequiresLogin, RequiresUserDataset and RequiresExistingClaim.",
    );

  /* --------------------------------- Render --------------------------------- */

  // TODO Infer the correct form from the claim reason etc. If not enough info is available in the dataset, show the corrupted callout below.

  const service = compfinds("X", read(`claim.service_type(${existingClaimId}, X)`), definemorefacts([], userDataset), [])[0];

  const { formAdapter } = service === "contraceptives" ? Contraceptives :
    service === "covidVaccine" ? Covid19Vaccine : Covid19Vaccine;

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

  console.log("SERVICE:", service);

  if (service === "\"covidVaccine\"") {
    return (
      <Container addVerticalPadding={true}>
        <Covid19VaccineForm
          defaultValues={initialFormValues}
          onClickSave={onClickSave}
        />
      </Container>
    );
  } else if (service === "\"contraceptives\"") {
    return (
      <Container addVerticalPadding={true}>
        <ContraceptivesForm
          defaultValues={initialFormValues}
          onClickSave={onClickSave}
        />
      </Container>
    );
  } else {
    return <div>Service not recognized.</div>;
  }
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
