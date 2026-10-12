import useActiveView from "@/hooks/use-active-view";
import TabSwitcher from "@/components/tap-switcher";
import { Render } from "@/components/conditional";
import useSendQuery from "@/hooks/use-send-query";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import ChatLayout from "../chat/chat";
import RenderLoop from "../render-loop";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";
import RenderComponents from "@/utils/render-components";
import { pdpRegistry } from "../pdp/pdpRegistry";
import ProductLoading from "./product-loading";

const ProductPageMobileView = ({ headerHeight }: { headerHeight: number }) => {
  const query = useSendQuery(() => handleChangeView("products"));
  const layoutConfigs = useLayoutConfigs();
  const [activeView, handleChangeView] = useActiveView(() => {
    query.resetCountdown();
  });

  const { onSendQuery } = query;

  const handleSend = useCallback(
    (v: string) => {
      if (v.length) {
        onSendQuery({ query: v, beforeSend: () => handleChangeView("chat") });
      }
    },
    [onSendQuery, handleChangeView],
  );

  const handleSendTrend = useCallback(
    (v: string) => {
      if (v.length) {
        onSendQuery({ trend: v, beforeSend: () => handleChangeView("chat") });
      }
    },
    [onSendQuery, handleChangeView],
  );

  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <TabSwitcher
        activeView={activeView}
        handleChangeView={handleChangeView}
        url={layoutConfigs.plp?.pageLayout?.mobileChatToggleButton}
        toggleButtonStyle={
          layoutConfigs.plp?.pageLayout?.mobileChatToggleButtonStyle
        }
      />
      <div>
        <div
          className="flex-1 overflow-auto"
          style={{
            paddingBottom: `${footerHeight}px`,
            height: `calc(100dvh - ${headerHeight}px)`,
          }}
        >
          <Render
            when={activeView === "products"}
            show={
              <Suspense fallback={<ProductLoading />}>
                <section className={layoutConfigs.pdp.styles.detailSection}>
                  <RenderLoop
                    list={layoutConfigs.pdp.layout}
                    render={(item: any) => (
                      <RenderComponents
                        item={item}
                        registry={pdpRegistry}
                        runtimeScope={{}}
                      />
                    )}
                  />
                </section>
              </Suspense>
            }
            otherwise={
              <ChatLayout
                handleSend={handleSend}
                handleSendTrend={handleSendTrend}
                handleChangeView={handleChangeView}
              />
            }
          />
        </div>
      </div>
    </>
  );
};

export default ProductPageMobileView;
