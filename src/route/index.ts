import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import "../index.css"
import AuthPage from "../pages/Auth/Index";
import BiasPage from "../pages/Bias";
import CreateBiasPage from "../pages/Bias/Create";
import NotFoundPage from "../pages/NotFoundPage";
import EditBiasPage from "../pages/Bias/EditBias";
import RulesPage from "../pages/Rules";
import RulesCreatePage from "../pages/Rules/create";
import RulesEditPage from "../pages/Rules/edit";
import TradeIndexPage from "../pages/Trades";
import TradeDetailsPage from "../pages/Trades/details";
// import EditTradePage from "../pages/Trades/edit";
import CreateTradePage from "../pages/Trades/create";
import TradeEditPage from "../pages/Trades/edit";
import RulesDetailPage from "../pages/Rules/details";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    ErrorBoundary: NotFoundPage,
    children: [
      { index: true, Component: Home },
    ],
  },
  {
    path: "/auth",
    Component: AuthPage,
    ErrorBoundary: NotFoundPage,
  },
  {
    path: "/bias",
    Component: BiasPage,
    ErrorBoundary: NotFoundPage,
  },
  {
    path: '/bias/create',
    Component: CreateBiasPage
   },
   {
    path: '/bias/edit/:id',
    Component: EditBiasPage
   },
   {
    path: '/rules',
    Component: RulesPage
   },
   {
    path: '/rules/create',
    Component: RulesCreatePage
   },
   {
    path: '/rules/edit/:id',
    Component: RulesEditPage
   },
   {
    path: '/rules/detail/:id',
    Component: RulesDetailPage
   },
   {
    path: "/trades",
    Component: TradeIndexPage
   },
   {
    path: "/trades/:id",
    Component: TradeDetailsPage
   },
   {
    path: "/trades/edit/:id",
    Component: TradeEditPage
   },
   {
    path: "trades/create",
    Component: CreateTradePage
   }
]);


