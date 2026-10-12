import {
  CustomLayoutType,
  useLayout,
  useLayoutDispatch,
} from "@/contexts/layoutContext";
import { useCallback } from "react";

function useToggleView() {
  const layout = useLayout();
  const dispatch = useLayoutDispatch();

  const onToggleView = useCallback(() => {
    const toggleDirection: CustomLayoutType = layout.sideBarExpanded
      ? "collapse"
      : "expand";

    dispatch({ type: toggleDirection });
  }, [layout.sideBarExpanded, dispatch]);

  return onToggleView;
}

export default useToggleView;
