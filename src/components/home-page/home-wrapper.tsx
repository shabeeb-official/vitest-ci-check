import { ReactNode } from "react";

interface HomeWrapperProps {
  children?: ReactNode;
  headerHeight?: number;
  styles?: string;
}

const HomeWrapper = ({ children, headerHeight = 0, styles }: HomeWrapperProps) => {
  return (
    <div
      className={styles || "w-full flex items-center justify-center flex-col"}
      style={{
        height: `calc(100dvh - ${headerHeight}px)`,
      }}
    >
      {children}
    </div>
  );
};

export default HomeWrapper;
