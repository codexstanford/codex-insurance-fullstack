import { twMerge } from "tailwind-merge";

/**
 * Helper function for combining classNames to one className string.
 * It removes duplicates with the last classNames added having the highest priority.
 *
 * @param classes
 * @returns
 */
export const classNames = (
  ...classes: (string | [boolean, string] | undefined)[]
) =>
  twMerge(
    classes
      .filter(Boolean)
      .map((val) => (Array.isArray(val) ? (val[0] ? val[1] : "") : val)),
  );
