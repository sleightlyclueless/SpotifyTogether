import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider.tsx";

// AuthRequired is a component that authorizes the given route before rendering the children.
export const AuthRequired = ({
  to = "/auth/login",
  children,
}: {
  to?: string;
  children?: React.ReactNode;
}) => {
  // see provider/AuthProvider.tsx for the useAuth hook, checking if the user is logged in and has a valid JWT.
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  if (!isLoggedIn && pathname !== to) {
    return <Navigate to={to} replace />;
  }
  return <>{children}</>;
};
