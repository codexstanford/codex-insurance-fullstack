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
  isCovered,
  children,
  __debugFormData,
}) => {
  const claimId = useContext(ExistingClaimContext);

  const claimName = claimId !== undefined ? "Claim " + (parseInt(claimId.substring(5))+1) : "CLAIM ID MALFORMED";

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
            isCovered === undefined ? "bg-blue-200" : 
              isCovered ? "bg-green-400" : "bg-red-400",
          )}
        >
          {claimId && <span className="font-bold text-2xl">{claimName + ":"}</span>}
          <h1 className=" text-xl">{title}</h1>
          <p className="font-bold text-xl ml-auto">{isCovered === undefined ? "Needs More Info" : 
              isCovered ? "Covered" : "Not Covered"}</p>
          <Button className="ml-0" onClick={() => void (onSave && onSave())}>
            Save
          </Button>
        </div>
        <div className="flex gap-3 items-center p-3 bg-yellow-300 font-bold">
          Important Coverage Note: Cardinal Care only covers services received at <br/>(a) Stanford Health Care, (b) Menlo Medical Clinic, or (c) Sutter Health
        </div>
        {children}
        {/*{__debugFormData && <FormDataSpy data={__debugFormData} />}*/}
      </Container>
    </>
  );
};

export default EpilogFormContainer;
