import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";


export const router =createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      { index: true, Component: Home },
      {
        path: "auth",
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
      // {
      //   path: "concerts",
      //   children: [
      //     { index: true, Component: ConcertsHome },
      //     { path: ":city", Component: ConcertsCity },
      //     { path: "trending", Component: ConcertsTrending },
      //   ],
      // },
    ],
  },
]);


