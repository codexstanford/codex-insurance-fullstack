import { FieldValues } from "react-hook-form";

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
/*                               Export adapters                              */
/* -------------------------------------------------------------------------- */

export * as Covid19Vaccine from "./covid19VaccineAdapter";
