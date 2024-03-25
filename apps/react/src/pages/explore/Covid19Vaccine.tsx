import React from "react";
import Constraint from "../../components/Constraint";
import ConstraintContainer from "../../components/ConstraintContainer";
import EpilogFormContainer from "../../components/EpilogFormContainer";
import InputDate from "../../components/InputDate";
import InputSelect from "../../components/InputSelect";
import { useForm, Controller } from "react-hook-form";

const Covid19Vaccine: React.FC = () => {
  const { control } = useForm();

  return (
    <EpilogFormContainer title="COVID-19 Vaccine" onSave={() => alert("WIP")}>
      <ConstraintContainer>
        <Constraint id="test" label="Date of Birth">
          <InputDate />
        </Constraint>
        <Constraint id="test2" label="Vaccination History">
          <Controller
            name="iceCreamType"
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
          <InputDate />
        </Constraint>
      </ConstraintContainer>
    </EpilogFormContainer>
  );
};

export default Covid19Vaccine;
