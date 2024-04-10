import { PlusCircleIcon as FilledPlusCircleIcon } from "@heroicons/react/20/solid";
import {
  BookOpenIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  DocumentIcon,
  HomeIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ROUTES } from "common";
import { ReactNode, useCallback, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CODEX_BRAND_CLASSES,
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
          "flex items-center w-full",
          CODEX_BRAND_CLASSES,
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
      <SidebarLink
        icon={<HomeIcon className="w-6 h-6" />}
        to={ROUTES.DASHBOARD}
      >
        Dashboard
      </SidebarLink>
      {/*<SidebarLink
        icon={<DocumentIcon className="w-6 h-6" />}
        to={ROUTES.CLAIM}
        linkPlusTo={ROUTES.INDEX}
      >
        Claims
      </SidebarLink>
      <SidebarLink
        icon={<BookOpenIcon className="w-6 h-6" />}
        to={ROUTES.POLICY}
        linkPlusTo="#"
      >
        Policies
      </SidebarLink>
      <SidebarLink
        icon={<UserIcon className="w-6 h-6" />}
        to={ROUTES.PERSON}
        linkPlusTo="#"
      >
        People
        </SidebarLink>*/}
    </aside>
  );
}

function SidebarLink({
  children,
  to = "#",
  icon,
  linkPlusTo,
}: {
  children?: ReactNode;
  to?: string;
  icon?: ReactNode;
  linkPlusTo?: string;
}) {
  const { isSidebarCollapsed: isCollapsed } = useContext(
    IsSidebarCollapsedContext,
  );

  const navigate = useNavigate();
  const onClickPlus = useCallback(
    () => void (linkPlusTo && navigate(linkPlusTo)),
    [navigate, linkPlusTo],
  );

  const { pathname } = useLocation();

  const isActive = pathname.endsWith(to);

  return (
    <>
      <div
        className={classNames(
          "px-3 mx-3 text-gray-400 font-semibold hover:text-gray-500 border-2 hover:border-gray-500 rounded-lg cursor-pointer flex flex-row gap-2 items-center",
          [
            isActive,
            "text-black border-black hover:text-black hover:border-black",
          ],
          [isCollapsed, "justify-center"],
        )}
      >
        <Link to={to} className="py-2">
          {icon}
        </Link>
        {!isCollapsed && (
          <Link to={to} className="flex-grow py-2">
            {children}
          </Link>
        )}
        {!isCollapsed && linkPlusTo && (
          <button
            onClick={onClickPlus}
            className="group ml-auto hover:fill-black  py-2"
          >
            <PlusCircleIcon className="w-6 h-6 group-hover:hidden" />
            <FilledPlusCircleIcon className="w-6 h-6 hidden group-hover:block" />
          </button>
        )}
      </div>
    </>
  );
}
