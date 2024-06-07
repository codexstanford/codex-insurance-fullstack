import { ROUTES } from "common";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import RequiresExistingClaim from "../components/RequiresExistingClaim";
import RequiresLogin from "../components/RequiresLogin";
import RequiresUserDataset from "../components/RequiresUserDataset";
//import Covid19VaccineForm from "../components/forms/Covid19VaccineForm";
//import ContraceptivesForm from "../components/forms/ContraceptivesForm";
import GeneralPolicyForm from "../components/forms/GeneralPolicyForm";
import { ExistingClaimContext } from "../contexts/existingClaimContext";
import { UserDatasetContext } from "../contexts/userDatasetContext";
//import { Covid19Vaccine, Contraceptives } from "../epilog/form-adapters/_formAdapter";
import GeneralFormAdapter from "../epilog/form-adapters/generalFormAdapter";
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
  console.log("claimIdOnClaimSinglePage", claimId);

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

  // console.log("render claim form is being called")
  const sessionUser = useContext(LoginContext);
  const userDataset = useContext(UserDatasetContext);
  const existingClaimId = useContext(ExistingClaimContext);
  const navigate = useNavigate();


  if (!sessionUser || !userDataset || !existingClaimId)
    throw new Error(
      "LoginContext, UserDatasetContext and ExistingClaimContext are required. Please wrap this component in RequiresLogin, RequiresUserDataset and RequiresExistingClaim.",
    );

  /* --------------------------------- Render --------------------------------- */

  // TODO Infer the correct form from the claim reason etc. If not enough info is available in the dataset, show the corrupted callout below.

  const service = useMemo(() => {
    console.log("userDatasetInUseMemo()", userDataset);
    const rawService = compfinds("X", read(`claim.service_type(${existingClaimId}, X)`), definemorefacts([], userDataset), [])[0];
    console.log("rawService", rawService);
    return (typeof rawService === 'string' ? rawService.slice(1, -1) : "contraceptives");  // Default if undefined or not string
  }, [existingClaimId, userDataset]);


  const formAdapter = useMemo(() => new GeneralFormAdapter(service, userDataset, existingClaimId, true), [service, userDataset, existingClaimId]);

  console.log("userDatasetBeforeInitialFormValues", userDataset);
  const initialFormValues = formAdapter.epilogToFormValues(
    userDataset,
    existingClaimId,
  );
  console.log("initialFormValuesInClaimSingle", initialFormValues);

//  const { formAdapter } = service === "contraceptives" ? Contraceptives :
//    service === "covidVaccine" ? Covid19Vaccine : Covid19Vaccine;

//  const initialFormValues = formAdapter.epilogToFormValues(
//    userDataset,
//    existingClaimId,
//  );


  const { mutation } = useUserDataset(sessionUser.id);

//  const covid19OnClickSave = useCallback(
//    (formValues: Covid19Vaccine.FormValues) => {
//      const formDataset = formAdapter.formValuesToEpilog(formValues);
//      const mergedDataset = definemorefacts(formDataset, userDataset);
//      mutation.mutate(mergedDataset);
//      // TODO Test if, because of this mutation, a re-render of RequiresUserDataset is triggered.
//    },
//    [formAdapter, mutation],
//  );

//  const contraceptivesOnClickSave = useCallback(
//    (formValues: Contraceptives.FormValues) => {
//      const formDataset = formAdapter.formValuesToEpilog(formValues);
//      const mergedDataset = definemorefacts(formDataset, userDataset);
//      mutation.mutate(mergedDataset);
//      // TODO Test if, because of this mutation, a re-render of RequiresUserDataset is triggered.
//    },
//    [formAdapter, mutation],
//  );

//  const onClickSave = 
//  service === "contraceptives" ? contraceptivesOnClickSave : 
//    service === "covidVaccine" ? covid19OnClickSave : covid19OnClickSave;

  // console.log("SERVICE:", service);

  const onClickSave = useCallback(
    (formValues: any) => { // Adjust the type here as needed
    console.log("currentformValues in ClaimSingle", formValues);
      const dataset  = formAdapter.formValuesToEpilog(formValues);
      console.log("current dataset", dataset);
      const mergedDataset = definemorefacts(dataset, userDataset);
      console.log("current mergedDataset", mergedDataset);
      mutation.mutateAsync(mergedDataset)
      .then(() => navigate(ROUTES.getClaimUrl(formValues.claim.id.toString())))
      .catch((error: any) => console.error("Failed to submit claim:", error));
    },
    [formAdapter, mutation, navigate, userDataset]
  );

  return (
    <Container addVerticalPadding={true}>
      <GeneralPolicyForm
        policyType={service}
        defaultValues={initialFormValues}
        onClickSave={onClickSave}
      />
    </Container>
  );
  



//  if (service === "covidVaccine") {
//    return (
//      <Container addVerticalPadding={true}>
//        <Covid19VaccineForm
//          defaultValues={initialFormValues}
//          onClickSave={onClickSave}
//        />
//      </Container>
//    );
//  } else if (service === "contraceptives") {
//    return (
//      <Container addVerticalPadding={true}>
//        <ContraceptivesForm
//          defaultValues={initialFormValues}
//          onClickSave={onClickSave}
//        />
//      </Container>
//    );
//  } else {
//    console.log("service not recognized in ClaimSingle");
//    return <div>Service not recognized.</div>;
//  }
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
