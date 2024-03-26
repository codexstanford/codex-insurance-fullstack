import React from "react";
import Constraint from "../../components/Constraint";
import ConstraintContainer from "../../components/ConstraintContainer";
import EpilogFormContainer from "../../components/EpilogFormContainer";
import InputDate from "../../components/InputDate";
import InputSelect from "../../components/InputSelect";
import { useForm, Controller } from "react-hook-form";
import InputSelectButtons from "../../components/InputSelectButtons";

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

const locations = [
  { id: "facility", label: "Facility" },
  { id: "physiciansOffice", label: "Physician's Office" },
  { id: "other", label: "Any other location" },
] as const;

const Covid19Vaccine: React.FC = () => {
  const { control, watch } = useForm({
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

  return (
    <EpilogFormContainer
      title="COVID-19 Vaccine"
      onSave={() => alert("WIP")}
      __debugFormData={watch()}
    >
      <ConstraintContainer>
        <Constraint label="Date of Birth">
          <Controller
            name="dob"
            control={control}
            render={({ field }) => <InputDate {...field} />}
          />
        </Constraint>
        <Constraint label="Vaccination History">
          <Controller
            name="vaccinationHistory_vaccineType"
            control={control}
            render={({ field }) => (
              <InputSelect
                {...field}
                options={[
                  { id: 0, label: "Moderna" },
                  { id: 1, label: "Pfizer" },
                ]}
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
        <Constraint label="Insurance">
          <Controller
            name="insurance"
            control={control}
            render={({ field }) => (
              <InputSelectButtons
                {...field}
                options={[
                  { id: "cardinalCare", label: "Cardinal Care" },
                  { id: "kaiserHMO", label: "Kaiser HMO" },
                ]}
              />
            )}
          />
        </Constraint>
        <Constraint label="Services">
          <Controller
            name="services"
            control={control}
            render={({ field }) => (
              <InputSelectButtons {...field} options={vaccines} />
            )}
          />
        </Constraint>
        <Constraint label="When">
          <Controller
            name="when"
            control={control}
            render={({ field }) => <InputDate {...field} />}
          />
        </Constraint>
        <Constraint label="Where">
          <Controller
            name="where"
            control={control}
            render={({ field }) => (
              <InputSelectButtons {...field} options={locations} />
            )}
          />
        </Constraint>
      </ConstraintContainer>
    </EpilogFormContainer>
  );
};

export default Covid19Vaccine;
