import { MinusIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { COMMON_FOCUS_CLASSES } from "../../consts/classes.const";
import { LOCATIONS, YES_OR_NO } from "../../consts/options.const";
import {
  ConstraintContext,
  IsConstraintLockedRecord,
  createConstraintContextData,
} from "../../contexts/constraintContext";
import { Covid19Vaccine } from "../../epilog/form-adapters/_formAdapter";
import { VACCINE_HISTORY_OPTIONS, VACCINE_OPTIONS } from "../../epilog/form-adapters/covid19VaccineAdapter";
import useIsCovered from "../../hooks/useIsCovered";
import { BasicOption } from "../../types/basicOption";
import { classNames } from "../../utils/classNames";
import Constraint from "../Constraint";
import ConstraintContainer from "../ConstraintContainer";
import EpilogFormContainer from "../EpilogFormContainer";
import InputDate from "../InputDate";
import InputSelectButtons from "../InputSelectButtons";

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

  // https://react-hook-form.com/docs/usefieldarray

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vaccinationHistory_vaccineTypes",
  });

  const onClickSaveCallback = useCallback(
    () => onClickSave(getValues()),
    [onClickSave, getValues],
  );

  const onClickAddVaccinationHistoryType = useCallback(
    () =>
      append(
        VACCINE_HISTORY_OPTIONS.find((option) => option.id === "other") as BasicOption,
      ),
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
        formState.touchedFields.vaccinationHistory_vaccineTypes &&
        getValues("vaccinationHistory_vaccineTypes").length > 0 &&
        setIsLockedRecord((prev) => ({ ...prev, vaccinationHistory: true }))
      ),
    [
      watch("vaccinationHistory_vaccineTypes"),
      formState.touchedFields.vaccinationHistory_vaccineTypes,
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

  let allInputsEntered = useMemo(
    () => {
      const formValues = getValues();

      return formValues.dob !== null && 
        formValues.isPersonImmunocompromised !== null && 
        formValues.vaccineBrand !== null &&
        formValues.when !== null &&
        formValues.where !== null;
    },
    [watch("dob"), watch("isPersonImmunocompromised"), watch("vaccineBrand"), watch("when"), watch("where")]
  );

  const isCovered = useIsCovered(defaultValues.claim.id + "", formDataset)


  /* -------------------------------- Rendering ------------------------------- */

  return (
    <EpilogFormContainer
      title="COVID-19 Vaccine"
      onSave={onClickSaveCallback}
      isCovered={allInputsEntered ? isCovered : undefined}
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
            label="Are you immunocompromised?"
          >
            <Controller
              name="isPersonImmunocompromised"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelectButtons {...field} options={YES_OR_NO} />
              )}
            />
          </Constraint>
          <Constraint
            id="vaccinationHistory"
            label="Vaccination History"
            onClickAddField={onClickAddVaccinationHistoryType}
          >
            <p>Add an entry for each Covid vaccine you've received. 
            If you received it before September 11, 2023, indicate its type.
            If it was the most recent formulation (i.e. received since September 11, 2023), indicate that instead.</p>
            {fields.map((field, index) => (
              <Controller
                key={field.id}
                name={`vaccinationHistory_vaccineTypes.${index}`}
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <div className="last:border-b-0 border-b-2 pb-2 flex flex-row items-center">
                    <InputSelectButtons
                      {...field}
                      options={Covid19Vaccine.VACCINE_HISTORY_OPTIONS}
                      canDeselect = {false}
                    />
                    <button
                      onClick={() => remove(index)}
                      className={classNames(
                        COMMON_FOCUS_CLASSES,
                        "border border-black rounded-full size-8 flex items-center justify-center ml-auto",
                      )}
                    >
                      <MinusIcon className="size-4 " />
                    </button>
                  </div>
                )}
              />
            ))}
          </Constraint>
          {/*<Constraint id="insurance" label="Insurance">
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
          </Constraint>*/}
          <Constraint id="services" label="What brand of vaccine did you receive?">
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
          <Constraint id="when" label="When was the vaccination performed?">
            <Controller
              name="when"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputDate {...field} />
              )}
            />
          </Constraint>
          <Constraint id="where" label="Where was the vaccine administered?">
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
