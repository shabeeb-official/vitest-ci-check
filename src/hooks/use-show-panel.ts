import { useLayout } from "@/contexts/layoutContext";
import { useMemo } from "react";
import { useIsMobileWidth } from "./use-mobile-width";

function useShowPanel() {
  const isMobile = useIsMobileWidth();
  const layout = useLayout();
  const show = useMemo(() => {
    const showState = {
      chat: layout.sideBarExpanded,
      content: true,
    };

    if (isMobile) {
      showState.chat = layout.sideBarExpanded;
      showState.content = !layout.sideBarExpanded;
    }

    return showState;
  }, [layout.sideBarExpanded]);

  return show;
}

export default useShowPanel;
