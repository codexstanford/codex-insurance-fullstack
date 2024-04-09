import { ROUTES } from "common";
import { useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ButtonLink } from "../components/Button";
import DoAfterLoginActionBeforeRender from "../components/DoAfterLoginActionBeforeRender";
import Sidebar from "../components/Sidebar";
import {
  CODEX_BRAND_CLASSES,
  MAIN_CONTAINER_MT,
  NAVBAR_HEIGHT,
  NAVBAR_PADDING,
  SIDEBAR_COLLAPSED_MAIN_CONTAINER_ML,
  SIDEBAR_COLLAPSED_NAVBAR_LEFT,
  SIDEBAR_NOT_COLLAPSED_MAIN_CONTAINER_ML,
  SIDEBAR_NOT_COLLAPSED_NAVBAR_LEFT,
  Z_INDEX_NAVBAR,
} from "../consts/classes.const";
import { IsSidebarCollapsedContext } from "../contexts/isSidebarCollapsedContext";
import useSessionUser from "../hooks/useSessionUser";
import { classNames } from "../utils/classNames";
import SearchboxClaimReason from "../components/SearchboxClaimReason";

const Root: React.FC = () => {
  const user = useSessionUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isSiderbarCollapsedContextValue = useMemo(
    () => ({ isSidebarCollapsed, setIsSidebarCollapsed }),
    [isSidebarCollapsed, setIsSidebarCollapsed],
  );

  const { pathname } = useLocation();

  const showSearchbar = pathname !== ROUTES.INDEX;

  return (
    <>
      <DoAfterLoginActionBeforeRender>
        <IsSidebarCollapsedContext.Provider
          value={isSiderbarCollapsedContextValue}
        >
          {user && <Sidebar />}
          <header
            className={classNames(
              "border-b-2 border-gray-200 bg-white text-black fixed top-0 right-0 items-center flex gap-3",
              Z_INDEX_NAVBAR,
              NAVBAR_HEIGHT,
              NAVBAR_PADDING,
              [!user, "left-0"],
              [
                !!user,
                isSidebarCollapsed
                  ? SIDEBAR_COLLAPSED_NAVBAR_LEFT
                  : SIDEBAR_NOT_COLLAPSED_NAVBAR_LEFT,
              ],
            )}
          >
            {!user && (
              <Link to={ROUTES.INDEX} className={CODEX_BRAND_CLASSES}>
                CodeX
              </Link>
            )}
            {showSearchbar && (
              <SearchboxClaimReason placeholder="Explore Coverage" />
            )}
            <div className="py-3 flex gap-3 items-center ml-auto">
              {!user && <ButtonLink href={ROUTES.LOGIN}>Login</ButtonLink>}
              {user && (
                <>
                  <span>{user.displayName}</span>
                  <ButtonLink
                    href={ROUTES.API_AUTH_LOGOUT}
                    renderAsReactRouterLink={false}
                  >
                    Logout
                  </ButtonLink>
                </>
              )}
            </div>
          </header>
          <main
            className={classNames(MAIN_CONTAINER_MT, [
              !!user,
              isSidebarCollapsed
                ? SIDEBAR_COLLAPSED_MAIN_CONTAINER_ML
                : SIDEBAR_NOT_COLLAPSED_MAIN_CONTAINER_ML,
            ])}
          >
            <Outlet />
          </main>
        </IsSidebarCollapsedContext.Provider>
      </DoAfterLoginActionBeforeRender>
    </>
  );
};

export default Root;
