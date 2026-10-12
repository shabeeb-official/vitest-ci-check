import { useProductListFilter } from "@/store/filter";
import { FilterConfigItem } from "@/config/filter-config";
import clsx from "clsx";
import { useProducts } from "@/store/products";
import { useMemo } from "react";

type GenericOptionFilterProps = {
  config: FilterConfigItem;
  options: string[];
  styles?: any;
};

const GenericOptionFilter = ({
  config,
  options,
  styles,
}: GenericOptionFilterProps) => {
  const { filterValues, onUpdateFilter } = useProductListFilter();
  const selectedValues = (filterValues[config.code] as string[]) || [];
  const { products } = useProducts();

  const colorMap = useMemo(() => {
    if (
      config.code.toLowerCase() !== "color" &&
      config.code.toLowerCase() !== "shade"
    )
      return {};
    return products.reduce(
      (acc, product) => {
        // facet_color matches the option string
        if (product.facet_color && product.sw_image) {
          acc[product.facet_color] = product.sw_image;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [products, config.code]);

  const handleSelect = (value: string) => {
    onUpdateFilter(value, config.code);
  };

  if (!options || options.length === 0) {
    return null;
  }

  if (config.code.toLowerCase() === "size") {
    const sizeOrder = [
      "XXXS",
      "XXS",
      "XS",
      "S",
      "SM",
      "M",
      "MD",
      "ME",
      "L",
      "LG",
      "XL",
      "XXL",
      "XXXL",
      "XXXXL",
    ];

    const normalize = (v: string) => v.trim().toUpperCase();

    options = [...options].sort((a, b) => {
      const aVal = normalize(a);
      const bVal = normalize(b);

      const aNum = Number(aVal);
      const bNum = Number(bVal);

      const aIsNum = !isNaN(aNum);
      const bIsNum = !isNaN(bNum);

      if (aIsNum && bIsNum) return aNum - bNum;

      if (!aIsNum && !bIsNum) {
        const ai = sizeOrder.indexOf(aVal);
        const bi = sizeOrder.indexOf(bVal);
        if (ai !== -1 && bi !== -1) return ai - bi;
        return aVal.localeCompare(bVal);
      }

      return aIsNum ? -1 : 1;
    });
  }

  return (
    <div className={clsx(styles?.filterPanel ?? "p-4")}>
      <div className={styles?.colorWrapper ?? "flex flex-wrap gap-2"}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          if (config.code.toLowerCase() === "color") {
            const swatchUrl = colorMap[option];

            return (
              <div
                key={option}
                className="flex gap-2 cursor-pointer items-center"
                onClick={() => handleSelect(option)}
              >
                <div
                  className={clsx(
                    styles?.colorPill ?? "flex gap-2 cursor-pointer",
                    isSelected
                      ? (styles?.colorPillSelected ??
                          "p-[3px] border-black border-2")
                      : "",
                  )}
                >
                  {swatchUrl ? (
                    <img
                      src={swatchUrl}
                      alt={option}
                      className={styles?.colorPillImage ?? "h-5 w-5"}
                    />
                  ) : (
                    <div
                      className={styles?.colorPillImage ?? "h-5 w-5"}
                      style={{ backgroundColor: option.toLowerCase() }}
                    />
                  )}
                </div>
                <span
                  className={styles?.genericFilterItemsLabel || "text-[14px]"}
                >
                  {option}
                </span>
              </div>
            );
          }

          // Default rendering
          return (
            <div
              key={option}
              className={clsx(
                isSelected
                  ? (styles?.genericFilterItemsSelected ??
                      "cursor-pointer border px-4 py-2 text-[14px] transition-colors bg-[#ffe1ea] text-black border-black")
                  : (styles?.genericFilterItemsNotSelected ??
                      "cursor-pointer border px-4 py-2 text-[14px] transition-colors bg-white text-gray-700 border-gray-300 hover:border-gray-400"),
              )}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenericOptionFilter;
