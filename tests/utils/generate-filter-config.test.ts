import { describe, expect, it } from "vitest";

import {
  generateFilterConfig,
  prioritizeFilterConfig,
} from "@/utils/generate-filter-config";

describe("generateFilterConfig", () => {
  it("returns an empty array for an empty product list", () => {
    expect(generateFilterConfig([])).toEqual([]);
  });

  it("generates a price range from numeric prices", () => {
    const products = [{ price: 10 }, { price: 25.5 }, { price: 99.99 }];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "price",
        label: "Price",
        type: "range",
        min: 10,
        max: 100,
      },
    ]);
  });

  it("handles string prices", () => {
    const products = [{ price: "12.50" }, { price: "50.25" }];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "price",
        label: "Price",
        type: "range",
        min: 12,
        max: 51,
      },
    ]);
  });

  it("generates option filters for string attributes", () => {
    const products = [
      {
        attributes: {
          color: "Black",
          brand: "Nike",
        },
      },
      {
        attributes: {
          color: "White",
          brand: "Adidas",
        },
      },
    ];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "color",
        label: "Color",
        type: "option",
      },
      {
        code: "brand",
        label: "Brand",
        type: "option",
      },
    ]);
  });

  it("collects array attribute values", () => {
    const products = [
      {
        attributes: {
          color: ["Black", "White"],
        },
      },
      {
        attributes: {
          color: ["White", "Red"],
        },
      },
    ];

    const result = generateFilterConfig(products);

    expect(result).toEqual([
      {
        code: "color",
        label: "Color",
        type: "option",
      },
    ]);
  });

  it("removes duplicate attribute values", () => {
    const products = [
      {
        attributes: {
          color: "Black",
        },
      },
      {
        attributes: {
          color: "Black",
        },
      },
      {
        attributes: {
          color: ["Black", "White"],
        },
      },
    ];

    const result = generateFilterConfig(products);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      code: "color",
      label: "Color",
      type: "option",
    });
  });

  it("generates range filters for numeric attributes", () => {
    const products = [
      {
        attributes: {
          weight: "10",
        },
      },
      {
        attributes: {
          weight: "25.5",
        },
      },
      {
        attributes: {
          weight: "50",
        },
      },
    ];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "weight",
        label: "Weight",
        type: "range",
        min: 10,
        max: 50,
      },
    ]);
  });

  it("treats size as an option even when values are numeric", () => {
    const products = [
      {
        attributes: {
          size: "8",
        },
      },
      {
        attributes: {
          size: "10",
        },
      },
    ];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "size",
        label: "Size",
        type: "option",
      },
    ]);
  });

  it("treats rating as an option even when values are numeric", () => {
    const products = [
      {
        attributes: {
          rating: "3",
        },
      },
      {
        attributes: {
          rating: "5",
        },
      },
    ];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "rating",
        label: "Rating",
        type: "option",
      },
    ]);
  });

  it("treats stock as an option even when values are numeric", () => {
    const products = [
      {
        attributes: {
          stock: "10",
        },
      },
      {
        attributes: {
          stock: "20",
        },
      },
    ];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "stock",
        label: "Stock",
        type: "option",
      },
    ]);
  });

  it("generates labels from underscore-separated attribute codes", () => {
    const products = [
      {
        attributes: {
          sleeve_length: "Long",
          product_type: "Shirt",
        },
      },
    ];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "sleeve_length",
        label: "Sleeve Length",
        type: "option",
      },
      {
        code: "product_type",
        label: "Product Type",
        type: "option",
      },
    ]);
  });

  it("handles multiple attributes and price together", () => {
    const products = [
      {
        price: 20,
        attributes: {
          color: "Black",
          size: "M",
          weight: "5",
        },
      },
      {
        price: 40,
        attributes: {
          color: "White",
          size: "L",
          weight: "10",
        },
      },
    ];

    const result = generateFilterConfig(products);

    expect(result).toEqual([
      {
        code: "price",
        label: "Price",
        type: "range",
        min: 20,
        max: 40,
      },
      {
        code: "color",
        label: "Color",
        type: "option",
      },
      {
        code: "size",
        label: "Size",
        type: "option",
      },
      {
        code: "weight",
        label: "Weight",
        type: "range",
        min: 5,
        max: 10,
      },
    ]);
  });

  it("handles undefined attributes", () => {
    expect(
      generateFilterConfig([
        {
          price: 20,
        },
        {},
      ]),
    ).toEqual([
      {
        code: "price",
        label: "Price",
        type: "range",
        min: 20,
        max: 20,
      },
    ]);
  });

  it("handles empty attributes", () => {
    expect(
      generateFilterConfig([
        {
          attributes: {},
        },
      ]),
    ).toEqual([]);
  });

  it("handles special characters in attribute values", () => {
    const products = [
      {
        attributes: {
          size: "³",
        },
      },
    ];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "size",
        label: "Size",
        type: "option",
      },
    ]);
  });

  it("handles whitespace values as option values", () => {
    const products = [
      {
        attributes: {
          color: "   ",
        },
      },
    ];

    expect(generateFilterConfig(products)).toEqual([
      {
        code: "color",
        label: "Color",
        type: "option",
      },
    ]);
  });

  it("handles null-like product attributes without throwing", () => {
    expect(() =>
      generateFilterConfig([
        {
          attributes: undefined,
        },
      ]),
    ).not.toThrow();
  });

  it("handles a large product dataset", () => {
    const products = Array.from({ length: 5000 }, (_, index) => ({
      price: index + 1,
      attributes: {
        color: index % 2 === 0 ? "Black" : "White",
        size: index % 3 === 0 ? "M" : "L",
      },
    }));

    const result = generateFilterConfig(products);

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      code: "price",
      label: "Price",
      type: "range",
      min: 1,
      max: 5000,
    });
  });
});

describe("prioritizeFilterConfig", () => {
  it("returns an empty array for empty input", () => {
    expect(prioritizeFilterConfig([])).toEqual([]);
  });

  it("prioritizes filters according to the configured priority order", () => {
    const config = [
      { code: "brand", label: "Brand", type: "option" as const },
      { code: "price", label: "Price", type: "range" as const },
      { code: "color", label: "Color", type: "option" as const },
      { code: "size", label: "Size", type: "option" as const },
    ];

    const result = prioritizeFilterConfig(config);

    expect(result.map((item) => item.code)).toEqual([
      "price",
      "color",
      "size",
      "brand",
    ]);
  });

  it("keeps unknown filters after prioritized filters", () => {
    const config = [
      { code: "material", label: "Material", type: "option" as const },
      { code: "color", label: "Color", type: "option" as const },
      { code: "brand", label: "Brand", type: "option" as const },
      { code: "unknown", label: "Unknown", type: "option" as const },
    ];

    const result = prioritizeFilterConfig(config);

    expect(result.map((item) => item.code)).toEqual([
      "color",
      "brand",
      "material",
      "unknown",
    ]);
  });

  it("prioritizes facet_color after color", () => {
    const config = [
      {
        code: "facet_color",
        label: "Facet Color",
        type: "option" as const,
      },
      {
        code: "color",
        label: "Color",
        type: "option" as const,
      },
    ];

    const result = prioritizeFilterConfig(config);

    expect(result.map((item) => item.code)).toEqual(["color", "facet_color"]);
  });

  it("does not mutate the original array", () => {
    const config = [
      { code: "brand", label: "Brand", type: "option" as const },
      { code: "price", label: "Price", type: "range" as const },
    ];

    const original = [...config];

    prioritizeFilterConfig(config);

    expect(config).toEqual(original);
  });

  it("preserves the relative order of unknown filters", () => {
    const config = [
      { code: "aaa", label: "AAA", type: "option" as const },
      { code: "bbb", label: "BBB", type: "option" as const },
      { code: "ccc", label: "CCC", type: "option" as const },
    ];

    const result = prioritizeFilterConfig(config);

    expect(result.map((item) => item.code)).toEqual(["aaa", "bbb", "ccc"]);
  });
});
