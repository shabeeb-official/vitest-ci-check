import { ReactNode } from "react";

type BoxProps = {
  as: "div" | "section" | "main" | "label" | "table" | "tbody" | "thead" | "th" | "tr" | "td";
  className: string;
  children: ReactNode;
  onClick?: () => void;
  isLenght: [] | {}
};

export const Box = (props: BoxProps) => {
  const { as, children, className, isLenght, onClick } = props;
  const Comp = as;



  return <Comp className={className} onClick={onClick}>{children}</Comp>;
};
