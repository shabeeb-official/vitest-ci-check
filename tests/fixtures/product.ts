import { ProductListItem } from "@/types/product";

export const product = (
  id: string,
  overrides: Partial<ProductListItem> = {},
): ProductListItem => ({
  id,
  sku: `SKU-${id}`,
  title: `Product ${id}`,
  price: 10,
  brand: "Brand",
  trend: "trend",
  imageUrl: `/img/${id}.jpg`,
  sw_image: `/sw/${id}.jpg`,
  facet_color: "black",
  size_options: "M",
  ...overrides,
});
