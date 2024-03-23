import React from "react";
import { ButtonLink } from "../../components/Button";
import Constraint from "../../components/Constraint";
import Container from "../../components/Container";
import InputDate from "../../components/InputDate";

const Covid19Vaccine: React.FC = () => {
  // const { register, handleSubmit, watch } = useForm();

  return (
    <Container
      makeBoxed="narrow"
      centerXY={true}
      makeGutter={true}
      className="max-w-3xl"
    >
      <div className={"flex gap-3 items-center p-3 bg-blue-200"}>
        <p className="font-bold text-xl mr-auto ">COVID-19 Vaccine</p>
        <ButtonLink href="/">Save</ButtonLink>
      </div>
      <Container makeGutter={true} className="p-3 bg-teal-200">
        <p className="text-right">Constraints</p>
        <Constraint id="test" label="Date of Birth">
          <InputDate />
        </Constraint>
      </Container>
    </Container>
  );
};

export default Covid19Vaccine;
