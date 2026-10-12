import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { ReactNode } from "react";

export const HideSm = ({ children }: { children: ReactNode }) => {
  const isMobileWidth = useIsMobileWidth();

  if (isMobileWidth) {
    return null;
  }

  return children;
};
