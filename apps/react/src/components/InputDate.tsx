import { useContext, useState } from "react";
import Datepicker from "tailwind-datepicker-react";
import { getButtonClassNames } from "./Button";
import { classNames } from "../utils/classNames";
import { COMMON_INPUT_CLASSES } from "../consts/classes.const";
import { InputContext } from "../contexts/InputContext";

// https://github.com/OMikkel/tailwind-datepicker-react

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type InputDate_Input = Omit<
  React.ComponentProps<typeof Datepicker>,
  "show" | "setShow"
> & { onBlur?: () => void };

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

// We have to override the stuff that comes from Datepicker
const buttonClassNames = classNames(
  getButtonClassNames("gray"),
  "rounded-none",
);

const InputDate: React.FC<InputDate_Input> = ({
  options,
  onChange,
  onBlur,
  ...props
}) => {
  const inputContext = useContext(InputContext);

  const [show, setShow] = useState(false);

  return (
    <Datepicker
      {...props}
      show={show}
      setShow={setShow}
      onChange={(date) => {
        onChange?.(date);
        onBlur?.();
      }}
      options={{
        clearBtn: false,
        ...options,
        theme: {
          background: "rounded-none",
          todayBtn: buttonClassNames,
          clearBtn: buttonClassNames,
          icons: "",
          text: "text-black",
          disabledText: "",
          input: classNames(COMMON_INPUT_CLASSES, [
            !!inputContext?.isLocked,
            "bg-blue-200",
          ]),
          inputIcon: "hidden",
          selected: "bg-blue-200 hover:bg-blue-100 text-black",
        },
      }}
    />
  );
};

export default InputDate;
