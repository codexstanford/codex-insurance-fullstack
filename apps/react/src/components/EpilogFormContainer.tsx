import { useContext } from "react";
import { classNames } from "../utils/classNames";
import { Button } from "./Button";
import Container from "./Container";
import FormDataSpy from "./FormDataSpy";
import { ExistingClaimContext } from "../contexts/existingClaimContext";

type Input = {
  containerProps?: React.ComponentProps<typeof Container>;
  title?: React.ReactNode;
  onSave?: () => void;
  isCovered?: boolean;
  children?: React.ReactNode;
  __debugFormData?: Record<string, unknown>;
};

const EpilogFormContainer: React.FC<Input> = ({
  containerProps,
  title,
  onSave,
  isCovered = false,
  children,
  __debugFormData,
}) => {
  const claimId = useContext(ExistingClaimContext);

  return (
    <>
      <Container
        makeBoxed="narrow"
        centerXY={true}
        makeGutter={true}
        {...containerProps}
        className={classNames("max-w-3xl", containerProps?.className)}
      >
        <div
          className={classNames(
            "flex gap-3 items-center p-3 ",
            isCovered ? "bg-green-400" : "bg-blue-200",
          )}
        >
          <h1 className="font-bold text-xl">{title}</h1>
          {claimId && <span className="font-mono">{claimId}</span>}
          <Button className="ml-auto" onClick={() => void (onSave && onSave())}>
            Save
          </Button>
        </div>
        {children}
        {__debugFormData && <FormDataSpy data={__debugFormData} />}
      </Container>
    </>
  );
};

export default EpilogFormContainer;
