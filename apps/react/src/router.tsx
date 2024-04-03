// https://reactrouter.com/en/main/routers/create-browser-router

import { ROUTES } from "common";
import { Navigate, createBrowserRouter } from "react-router-dom";
import RequiresLogin from "./components/RequiresLogin";
import RequiresUserDataset from "./components/RequiresUserDataset";
import ClaimPage from "./pages/ClaimSingle";
import Dasboard from "./pages/Dashboard";
import ExplorePage from "./pages/Explore";
import Index from "./pages/Index";
import ResourceListPage from "./pages/ResourceListPage";
import Root from "./pages/Root";
import Login from "./pages/auth/Login";

const router = createBrowserRouter([
  {
    path: ROUTES.INDEX,
    element: <Root />,
    children: [
      {
        path: ROUTES.INDEX,
        element: <Index />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTES.SERVICE + "/:service",
        element: <ExplorePage />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <RequiresLogin>
            <RequiresUserDataset>
              <Dasboard />
            </RequiresUserDataset>
          </RequiresLogin>
        ),
      },
      /* -------------------------------------------------------------------------- */
      /*                                   Claims                                   */
      /* -------------------------------------------------------------------------- */
      // List
      {
        path: ROUTES.CLAIM,
        element: (
          <RequiresLogin>
            <RequiresUserDataset>
              <ResourceListPage
                heading="Claims"
                resourceType="claim"
                linkToListPage={ROUTES.CLAIM}
              />
            </RequiresUserDataset>
          </RequiresLogin>
        ),
      },
      // Create
      {
        path: ROUTES.CLAIM_NEW,
        element: <Navigate to={ROUTES.INDEX} />,
      },
      // Read
      {
        path: ROUTES.CLAIM + "/:claimId",
        element: <ClaimPage />,
      },
      /* -------------------------------------------------------------------------- */
      /*                                   Policy                                   */
      /* -------------------------------------------------------------------------- */
      {
        path: ROUTES.POLICY + "/:policyId?",
        element: (
          <RequiresLogin>
            <RequiresUserDataset>
              <ResourceListPage
                heading="Policies"
                resourceType="policy"
                linkToListPage={ROUTES.POLICY}
              />
            </RequiresUserDataset>
          </RequiresLogin>
        ),
      },
      /* -------------------------------------------------------------------------- */
      /*                                   Person                                   */
      /* -------------------------------------------------------------------------- */
      {
        path: ROUTES.PERSON + "/:personId?",
        element: (
          <RequiresLogin>
            <RequiresUserDataset>
              <ResourceListPage
                heading="People"
                resourceType="person"
                linkToListPage={ROUTES.PERSON}
              />
            </RequiresUserDataset>
          </RequiresLogin>
        ),
      },
    ],
  },
]);

export default router;
