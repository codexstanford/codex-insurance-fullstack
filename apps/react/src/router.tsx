// https://reactrouter.com/en/main/routers/create-browser-router

import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Root from "./pages/Root";
import Login from "./pages/auth/Login";
import Covid19VaccineComponent from "./pages/explore/Covid19Vaccine";
import { ROUTES } from "common";
import ClaimPage from "./pages/Claim";

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
        path: ROUTES.SERVICE_COVID19VACCINE + "/:claimId?",
        element: <Covid19VaccineComponent />,
      },
      {
        path: ROUTES.CLAIM + "/:claimId",
        element: <ClaimPage />,
      },
    ],
  },
]);

export default router;
