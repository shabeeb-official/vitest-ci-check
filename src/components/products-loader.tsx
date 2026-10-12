import { useLayout } from "@/contexts/layoutContext";
import ExpandeSunny from "@/components/expand-sunny";
import clsx from "clsx";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";

const ShimmerCard = () => {
  return (
    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
      <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );
};

const ShimmerGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
};

const ProductsLoader = () => {
  const { sideBarExpanded } = useLayout();
  const layoutConfigs = useLayoutConfigs();
  const loadingAnimation =
    layoutConfigs.plp.pageLayout.loadingAnimation || "none";
  const loadingTextStyle =
    layoutConfigs.plp.pageLayout.loadingTextStyle ||
    "absolute top-[5rem] left-[50%] translate-x-[-50%] text-[3rem] font-bold text-accent";
  return (
    <>
      <div className={clsx("h-full w-full bg-white p-3 relative")}>
        <div className="w-full">
          {!sideBarExpanded ? (
            <ExpandeSunny
              imageURL={layoutConfigs.plp.pageLayout.idleToggleBtnUrl}
              styles={layoutConfigs?.plp?.styles?.topBar?.ChatToogleButton}
            />
          ) : null}
        </div>
        <ShimmerGrid />
        <h1 className={loadingTextStyle}>
          {layoutConfigs.plp.pageLayout.loadingText || "Loading"}
          {loadingAnimation === "roadandgunTypingDots" && (
            <span className="roadandgun-loading-dots" />
          )}
        </h1>
      </div>
    </>
  );
};

export default ProductsLoader;
