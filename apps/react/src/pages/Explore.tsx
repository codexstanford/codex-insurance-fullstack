import { ROUTES } from "common";
import { getClaimUrl } from "common/src/routes";
import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDataset } from "../api/userDataset";
import RequiresLogin from "../components/RequiresLogin";
import RequiresUserDataset from "../components/RequiresUserDataset";
import Covid19VaccineForm from "../components/forms/Covid19VaccineForm";
import { LoginContext } from "../contexts/loginContext";
import { UserDatasetContext } from "../contexts/userDatasetContext";
import { Covid19Vaccine } from "../epilog/form-adapters/_formAdapter";
import useSessionUser from "../hooks/useSessionUser";
import { setPreservedUserDataset } from "../utils/storage";

export default function ExplorePage() {
  // TODO Infer the correct form from service param.

  // The challenge is that this page may be accessed by both, logged in and logged out users.
  // Thus, first, the generation of the default values is done two ways. Either with or without the user dataset.
  // Second, the save action differs. Either we merge with the exisitng user dataset and upload it
  // or we save the form values to the local storage and send to user to the login.
  // In any case, we then need to redirect the user to the /claim/(claimId) page.

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

  const { formAdapter } = Covid19Vaccine;

  const initialFormValues = formAdapter.epilogToFormValues([]);

  const onClickSave = useCallback(
    (formValues: Covid19Vaccine.FormValues) => {
      const formDataset = formAdapter.formValuesToEpilog(formValues);
      setPreservedUserDataset(formDataset);
      navigate(
        ROUTES.getLoginWithRedirectUrl(
          ROUTES.getClaimUrl(formValues.claim.id + ""),
        ),
      );
    },
    [formAdapter, navigate],
  );

  return (
    <Covid19VaccineForm
      defaultValues={initialFormValues}
      onClickSave={onClickSave}
    />
  );
}

function RenderNewClaimFormLoggedIn() {
  /* ------------------------ Environmental conditions ------------------------ */
  const sessionUser = useContext(LoginContext);
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

  const { formAdapter } = Covid19Vaccine;

  // Passing undefined as the second argument to epilogToFormValues will
  // make the function generate a new distinct claimId

  // TODO If the user opens the form two times, both will assume the same claimId. If one then gets saved, and then the other, the latter will overwrite the first claim.

  const initialFormValues = formAdapter.epilogToFormValues(
    userDataset,
    undefined,
  );

  const { mutation } = useUserDataset(sessionUser.id);
  const navigate = useNavigate();

  const onClickSave = useCallback(
    (formValues: Covid19Vaccine.FormValues) => {
      const formDataset = formAdapter.formValuesToEpilog(formValues);
      const mergedDataset = definemorefacts(formDataset, userDataset);
      mutation
        .mutateAsync(mergedDataset)
        .then(() => navigate(getClaimUrl(formValues.claim.id + "")));
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
