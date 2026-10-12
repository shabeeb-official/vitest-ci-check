import { createContext, useContext } from "react";

export type AuthContextType = {
  token: null | string;
  onReAuthentication: (token: string) => void;
};

const noop = () => {};

export const authContext = createContext<AuthContextType>({
  token: null,
  onReAuthentication: noop,
});

export const useAuth = () => useContext(authContext);
