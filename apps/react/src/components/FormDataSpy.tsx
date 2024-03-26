import { Disclosure } from "@headlessui/react";
import { classNames } from "../utils/classNames";
import { COMMON_INPUT_CLASSES } from "../consts/classes.const";

export type FormDataSpy_Input = {
  data: Record<string, unknown>;
} & JSX.IntrinsicElements["div"];

const FormDataSpy: React.FC<FormDataSpy_Input> = ({
  data,
  className,
  ...props
}) => (
  <>
    <Disclosure>
      <Disclosure.Button className="text-sm text-stone-300">
        JSON
      </Disclosure.Button>
      <Disclosure.Panel className="text-gray-500">
        <div
          className={classNames(
            COMMON_INPUT_CLASSES,
            "font-mono overflow-scroll",
            className,
          )}
          {...props}
        >
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </Disclosure.Panel>
    </Disclosure>
  </>
);

export default FormDataSpy;
