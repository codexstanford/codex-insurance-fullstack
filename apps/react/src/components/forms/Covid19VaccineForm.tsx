import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Constraint from "../Constraint";
import ConstraintContainer from "../ConstraintContainer";
import EpilogFormContainer from "../EpilogFormContainer";
import InputDate from "../InputDate";
import InputSelect from "../InputSelect";
import InputSelectButtons from "../InputSelectButtons";
import { LOCATIONS, YES_OR_NO } from "../../consts/options.const";
import {
  ConstraintContext,
  IsConstraintLockedRecord,
  createConstraintContextData,
} from "../../contexts/constraintContext";
import { Covid19Vaccine } from "../../epilog/form-adapters/_formAdapter";
import useIsCovered from "../../hooks/useIsCovered";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface IsLockedRecord extends IsConstraintLockedRecord {
  dob: boolean;
  isPersonImmunocompromised: boolean;
  vaccinationHistory: boolean;
  insurance: boolean;
  services: boolean;
  when: boolean;
  where: boolean;
}

type Input = {
  defaultValues: Covid19Vaccine.FormValues;
  onClickSave: (formValues: Covid19Vaccine.FormValues) => void;
};

/* -------------------------------------------------------------------------- */
/*                                 Compontnet                                 */
/* -------------------------------------------------------------------------- */

export default function Covid19VaccineForm({
  defaultValues,
  onClickSave,
}: Input) {
  /* ------------------------------- Form logic ------------------------------- */

  const { control, watch, getValues, formState } =
    useForm<Covid19Vaccine.FormValues>({
      defaultValues,
    });

  const onClickSaveCallback = useCallback(
    () => onClickSave(getValues()),
    [onClickSave, getValues],
  );

  /* --------------------------- Constraint locking --------------------------- */

  const [isLockedRecord, setIsLockedRecord] = useState<IsLockedRecord>({
    dob: false,
    isPersonImmunocompromised: false,
    vaccinationHistory: false,
    insurance: false,
    services: false,
    when: false,
    where: false,
  });

  useEffect(
    () =>
      void (
        formState.dirtyFields.dob &&
        setIsLockedRecord((prev) => ({ ...prev, dob: true }))
      ),
    [watch("dob"), formState.dirtyFields.dob],
  );

  useEffect(
    () =>
      void (
        formState.dirtyFields.isPersonImmunocompromised &&
        setIsLockedRecord((prev) => ({
          ...prev,
          isPersonImmunocompromised: true,
        }))
      ),
    [
      watch("isPersonImmunocompromised"),
      formState.dirtyFields.isPersonImmunocompromised,
    ],
  );

  useEffect(
    () =>
      void (
        formState.touchedFields.vaccinationHistory_vaccineType &&
        formState.touchedFields.vaccinationHistory_date &&
        getValues("vaccinationHistory_vaccineType") &&
        setIsLockedRecord((prev) => ({ ...prev, vaccinationHistory: true }))
      ),
    [
      watch("vaccinationHistory_vaccineType"),
      watch("vaccinationHistory_date"),
      formState.touchedFields.vaccinationHistory_vaccineType,
      formState.touchedFields.vaccinationHistory_date,
    ],
  );

  useEffect(
    () =>
      void (
        formState.touchedFields.policyType &&
        setIsLockedRecord((prev) => ({
          ...prev,
          insurance:
            !!getValues(
              "policyType.id",
            ) /* if changed to multiple again: remove !! and append .length > 0 */,
        }))
      ),
    [watch("policyType"), formState.touchedFields.policyType],
  );

  const constraintContextData = useMemo(
    () => createConstraintContextData(isLockedRecord, setIsLockedRecord),
    [isLockedRecord, setIsLockedRecord],
  );

  useEffect(
    () =>
      void (
        formState.dirtyFields.dob &&
        setIsLockedRecord((prev) => ({ ...prev, dob: true }))
      ),
    [watch("dob")],
  );

  useEffect(
    () =>
      void (
        formState.touchedFields.vaccinationHistory_vaccineType &&
        formState.touchedFields.vaccinationHistory_date &&
        getValues("vaccinationHistory_vaccineType") &&
        setIsLockedRecord((prev) => ({ ...prev, vaccinationHistory: true }))
      ),
    [watch("vaccinationHistory_vaccineType"), watch("vaccinationHistory_date")],
  );

  useEffect(
    () =>
      void (
        formState.touchedFields.policyType &&
        setIsLockedRecord((prev) => ({
          ...prev,
          insurance:
            !!getValues(
              "policyType.id",
            ) /* if changed to multiple again: remove !! and append .length > 0 */,
        }))
      ),
    [watch("policyType")],
  );

  useEffect(
    () =>
      void (
        formState.touchedFields.vaccineBrand &&
        setIsLockedRecord((prev) => ({
          ...prev,
          services:
            !!getValues(
              "vaccineBrand.id",
            ) /* if changed to multiple again: remove !! and append .length > 0 */,
        }))
      ),
    [watch("vaccineBrand")],
  );

  useEffect(
    () =>
      void (
        formState.touchedFields.when &&
        setIsLockedRecord((prev) => ({ ...prev, when: true }))
      ),
    [watch("when")],
  );

  useEffect(
    () =>
      void (
        formState.touchedFields.where &&
        setIsLockedRecord((prev) => ({
          ...prev,
          where:
            !!getValues(
              "where",
            ) /* if changed to multiple again: remove !! and append .length > 0 */,
        }))
      ),
    [watch("where")],
  );

  /* -------------------------------- IsCovered ------------------------------- */

  const formDataset = useMemo(
    () => Covid19Vaccine.formAdapter.formValuesToEpilog(getValues()),
    [JSON.stringify(watch())],
  );

  const isCovered = useIsCovered(defaultValues.claim.id + "", formDataset);

  /* -------------------------------- Rendering ------------------------------- */

  return (
    <EpilogFormContainer
      title="COVID-19 Vaccine"
      onSave={onClickSaveCallback}
      isCovered={isCovered}
      __debugFormData={watch()}
    >
      <ConstraintContext.Provider value={constraintContextData}>
        <ConstraintContainer>
          <Constraint id="dob" label="Date of Birth">
            <Controller
              name="dob"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputDate {...field} />
              )}
            />
          </Constraint>
          <Constraint
            id="isPersonImmunocompromised"
            label="Is person immunocompromised?"
          >
            <Controller
              name="isPersonImmunocompromised"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelectButtons {...field} options={YES_OR_NO} />
              )}
            />
          </Constraint>
          <Constraint id="vaccinationHistory" label="Vaccination History">
            <Controller
              name="vaccinationHistory_vaccineType"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelect
                  {...field}
                  options={Covid19Vaccine.VACCINE_OPTIONS}
                  placeholder="Select your most recent vaccine"
                />
              )}
            />
            <Controller
              name="vaccinationHistory_date"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputDate {...field} />
              )}
            />
          </Constraint>
          <Constraint id="insurance" label="Insurance">
            <Controller
              name="policyType"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelectButtons
                  {...field}
                  options={Covid19Vaccine.POLICY_TYPE_OPTIONS}
                />
              )}
            />
          </Constraint>
          <Constraint id="services" label="Services">
            <Controller
              name="vaccineBrand"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelectButtons
                  {...field}
                  options={Covid19Vaccine.VACCINE_OPTIONS}
                />
              )}
            />
          </Constraint>
          <Constraint id="when" label="When">
            <Controller
              name="when"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputDate {...field} />
              )}
            />
          </Constraint>
          <Constraint id="where" label="Where">
            <Controller
              name="where"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelectButtons {...field} options={LOCATIONS} />
              )}
            />
          </Constraint>
        </ConstraintContainer>
      </ConstraintContext.Provider>
    </EpilogFormContainer>
  );
}
