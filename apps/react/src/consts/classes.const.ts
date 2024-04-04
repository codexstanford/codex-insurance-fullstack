import { classNames } from "../utils/classNames";

/* -------------------------------------------------------------------------- */
/*                                  Z-Indexs                                  */
/* -------------------------------------------------------------------------- */

export const Z_INDEX_MODAL = "z-50";
export const Z_INDEX_SIDEBAR = "z-40";
export const Z_INDEX_NAVBAR = "z-30";

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

export const SIDEBAR_W_COLLAPSED = "w-20";
export const SIDEBAR_W_NOT_COLLAPSED = "w-60";

export const SIDEBAR_COLLAPSED_MAIN_CONTAINER_ML = "ml-20";
export const SIDEBAR_COLLAPSED_NAVBAR_LEFT = "left-20";

export const SIDEBAR_NOT_COLLAPSED_MAIN_CONTAINER_ML = "ml-60";
export const SIDEBAR_NOT_COLLAPSED_NAVBAR_LEFT = "left-60";

export const NAVBAR_HEIGHT = "h-16";
export const NAVBAR_PADDING = "p-3";

export const CODEX_BRAND_CLASSES = "font-bold text-xl text-gray-600";

/* -------------------------------------------------------------------------- */
/*                                   Navbar                                   */
/* -------------------------------------------------------------------------- */

export const MAIN_CONTAINER_MT = "mt-20";
// Note: We can't just prepend a "-" to the const above
// because Tailwind needs to find the whole class name
// somewhere in the source code.
export const MAIN_CONTAINER_REMOVE_MT = "-mt-20";

/* -------------------------------------------------------------------------- */
/*                                    Misc                                    */
/* -------------------------------------------------------------------------- */

export const COMMON_BORDER_CLASSES = "border-2 border-gray-400";

export const COMMON_FOCUS_CLASSES =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300";

export const COMMON_INPUT_CLASSES = classNames(
  COMMON_BORDER_CLASSES,
  COMMON_FOCUS_CLASSES,
  "text-left w-full py-2 px-3 rounded-2xl bg-white text-black text-sm cursor-default",
);
