import { useNavigate } from "react-router-dom";
import { startTransition } from "react";
import { PATHS } from "@/paths";
import useActiveTrends from "@/hooks/use-active-trends";
import useHandleSearch from "@/hooks/use-handle-search";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { homeRegistry } from "@/components/home-page";
import RenderLoop from "@/components/render-loop";
import RenderComponents from "@/utils/render-components";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";

const HomePage = ({ headerHeight }: { headerHeight: number }) => {
  const navigate = useNavigate();
  const layoutConfigs = useLayoutConfigs();

  const handleNavigate = (term: string) => {
    if (term.length === 0) {
      return;
    }
    startTransition(() => {
      navigate(`${PATHS.products.root}?query=${term}`);
    });
  };

  const activeTrends = useActiveTrends();
  const [searchTerm, onTextChange] = useHandleSearch();
  const isMobileWidth = useIsMobileWidth();

  const runtimeScope = {
    headerHeight,
    searchTerm,
    onTextChange,
    handleNavigate,
    activeTrends,
    isMobileWidth,
  };

  return (
    <RenderLoop
      list={layoutConfigs.home.layout}
      render={(item: any) => (
        <RenderComponents
          item={item}
          registry={homeRegistry}
          runtimeScope={runtimeScope}
        />
      )}
    />
  );
};

export default HomePage;
