import { MAIN_CONTAINER_REMOVE_MT } from "../consts/classes.const";
import { classNames } from "../utils/classNames";
import React from "react";

/* -------------------------------------------------------------------------- */
/*                               Boxed container                              */
/* -------------------------------------------------------------------------- */

export const px = "px-6 sm:px-12";
export const py = "py-6 sm:py-12 lg:py-16";

export const narrowBoxedClasses = classNames("container mx-auto", px);

export const fluid_px = "px-6 sm:px-20 lg:px-24";
export const fluid_py = "py-6 sm:py-20 lg:py-24";

export const fluidBoxedClasses = classNames("max-w-[2000px] mx-auto", fluid_px);

/* -------------------------------------------------------------------------- */
/*                                   Gutter                                   */
/* -------------------------------------------------------------------------- */

export const gutter = "flex-wrap flex-col items-stretch";

/* -------------------------------------------------------------------------- */
/*                                 Full height                                */
/* -------------------------------------------------------------------------- */

export const fullHeight = classNames(MAIN_CONTAINER_REMOVE_MT, "min-h-[100vh]");

export const xyCenter = "justify-center items-center";

/* -------------------------------------------------------------------------- */
/*                                    Comp                                    */
/* -------------------------------------------------------------------------- */

type Container_Input = {
  addVerticalPadding?: boolean;
  makeBoxed?: "narrow" | "fluid";
  makeGutter?: boolean;
  makeFullHeight?: boolean;
  centerXY?: boolean;
} & JSX.IntrinsicElements["div"];

const Container: React.FC<Container_Input> = ({
  addVerticalPadding = false,
  makeBoxed,
  makeGutter = false,
  makeFullHeight = false,
  centerXY = false,
  className,
  ...props
}) => (
  <div
    className={classNames(
      "flex gap-3 items-center",
      makeBoxed
        ? makeBoxed === "narrow"
          ? narrowBoxedClasses
          : fluidBoxedClasses
        : "",
      addVerticalPadding ? (makeBoxed === "fluid" ? fluid_py : py) : "",
      [centerXY, xyCenter],
      [makeGutter, gutter],
      [makeFullHeight, fullHeight],
      className,
    )}
    {...props}
  />
);

export default Container;
