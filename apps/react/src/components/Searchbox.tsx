import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import {
  COMMON_BORDER_CLASSES,
  COMMON_INPUT_CLASSES,
} from "../consts/classes.const";
import { classNames } from "../utils/classNames";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type Searchbox_Input<T extends Record<string | number, string>> = {
  options: T;
  onChange?: (key?: keyof T) => void;
  placehoder?: string;
};

/* -------------------------------------------------------------------------- */
/*                                  Function                                  */
/* -------------------------------------------------------------------------- */

export function Searchbox<T extends Record<string | number, string>>({
  options,
  onChange,
  placehoder,
}: Searchbox_Input<T>) {
  const [selected, setSelected] = useState<keyof typeof options | undefined>();
  const [query, setQuery] = useState("");

  useEffect(() => onChange?.(selected), [selected]);

  const filteredEntries =
    query === ""
      ? Object.entries(options)
      : Object.entries(options).filter(([_, label]) =>
          label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative">
        <div
          className={classNames(
            COMMON_INPUT_CLASSES,
            "p-0 relative w-full cursor-default overflow-hidden rounded-2xl bg-white text-left sm:text-sm",
          )}
        >
          <Combobox.Button className="absolute inset-y-0 left-0 flex items-center pl-2">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
          <Combobox.Input
            className="w-full border-none py-2 pr-3 pl-10 text-sm leading-5 text-black focus:ring-0"
            displayValue={(id: keyof typeof options) => options[id] || ""}
            placeholder={placehoder || "Search..."}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onChange?.(selected);
                console.log("ON CHANGE", selected);
              }
            }}
          />
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options
            className={classNames(
              COMMON_BORDER_CLASSES,
              "absolute mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm",
            )}
          >
            {filteredEntries.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-black">
                Nothing found.
              </div>
            ) : (
              filteredEntries.map(([id, label], key) => (
                <Combobox.Option
                  key={key}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-10 pr-4",
                      [active, "bg-blue-200"],
                    )
                  }
                  value={id}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {label}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 text-black`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}

export default Searchbox;
