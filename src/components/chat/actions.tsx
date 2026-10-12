import clsx from "clsx";
import SendIcon from "./send-icon";
import { useCallback, useMemo } from "react";
import { MOBILE_WIDTH } from "@/config";
import useGetCountry from "@/hooks/use-country";

type TChatFooterProps = {
  url?: string;
  info?: string;
  footerWrapperStyle?: string;
  footerLinkStyle?: string;
  footerTextPrefix?: string;
  footerLinkText?: string;
  footerTextSuffix?: string;
  footerTextStyle?: string;
};

type Props = {
  searchTerm: string;
  chatWindow: boolean;
  isSubmitting: boolean;
  align?: "left" | "right";
  onClick: () => void;
  chatButtonActionIcon?: string;
  addFooter: boolean;
  footerProps: TChatFooterProps;
  styles?: any;
};

const ChatInputActions = (props: Props) => {
  const {
    searchTerm,
    chatWindow,
    onClick,
    align,
    styles,
    chatButtonActionIcon,
    addFooter = false,
    footerProps,
  } = props;

  const className = clsx(
    "flex items-center gap-4",
    addFooter
      ? window.innerWidth > MOBILE_WIDTH
        ? "justify-between"
        : "justify-end"
      : align === "left"
        ? "justify-start"
        : "justify-end",
  );

  const handleClick = useCallback(() => {
    if (searchTerm.length > 0) {
      onClick();
    }
  }, [searchTerm, onClick]);

  const activeRegions = useGetCountry();
  const URI = useMemo(() => {
    if (activeRegions && footerProps?.url) {
      return footerProps.url.replace(":region", activeRegions);
    }
    return "";
  }, [activeRegions, footerProps?.url]);

  console.log("Chat Active Region", activeRegions);
  console.log("Contact URI", URI);

  return (
    <>
      <div id="actions-section" className={className}>
        {window.innerWidth > MOBILE_WIDTH ? (
          URI ? (
            <div
              className={
                footerProps?.footerWrapperStyle ||
                "flex items-center justify-center"
              }
            >
              <p className={footerProps?.footerTextStyle}>
                {footerProps?.footerTextPrefix}{" "}
                <a href={URI} className={footerProps?.footerLinkStyle}>
                  {footerProps?.footerLinkText}
                </a>{" "}
                {footerProps?.footerTextSuffix}
              </p>
            </div>
          ) : null
        ) : null}
        <div
          className={clsx(
            searchTerm.length > 0 ? "cursor-pointer" : "cursor-not-allowed",
          )}
          onClick={handleClick}
        >
          {chatButtonActionIcon ? (
            <img
              src={chatButtonActionIcon}
              alt="send-icon"
              className={styles?.imageWidth || "min-w-[25px]"}
            />
          ) : (
            <SendIcon
              disabled={searchTerm.length === 0}
              chatWindow={chatWindow}
              styles={styles}
            />
          )}
        </div>
      </div>
    </>
  );
};

type TestProps = {
  wrapperStyle: string;
  textStyle: string;
  prefix: string;
  linkStyle: string;
  linkText: string;
  suffix: string;
  url: string;
};

export const ChatFooter = (props: TestProps) => {
  const { linkStyle, linkText, prefix, suffix, textStyle, wrapperStyle, url } =
    props;

  const activeRegions = useGetCountry();
  const URI = useMemo(() => {
    if (activeRegions && url) {
      return url.replace(":region", activeRegions);
    }
    return "";
  }, [activeRegions, url]);

  console.log(wrapperStyle);
  return (
    <div className={wrapperStyle || "flex items-center justify-center"}>
      <p className={textStyle}>
        {prefix}{" "}
        <a href={URI} className={linkStyle}>
          {linkText}
        </a>{" "}
        {suffix}
      </p>
    </div>
  );
};
export default ChatInputActions;
