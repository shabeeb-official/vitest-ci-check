import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import useShowPanel from "@/hooks/use-show-panel";
import { ReactNode } from "react";

type VisibilityProps = {
  children: ReactNode;
};

export const ShowSm = (props: VisibilityProps) => {
  const { children } = props;

  const isMobileWidth = useIsMobileWidth();

  if (isMobileWidth) {
    return children;
  }

  return null;
};

export function HideWhenChatPanelOpen(props: VisibilityProps) {
  const { children } = props;

  const show = useShowPanel();

  if (show.chat) {
    return null;
  }

  return children;
}
