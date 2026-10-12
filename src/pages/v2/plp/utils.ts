import { ProductListItem } from "@/types/product";
import { FilterTypes } from "./types";
import { ColorFilterItem } from "./types";
import { compareSizesDirect } from "@/utils/sort-sizes";

export const handleSortFilter = (
  products: ProductListItem[],
  filters: FilterTypes,
) => {
  const [sort] = filters.sort;
  return products
    .map((product) => {
      if (product.discount_price) {
        return { ...product, effective_price: product.discount_price };
      }
      return { ...product, effective_price: product.price };
    })
    .sort((a, b) => {
      if (sort === "") {
        return 0;
      }
      if (sort === "low-high") {
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
};

export const handlePriceFilter = (
  products: ProductListItem[],
  filters: FilterTypes,
) => {
  const selectedPriceValue = filters.price[0];
  if (selectedPriceValue > 0) {
    return products.filter(({ price: product_price }) => {
      const price =
        typeof product_price === "string"
          ? parseFloat(product_price)
          : product_price;

      return price < selectedPriceValue;
    });
  }
};

export function extractColors(products: ProductListItem[]) {
  const temp = {};
  for (let { sw_image, facet_color } of products) {
    if (!temp[facet_color]) {
      temp[facet_color] = sw_image;
    }
  }
  const colorList: ColorFilterItem[] = Object.entries(temp).map(([k, v]) => {
    return { colorName: k, src: v as string };
  });

  return colorList;
}

export function extractBrands(products: ProductListItem[]) {
  const extractedBrands = products.map(({ brand }) => brand);
  const brandList = [...new Set(extractedBrands)].map((brand) => ({
    brandName: brand,
  }));
  return brandList;
}

export function extractSizes(products: ProductListItem[]) {
  const sizeOptions = products.reduce((prev, curr) => {
    if (!curr.size_options) {
      return prev;
    }
    const options = curr.size_options.split(",");
    return [...prev, ...options];
  }, []);

  const uniqueEntries = [...new Set(sizeOptions)]
    .filter(Boolean)
    .sort(compareSizesDirect);

  return uniqueEntries.map((name) => ({ name }));
}

export function extractPriceRanges(products: ProductListItem[]) {
  const price = products
    .map(({ price }) => (price ? parseFloat(price as string) : 0))
    .sort((a, b) => a - b);

  const length = price.length;

  if (length === 0)
    return {
      start: 0,
      default: 0,
      end: 0,
    };

  const middleIndex = Math.floor(length / 2);

  return {
    start: price[0],
    default: price[middleIndex],
    end: price[length - 1],
  };
}
