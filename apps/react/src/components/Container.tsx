import { classNames } from "../utils/classNames";
import React from "react";

/* -------------------------------------------------------------------------- */
/*                               Boxed container                              */
/* -------------------------------------------------------------------------- */

export const px = "px-6 sm:px-12";
export const py = "py-6 sm:py-12 lg:py-16";

export const containerClasses = classNames("container mx-auto", px);

/* -------------------------------------------------------------------------- */
/*                               Fluid container                              */
/* -------------------------------------------------------------------------- */

export const fluid_px = "px-6 sm:px-20 lg:px-24";
export const fluid_py = "py-6 sm:py-20 lg:py-24";

export const containerFluidClasses = classNames(
  "max-w-[2000px] mx-auto",
  fluid_px,
);

/* -------------------------------------------------------------------------- */
/*                                   Gutter                                   */
/* -------------------------------------------------------------------------- */

export const gutter = "flex gap-3";

/* -------------------------------------------------------------------------- */
/*                                    Comp                                    */
/* -------------------------------------------------------------------------- */

type Container_Input = {
  addVerticalPadding?: boolean;
  makeFluid?: boolean;
  makeGutter?: boolean;
} & JSX.IntrinsicElements["div"];

const Container: React.FC<Container_Input> = ({
  addVerticalPadding = false,
  makeFluid = false,
  makeGutter = false,
  className,
  ...props
}) => (
  <div
    className={classNames(
      makeFluid ? containerFluidClasses : containerClasses,
      addVerticalPadding ? (makeFluid ? fluid_py : py) : "",
      [makeGutter, gutter],
      className,
    )}
    {...props}
  />
);

export default Container;
