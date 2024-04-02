import { Link, Outlet } from "react-router-dom";
import Container from "../components/Container";
import useSessionUser from "../hooks/useSessionUser";
import { ROUTES } from "common";
import { ButtonLink } from "../components/Button";
import {
  SIDEBAR_COLLAPSED_MAIN_CONTAINER_ML,
  SIDEBAR_NOT_COLLAPSED_MAIN_CONTAINER_ML,
  MAIN_CONTAINER_MT,
  Z_INDEX_NAVBAR,
  SIDEBAR_COLLAPSED_NAVBAR_LEFT,
  SIDEBAR_NOT_COLLAPSED_NAVBAR_LEFT,
  NAVBAR_HEIGHT,
  NAVBAR_PADDING,
} from "../consts/classes.const";
import DoAfterLoginActionBeforeRender from "../components/DoAfterLoginActionBeforeRender";
import Sidebar from "../components/Sidebar";
import { classNames } from "../utils/classNames";
import { useMemo, useState } from "react";
import { IsSidebarCollapsedContext } from "../contexts/isSidebarCollapsedContext";

const Root: React.FC = () => {
  const user = useSessionUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isSiderbarCollapsedContextValue = useMemo(
    () => ({ isSidebarCollapsed, setIsSidebarCollapsed }),
    [isSidebarCollapsed, setIsSidebarCollapsed],
  );

  return (
    <>
      <DoAfterLoginActionBeforeRender>
        <IsSidebarCollapsedContext.Provider
          value={isSiderbarCollapsedContextValue}
        >
          {user && <Sidebar />}
          <header
            className={classNames(
              "bg-blue-200 text-black fixed top-0 right-0 items-center flex justify-end",
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
            <div className="py-3 flex gap-3 items-center">
              {!user && <ButtonLink href={ROUTES.LOGIN}>Login</ButtonLink>}
              {user && (
                <ButtonLink
                  href={ROUTES.API_AUTH_LOGUT}
                  renderAsReactRouterLink={false}
                >
                  Logut
                </ButtonLink>
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
