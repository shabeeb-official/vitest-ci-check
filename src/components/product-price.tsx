import Currency from "./currency";
import { Render } from "./conditional";
import { ProductListItem } from "@/types/product";
import { handleTextSelection } from "@/utils/helper/textSelector";

type PriceProps = {
  product: ProductListItem;
  styles: { strike: string; sale: string; price: string; priceWrapper: string };
};

export const ProductPrice = (props: PriceProps) => {
  const { product, styles } = props;

  return (
    <div className={`${styles.priceWrapper} `}>
      <Render
        when={Boolean(product.discount_price)}
        show={
          <div className="flex gap-2 w-fit cursor-pointer  ">
            <p
              className={`${styles.strike} cursor-pointer w-fit `}
              onClick={handleTextSelection}
            >
              <Currency>{product.price}</Currency>
            </p>
            <p
              className={`${styles.sale} cursor-pointer`}
              onClick={handleTextSelection}
            >
              <Currency>{product.discount_price}</Currency>
            </p>
          </div>
        }
        otherwise={
          <p
            className={`${styles.price} cursor-pointer w-fit`}
            onClick={handleTextSelection}
          >
            <Currency>{product.price}</Currency>
          </p>
        }
      />
    </div>
  );
};
