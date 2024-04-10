import { BasicOption } from "../types/basicOption";
import { classNames } from "../utils/classNames";
import { Button } from "./Button";

type SpecialStatus = "none" | "disabled" | "green";

interface Option extends BasicOption {
  specialStatus?: SpecialStatus;
}

type InputSelectButtons_Input<
  TOptions extends Readonly<Option[]>,
  TValue extends (TOptions[number] | null) | TOptions,
> = {
  value: TValue;
  onChange?: (value: TValue) => void;
  onBlur?: () => void;
  canDeselect?: boolean,
  options: TOptions;
};

export default function InputSelectButtons<
  TOptions extends Readonly<Option[]>,
  TValue extends (TOptions[number] | null) | TOptions,
>({
  value,
  onChange,
  onBlur,
  canDeselect = true,
  options,
}: InputSelectButtons_Input<TOptions, TValue>) {
  const isSelected = (opt: TOptions[number]) =>
    Array.isArray(value)
      ? value.some((v) => v.id === opt.id)
      : value && value.id === opt.id;

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
            if (isSelected(opt) && canDeselect) {
              // Now unselect
              onChange?.(
                (Array.isArray(value)
                  ? Object.freeze(value.filter((v) => v.id !== opt.id))
                  : null) as TValue,
              );
            } else {
              onChange?.(
                (Array.isArray(value)
                  ? [...value, opt]
                  : opt) as unknown as TValue,
              );
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
