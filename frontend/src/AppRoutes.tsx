import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { OverviewPage } from "./pages/index.tsx";
import { AuthRequired } from "./AuthRequired.tsx";
import { SpotifyPage } from "./pages/SpotifyPage.tsx";

export type RouteConfig = RouteProps & {
  path: string;
  isPrivate?: boolean;
};

export const routes: RouteConfig[] = [
  {
    isPrivate: false,
    path: "/",
    element: <Navigate to="/overview" replace />,
  },
  {
    isPrivate: true,
    path: "/overview",
    element: <OverviewPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
  },
  {
    path: "/spotify",
    element: <SpotifyPage />,
  },
];

function renderRouteMap({ isPrivate, element, ...restRoute }: RouteConfig) {
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
