import React from "react";
import { ButtonLink } from "../components/Button";
import Container from "../components/Container";
import Heading from "../components/Heading";
import SearchboxClaimReason from "../components/SearchboxClaimReason";

const Index: React.FC = () => {
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
          <SearchboxClaimReason placeholder="eg: contraceptives" />
          <div className="flex gap-3 justify-center items-center">
            <ButtonLink href={"/"} color="gray" className="min-w-40">
              Waive Cardinal Care
            </ButtonLink>
            {/*<ButtonLink href={"/"} color="gray" className="min-w-40">
              File a Claim
  </ButtonLink>*/}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Index;
