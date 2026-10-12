import { useLayout } from "@/contexts/layoutContext";

const useIsRTL = () => {
  const layout = useLayout();
  return layout.direction === "rtl";
};

export default useIsRTL;
