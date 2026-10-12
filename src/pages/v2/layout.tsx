import { Suspense, useRef, useMemo, useEffect } from "react";
import useSendQuery from "../../hooks/use-send-query";
import { useLayout } from "../../contexts/layoutContext";
import clsx from "clsx";
import { DEFAULT_HEADER_HEIGHT } from "../../config";
import Loader from "../../components/loader";
import { customEvent } from "@/utils/events";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import useGetQueryParameters from "@/hooks/use-get-query-parameters";
import ChatSection from "./chat-section";
import ContentSection from "./content-section";

function V2Layout(props: { headerHeight: number }) {
  const query = useSendQuery();
  const layout = useLayout();
  const ref = useRef(null);
  const isMobile = useIsMobileWidth();

  const containerStyle = useMemo(() => {
    return clsx(
      "w-full flex min-h-0 overflow-hidden p-0 max-sm:p-0 -background-gradient transition-all duration-300 ease-in-out",
      layout.sideBarExpanded && !isMobile ? "gap-3" : "gap-0",
    );
  }, [layout.sideBarExpanded, isMobile]);

  const {
    query: queryParams,
    trend,
    resetQuery,
    isQueryPresent,
  } = useGetQueryParameters();

  useEffect(() => {
    if (!isQueryPresent) {
      return;
    }

    if (trend) {
      query.onSendQuery({ onSuccess, trend });
      resetQuery();
      return;
    }

    if (queryParams) {
      query.onSendQuery({ onSuccess, query: queryParams });
      resetQuery();
      return;
    }
  }, [queryParams, trend]);

  const onSuccess = () => {
    ref.current?.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const unsubscribe = customEvent.subscribe("send-query", (e) => {
      query.onSendQuery({ onSuccess, query: e.detail.data });
    });
    return () => unsubscribe();
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <div
        className={containerStyle}
        style={{
          height: `calc(100dvh - ${props.headerHeight || DEFAULT_HEADER_HEIGHT}px)`,
        }}
      >
        <ChatSection />
        <ContentSection ref={ref} />
      </div>
    </Suspense>
  );
}

export default V2Layout;
