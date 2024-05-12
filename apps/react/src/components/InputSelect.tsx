import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  COMMON_BORDER_CLASSES,
  COMMON_INPUT_CLASSES,
} from "../consts/classes.const";
import { BasicOption } from "../types/basicOption";
import { classNames } from "../utils/classNames";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface Option extends BasicOption {
  disabled?: boolean;
}

type InputSelect_Input<
  TOptions extends Readonly<Option[]>,
  TValue extends (TOptions[number] | null) | TOptions,
> = {
  value: TValue;
  onChange?: (value: TValue) => void;
  options: TOptions;
  placeholder?: string;
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

export default function InputSelect<
  TOptions extends Readonly<Option[]>,
  TValue extends (TOptions[number] | null) | TOptions,
>({
  value,
  options,
  placeholder = "Select an option",
  ...props
}: InputSelect_Input<TOptions, TValue>) {
  let listboxButtonString = placeholder;

  if (Array.isArray(value) && value.length > 0) {
    listboxButtonString = value.map((s) => s.label).join(", ");
  }

  if (!Array.isArray(value) && value) {
    listboxButtonString = (value as TOptions[number]).label;
  }

  return (
    <Listbox {...props} value={value} multiple={Array.isArray(value)} by="id">
      <div className="relative">
        <Listbox.Button
          className={classNames(COMMON_INPUT_CLASSES, "relative pr-10")}
        >
          <span className="block truncate">{listboxButtonString}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className={classNames(
            COMMON_BORDER_CLASSES,
            "absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm",
          )}
        >
          {options.map((opt, key) => (
            <Listbox.Option
              key={key}
              className={({ active }) =>
                classNames(
                  "relative cursor-default select-none py-2 pl-10 pr-4",
                  [active, "bg-blue-200"],
                )
              }
              value={opt}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {opt.label}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
