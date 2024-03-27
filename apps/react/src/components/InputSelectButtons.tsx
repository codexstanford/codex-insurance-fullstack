import { classNames } from "../utils/classNames";
import { Button } from "./Button";

type SpecialStatus = "none" | "disabled" | "green";

interface Option {
  id: number | string;
  label: string;
  specialStatus?: SpecialStatus;
}

type InputSelectButtons_Input<T extends Readonly<Option[]>> = {
  value: T;
  onChange?: (value: T) => void;
  onBlur?: () => void;
  options: T;
};

export default function InputSelectButtons<T extends Readonly<Option[]>>({
  value,
  onChange,
  onBlur,
  options,
}: InputSelectButtons_Input<T>) {
  const isSelected = (opt: T[number]) => value.some((v) => v.id === opt.id);

  return (
    <div className="flex gap-3 flex-wrap">
      {options.map((opt) => (
        <Button
          key={opt.id}
          className={classNames("-uppercase", [
            isSelected(opt),
            "bg-blue-200 hover:bg-blue-100",
          ])}
          disabled={opt?.specialStatus === "disabled"}
          onClick={() => {
            if (opt.specialStatus === "disabled") return;
            if (isSelected(opt)) {
              onChange?.(
                Object.freeze(value.filter((v) => v.id !== opt.id)) as T,
              );
            } else {
              onChange?.([...value, opt] as unknown as T);
            }
            onBlur?.();
          }}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
