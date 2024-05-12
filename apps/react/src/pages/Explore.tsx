import { ROUTES } from "common";
import { getClaimUrl } from "common/src/routes";
import { useCallback, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserDataset } from "../api/userDataset";
import RequiresLogin from "../components/RequiresLogin";
import RequiresUserDataset from "../components/RequiresUserDataset";
//import Covid19VaccineForm from "../components/forms/Covid19VaccineForm";
//import ContraceptivesForm from "../components/forms/ContraceptivesForm";
import GeneralPolicyForm from "../components/forms/GeneralPolicyForm";
import { LoginContext } from "../contexts/loginContext";
import { UserDatasetContext } from "../contexts/userDatasetContext";
//import { Covid19Vaccine, Contraceptives } from "../epilog/form-adapters/_formAdapter";
import GeneralFormAdapter from "../epilog/form-adapters/generalFormAdapter";
import useSessionUser from "../hooks/useSessionUser";
import { setAfterLoginAction } from "../utils/storage";
import Container from "../components/Container";

export default function ExplorePage() {
  // TODO Infer the correct form from service param.

  // The challenge is that this page may be accessed by both, logged in and logged out users.
  // Thus, first, the generation of the default values is done two ways. Either with or without the user dataset.
  // Second, the save action differs. Either we merge with the exisitng user dataset and upload it
  // or we save the form values to the local storage and send to user to the login.
  // In any case, we then need to redirect the user to the /claim/(claimId) page.
  const { service } = useParams();
  const sessionUser = useSessionUser();

  const navigate = useNavigate();

  if (sessionUser) {
    return (
      <RequiresLogin>
        <RequiresUserDataset>
          <RenderNewClaimFormLoggedIn />
        </RequiresUserDataset>
      </RequiresLogin>
    );
  }

//  const { formAdapter } = service === "contraceptives" ? Contraceptives :
//    service === "covidVaccine" ? Covid19Vaccine : Covid19Vaccine;
if (!service) {
    return <div>Service type is required.</div>;
  }
  const formAdapter = useMemo(() => new GeneralFormAdapter(service, definemorefacts([], []), undefined, true), [service]);
  const initialFormValues = useMemo(() => formAdapter.epilogToFormValues(), [formAdapter]);


  const onClickSave = useCallback(
    (formValues: any) => {
      try {
        const { dataset } = formAdapter.formValuesToEpilog(formValues);
        const claimId = formValues.claim?.id;
        if (!claimId) {
          console.error("Claim ID is undefined.");
          return;
        }
        setAfterLoginAction({
          saveToUserDataset: dataset,
          redirectPath: ROUTES.getClaimUrl(claimId.toString()),
        });
        navigate(ROUTES.LOGIN);
      } catch (error) {
        console.error("Error processing form data:", error);
      }
    },
    [formAdapter, navigate]
  );
  

//  const onClickSave = useCallback(
//    (formValues: Covid19Vaccine.FormValues) => {
//      const formDataset = formAdapter.formValuesToEpilog(formValues);
//      setAfterLoginAction({
//        saveToUserDataset: formDataset,
//        redirectPath: ROUTES.getClaimUrl(formValues.claim.id + ""),
//      });
//      navigate(ROUTES.LOGIN);
//    },
//    [formAdapter, navigate],
//  );

  console.log("initialFormValues", initialFormValues);
  console.log("service", service);

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
//      <Covid19VaccineForm
//        defaultValues={initialFormValues}
//        onClickSave={onClickSave}
//      />
//    );
//  } else if (service === "contraceptives") {
//    return (
//      <ContraceptivesForm
//        defaultValues={initialFormValues}
//        onClickSave={onClickSave}
//      />
//    );
//  } else {
//    return <div>Service not recognized.</div>;
//  }
}

function RenderNewClaimFormLoggedIn() {
  /* ------------------------ Environmental conditions ------------------------ */
  const sessionUser = useContext(LoginContext);
  const { service } = useParams();
  const userDataset = useContext(UserDatasetContext);

  if (!sessionUser || !userDataset)
    throw new Error(
      "LoginContext and ExistingClaimContext are required. Please wrap this component in RequiresLogin and RequiresUserDataset.",
    );

  /* --------------------------------- Render --------------------------------- */

  // TODO Infer the correct form from the claim reason etc. If not enough info is available in the dataset, show the corrupted callout below.

  // TODO The code below is a copy of the code in apps/react/src/pages/Claim.tsx. Find a way to abstract away this code duplication. But note that there are two modifications here:
  // 1. The onClickSave function is different. It navigates to the claim page.
  // 2. The initialFormValues are generated differently. The second argument to epilogToFormValues is undefined, which makes the function generate a new distinct claimId.

//  const { formAdapter } = service === "contraceptives" ? Contraceptives :
//    service === "covidVaccine" ? Covid19Vaccine : Covid19Vaccine;
if (!service) {
    return <div>Service type is required.</div>;
  }
  
  const formAdapter = useMemo(() => new GeneralFormAdapter(service, userDataset, undefined, true), [service, userDataset]);
  const initialFormValues = useMemo(() => formAdapter.epilogToFormValues(userDataset), [formAdapter]);



  // Passing undefined as the second argument to epilogToFormValues will
  // make the function generate a new distinct claimId

  // TODO If the user opens the form two times, both will assume the same claimId. If one then gets saved, and then the other, the latter will overwrite the first claim.



  const { mutation } = useUserDataset(sessionUser.id);
  const navigate = useNavigate();

  const onClickSave = useCallback(
    (formValues: any) => {
      console.log("Received Form Values:", formValues);
  
      if (!formValues || !formValues.claim || typeof formValues.claim.id !== 'string') {
        console.error("Claim ID is undefined or not properly formatted. Received form values:", formValues);
        return;
      }
  
      const claimId = formValues.claim.id;  // This assumes claim.id is directly accessible and properly formatted
      const { dataset } = formAdapter.formValuesToEpilog(formValues);
  
      const mergedDataset = definemorefacts(dataset, userDataset);
      mutation.mutateAsync(mergedDataset)
        .then(() => {
          console.log("Navigating to claim with ID:", claimId);
          navigate(getClaimUrl(claimId)); // Ensure this URL construction is correct
        })
        .catch(error => console.error("Failed to submit claim:", error));
    },
    [formAdapter, navigate, userDataset, mutation]
  );
  
  

//  const onClickSave = useCallback(
//    (formValues: Covid19Vaccine.FormValues) => {
//      const formDataset = formAdapter.formValuesToEpilog(formValues);
//      const mergedDataset = definemorefacts(formDataset, userDataset);
//      mutation
//        .mutateAsync(mergedDataset)
//        .then(() => navigate(getClaimUrl(formValues.claim.id + "")));
//    },
//    [formAdapter, mutation],
//  );


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
//    return <div>Service not recognized.</div>;
//  }
}
