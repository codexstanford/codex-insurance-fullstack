import { useState } from "react";
import Datepicker from "tailwind-datepicker-react";
import { getButtonClassNames } from "./Button";
import { classNames } from "../utils/classNames";
import { COMMON_INPUT_CLASSES } from "../consts/classes.const";

// https://github.com/OMikkel/tailwind-datepicker-react

type InputDate_Input = Omit<
  React.ComponentProps<typeof Datepicker>,
  "show" | "setShow"
>;

// We have to override the stuff that comes from Datepicker
const buttonClassNames = classNames(
  getButtonClassNames("gray"),
  "rounded-none",
);

const InputDate: React.FC<InputDate_Input> = ({ options, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <Datepicker
      {...props}
      show={show}
      setShow={setShow}
      options={{
        ...options,
        theme: {
          background: "rounded-none",
          todayBtn: buttonClassNames,
          clearBtn: buttonClassNames,
          icons: "",
          text: "text-black",
          disabledText: "",
          input: classNames(COMMON_INPUT_CLASSES),
          inputIcon: "hidden",
          selected: "bg-blue-200 hover:bg-blue-100 text-black",
        },
      }}
    />
  );
};

export default InputDate;
