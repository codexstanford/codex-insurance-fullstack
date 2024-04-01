import { ReactNode } from "react";
import Container from "./Container";
import Heading from "./Heading";
import { ButtonLink } from "./Button";
import { ROUTES } from "common";

type Input = {
  heading?: ReactNode;
  children?: ReactNode;
  addGoHomeButton?: boolean;
  wrapInFullpageContainer?: boolean;
};

export default function Callout({
  heading,
  children,
  addGoHomeButton = false,
  wrapInFullpageContainer = false,
}: Input) {
  return (
    <Container
      makeBoxed="narrow"
      centerXY={true}
      makeGutter={true}
      className="max-w-3xl"
      addVerticalPadding={wrapInFullpageContainer}
      makeFullHeight={wrapInFullpageContainer}
    >
      <Heading level={1}>{heading}</Heading>
      {children}
      {addGoHomeButton && (
        <div className="w-auto">
          <ButtonLink href={ROUTES.INDEX}>Go to home page</ButtonLink>
        </div>
      )}
    </Container>
  );
}
