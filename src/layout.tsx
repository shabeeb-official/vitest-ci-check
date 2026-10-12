import { Suspense, useRef, useMemo, ReactNode } from "react";
import useSendQuery from "./hooks/use-send-query";
import { useLayout } from "./contexts/layoutContext";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { DEFAULT_HEADER_HEIGHT, MOBILE_WIDTH } from "./config";
import useWindowWidth from "./hooks/use-window-width";
import Loader from "./components/loader";
import { Render } from "./components/conditional";
import ChatLayout from "./components/chat/chat";
// import layoutConfigs from "./layouts";
import { useLayoutConfigs } from "./layouts/LayoutConfigContext";

export const Layout = (props: { headerHeight: number }) => {
  const query = useSendQuery();
  const layout = useLayout();
  const windowWidth = useWindowWidth();
  const layoutConfigs = useLayoutConfigs();

  const { direction } = layoutConfigs.plp.pageLayout;

  const containerStyle = useMemo(() => {
    return clsx(
      "w-full flex p-0 max-sm:p-0 -background-gradient transition-all duration-300 ease-in-out",
      layout.sideBarExpanded ? "gap-3" : "gap-0",
      direction === "rtl" ? "flex-row" : "flex-row-reverse",
    );
  }, [layout.sideBarExpanded]);

  const rightSectionWidth = useMemo(() => {
    return clsx("w-full overflow-y-scroll bg-white", layout.rightWidth);
  }, [layout.rightWidth]);

  const ref = useRef(null);
  if (windowWidth < MOBILE_WIDTH) {
    const visibleHeight = window.innerHeight;
    return (
      <div
        id="layout-container"
        ref={ref}
        className="overflow-auto"
        style={{
          minHeight: `calc(${visibleHeight}- ${props.headerHeight || DEFAULT_HEADER_HEIGHT}px)`,
        }}
      >
        <Outlet context={ref} />
      </div>
    );
  }

  const onSuccess = () => {
    ref.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSend = (v: string) => {
    query.onSendQuery({ onSuccess, query: v });
  };

  const handleSendTrend = (v: string) => {
    query.onSendQuery({ onSuccess, trend: v });
  };

  return (
    <Suspense fallback={<Loader />}>
      <div
        className={containerStyle}
        style={{
          height: `calc(100dvh - ${props.headerHeight || DEFAULT_HEADER_HEIGHT}px)`,
        }}
      >
        <ChatSectionWrapper>
          <ChatLayout
            handleSend={handleSend}
            handleSendTrend={handleSendTrend}
          />
        </ChatSectionWrapper>
        <div className={rightSectionWidth} ref={ref} id="layout-container">
          <Outlet context={ref} />
        </div>
      </div>
    </Suspense>
  );
};

const ChatSectionWrapper = ({ children }: { children: ReactNode }) => {
  const layout = useLayout();
  const leftSectionWidth = useMemo(() => {
    return clsx(
      "bg-white flex flex-col transition-all duration-300 ease-in-out overflow-hidden ",
      layout.leftWidth,
    );
  }, [layout.leftWidth]);

  return (
    <Render
      when={layout.sideBarExpanded}
      show={
        <div
          id="chat-window"
          className={clsx(leftSectionWidth, layout.layoutClass)}
        >
          {children}
        </div>
      }
    />
  );
};
