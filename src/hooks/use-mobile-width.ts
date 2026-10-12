import { useMemo } from "react";
import useWindowWidth from "./use-window-width";
import { MOBILE_WIDTH } from "@/config";

export const useIsMobileWidth = () => {
  const windowWidth = useWindowWidth();

  return useMemo(() => windowWidth < MOBILE_WIDTH, [windowWidth]);
};
