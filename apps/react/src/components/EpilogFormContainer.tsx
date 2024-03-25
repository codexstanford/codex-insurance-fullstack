import { classNames } from "../utils/classNames";
import { Button } from "./Button";
import Container from "./Container";

type EpilogFormContainter_Input = {
  containerProps?: React.ComponentProps<typeof Container>;
  title?: React.ReactNode;
  onSave?: () => void;
  children?: React.ReactNode;
};

const EpilogFormContainer: React.FC<EpilogFormContainter_Input> = ({
  containerProps,
  title,
  onSave,
  children,
}) => {
  return (
    <>
      <Container
        makeBoxed="narrow"
        centerXY={true}
        makeGutter={true}
        {...containerProps}
        className={classNames("max-w-3xl", containerProps?.className)}
      >
        <div className={"flex gap-3 items-center p-3 bg-blue-200"}>
          <h1 className="font-bold text-xl mr-auto ">{title}</h1>
          <Button onClick={() => void (onSave && onSave())}>Save</Button>
        </div>
        {children}
      </Container>
    </>
  );
};

export default EpilogFormContainer;
