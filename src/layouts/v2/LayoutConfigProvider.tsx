import { ReactNode } from "react";
import { layoutConfigs } from "./index";
import { LayoutConfigContext } from "@/layouts/LayoutConfigContext";

export const LayoutConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LayoutConfigContext.Provider value={layoutConfigs}>
      {children}
    </LayoutConfigContext.Provider>
  );
};
