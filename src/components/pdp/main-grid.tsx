import { ReactNode } from "react";

type Props = {
  style: string;
  children: ReactNode;
};

const PDPWrapper = ({ style, children }: Props) => {
  return <div className={style}>{children}</div>;
};

export default PDPWrapper;
