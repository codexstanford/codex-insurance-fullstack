import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { classNames } from "../utils/classNames";
import { Z_INDEX_MODAL } from "../consts/classes.const";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

type Input = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  button?: { label: string; onClick: () => void };
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  button,
}: Input) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={classNames("relative", Z_INDEX_MODAL)}
          onClose={onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="bg-gray-200 p-6 flex items-center flex-row gap-3">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold mr-auto"
                    >
                      {title}
                    </Dialog.Title>
                    <button onClick={onClose}>
                      <XCircleIcon className="w-8 h-8" />
                    </button>
                  </div>
                  <div className="p-6">{children}</div>
                  {button && (
                    <div className="p-6 flex flex-row justify-end items-center gap-3">
                      <Button onClick={button.onClick}>{button.label}</Button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
