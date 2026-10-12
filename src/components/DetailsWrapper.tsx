import { ProductListItem } from "@/types/product";
import { ReactNode } from "react";

export type DetailWrapperProps = {
  product: ProductListItem;
  children: ReactNode;
  styles: { details: string };
};

export const DetailsWrapper = (props: DetailWrapperProps) => {
  const { children, styles } = props;
  return <div className={styles.details}>{children}</div>;
};
