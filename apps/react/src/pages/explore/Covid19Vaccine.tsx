import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Constraint from "../../components/Constraint";
import ConstraintContainer from "../../components/ConstraintContainer";
import EpilogFormContainer from "../../components/EpilogFormContainer";
import InputDate from "../../components/InputDate";
import InputSelect from "../../components/InputSelect";
import InputSelectButtons from "../../components/InputSelectButtons";
import {
  ConstraintContext,
  IsConstraintLockedRecord,
  createConstraintContextData,
} from "../../contexts/ConstraintContext";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type FormData = {
  dob: Date;
  vaccinationHistory_vaccineType: string | null;
  vaccinationHistory_date: Date;
  insurance: typeof insurers;
  services: typeof vaccines;
  when: Date;
  where: typeof locations;
};

interface IsLockedRecord extends IsConstraintLockedRecord {
  dob: boolean;
  vaccinationHistory: boolean;
  insurance: boolean;
  services: boolean;
  when: boolean;
  where: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                   Consts                                   */
/* -------------------------------------------------------------------------- */

const vaccines = [
  { id: "moderna", label: "Moderna" },
  { id: "pfizer", label: "Pfizer" },
  { id: "astrazeneca", label: "AstraZeneca" },
  { id: "johnson", label: "Johnson & Johnson" },
  { id: "sinovac", label: "Sinovac" },
  { id: "sinopharm", label: "Sinopharm" },
  { id: "bharat", label: "Bharat Biotech" },
  { id: "sputnik", label: "Sputnik V" },
] as const;

const insurers = [
  { id: "cardinalCare", label: "Cardinal Care" },
  { id: "kaiserHMO", label: "Kaiser HMO" },
] as const;

const locations = [
  { id: "facility", label: "Facility" },
  { id: "physiciansOffice", label: "Physician's Office" },
  { id: "other", label: "Any other location" },
] as const;

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

const Covid19Vaccine: React.FC = () => {
  /* ------------------------------- Form logic ------------------------------- */

  const { control, watch, getValues, formState } = useForm<FormData>({
    defaultValues: {
      dob: new Date(),
      vaccinationHistory_vaccineType: null,
      vaccinationHistory_date: new Date(),
      insurance: [],
      services: [],
      when: new Date(),
      where: [],
    },
  });

  /* --------------------------- Constraint locking --------------------------- */

  const [isLockedRecord, setIsLockedRecord] = React.useState<IsLockedRecord>({
    dob: false,
    vaccinationHistory: false,
    insurance: false,
    services: false,
    when: false,
    where: false,
  });

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
        formState.touchedFields.insurance &&
        setIsLockedRecord((prev) => ({
          ...prev,
          insurance: getValues("insurance").length > 0,
        }))
      ),
    [watch("insurance")],
  );

  useEffect(
    () =>
      void (
        formState.touchedFields.services &&
        setIsLockedRecord((prev) => ({
          ...prev,
          services: getValues("services").length > 0,
        }))
      ),
    [watch("services")],
  );

  useEffect(
    () =>
      void (
        formState.dirtyFields.when &&
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
          where: getValues("where").length > 0,
        }))
      ),
    [watch("where")],
  );

  /* -------------------------------- Rendering ------------------------------- */

  return (
    <EpilogFormContainer
      title="COVID-19 Vaccine"
      onSave={() => alert("WIP")}
      __debugFormData={watch()}
    >
      <ConstraintContext.Provider value={constraintContextData}>
        <ConstraintContainer>
          <Constraint id="dob" label="Date of Birth">
            <Controller
              name="dob"
              control={control}
              render={({ field }) => <InputDate {...field} />}
            />
          </Constraint>
          <Constraint id="vaccinationHistory" label="Vaccination History">
            <Controller
              name="vaccinationHistory_vaccineType"
              control={control}
              render={({ field }) => (
                <InputSelect
                  {...field}
                  options={vaccines}
                  placeholder="Select your most recent vaccine"
                />
              )}
            />
            <Controller
              name="vaccinationHistory_date"
              control={control}
              render={({ field }) => <InputDate {...field} />}
            />
          </Constraint>
          <Constraint id="insurance" label="Insurance">
            <Controller
              name="insurance"
              control={control}
              render={({ field }) => (
                <InputSelectButtons {...field} options={insurers} />
              )}
            />
          </Constraint>
          <Constraint id="services" label="Services">
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <InputSelectButtons {...field} options={vaccines} />
              )}
            />
          </Constraint>
          <Constraint id="when" label="When">
            <Controller
              name="when"
              control={control}
              render={({ field }) => <InputDate {...field} />}
            />
          </Constraint>
          <Constraint id="where" label="Where">
            <Controller
              name="where"
              control={control}
              render={({ field }) => (
                <InputSelectButtons {...field} options={locations} />
              )}
            />
          </Constraint>
        </ConstraintContainer>
      </ConstraintContext.Provider>
    </EpilogFormContainer>
  );
};

export default Covid19Vaccine;
