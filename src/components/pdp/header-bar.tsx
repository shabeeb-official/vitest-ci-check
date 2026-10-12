import { useLayout } from "@/contexts/layoutContext";
import clsx from "clsx";
import { ReactNode } from "react";

type HeaderBarProps = {
  styles: string;
  children?: ReactNode;
};

const HeaderBar = ({ styles, children }: HeaderBarProps) => {
  const { sideBarExpanded } = useLayout();

  const finalStyle = clsx(styles, sideBarExpanded ? "gap-5" : "gap-3");

  return <div className={finalStyle}>{children}</div>;
};

export default HeaderBar;
