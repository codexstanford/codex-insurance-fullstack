import {
  BookOpenIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  DocumentIcon,
  GiftIcon,
  HomeIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ROUTES } from "common";
import { ReactNode, useContext } from "react";
import { Link } from "react-router-dom";
import {
  NAVBAR_HEIGHT,
  NAVBAR_PADDING,
  SIDEBAR_W_COLLAPSED,
  SIDEBAR_W_NOT_COLLAPSED,
  Z_INDEX_SIDEBAR,
} from "../consts/classes.const";
import { IsSidebarCollapsedContext } from "../contexts/isSidebarCollapsedContext";
import { classNames } from "../utils/classNames";

export default function Sidebar() {
  const {
    isSidebarCollapsed: isCollapsed,
    setIsSidebarCollapsed: setIsCollapsed,
  } = useContext(IsSidebarCollapsedContext);

  return (
    <aside
      className={classNames(
        "fixed top-0 left-0 bottom-0 bg-gray-200 flex flex-col gap-3",
        Z_INDEX_SIDEBAR,
        isCollapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_NOT_COLLAPSED,
      )}
    >
      <div
        className={classNames(
          "flex items-center w-full font-bold text-xl text-gray-600",
          NAVBAR_HEIGHT,
          NAVBAR_PADDING,
          [isCollapsed, "justify-center justify-items-center"],
        )}
      >
        {!isCollapsed && <Link to={ROUTES.INDEX}>CodeX</Link>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={classNames("p-2 cursor-pointer", [
            !isCollapsed,
            "ml-auto",
          ])}
        >
          {isCollapsed && <ChevronDoubleRightIcon className="w-6 h-6" />}
          {!isCollapsed && <ChevronDoubleLeftIcon className="w-6 h-6" />}
        </button>
      </div>
      <SidebarLink icon={<HomeIcon className="w-6 h-6" />} isActive={true}>
        Dashboard
      </SidebarLink>
      <SidebarLink icon={<DocumentIcon className="w-6 h-6" />} linkPlusTo="#">
        Claims
      </SidebarLink>
      <SidebarLink icon={<BookOpenIcon className="w-6 h-6" />} linkPlusTo="#">
        Policies
      </SidebarLink>
      <SidebarLink icon={<UserIcon className="w-6 h-6" />} linkPlusTo="#">
        People
      </SidebarLink>
      <SidebarLink icon={<GiftIcon className="w-6 h-6" />} linkPlusTo="#">
        Property
      </SidebarLink>
    </aside>
  );
}

function SidebarLink({
  children,
  to = "#",
  icon,
  linkPlusTo,
  isActive = false,
}: {
  children?: ReactNode;
  to?: string;
  icon?: ReactNode;
  linkPlusTo?: string;
  isActive?: boolean;
}) {
  const { isSidebarCollapsed: isCollapsed } = useContext(
    IsSidebarCollapsedContext,
  );

  return (
    <>
      <div
        className={classNames(
          "px-3 mx-3 py-2 text-gray-400 font-semibold hover:text-gray-500 border-2 hover:border-gray-500 rounded-lg cursor-pointer flex flex-row gap-2 items-center",
          [
            isActive,
            "text-black border-black hover:text-black hover:border-black",
          ],
          [isCollapsed, "justify-center"],
        )}
      >
        {icon}
        {!isCollapsed && <Link to={to}>{children}</Link>}
        {!isCollapsed && linkPlusTo && (
          <Link to={linkPlusTo} className="ml-auto">
            <PlusCircleIcon className="w-6 h-6" />
          </Link>
        )}
      </div>
    </>
  );
}
