import React from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import Searchbox from "../components/Searchbox";

const Index: React.FC = () => {
  return (
    <>
      <Container
        addVerticalPadding={true}
        className={"min-h-[100vh] flex justify-center items-center"}
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 text-center gap-3">
            <Heading level={1}>Explore Coverage</Heading>
            <p className="text-xl">search by category or situation</p>
          </div>
          <Searchbox />
        </div>
      </Container>
    </>
  );
};

export default Index;
