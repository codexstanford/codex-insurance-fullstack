import React from "react";
import { classNames } from "../utils/classNames";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type Heading_Input = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
} & React.JSX.IntrinsicElements["h1"];

type ClassRecord = Record<Heading_Input["level"], string>;

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const sizeClassRecord: ClassRecord = {
  1: "text-5xl font-extrabold",
  2: "text-4xl font-bold",
  3: "text-3xl font-bold",
  4: "text-2xl font-bold",
  5: "text-xl font-bold",
  6: "text-lg font-bold",
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

export const Heading: React.FC<Heading_Input> = ({
  level,
  className,
  ...props
}) => {
  const Tag = `h${level}` as keyof Pick<React.JSX.IntrinsicElements, "h1">; // The latter is a hack to get the correct type for the Tag.
  return (
    <Tag className={classNames(sizeClassRecord[level], className)} {...props} />
  );
};

export default Heading;
