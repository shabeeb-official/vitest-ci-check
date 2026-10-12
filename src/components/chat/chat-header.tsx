import { useCallback } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useLayout, useLayoutDispatch } from "@/contexts/layoutContext";
import clsx from "clsx";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { debug } from "debug";
import { HideSm } from "../hider";
import { Render } from "../conditional";
import useIsRTL from "@/hooks/use-is-rtl";

const log = debug("app:Chat");

type ChatHeaderProps = {
  label: string;
  avatar: string;
  mobileAvatar: string;
  chatHeaderToggleIcon: string;
  styles?: {
    avatarMobile: string;
    avatarDesktop: string;
    wrapper?: string;
    inner?: string;
    innerMobile?: string;
    innerDesktop?: string;
    image?: string;
    imageMobile?: string;
    title?: string;
    toggle?: string;
    toggleImageWidth?: string;
  };
};

const ChatHeader = (props: ChatHeaderProps) => {
  const { avatar, styles, chatHeaderToggleIcon } = props;

  const isRTL = useIsRTL();
  const isMobileWidth = useIsMobileWidth();
  const layout = useLayout();
  const layoutDispatch = useLayoutDispatch();

  const onToggle = useCallback(() => {
    log(
      "toggling sidebar, side bar is now",
      layout.sideBarExpanded ? "closed" : "opened",
    );
    layoutDispatch({ type: layout.sideBarExpanded ? "collapse" : "expand" });
  }, [layout.sideBarExpanded, layoutDispatch]);

  return (
    <div
      className={clsx(
        styles?.wrapper || "flex justify-between items-center mb-2",
        isRTL ? "flex-row" : "flex-row-reverse",
      )}
    >
      <div className="flex justify-center w-full">
        <img
          src={avatar}
          alt="sunny-logo"
          className={clsx(
            isMobileWidth ? styles.avatarMobile : styles.avatarDesktop,
          )}
        />
      </div>
      <HideSm>
        <div
          onClick={onToggle}
          title="Close chat window"
          className={clsx(
            styles?.toggle ||
              "bg-[#F8E300] hover:bg-[#F8E300] rounded-[50%] hidden cursor-pointer sm:flex p-1",
          )}
        >
          <Render
            when={isRTL}
            show={
              chatHeaderToggleIcon ? (
                <img
                  src={chatHeaderToggleIcon}
                  alt="toggle-icon"
                  width={styles?.toggleImageWidth || 24}
                />
              ) : (
                <ChevronsLeft />
              )
            }
            otherwise={
              chatHeaderToggleIcon ? (
                <img
                  src={chatHeaderToggleIcon}
                  alt="toggle-icon"
                  width={styles?.toggleImageWidth || 24}
                />
              ) : (
                <ChevronsRight />
              )
            }
          />
        </div>
      </HideSm>
    </div>
  );
};

export default ChatHeader;
