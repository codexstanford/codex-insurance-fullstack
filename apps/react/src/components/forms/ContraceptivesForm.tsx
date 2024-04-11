import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Constraint from "../../components/Constraint";
import ConstraintContainer from "../../components/ConstraintContainer";
import EpilogFormContainer from "../../components/EpilogFormContainer";
import InputDate from "../../components/InputDate";
import InputSelect from "../../components/InputSelect";
import InputSelectButtons from "../../components/InputSelectButtons";
import { CONTRACEPTIVE_OPTIONS, LOCATIONS } from "../../consts/options.const";
import {
  ConstraintContext,
  IsConstraintLockedRecord,
  createConstraintContextData,
} from "../../contexts/constraintContext";
import { Contraceptives } from "../../epilog/form-adapters/_formAdapter";
import useIsCovered from "../../hooks/useIsCovered";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface IsLockedRecord extends IsConstraintLockedRecord {
  insurance: boolean;
  services: boolean;
  when: boolean;
  where: boolean;
}

type Input = {
  defaultValues: Contraceptives.FormValues;
  onClickSave: (formValues: Contraceptives.FormValues) => void;
};

/* -------------------------------------------------------------------------- */
/*                                 Compontnet                                 */
/* -------------------------------------------------------------------------- */

export default function ContraceptivesForm({
  defaultValues,
  onClickSave,
}: Input) {
  /* ------------------------------- Form logic ------------------------------- */

  const { control, watch, getValues, formState } =
    useForm<Contraceptives.FormValues>({
      defaultValues,
    });

  const onClickSaveCallback = useCallback(
    () => onClickSave(getValues()),
    [onClickSave, getValues],
  );

  /* --------------------------- Constraint locking --------------------------- */

  const [isLockedRecord, setIsLockedRecord] = useState<IsLockedRecord>({
    insurance: false,
    services: false,
    when: false,
    where: false,
  });

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
    () => Contraceptives.formAdapter.formValuesToEpilog(getValues()),
    [JSON.stringify(watch())],
  );

  let allInputsEntered = useMemo(
    () => {
      const formValues = getValues();

      return formValues.contraceptiveService !== null && 
        formValues.when !== null &&
        formValues.where !== null;
    },
    [watch("contraceptiveService"), watch("when"), watch("where")]
  );

  const isCovered = useIsCovered(defaultValues.claim.id + "", formDataset);

  /* -------------------------------- Rendering ------------------------------- */

  return (
    <EpilogFormContainer
      title="Contraceptives"
      onSave={onClickSaveCallback}
      isCovered={allInputsEntered ? isCovered : undefined}
      __debugFormData={watch()}
    >
      <ConstraintContext.Provider value={constraintContextData}>
        <ConstraintContainer>
          {/*<Constraint id="insurance" label="Insurance">
            <Controller
              name="policyType"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelectButtons
                  {...field}
                  options={Contraceptives.POLICY_TYPE_OPTIONS}
                />
              )}
            />
          </Constraint>*/}
          <Constraint id="services" label="What contraceptive service did you have performed?">
            <Controller
              name="contraceptiveService"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelectButtons
                  {...field}
                  options={CONTRACEPTIVE_OPTIONS}
                />
              )}
            />
          </Constraint>
          <Constraint id="when" label="When was the service performed?">
            <Controller
              name="when"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputDate {...field} />
              )}
            />
          </Constraint>
          <Constraint id="where" label="Where was the service performed?">
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
