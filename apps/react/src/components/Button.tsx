import { Link } from "react-router-dom";
import { COMMON_INPUT_CLASSES } from "../consts/classes.const";
import { classNames } from "../utils/classNames";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type Color = "white" | "gray";

type Common_Button_Input = { color?: Color };

export type Button_Input = Common_Button_Input &
  React.JSX.IntrinsicElements["button"];

export type ButtonLink_Input = {
  renderAsReactRouterLink?: boolean;
  href: string;
} & Common_Button_Input &
  React.JSX.IntrinsicElements["a"];

/* -------------------------------------------------------------------------- */
/*                                   Consts                                   */
/* -------------------------------------------------------------------------- */

const BUTTON_CLASSES =
  "w-auto flex items-center justify-center px-4 py-2 uppercase text-center cursor-pointer text-sm";

const COLOR_CLASSES = {
  white: "bg-white hover:bg-gray-100 text-black",
  gray: "bg-gray-200 hover:bg-gray-100 text-gray-500",
} as const satisfies Record<Color, string>;

/* -------------------------------------------------------------------------- */
/*                                  Function                                  */
/* -------------------------------------------------------------------------- */

export const getButtonClassNames = (color: Color) => {
  return classNames(COMMON_INPUT_CLASSES, BUTTON_CLASSES, COLOR_CLASSES[color]);
};

export const Button: React.FC<Button_Input> = ({
  color = "white",
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classNames(getButtonClassNames(color), className)}
    />
  );
};

export const ButtonLink: React.FC<ButtonLink_Input> = ({
  renderAsReactRouterLink = true,
  color = "white",
  className,
  href,
  ...props
}) => {
  const cN = classNames(getButtonClassNames(color), className);

  if (renderAsReactRouterLink)
    return <Link {...props} to={href} className={cN} />;

  return <a {...props} href={href} className={cN} />;
};
