import { useProductListFilter } from "@/store/filter";
import { useProducts } from "@/store/products";
import clsx from "clsx";
import { useMemo } from "react";

const ColorFilterItem = ({ styles }: { styles?: any }) => {
  const { onUpdateFilter, filterValues } = useProductListFilter();
  const { products } = useProducts();
  const colors = useMemo(() => {
    if (products.length === 0) {
      return [];
    }
    return Object.entries(
      products
        .map((product) => {
          if (product.sw_image && product.facet_color) {
            return {
              colorName: product.facet_color,
              swatchURL: product.sw_image,
            };
          }
          return null;
        })
        .filter(Boolean)
        .reduce((acc, curr) => {
          if (acc[curr.colorName]) {
            return acc;
          }
          return { ...acc, [curr.colorName]: curr.swatchURL };
        }, {}),
    );
  }, [products]);

  return (
    <div className={styles?.filterPanel ?? "grid grid-cols-12 mb-10"}>
      <span className="col-span-3" />
      <div className="col-span-6 h-200 flex gap-4  flex-wrap justify-start">
        {colors.map(([colorName, swatchURL]) => {
          let isSelected = false;

          if (filterValues.color !== "none") {
            const index = filterValues.color.findIndex((color) => {
              return color === colorName;
            });
            isSelected = index > -1;
          }
          const style = clsx(
            styles?.colorPill ?? "flex gap-2 cursor-pointer",
            isSelected
              ? (styles?.colorPillSelected ?? "p-[3px] border-black border-2")
              : "",
          );

          return (
            <div
              className="flex gap-2 cursor-pointer items-center"
              onClick={() => {
                onUpdateFilter(colorName);
              }}
            >
              <div className={style}>
                <img
                  src={swatchURL}
                  aria-label={colorName}
                  className={styles?.colorPillImage ?? "h-5 w-5"}
                />
              </div>
              {colorName}
            </div>
          );
        })}
      </div>
      <span className="col-span-3" />
    </div>
  );
};

export default ColorFilterItem;
