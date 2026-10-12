import { useProducts } from "@/store/products";
import { useEffect, useMemo } from "react";
import { Slider } from "../ui/slider";
import { useProductListFilter } from "@/store/filter";
import Currency from "../currency";

const PriceFilterItem = ({ styles }: { styles?: any }) => {
  const { products } = useProducts();
  const { onUpdateFilter, filterValues } = useProductListFilter();
  const priceFilterCurrencyTextWrapper =
    styles.priceFilterCurrencyTextWrapper || "flex gap-2 font-light";

  const sortedPriceList = useMemo(() => {
    return (
      products
        .map((product) => {
          const price = product.discount_price
            ? product.discount_price
            : product.price;
          return parseFloat(price?.toString());
        })
        .sort((a, b) => a - b) || []
    );
  }, [products]);
  console.log("sortedPriceList", sortedPriceList);
  const [start, middle, end] = useMemo(() => {
    const length = sortedPriceList.length;

    if (length === 0) return [0, 0, 0];

    const middleIndex = Math.floor(length / 2);

    return [
      sortedPriceList[0],
      sortedPriceList[middleIndex],
      sortedPriceList[length - 1],
    ];
  }, [sortedPriceList]);

  useEffect(() => {
    if (filterValues.price === "none") {
      console.log('middle', middle)
      onUpdateFilter(middle);
    }
  }, [middle, onUpdateFilter, filterValues]);

  return (
    <div className={styles?.filterPanel ?? "mb-8 w-full flex justify-center"}>
      <div className="w-[50%]">
        <div className={priceFilterCurrencyTextWrapper}>
          <p>
            <Currency>{start}</Currency>
          </p>
          -
          <p>
            <Currency>{filterValues.price as number}</Currency>
          </p>
        </div>
        <Slider
          min={start}
          max={end}
          step={1}
          defaultValue={[middle]}
          value={[filterValues.price as number]}
          onValueChange={(v) => onUpdateFilter(v[0])}
          className="w-full cursor-grab active:cursor-grabbing"
        />
      </div>
    </div>
  );
};

export default PriceFilterItem;
