import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage.tsx";
import { AuthRequired } from "./AuthRequired.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";

export type RouteConfig = RouteProps & {
  path: string;
  isPrivate?: boolean;
};
export const routes: RouteConfig[] = [
  {
    isPrivate: false,
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    isPrivate: true,
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
  },
];

export function renderRouteMap({
  isPrivate,
  element,
  ...restRoute
}: RouteConfig) {
  const authRequiredElement = isPrivate ? (
    <AuthRequired>{element}</AuthRequired>
  ) : (
    element
  );
  return (
    <Route key={restRoute.path} {...restRoute} element={authRequiredElement} />
  );
}

export const AppRoutes = () => {
  return <Routes>{routes.map(renderRouteMap)}</Routes>;
};
