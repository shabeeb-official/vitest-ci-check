import { createContext, useContext } from "react";

export const LayoutConfigContext = createContext<any>(null);

export const useLayoutConfigs = () => {
  const ctx = useContext(LayoutConfigContext);
  if (!ctx) {
    throw new Error("useLayoutConfigs must be used inside provider");
  }
  return ctx;
};
