import { useProdctDetail } from "@/store/product-detail";
import { Render } from "../conditional";
import Currency from "../currency";

type ProductPriceProps = {
  priceWrapperStyle: string;
  priceSaleStyle: string;
  priceStrikeStyle: string;
};

export const ProductPriceComponent = (props: ProductPriceProps) => {
  const { priceWrapperStyle, priceSaleStyle, priceStrikeStyle } = props;
  const product = useProdctDetail();
  return (
    <Render
      when={product.sale_price != ""}
      show={
        <div className={priceWrapperStyle}>
          <p className={priceSaleStyle}>
            <Currency>{product.sale_price}</Currency>
          </p>
          <p className={priceStrikeStyle}>
            <Currency>{product.price}</Currency>
          </p>
        </div>
      }
      otherwise={
        <p className={`${priceWrapperStyle} text-gray-900 mb-4`}>
          <Currency>{product.price}</Currency>
        </p>
      }
    />
  );
};
