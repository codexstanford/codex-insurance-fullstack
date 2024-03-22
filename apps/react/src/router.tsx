// https://reactrouter.com/en/main/routers/create-browser-router

import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import Root from "./pages/Root";
import Index from "./pages/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "auth/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
