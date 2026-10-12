import { ReactNode } from "react";

export const ProductCardBody = ({
  children,
  styles,
}: {
  children: ReactNode;
  styles: { content: string };
}) => {
  return <div className={styles.content}>{children}</div>;
};
