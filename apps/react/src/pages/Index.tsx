import { ROUTES } from "common";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ButtonLink } from "../components/Button";
import Container from "../components/Container";
import Heading from "../components/Heading";
import Searchbox from "../components/Searchbox";
import { SITUATIONS } from "../consts/situations.const";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container
        makeBoxed="fluid"
        addVerticalPadding={true}
        makeFullHeight={true}
        centerXY={true}
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 text-center gap-3">
            <Heading level={1}>Explore Coverage</Heading>
            <p className="text-xl">search by category or situation</p>
          </div>
          <Searchbox
            options={SITUATIONS}
            // TODO Redirect to service form that was actually selected
            onChange={(situation) => {
              if (situation) navigate(ROUTES.SERVICE + "/" + situation);
            }}
          />
          <div className="flex gap-3 justify-center items-center">
            <ButtonLink href={"/"} color="gray" className="min-w-40">
              Wave Cardinal Care
            </ButtonLink>
            <ButtonLink href={"/"} color="gray" className="min-w-40">
              File a Claim
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Index;
