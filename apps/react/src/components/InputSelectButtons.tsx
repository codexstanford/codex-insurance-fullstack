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
  const isSelected = (opt: TOptions[number]) => {
    const optionKey = opt.id || opt.value;  // Assuming all options have either an id or value
    return Array.isArray(value)
      ? value.some((v) => v.id === optionKey || v.value === optionKey)
      : value && (value.id === optionKey || value.value === optionKey);
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {options.map((opt) => {
        const optKey = opt.id || opt.value;  // Handle options with id or value
        return (
          <Button
            key={optKey}
            className={classNames("-uppercase", [
              isSelected(opt),
              "bg-blue-200 hover:bg-blue-100",
            ])}
            disabled={opt.specialStatus === "disabled"}
            onClick={() => {
              if (opt.specialStatus === "disabled") return;
              const isOptSelected = isSelected(opt);
              if (isOptSelected && canDeselect) {
                const newValue = Array.isArray(value)
                  ? Object.freeze(value.filter((v) => v.id !== optKey && v.value !== optKey))
                  : null;
                onChange?.(newValue as TValue);
              } else {
                const newValue = Array.isArray(value)
                  ? [...value, opt]
                  : opt;
                onChange?.(newValue as unknown as TValue);
              }
              onBlur?.();
            }}
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}
