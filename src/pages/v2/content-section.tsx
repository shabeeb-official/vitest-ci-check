import { Render } from "@/components/conditional";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import useShowPanel from "@/hooks/use-show-panel";
import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { Outlet } from "react-router-dom";

function ContentSection(
  _: unknown,
  ref: React.MutableRefObject<HTMLDivElement>,
) {
  const { content } = useShowPanel();
  const isMobile = useIsMobileWidth();

  const outletContainerStyle = useMemo(() => {
    return clsx(
      "flex h-full min-h-0 flex-col overflow-hidden bg-white",
      isMobile ? "w-full flex-1" : "min-w-0 flex-[9.5]",
    );
  }, [isMobile]);

  return (
    <Render
      when={content}
      show={
        <div className={outletContainerStyle} ref={ref} id="layout-container">
          <Outlet context={ref} />
        </div>
      }
    />
  );
}

export default forwardRef(ContentSection);
