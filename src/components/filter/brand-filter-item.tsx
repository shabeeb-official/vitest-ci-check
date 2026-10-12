import { useProductListFilter } from "@/store/filter";
import { useProducts } from "@/store/products";
import { useMemo } from "react";

const BrandFilterItems = ({ styles }: { styles?: any }) => {
  const { onUpdateFilter, filterValues } = useProductListFilter();
  const { products } = useProducts();
  const brands = useMemo(() => {
    if (products.length === 0) {
      return [];
    }
    return [...new Set(products.map((product) => product.brand))];
  }, [products]);

  return (
    <div className={styles?.filterPanel ?? "grid grid-cols-12 mb-10"}>
      <span className="col-span-3" />
      <div className="col-span-6 h-200 flex gap-4  flex-wrap justify-start">
        {brands.map((brand) => {
          return (
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => {
                onUpdateFilter(brand);
              }}
            >
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={filterValues.brand?.includes(brand)}
              />
              {brand}
            </div>
          );
        })}
      </div>
      <span className="col-span-3" />
    </div>
  );
};

export default BrandFilterItems;
