import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Constraint from "../../components/Constraint";
import ConstraintContainer from "../../components/ConstraintContainer";
import EpilogFormContainer from "../../components/EpilogFormContainer";
import InputDate from "../../components/InputDate";
import InputSelect from "../../components/InputSelect";
import InputSelectButtons from "../../components/InputSelectButtons";
import { LOCATIONS } from "../../consts/locations.const";
import {
  ConstraintContext,
  IsConstraintLockedRecord,
  createConstraintContextData,
} from "../../contexts/ConstraintContext";
import {
  dateToString,
  getFirstOrNextId,
  timeOfDateToString,
} from "../../utils/epilogUtils";
import { DateTime } from "luxon";
import { EPILOG_COMMON_DATASET } from "../../consts/dataset.const";
import { EPILOG_RULESET } from "../../consts/ruleset.const";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type FormData = {
  dob: Date;
  vaccinationHistory_vaccineType: (typeof vaccines)[number] | null;
  vaccinationHistory_date: Date;
  insurance: (typeof insurers)[number] | null; // Remove [number] | null to allow multiple selection later on
  services: (typeof vaccines)[number] | null;
  when: Date;
  where: (typeof LOCATIONS)[number] | null;
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
] as const;

const insurers = [
  { id: "cardinalCare", label: "Cardinal Care" },
  { id: "kaiserHMO", label: "Kaiser HMO" },
] as const;

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

const Covid19Vaccine: React.FC = () => {
  /* ------------------------------- Form logic ------------------------------- */

  const { control, watch, getValues, formState } = useForm<FormData>({
    defaultValues: {
      dob: DateTime.now().minus({ years: 25 }).toJSDate(),
      vaccinationHistory_vaccineType: null,
      vaccinationHistory_date: new Date(),
      insurance: null,
      services: null,
      when: new Date(),
      where: null,
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
          insurance:
            !!getValues(
              "insurance",
            ) /* if changed to multiple again: remove !! and append .length > 0 */,
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
          services:
            !!getValues(
              "services",
            ) /* if changed to multiple again: remove !! and append .length > 0 */,
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
          where:
            !!getValues(
              "where",
            ) /* if changed to multiple again: remove !! and append .length > 0 */,
        }))
      ),
    [watch("where")],
  );

  /* --------------------------------- Epilog --------------------------------- */

  const epilogRepresentation = useMemo(() => {
    const person = getFirstOrNextId("person", []);
    const policy = getFirstOrNextId("policy", []);
    const claim = getFirstOrNextId("claim", []);

    const claimDate = new Date();
    const claimDateStr = dateToString(claimDate);
    const claimTimeStr = timeOfDateToString(claimDate);

    const dob = dateToString(getValues("dob"));

    const vaccine = getValues("services.id") || "nil";

    const location = getValues("where.id") || "nil";

    const vaccinationHistory_vaccineType = getValues(
      "vaccinationHistory_vaccineType",
    );

    return `
    person(${person})
    policy(${policy})
    claim(${claim})

    person.dob(${person}, ${dob})
    person.occupation(${person}, other)
    person.immunocompromised(${person}, no)

    policy.type(${policy}, cardinal)
    policy.insuree(${policy}, ${person})
    policy.startdate(${policy}, ${person}, 01_08_2023)
    policy.enddate(${policy}, ${person}, 30_06_2024)

    claim.policy(${claim}, ${policy})
    claim.claimant(${claim}, ${person})
    claim.time(${claim}, ${claimDateStr}, ${claimTimeStr})
    claim.hosp_start_time(${claim}, 03_09_2023, 00_00)
    claim.hosp_end_time(${claim}, 03_09_2023, 01_13)
    claim.hospital(${claim}, stanford_medical_center)
    claim.reason(${claim}, preventive_care)
    claim.vaccine(${claim}, covid)
    claim.vaccine_brand(${claim}, ${vaccine})
    claim.vaccine_dose_count(${claim}, 2)
    claim.consequence_of_occupation(${claim}, no)
    claim.location(${claim}, ${location})
    claim.previous_vaccines_pfizer(${claim}, ${vaccinationHistory_vaccineType?.id === "pfizer" ? 1 : 0})
    claim.previous_vaccines_moderna(${claim}, ${vaccinationHistory_vaccineType?.id === "moderna" ? 1 : 0})
    claim.previous_vaccines_other(${claim}, ${vaccinationHistory_vaccineType && vaccinationHistory_vaccineType.id !== "pfizer" && vaccinationHistory_vaccineType?.id !== "moderna" ? 1 : 0})
    `;
  }, [watch()]);

  const isCovered = useMemo(() => {
    const claim = getFirstOrNextId("claim", []);

    const query = read(`covered(${claim})`);

    const facts = definemorefacts(
      EPILOG_COMMON_DATASET,
      readdata(epilogRepresentation),
    );

    console.log("QUERY", query);
    console.log("FACTS", facts);
    console.log("RULESET", EPILOG_RULESET);

    // TODO The following will make the browser crash
    // const result = compfinds(query, query, facts, EPILOG_RULESET);

    // console.log("RESULT", result);

    return false;
  }, [epilogRepresentation]);

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
              render={({ field: { ref, ...field } }) => (
                <InputDate {...field} />
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
                  options={vaccines}
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
              name="insurance"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelectButtons {...field} options={insurers} />
              )}
            />
          </Constraint>
          <Constraint id="services" label="Services">
            <Controller
              name="services"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <InputSelectButtons {...field} options={vaccines} />
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
      <pre>{isCovered}</pre>
      <pre>{epilogRepresentation}</pre>
    </EpilogFormContainer>
  );
};

export default Covid19Vaccine;
