import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { COMMON_FOCUS_CLASSES } from "../consts/classes.const";
import { classNames } from "../utils/classNames";
import Container from "./Container";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type Constraint_Input = {
  id?: string;
  label: React.ReactNode;
  children?: React.ReactNode;
  onClickAddField?: () => void;
};

/* -------------------------------------------------------------------------- */
/*                                  Function                                  */
/* -------------------------------------------------------------------------- */

const Constraint: React.FC<Constraint_Input> = ({
  id,
  label,
  children,
  onClickAddField,
}) => {
  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <Container makeGutter={true} className="p-3 bg-white">
          <Container>
            <Disclosure.Button as="button" className={COMMON_FOCUS_CLASSES}>
              {open && <ChevronUpIcon className="size-6" />}
              {!open && <ChevronDownIcon className="size-6" />}
            </Disclosure.Button>
            <label htmlFor={id} className="mr-auto">
              {label}
            </label>
            {onClickAddField && (
              <button
                onClick={onClickAddField}
                className={classNames(
                  COMMON_FOCUS_CLASSES,
                  "border border-black rounded-full size-8 flex items-center justify-center",
                )}
              >
                <PlusIcon className="size-4 " />
              </button>
            )}
          </Container>
          <Disclosure.Panel>
            <Container makeGutter={true}>{children}</Container>
          </Disclosure.Panel>
        </Container>
      )}
    </Disclosure>
  );
};

export default Constraint;
