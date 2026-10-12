import useSendQuery from "@/hooks/use-send-query";
import { useProducts } from "@/store/products";
import TabSwitcher from "./tap-switcher";
import { Render } from "./conditional";
import useActiveView from "@/hooks/use-active-view";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatLayout from "./chat/chat";
import ProductDisplay from "./plp-wrapper";
import RenderLoop from "./render-loop";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";
import RenderComponents from "@/utils/render-components";
import { plpRegistry } from "./ProductDisplay";
import { useProductListFilter } from "@/store/filter";
import IdleSection from "./idle-page";

const MobileView = ({ headerHeight }: { headerHeight: number }) => {
  const { status: productStatus, products } = useProducts();
  const layoutConfigs = useLayoutConfigs();

  const query = useSendQuery(() => handleChangeView("products"));
  const [activeView, handleChangeView] = useActiveView(() => {
    query.resetCountdown();
  });

  const { onSendQuery } = query;

  const handleSend = useCallback(
    (v: string) => {
      if (v.length) {
        onSendQuery({
          query: v,
          beforeSend: () => {
            handleChangeView("chat");
          },
        });
      }
    },
    [onSendQuery, handleChangeView],
  );

  const handleSendTrend = useCallback(
    (v: string) => {
      if (v.length) {
        onSendQuery({
          trend: v,
          beforeSend: () => {
            handleChangeView("chat");
          },
        });
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

  const { onCloseFilter } = useProductListFilter();

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
      <div
        className="flex-1 overflow-hidden relative"
        style={{
          paddingBottom: `${footerHeight}px`,
          height: `calc(100dvh - ${headerHeight}px)`,
        }}
      >
        <Render
          when={activeView === "products"}
          show={
            <div
              id="personal-recs"
              className="flex-1 overflow-auto max-h-full"
              onScroll={() => {
                onCloseFilter();
              }}
            >
              <Render
                when={productStatus === "success" || products.length > 0}
                show={
                  <RenderLoop
                    list={layoutConfigs.plp.layout}
                    render={(item: any) => (
                      <RenderComponents
                        item={item}
                        registry={plpRegistry}
                        runtimeScope={{}}
                      />
                    )}
                  />
                  // <ProductDisplay />
                }
                otherwise={<IdleSection />}
              />
            </div>
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
    </>
  );
};

export default MobileView;
