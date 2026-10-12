import { useEffect, useRef, useState } from "react";
import { loadLayoutConfigs } from "./index";
import { LayoutConfigContext } from "./LayoutConfigContext";
import Loader from "../components/loader";
import { useAuth } from "@/store/auth/use-auth";

export const LayoutConfigProvider = ({ children }: any) => {
  const [configs, setConfigs] = useState<any>(null);
  const auth = useAuth();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Already loaded once so skip the API call for fetch config
    if (hasLoadedRef.current) return;

    // Wait until token exists before attempting to load configs
    if (!auth?.token) return;

    hasLoadedRef.current = true;
    loadLayoutConfigs(auth?.token).then(setConfigs).catch(console.error);
  }, [auth?.token]);

  if (!configs) {
    return <Loader />;
  }

  return (
    <LayoutConfigContext.Provider value={configs}>
      {children}
    </LayoutConfigContext.Provider>
  );
};
