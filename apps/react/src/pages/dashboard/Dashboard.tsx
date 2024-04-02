import Container from "../../components/Container";
import Heading from "../../components/Heading";

export default function Dasboard() {
  return (
    <>
      <Container
        makeBoxed="narrow"
        addVerticalPadding={true}
        makeGutter={true}
        className="gap-10"
      >
        <Heading level={1}>Dashboard</Heading>
        <Heading level={2}>Claims</Heading>
      </Container>
    </>
  );
}
