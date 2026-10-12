import { useProducts } from "@/store/products";
import { useMemo } from "react";

export function useFilterProducts(filterValues: any) {
  const { products } = useProducts();
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const productPrice = Number(product.price);

      const productSizes =
        product.size_options?.split(",").map((size) => size.trim()) ?? [];

      if (
        filterValues.brand?.length &&
        !filterValues.brand.includes(product.brand)
      ) {
        return false;
      }

      if (
        filterValues.color?.length &&
        !filterValues.color.includes(product.facet_color)
      ) {
        return false;
      }

      if (
        filterValues.size?.length &&
        !filterValues.size.some((size) => productSizes.includes(size))
      ) {
        return false;
      }

      if (filterValues.price?.length && productPrice > filterValues.price[0]) {
        return false;
      }

      return true;
    });

    const sortType = filterValues.sort?.[0];

    switch (sortType) {
      case "high-low":
        return [...filtered].sort((a, b) => Number(b.price) - Number(a.price));

      case "low-high":
        return [...filtered].sort((a, b) => Number(a.price) - Number(b.price));

      default:
        return filtered;
    }
  }, [products, filterValues]);

  return filteredProducts;
}
