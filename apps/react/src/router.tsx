// https://reactrouter.com/en/main/routers/create-browser-router

import { ROUTES } from "common";
import { createBrowserRouter } from "react-router-dom";
import ClaimPage from "./pages/Claim";
import ExplorePage from "./pages/Explore";
import Index from "./pages/Index";
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
        path: ROUTES.CLAIM + "/:claimId",
        element: <ClaimPage />,
      },
    ],
  },
]);

export default router;
