import { useCallback, useState } from "react";
import { Button } from "./Button";
import Container from "./Container";

export default function InlineForm({
  label,
  valueStringRepresentation,
  children,
  onSubmit,
}: {
  label: string;
  valueStringRepresentation: string;
  children: React.ReactNode;
  onSubmit: () => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  const onButtonClick = useCallback(() => {
    if (isEditMode) onSubmit();
    setIsEditMode((prev) => !prev);
  }, [isEditMode, setIsEditMode, onSubmit]);

  return (
    <>
      <Container makeGutter={true} className="flex-row">
        <Container makeGutter={true} className="flex-1 gap-1">
          <label>{label}</label>
          {!isEditMode && (
            <p className="text-gray-600">{valueStringRepresentation}</p>
          )}
          {isEditMode && children}
        </Container>
        <div className="flex items-center">
          <Button onClick={onButtonClick}>
            {isEditMode ? "Save" : "Update"}
          </Button>
        </div>
      </Container>
    </>
  );
}
