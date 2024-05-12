import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Constraint from "../../components/Constraint";
import ConstraintContainer from "../../components/ConstraintContainer";
import EpilogFormContainer from "../../components/EpilogFormContainer";
import InputDate from "../../components/InputDate";
import InputSelectButtons from "../../components/InputSelectButtons";
import { CONTRACEPTIVE_OPTIONS, LOCATIONS } from "../../consts/options.const";
import { Contraceptives } from "../../epilog/form-adapters/_formAdapter";
import useIsCovered from "../../hooks/useIsCovered";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

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

  const { control, watch, getValues } =
    useForm<Contraceptives.FormValues>({
      defaultValues,
    });

  const onClickSaveCallback = useCallback(
    () => onClickSave(getValues()),
    [onClickSave, getValues],
  );

  /* -------------------------------- IsCovered ------------------------------- */

  const formDataset = useMemo(
    () => Contraceptives.formAdapter.formValuesToEpilog(getValues()),
    [JSON.stringify(watch())],
  );

  let allInputsEntered = useMemo(() => {
    const formValues = getValues();

    return (
      formValues.contraceptiveService !== null &&
      formValues.when !== null &&
      formValues.where !== null
    );
  }, [watch("contraceptiveService"), watch("when"), watch("where")]);

  const isCovered = useIsCovered(defaultValues.claim.id + "", formDataset);

  /* -------------------------------- Rendering ------------------------------- */

  return (
    <EpilogFormContainer
      title="Contraceptives"
      onSave={onClickSaveCallback}
      isCovered={allInputsEntered ? isCovered : undefined}
      __debugFormData={watch()}
    >
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
          <Constraint
            id="services"
            label="What contraceptive service did you have performed?"
          >
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
    </EpilogFormContainer>
  );
}
