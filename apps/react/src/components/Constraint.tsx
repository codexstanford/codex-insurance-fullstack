import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import React, { useCallback } from "react";
import { COMMON_FOCUS_CLASSES } from "../consts/classes.const";
import { classNames } from "../utils/classNames";
import { ConstraintContext } from "../contexts/ConstraintContext";
import Container from "./Container";
import { InputContext } from "../contexts/InputContext";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type Constraint_Input = {
  id?: string;
  label: React.ReactNode;
  children?: React.ReactNode;
};

/* -------------------------------------------------------------------------- */
/*                                  Function                                  */
/* -------------------------------------------------------------------------- */

const Constraint: React.FC<Constraint_Input> = ({ id, label, children }) => {
  const constraintContext = React.useContext(ConstraintContext);

  const isLocked = !!(id && constraintContext?.getIsLocked(id));

  const onClickLock = useCallback(
    () => void (id && constraintContext?.onClickLock(id)),
    [id, constraintContext],
  );

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <Container makeGutter={true} className="p-3 bg-white">
          <Container>
            <Disclosure.Button as="button" className={COMMON_FOCUS_CLASSES}>
              {open && <ChevronUpIcon className="size-6" />}
              {!open && <ChevronDownIcon className="size-6" />}
            </Disclosure.Button>
            <label htmlFor={id}>{label}</label>
            <button
              onClick={onClickLock}
              className={classNames(
                COMMON_FOCUS_CLASSES,
                "border ml-auto border-black rounded-full size-8 flex items-center justify-center",
                [isLocked, "bg-blue-200"],
              )}
            >
              {isLocked && <LockClosedIcon className="size-4 " />}
              {!isLocked && <LockOpenIcon className="size-4" />}
            </button>
          </Container>
          <Disclosure.Panel as={Container} makeGutter={true}>
            <InputContext.Provider value={{ isLocked }}>
              {children}
            </InputContext.Provider>
          </Disclosure.Panel>
        </Container>
      )}
    </Disclosure>
  );
};

export default Constraint;
