import { ProductListItem } from "@/types/product";
import { handleTextSelection } from "@/utils/helper/textSelector";

export type TitleProps = {
  product: ProductListItem;
  styles: { title: string };
};

export const ProductTitle = (props: TitleProps) => {
  const { product, styles } = props;
  return (
    <p className={styles.title} onClick={handleTextSelection}>
      {product.title}
    </p>
  );
};
