import { useProdctDetail } from "@/store/product-detail";
import { Render } from "../conditional";

type ProductBrandProps = {
  brandStyle: string;
};

export const ProductBrandComponent = (props: ProductBrandProps) => {
  const { brandStyle } = props;
  const product = useProdctDetail();

  return (
    <Render
      when={Boolean(product.brand)}
      show={<h2 className={brandStyle}>{product.brand}</h2>}
    />
  );
};
