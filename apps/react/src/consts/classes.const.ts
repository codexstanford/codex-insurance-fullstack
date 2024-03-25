import { classNames } from "../utils/classNames";

export const MAIN_CONTAINER_MT = "mt-20";
// Note: We can't just prepend a "-" to the const above
// because Tailwind needs to find the whole class name
// somewhere in the source code.
export const MAIN_CONTAINER_REMOVE_MT = "-mt-20";

export const COMMON_BORDER_CLASSES = "border-2 border-gray-400";

export const COMMON_FOCUS_CLASSES =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300";

export const COMMON_INPUT_CLASSES = classNames(
  COMMON_BORDER_CLASSES,
  COMMON_FOCUS_CLASSES,
  "text-left w-full py-2 px-3 rounded-2xl bg-white text-black text-sm cursor-default",
);
