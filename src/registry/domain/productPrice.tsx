import { Render } from "@/components/conditional";
import Currency from "@/components/currency";
import { useProdctDetail } from "@/store/product-detail";

import { ReactNode } from "react";

type Props = {
  slots: {
    regularPrice: ReactNode;
    salePrice: ReactNode;
  };
};

export const ProductPriceComponent = (props: Props) => {
  const product = useProdctDetail();

  const { slots } = props;

  const isSalePrice = product.sale_price != "";

  return (
    <Render
      when={isSalePrice}
      show={<SalePrice price={product.price} sale_price={product.sale_price} />}
      otherwise={slots.regularPrice}
    />
  );
};

type SalePriceProps = {
  sale_price: string;
  price: string;
};

const SalePrice = (props: SalePriceProps) => {
  const { price, sale_price } = props;
  return (
    <>
      <p className="text-lg font-light sale-item-color mb-2">
        <Currency>{sale_price}</Currency>
      </p>
      <p className="text-sm font-light text-gray-500 mb-2 line-through">
        <Currency>{price}</Currency>
      </p>
    </>
  );
};

type RegularPriceProps = {
  price: string;
};

const RegularPrice = (props: RegularPriceProps) => {
  const { price } = props;
  return (
    <p className="text-lg font-light text-gray-900 mb-4">
      <Currency>{price}</Currency>
    </p>
  );
};
