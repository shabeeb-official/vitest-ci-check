import { ProductListItem } from "@/types/product";

export type Brandprops = {
  product: ProductListItem;
  styles: { brand: string };
};

export const ProductBrand = (props: Brandprops) => {
  const { product, styles } = props;
  return (
    <h3 className={styles?.brand} onClick={(e) => e.stopPropagation()}>
      {product.brand}
    </h3>
  );
};
