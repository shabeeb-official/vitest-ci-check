import { FilterConfigItem, FilterType } from "@/config/filter-config";

interface Product {
  attributes?: Record<string, string | string[]>;
  price?: string | number;
  [key: string]: any;
}

/**
 * Determines if a value is numeric
 */
function isNumeric(value: string | number): boolean {
  if (typeof value === "number") return true;
  if (typeof value !== "string") return false;
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
}

/**
 * Determines if an attribute should be treated as a range or option filter
 */
function determineFilterType(
  attributeCode: string,
  values: (string | number)[]
): FilterType {
  // Price is always a range
  if (attributeCode === "price") return "range";

  // If all values are numeric, it's likely a range
  const numericValues = values.filter(isNumeric);
  if (numericValues.length === values.length && values.length > 0) {
    // But exclude codes that are typically options (size, color, etc.)
    if (["size", "rating", "stock"].includes(attributeCode.toLowerCase())) {
      return "option";
    }
    return "range";
  }

  return "option";
}

/**
 * Generates filter configuration dynamically from products
 */
export function generateFilterConfig(products: Product[]): FilterConfigItem[] {
  const attributeMap: Record<string, Set<string | number>> = {};
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  // Collect all attribute values from products
  products.forEach((product) => {
    // Handle price
    if (product.price) {
      const price = isNumeric(product.price)
        ? parseFloat(String(product.price))
        : 0;
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);
    }

    // Handle attributes
    if (product.attributes) {
      Object.entries(product.attributes).forEach(([key, value]) => {
        if (!attributeMap[key]) {
          attributeMap[key] = new Set();
        }
        if (Array.isArray(value)) {
          value.forEach((v) => attributeMap[key].add(v));
        } else {
          attributeMap[key].add(value);
        }
      });
    }
  });

  // Build filter config
  const config: FilterConfigItem[] = [];

  // Add price filter if we have valid price data
  if (minPrice !== Infinity && maxPrice !== -Infinity) {
    config.push({
      code: "price",
      label: "Price",
      type: "range",
      min: Math.floor(minPrice),
      max: Math.ceil(maxPrice),
    });
  }

  // Add attribute filters
  Object.entries(attributeMap).forEach(([code, valueSet]) => {
    const values = Array.from(valueSet);
    const type = determineFilterType(code, values as (string | number)[]);

    const labelFromCode = code
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const filterItem: FilterConfigItem = {
      code,
      label: labelFromCode,
      type,
    };

    // If it's a range type, calculate min/max for numeric attributes
    if (type === "range") {
      const numericValues = values
        .filter(isNumeric)
        .map((v) => parseFloat(String(v)));
      if (numericValues.length > 0) {
        filterItem.min = Math.floor(Math.min(...numericValues));
        filterItem.max = Math.ceil(Math.max(...numericValues));
      }
    }

    config.push(filterItem);
  });

  return config;
}

/**
 * Sorts filter config to prioritize common filters
 */
export function prioritizeFilterConfig(
  config: FilterConfigItem[]
): FilterConfigItem[] {
  const priorityOrder = [
    "price",
    "color",
    "facet_color",
    "size",
    "brand",
    "fit",
    "sleeve_length",
  ];

  const sorted = [...config].sort((a, b) => {
    const indexA = priorityOrder.indexOf(a.code);
    const indexB = priorityOrder.indexOf(b.code);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return sorted;
}
