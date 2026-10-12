import { useProductListFilter } from "@/store/filter";
import { useProducts } from "@/store/products";
import { compareSizesDirect } from "@/utils/sort-sizes";
import clsx from "clsx";
import { useMemo } from "react";

const SizeFilterItem = ({ styles }: { styles?: any }) => {
  const { onUpdateFilter, filterValues } = useProductListFilter();
  const { products } = useProducts();
  const sizes = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    return [
      ...new Set(
        products
          .map((product) => {
            return product.size_options?.split(",");
          })
          .filter(Boolean)
          .flat()
          .map((item) => item.trim())
          .sort(compareSizesDirect),
      ),
    ];
  }, [products]);

  return (
    <div className={styles?.filterPanel ?? "flex justify-center mb-10 " }>
      <div className="flex gap-3">
        {sizes.map((size) => {
          let isSelected = false;
          if (filterValues.size !== "none") {
            isSelected = filterValues.size.includes(size);
          }

          const style = clsx(
            "cursor-pointer p-1 min-w-8 h-8  text-nowrap text-center",
            isSelected ? "border-2 border-black" : "",
          );
          return (
            <div
              className={style}
              onClick={() => {
                onUpdateFilter(size);
              }}
            >
              {size}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SizeFilterItem;
