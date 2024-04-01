import { FieldValues } from "react-hook-form";
import { useUserDataset } from "../../api/userDataset";
import useSessionUser from "../../hooks/useSessionUser";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPreservedUserDataset } from "../../utils/storage";
import { ROUTES } from "common";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface FormAdapter<T extends FieldValues> {
  epilogToFormValues: (
    epilogDataset: ReturnType<typeof definemorefacts>,
    claimId?: string,
  ) => T;
  formValuesToEpilog: (values: T) => ReturnType<typeof definemorefacts>;
}

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

/** @deprecated */
export const useFormAdapter = <T extends FieldValues>(
  formAdapter: FormAdapter<T>,
  claimId?: string,
) => {
  const sessionUser = useSessionUser();

  const { query, mutation, userDataset } = useUserDataset(
    sessionUser?.id || -1,
  );

  const initialFormValues = useMemo(() => {
    const res = formAdapter.epilogToFormValues(userDataset || [], claimId);
    /*     console.debug(
      `Initial form values for claimId "${claimId}" and the user ${sessionUser ? "BEING" : "NOT BEING"} logged in:`,
      res,
    ); */
    return res;
  }, [userDataset, claimId, formAdapter]);

  const [formValues, setFormValues] = useState(initialFormValues);

  const formDataset = useMemo(() => {
    const dataset = formAdapter.formValuesToEpilog(formValues);
    // console.debug(`Generated form dataset:`, dataset);
    return dataset;
  }, [formAdapter, formValues]);

  const formEpilogString = useMemo(() => grindem(formDataset), [formDataset]);

  const navigate = useNavigate();

  const saveChanges = useCallback(() => {
    if (sessionUser) {
      mutation.mutate(formDataset);
      return;
    }
    setPreservedUserDataset(formDataset);
    navigate(ROUTES.LOGIN);
  }, [mutation, formDataset, sessionUser, navigate]);

  return {
    initialFormValues,
    setFormValues,
    formDataset,
    formEpilogString,
    saveChanges,
    query,
    mutation,
  } as const;
};

export * as Covid19Vaccine from "./covid19VaccineAdapter";
