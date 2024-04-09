import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LockClosedIcon,
  LockOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import React, { useCallback } from "react";
import { COMMON_FOCUS_CLASSES } from "../consts/classes.const";
import { classNames } from "../utils/classNames";
import { ConstraintContext } from "../contexts/constraintContext";
import Container from "./Container";
import { InputContext } from "../contexts/inputContext";

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
            <button
              onClick={onClickLock}
              className={classNames(
                COMMON_FOCUS_CLASSES,
                "border border-black rounded-full size-8 flex items-center justify-center",
                [isLocked, "bg-blue-200"],
              )}
            >
              {isLocked && <LockClosedIcon className="size-4 " />}
              {!isLocked && <LockOpenIcon className="size-4" />}
            </button>
          </Container>
          <Disclosure.Panel>
            <Container makeGutter={true}>
              <InputContext.Provider value={{ isLocked }}>
                {children}
              </InputContext.Provider>
            </Container>
          </Disclosure.Panel>
        </Container>
      )}
    </Disclosure>
  );
};

export default Constraint;
