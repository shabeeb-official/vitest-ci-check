import { IS_DEV } from "@/config";
import { getUserSession } from "@/utils/session";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const isLoggedIn = getUserSession();

  if (IS_DEV) {
    return <>{children}</>;
  }

  if (isLoggedIn) {
    return <>{children}</>;
  }

  return <Navigate to="login" />;
};

export default AuthGuard;
