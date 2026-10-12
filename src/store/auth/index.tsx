import { useCallback, useEffect, useState } from "react";
import { authContext } from "./use-auth";

const AuthProvider = ({ children, token }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(token ? token : null);
  }, [token]);

  const onReAuthentication = useCallback((token: string) => {
    setAuthToken(token);
  }, []);

  return (
    <authContext.Provider
      value={{
        token: authToken,
        onReAuthentication: onReAuthentication,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
