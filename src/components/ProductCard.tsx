import { ReactNode } from "react";

type ProductCardProps = {
  navigateToProduct: () => void;
  children: ReactNode;
  styles: { base: string };
};

const ProductCard = (props: ProductCardProps) => {
  const { navigateToProduct, children, styles } = props;
  const baseStyle =
    "bg-white overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-md flex flex-col";
  return (
    <>
      <div
        onClick={navigateToProduct}
        className={styles ? styles.base : baseStyle}
      >
        {children}
      </div>
    </>
  );
};

export default ProductCard;
