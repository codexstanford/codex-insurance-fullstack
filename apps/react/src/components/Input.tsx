import React from "react";
import { classNames } from "../utils/classNames";
import { COMMON_INPUT_CLASSES } from "../consts/classes.const";

type Input_Input = {
  type: React.HTMLInputTypeAttribute;
} & React.JSX.IntrinsicElements["input"];

const Input: React.FC<Input_Input> = ({ type, className, ...props }) => {
  return (
    <input
      {...props}
      type={type}
      className={classNames(COMMON_INPUT_CLASSES, className)}
    />
  );
};

export default Input;
