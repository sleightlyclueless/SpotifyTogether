import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider.tsx";

type AuthRequiredProps = {
  to?: string;
  children?: React.ReactNode;
};

export const AuthRequired = ({
  to = "/auth/login",
  children,
}: AuthRequiredProps) => {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  if (!isLoggedIn && pathname !== to) {
    return <Navigate to={to} replace />;
  }
  return <>{children}</>;
};
