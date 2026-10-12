import { useState, useEffect, useCallback } from "react";
import { View } from "@/pages/View";
import { getSelectedView, setSelectedView } from "@/utils/view";
import useGetQueryParameters from "./use-get-query-parameters";

const useActiveView = (onChange: () => void): [View, (v: View) => void] => {
  const [activeView, setActiveView] = useState<View>(() => {
    if (window.location.hash.includes("/products/")) {
      return "products";
    }
    return getSelectedView();
  });

  const { isQueryPresent } = useGetQueryParameters();

  const handleChangeView = useCallback(
    (view: View) => {
      setSelectedView(view);
      onChange();
      setActiveView(view);
    },
    [onChange],
  );

  useEffect(() => {
    if (isQueryPresent) {
      handleChangeView("chat");
    }
  }, [handleChangeView, isQueryPresent]);

  return [activeView, handleChangeView];
};

export default useActiveView;
