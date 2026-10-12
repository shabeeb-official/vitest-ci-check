import { useState, useMemo, useEffect } from "react";
import { useProducts } from "@/store/products";
import { useProductListFilter } from "@/store/filter";
import { debug } from "debug";
import { FilterSize, ProductListItem } from "@/types/product";

const log = debug("app:ProductsPage");

const useFilterProducts = () => {
  const { products, status } = useProducts();
  const { filterValues, clearFilter } = useProductListFilter();
  const [resetFilter, setResetFilter] = useState<"ready" | "no">("no");

  useEffect(() => {
    if (status === "loading") {
      log("product is loading getting ready to clear filter");
      setResetFilter("ready");
    }
    if (status === "success" && resetFilter === "ready") {
      log("product loaded clearing the filter");
      setResetFilter("no");
      clearFilter();
      log("reset filter back to inital state");
    }
  }, [status, resetFilter, clearFilter]);

  const filteredProducts = useMemo(() => {
    const filtered = [...products]
      .filter((product) => {
        // Price filter (special handling)
        if (filterValues.price !== "none") {
          const price = Number(product.discount_price || product.price);
          if (price > filterValues.price) return false;
        }

        // Category filter (special handling)
        if (filterValues.category !== "none" && Array.isArray(filterValues.category) && filterValues.category.length > 0) {
          const selectedCats = filterValues.category;
          const productCat = product.categories?.toLowerCase();
          if (!selectedCats.includes(productCat)) return false;
        }

        // Generic handling for other filters
        for (const key in filterValues) {
          if (key === "price" || key === "sort" || key === "category") continue;

          const filterVal = filterValues[key];
          if (
            filterVal === "none" ||
            (Array.isArray(filterVal) && filterVal.length === 0)
          )
            continue;

          // Check against product attributes
          // Priority: product.attributes[key] -> product[key]
          let productVal: any = undefined;

          if (product.attributes && product.attributes[key]) {
            productVal = product.attributes[key];
          } else if ((product as any)[key]) {
            productVal = (product as any)[key];
          }

          // Also map some legacy keys if needed, e.g. 'color' -> 'facet_color' if not in attributes
          if (!productVal && key === "color") productVal = product.facet_color;
          if (!productVal && key === "size") productVal = product.size_options; // requires parsing?

          if (!productVal) return false; // If product doesn't have the attribute, it doesn't match the filter.

          if (Array.isArray(filterVal)) {
            // If filter is multiple options (OR logic usually)
            // If product attribute is array (e.g. size options), check intersection
            // If product attribute is single value, check inclusion

            const filterSet = new Set(filterVal as string[]);

            if (Array.isArray(productVal)) {
              // Product has multiple values (e.g. sizes), if ANY match, keep it
              if (!productVal.some((v) => filterSet.has(v))) return false;
            } else if (typeof productVal === "string") {
              // For size_options which is a comma string
              if (
                key === "size" &&
                typeof productVal === "string" &&
                productVal.includes(",")
              ) {
                const sizes = productVal.split(",").map((s) => s.trim());
                if (!sizes.some((v) => filterSet.has(v))) return false;
              } else {
                if (!filterSet.has(productVal)) return false;
              }
            } else {
              // number types etc
              if (!filterSet.has(String(productVal))) return false;
            }
          }
        }

        return true;
      })
      .map((product) => {
        if (product.discount_price) {
          return { ...product, effective_price: product.discount_price };
        }
        return { ...product, effective_price: product.price };
      })
      .sort((a, b) => {
        if (filterValues.sort === "none") {
          return 0;
        }
        if (filterValues.sort === "low-high") {
          return (
            parseFloat(a.effective_price.toString()) -
            parseFloat(b.effective_price.toString())
          );
        }
        return (
          parseFloat(b.effective_price.toString()) -
          parseFloat(a.effective_price.toString())
        );
      });

    return filtered;
  }, [products, filterValues]);

  return filteredProducts;
};

const filterSizes = (filtered: ProductListItem[], sizes: FilterSize) => {
  const temp = [];
  for (let i = 0; i < filtered.length; i++) {
    const trimmedSizes = extractSizesAndTrim(filtered[i].size_options);

    for (let j = 0; j < trimmedSizes.length; j++) {
      if (sizes.includes(trimmedSizes[j])) {
        const productIndex = temp.findIndex((product) => {
          return product.sku === filtered[i].sku;
        });
        if (productIndex === -1) {
          temp.push(filtered[i]);
        }
      }
    }
  }
  return temp;
};

const extractSizesAndTrim = (sizeString: string): string[] => {
  return sizeString.split(",").map((size) => size.trim());
};
export default useFilterProducts;
