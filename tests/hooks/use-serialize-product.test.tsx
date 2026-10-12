import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useSerializeProduct, {
  defaultDetailData,
} from "@/hooks/product-page/use-serialize-product";

import { useProdctDetailDispatch } from "@/store/product-detail";

const mockDispatch = vi.fn();
const mockUseGetSkuFromQuery = vi.fn();

vi.mock("@/store/product-detail", () => ({
  useProdctDetailDispatch: vi.fn(),
}));

vi.mock("@/hooks/use-get-sku-from-query", () => ({
  default: () => mockUseGetSkuFromQuery(),
}));

const createProduct = (overrides = {}) => ({
  id: "product-1",
  sku: "SKU123",
  title: "Test Product",
  price: "100",
  brand: "Test Brand",
  imageUrl: "/product.jpg",
  description: "Test description",
  sale_price: "",
  pattern: "",
  trend: "",
  colors: [],
  sizes: [],
  mainImageUrl: "",
  swatch: "",
  swatchName: "",
  designerNotes: "",
  ...overrides,
});

describe("useSerializeProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProdctDetailDispatch).mockReturnValue(mockDispatch);

    mockUseGetSkuFromQuery.mockReturnValue(["SKU123"]);
  });

  it("loads default product data when loading", () => {
    const products = [createProduct()];

    renderHook(() => useSerializeProduct(products, "loading"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "LOAD_PRODUCT",
      payload: defaultDetailData,
    });
  });

  it("loads the product matching the current SKU", () => {
    const firstProduct = createProduct({
      id: "product-1",
      sku: "SKU111",
      title: "First Product",
    });

    const matchingProduct = createProduct({
      id: "product-2",
      sku: "SKU123",
      title: "Matching Product",
    });

    renderHook(() =>
      useSerializeProduct([firstProduct, matchingProduct], "success"),
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "LOAD_PRODUCT",
      payload: matchingProduct,
    });
  });

  it("loads the first product when the SKU is not found", () => {
    const firstProduct = createProduct({
      id: "product-1",
      sku: "SKU111",
      title: "First Product",
    });

    const secondProduct = createProduct({
      id: "product-2",
      sku: "SKU222",
      title: "Second Product",
    });

    mockUseGetSkuFromQuery.mockReturnValue(["UNKNOWN-SKU"]);

    renderHook(() =>
      useSerializeProduct([firstProduct, secondProduct], "success"),
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "LOAD_PRODUCT",
      payload: firstProduct,
    });
  });

  it("does not dispatch when products are empty", () => {
    renderHook(() => useSerializeProduct([], "success"));

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch when SKU is missing during success", () => {
    mockUseGetSkuFromQuery.mockReturnValue([""]);

    const products = [createProduct()];

    renderHook(() => useSerializeProduct(products, "success"));

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch for idle status", () => {
    const products = [createProduct()];

    renderHook(() => useSerializeProduct(products, "idle"));

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch for empty status", () => {
    const products = [createProduct()];

    renderHook(() => useSerializeProduct(products, "empty"));

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch for failed status", () => {
    const products = [createProduct()];

    renderHook(() => useSerializeProduct(products, "failed"));

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("updates the product when the SKU changes", () => {
    const firstProduct = createProduct({
      sku: "SKU123",
      title: "Product One",
    });

    const secondProduct = createProduct({
      sku: "SKU456",
      title: "Product Two",
    });

    mockUseGetSkuFromQuery.mockReturnValue(["SKU123"]);

    const { rerender } = renderHook(
      ({ products, loadingStatus }) =>
        useSerializeProduct(products, loadingStatus),
      {
        initialProps: {
          products: [firstProduct, secondProduct],
          loadingStatus: "success" as const,
        },
      },
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "LOAD_PRODUCT",
      payload: firstProduct,
    });

    mockDispatch.mockClear();

    mockUseGetSkuFromQuery.mockReturnValue(["SKU456"]);

    rerender({
      products: [firstProduct, secondProduct],
      loadingStatus: "success",
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "LOAD_PRODUCT",
      payload: secondProduct,
    });
  });
});
