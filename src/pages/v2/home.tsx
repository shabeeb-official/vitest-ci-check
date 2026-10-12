import { Suspense, useMemo } from "react";
import clsx from "clsx";
import { DEFAULT_HEADER_HEIGHT } from "../../config";
import Loader from "../../components/loader";
import { useLayout } from "@/contexts/layoutContext";
import { useLayoutConfigs } from "@/layouts/v2/LayoutConfigContext";
import { renderNodeList } from "@/utils/render-ui";
import { composeRegistry, domainRegistry, genericRegistry } from "@/registry";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import useActiveTrends from "@/hooks/use-active-trends";

function V2Home({ headerHeight }: { headerHeight: number }) {
  const layouts = useLayoutConfigs();
  const { sideBarExpanded } = useLayout();
  const isMobile = useIsMobileWidth();
  const activeTrends = useActiveTrends();

  const visibleHeight = window.innerHeight;
  const containerStyle = useMemo(() => {
    return clsx(
      "w-full flex p-0 max-sm:p-0 -background-gradient transition-all duration-300 ease-in-out",
      sideBarExpanded ? "gap-3" : "gap-0",
    );
  }, [sideBarExpanded]);

  const view = renderNodeList(layouts.home.layout, {
    registry: composeRegistry(genericRegistry, domainRegistry),
    runtimeScope: {
      isMobile,
      activeTrends: activeTrends,
    },
  });

  return (
    <Suspense fallback={<Loader />}>
      <div
        className={containerStyle}
        style={
          isMobile
            ? {
                minHeight: `calc(${visibleHeight}- ${headerHeight || DEFAULT_HEADER_HEIGHT}px)`,
              }
            : {
                height: `calc(100dvh - ${headerHeight || DEFAULT_HEADER_HEIGHT}px)`,
              }
        }
      >
        {view}
      </div>
    </Suspense>
  );
}

export default V2Home;
