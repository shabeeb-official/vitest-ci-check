export interface ProductListItem {
  id: string;
  sku: string;
  title: string;
  price: number | string;
  brand: string;
  trend: string;
  imageUrl: string;
  discount_price?: string | number;
  sw_image: string;
  facet_color: string;
  size_options: string;
  categories?: string;
  attributes?: Record<string, any>;
  extra_details?: any[];
}

export interface EmarysArg {
  page: {
    products: ProductListItem[];
  };
}

export interface EmarysHomeProductResponse {
  id: string;
  image: string;
  title: string;
  brand: string;
  price_au: string;
  group_id: string;
}

export interface Product {
  id: string;
  sku: string;
  pattern: string;
  title: string;
  price: string;
  description: string;
  sale_price?: string;
  brand: string;
  trend: string;
  imageUrl: string;
  mainImageUrl: string;
  colors: string[];
  sizes: string[];
  images?: string[];
  swatch: string;
  swatchName: string;
  designerNotes: string;
  attributes?: Record<string, any>;
  extra_details?: any[];
  pdp_context_attributes?: string | null
}

export interface ProductResponse {
  name: string;
  item_group_id: string;
  description: string;
  Brand: string;
  image_url_1: string;
  product_id: string;
  imageUrl: string;
  price: string;
  sale_price: string;
  colors: string[];
  sizes: string[];
  pattern: string;
  sw_image: string;
  facet_color: string;
  designDetails: string;
  attributes?: Record<string, any>;
  extra_details?: any[];
  pdp_context_attributes?: string | null
}

export type Size = { id: string; size: string };
export type Color = { id: string; color: string; sizes: string[] };

export type SizeObject = {
  [key: string]: {
    id: string;
    label: string;
    sizes: { id: string; label: string }[];
  };
};

export type Sort = "low-high" | "high-low" | "none";
export type Brand = string | string[] | "none";
export type FilterColor = string | string[] | "none";
export type FilterSize = string | string[] | "none";
export type Price = number | "none";

export type Filters = string;

export type OnSelectFilter = (v: Filters) => void;
export type OnUpdateFilter = (
  v: Sort | Price | Brand,
  filterCode?: string,
) => void;

export type FilterValues = {
  sort: Sort;
  price: Price;
  [key: string]: any;
};

export type FilterProvider = {
  selectedFilter: Filters;
  filterValues: FilterValues;
  onSelectFilter: OnSelectFilter;
  onUpdateFilter: OnUpdateFilter;
  clearFilter: () => void;
  onCloseFilter: () => void;
};
