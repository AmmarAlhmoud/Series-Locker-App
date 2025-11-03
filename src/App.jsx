import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  tokenLoader,
  checkTokenLoader,
  checkTokenForAuthPageLoader,
} from "./util/auth";
import { logoutAction } from "./pages/Logout";

import Root from "./pages/Root";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ResetPasswordPage from "./pages/ResetPassword";
import NewPasswordPage from "./pages/NewPassword";
import AddSeriesPage from "./pages/AddSeries";
import WatchedSeriesPage from "./pages/WatchedSeries";
import PlanningToWatchPage from "./pages/PlanningToWatch";
import EditSeriesPage from "./pages/EditSeries";
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <Root />,
    loader: tokenLoader,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "login",
        element: <LoginPage />,
        loader: checkTokenForAuthPageLoader,
      },
      {
        path: "signup",
        element: <SignupPage />,
        loader: checkTokenForAuthPageLoader,
      },
      {
        path: "logout",
        action: logoutAction,
        loader: checkTokenForAuthPageLoader,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
        loader: checkTokenForAuthPageLoader,
      },
      {
        path: "new-password/:resetToken",
        element: <NewPasswordPage />,
        loader: checkTokenForAuthPageLoader,
      },
      {
        path: "add-series",
        element: <AddSeriesPage />,
        loader: checkTokenLoader,
      },
      {
        path: "watched-series",
        element: <WatchedSeriesPage />,
        loader: checkTokenLoader,
      },
      {
        path: "planning-to-watch",
        element: <PlanningToWatchPage />,
        loader: checkTokenLoader,
      },
      {
        path: "edit-series/:slug/:id",
        element: <EditSeriesPage />,
        loader: checkTokenLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
