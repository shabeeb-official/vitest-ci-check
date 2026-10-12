import { ReactNode } from "react";

export type ImageWrapperProps = {
  styles: { imageWrap: string };
  children?: ReactNode;
};

export const ImageWrapper = (props: ImageWrapperProps) => {
  const { styles, children } = props;
  return <div className={styles.imageWrap}>{children}</div>;
};
