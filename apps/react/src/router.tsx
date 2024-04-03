// https://reactrouter.com/en/main/routers/create-browser-router

import { ROUTES } from "common";
import { createBrowserRouter } from "react-router-dom";
import ClaimPage from "./pages/ClaimSingle";
import ExplorePage from "./pages/Explore";
import Index from "./pages/Index";
import Root from "./pages/Root";
import Login from "./pages/auth/Login";
import RequiresLogin from "./components/RequiresLogin";
import Dasboard from "./pages/Dashboard";
import RequiresUserDataset from "./components/RequiresUserDataset";
import ClaimListPage from "./pages/ClaimList";
import Container from "./components/Container";

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
        path: ROUTES.SERVICE + "/:service",
        element: <ExplorePage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
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
      {
        path: ROUTES.CLAIM,
        element: (
          <RequiresLogin>
            <RequiresUserDataset>
              <ClaimListPage />
            </RequiresUserDataset>
          </RequiresLogin>
        ),
      },
      {
        path: ROUTES.CLAIM + "/:claimId",
        element: <ClaimPage />,
      },
      {
        path: ROUTES.POLICY + "/:policyId?",
        element: (
          <RequiresLogin>
            <RequiresUserDataset>
              <Container makeBoxed="narrow">WIP</Container>
            </RequiresUserDataset>
          </RequiresLogin>
        ),
      },
      {
        path: ROUTES.PERSON + "/:personId?",
        element: (
          <RequiresLogin>
            <RequiresUserDataset>
              <Container makeBoxed="narrow">WIP</Container>
            </RequiresUserDataset>
          </RequiresLogin>
        ),
      },
    ],
  },
]);

export default router;
