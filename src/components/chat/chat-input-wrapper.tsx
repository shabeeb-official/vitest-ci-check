import { ReactNode, useMemo } from "react";
import clsx from "clsx";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";

type ChatInputWrapperProps = {
  children: ReactNode;
  chatWindow?: boolean;
  bgColor?: string;
  styles: {
    backgroundColor: string;
    base: string;
    mobile: {
      outerWrapper: string;
      innerWrapper: string;
    };
  };
};

export const ChatInputWrapper = (props: ChatInputWrapperProps) => {
  const { children, chatWindow, styles } = props;

  const isMobileWidth = useIsMobileWidth();
  const { innerWrapper, outerWrapper } = styles.mobile;
  const style = useMemo(() => {
    const { backgroundColor, base } = styles;
    return clsx(base, backgroundColor, chatWindow ? "w-full" : "w-[45%]");
  }, [chatWindow, styles]);

  if (isMobileWidth) {
    return (
      <div className={outerWrapper}>
        <div className={innerWrapper}>{children}</div>
      </div>
    );
  }

  return <div className={style}>{children}</div>;
};
export default ChatInputWrapper;
