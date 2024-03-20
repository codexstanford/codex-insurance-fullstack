// https://reactrouter.com/en/main/routers/create-browser-router

import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import Login from "./pages/auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "auth/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
