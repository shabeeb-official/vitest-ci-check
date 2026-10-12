import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import useFilterProducts from "@/hooks/use-filter-products";

import { useProducts } from "@/store/products";
import { useProductListFilter } from "@/store/filter";

vi.mock("@/store/products", () => ({
  useProducts: vi.fn(),
}));

vi.mock("@/store/filter", () => ({
  useProductListFilter: vi.fn(),
}));

const mockedUseProducts = vi.mocked(useProducts);
const mockedUseProductListFilter = vi.mocked(useProductListFilter);

type TestProduct = {
  sku: string;
  title?: string;
  price: string;
  discount_price?: string;
  categories?: string;
  color?: string;
  facet_color?: string;
  size_options?: string;
  attributes?: Record<string, unknown>;
};

const products: TestProduct[] = [
  {
    sku: "SKU-1",
    title: "Product One",
    price: "100",
    discount_price: "80",
    categories: "shirts",
    facet_color: "Red",
    size_options: "S, M, L",
    attributes: {
      material: "cotton",
    },
  },
  {
    sku: "SKU-2",
    title: "Product Two",
    price: "200",
    categories: "shoes",
    facet_color: "Blue",
    size_options: "M, XL",
    attributes: {
      material: "leather",
    },
  },
  {
    sku: "SKU-3",
    title: "Product Three",
    price: "50",
    categories: "shirts",
    facet_color: "Black",
    size_options: "S, XL",
    attributes: {
      material: "cotton",
    },
  },
];

const createFilterValues = (overrides: Record<string, unknown> = {}) => ({
  price: "none",
  category: "none",
  sort: "none",
  color: "none",
  size: "none",
  material: "none",
  ...overrides,
});

const setup = ({
  productData = products,
  status = "success",
  filterValues = createFilterValues(),
}: {
  productData?: TestProduct[];
  status?: "loading" | "success" | "error";
  filterValues?: Record<string, unknown>;
} = {}) => {
  const clearFilter = vi.fn();

  mockedUseProducts.mockReturnValue({
    products: productData as never,
    status: status as never,
  } as ReturnType<typeof useProducts>);

  mockedUseProductListFilter.mockReturnValue({
    filterValues,
    clearFilter,
  } as never);

  return {
    clearFilter,
  };
};

describe("useFilterProducts", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns all products when no filters are selected", () => {
    setup();

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current).toHaveLength(3);
    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-1",
      "SKU-2",
      "SKU-3",
    ]);
  });

  it("adds effective_price using discount_price when available", () => {
    setup();

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current[0]).toMatchObject({
      sku: "SKU-1",
      effective_price: "80",
    });
  });

  it("uses product price when discount_price is not available", () => {
    setup();

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current[1]).toMatchObject({
      sku: "SKU-2",
      effective_price: "200",
    });
  });

  it("filters products by maximum price", () => {
    setup({
      filterValues: createFilterValues({
        price: 100,
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-1",
      "SKU-3",
    ]);
  });

  it("filters products by category", () => {
    setup({
      filterValues: createFilterValues({
        category: ["shirts"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-1",
      "SKU-3",
    ]);
  });

  it("filters products by product attribute", () => {
    setup({
      filterValues: createFilterValues({
        material: ["cotton"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-1",
      "SKU-3",
    ]);
  });

  it("supports multiple values for an attribute", () => {
    setup({
      filterValues: createFilterValues({
        material: ["leather", "cotton"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-1",
      "SKU-2",
      "SKU-3",
    ]);
  });

  it("uses facet_color as the fallback for color filtering", () => {
    setup({
      filterValues: createFilterValues({
        color: ["Red"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual(["SKU-1"]);
  });

  it("filters products using comma-separated size options", () => {
    setup({
      filterValues: createFilterValues({
        size: ["XL"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-2",
      "SKU-3",
    ]);
  });

  it("supports multiple selected sizes", () => {
    setup({
      filterValues: createFilterValues({
        size: ["L", "XL"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-1",
      "SKU-2",
      "SKU-3",
    ]);
  });

  it("does not return products missing the requested attribute", () => {
    setup({
      filterValues: createFilterValues({
        material: ["wool"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current).toEqual([]);
  });

  it("sorts products from low to high using effective price", () => {
    setup({
      filterValues: createFilterValues({
        sort: "low-high",
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-3",
      "SKU-1",
      "SKU-2",
    ]);
  });

  it("sorts products from high to low using effective price", () => {
    setup({
      filterValues: createFilterValues({
        sort: "high-low",
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-2",
      "SKU-1",
      "SKU-3",
    ]);
  });

  it("does not sort products when sort is none", () => {
    setup({
      filterValues: createFilterValues({
        sort: "none",
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-1",
      "SKU-2",
      "SKU-3",
    ]);
  });

  it("combines price and category filters", () => {
    setup({
      filterValues: createFilterValues({
        price: 100,
        category: ["shirts"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-1",
      "SKU-3",
    ]);
  });

  it("combines category and material filters", () => {
    setup({
      filterValues: createFilterValues({
        category: ["shirts"],
        material: ["cotton"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current.map((product) => product.sku)).toEqual([
      "SKU-1",
      "SKU-3",
    ]);
  });

  it("returns an empty array when no products match the filters", () => {
    setup({
      filterValues: createFilterValues({
        category: ["jeans"],
      }),
    });

    const { result } = renderHook(() => useFilterProducts());

    expect(result.current).toEqual([]);
  });

  it("clears filters after products finish loading", () => {
    const { clearFilter } = setup({
      status: "loading",
    });

    const { rerender } = renderHook(() => useFilterProducts());

    expect(clearFilter).not.toHaveBeenCalled();

    mockedUseProducts.mockReturnValue({
      products: products as never,
      status: "success" as never,
    } as ReturnType<typeof useProducts>);

    act(() => {
      rerender();
    });

    expect(clearFilter).toHaveBeenCalledTimes(1);
  });

  it("does not clear filters immediately when status is successful", () => {
    const { clearFilter } = setup({
      status: "success",
    });

    renderHook(() => useFilterProducts());

    expect(clearFilter).not.toHaveBeenCalled();
  });
});
