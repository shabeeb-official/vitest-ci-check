import { useLayout } from "@/contexts/layoutContext";
import ExpandeSunny from "@/components/expand-sunny";
import clsx from "clsx";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";
import PlpTiles from "@/components/PlpTiles";

type IdleView = "message" | "tiles";

const IdleSection = () => {
  const { sideBarExpanded } = useLayout();
  const layoutConfigs = useLayoutConfigs();
  const idleView: IdleView =
    layoutConfigs?.plp?.pageLayout?.idleView === "tiles" ? "tiles" : "message";
  const idleContent = layoutConfigs?.plp?.content?.idleSection || {};
  const idleStyles = layoutConfigs?.plp?.styles?.topBar?.idleSection || {};
  const tilesConfig = idleContent?.tilesConfig || {};

  return (
    <div className={clsx("h-full w-full bg-white p-3", idleStyles.wrapper)}>
      <div className="w-full">
        {!sideBarExpanded ? (
          <ExpandeSunny
            styles={clsx(
              idleStyles.toggleButton || "h-[2.6rem] w-24 cursor-pointer",
            )}
            imageURL={layoutConfigs.plp.pageLayout.idleToggleBtnUrl}
          />
        ) : null}
      </div>

      {idleView === "tiles" ? (
        <div
          className={clsx(
            "h-full w-full overflow-auto px-2 py-3 sm:px-0 sm:py-2",
            idleStyles.tilesContainer,
          )}
        >
          <PlpTiles
            title={tilesConfig.title}
            subtitle={tilesConfig.subtitle}
            tiles={tilesConfig.tiles}
            styles={layoutConfigs?.plp?.styles?.plpTiles}
          />
        </div>
      ) : (
        <div
          className={clsx(
            "h-full w-full flex-1 flex justify-center text-center py-20 px-4 sm:px-6",
            idleStyles.messageContainer,
          )}
        >
          <div
            className={clsx(
              "w-full max-w-2xl py-8 px-2 sm:p-16 lg:p-24",
              idleStyles.messageInner,
            )}
          >
            <h2
              className={clsx(
                "text-2xl sm:text-3xl font-medium text-gray-800 mb-3",
                idleStyles.title,
              )}
            >
              {idleContent?.title || "Let's style you"}
            </h2>
            <p
              className={clsx(
                "text-[12px] sm:text-base text-gray-500 max-w-md mx-auto",
                idleStyles.description,
              )}
            >
              {idleContent?.description ||
                "Start chatting with our assistant to see personalized product recommendations."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdleSection;
