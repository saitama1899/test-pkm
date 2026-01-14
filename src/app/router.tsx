import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import PokedexLayout from "./layouts/PokedexLayout";

import HomePage from "../features/home/HomePage";
import TeamsPage from "../features/teams/TeamsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <PokedexLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "teams", element: <TeamsPage /> },
        ],
      },
    ],
  },
]);
