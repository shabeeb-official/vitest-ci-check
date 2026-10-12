
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import emarys from "@/api/emarys";

describe("Emarys homePageRecomendation", () => {
  beforeEach(() => {
    window.ScarabQueue = [];
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.ScarabQueue = [];
  });

  it("pushes a PERSONAL recommendation command", () => {
    emarys.homePageRecomendation(vi.fn());

    expect(window.ScarabQueue).toHaveLength(2);

    expect(window.ScarabQueue?.[0]).toEqual([
      "recommend",
      expect.objectContaining({
        logic: "PERSONAL",
        containerId: "#root",
        limit: 16,
      }),
    ]);

    expect(window.ScarabQueue?.[1]).toEqual(["go"]);
  });

  it("serializes recommendation products correctly", () => {
    const onSuccess = vi.fn();

    emarys.homePageRecomendation(onSuccess);

    const recommendCommand = window.ScarabQueue?.[0];

    const options = recommendCommand?.[1] as {
      success: (sc: any) => void;
    };

    options.success({
      page: {
        products: [
          {
            group_id: "GROUP123-extra",
            id: "SKU123",
            image: "https://example.com/product.jpg",
            title: "Test Product",
            brand: "Test Brand",
            price_au: "99.95",
          },
        ],
      },
    });

    expect(onSuccess).toHaveBeenCalledWith([
      {
        id: "GROUP123",
        sku: "SKU123",
        imageUrl: "https://example.com/product.jpg",
        title: "Test Product",
        brand: "Test Brand",
        price: "99.95",
        trend: "",
      },
    ]);
  });

  it("extracts the product id before the first hyphen", () => {
    const onSuccess = vi.fn();

    emarys.homePageRecomendation(onSuccess);

    const recommendCommand = window.ScarabQueue?.[0];

    const options = recommendCommand?.[1] as {
      success: (sc: any) => void;
    };

    options.success({
      page: {
        products: [
          {
            group_id: "ABC-123-456",
            id: "SKU999",
            image: "/product.jpg",
            title: "Product",
            brand: "Brand",
            price_au: "120",
          },
        ],
      },
    });

    expect(onSuccess).toHaveBeenCalledWith([
      {
        id: "ABC",
        sku: "SKU999",
        imageUrl: "/product.jpg",
        title: "Product",
        brand: "Brand",
        price: "120.00",
        trend: "",
      },
    ]);
  });

  it("formats the price to two decimal places", () => {
    const onSuccess = vi.fn();

    emarys.homePageRecomendation(onSuccess);

    const recommendCommand = window.ScarabQueue?.[0];

    const options = recommendCommand?.[1] as {
      success: (sc: any) => void;
    };

    options.success({
      page: {
        products: [
          {
            group_id: "GROUP1",
            id: "SKU1",
            image: "/image.jpg",
            title: "Product",
            brand: "Brand",
            price_au: "50",
          },
        ],
      },
    });

    expect(onSuccess).toHaveBeenCalledWith([
      {
        id: "GROUP1",
        sku: "SKU1",
        imageUrl: "/image.jpg",
        title: "Product",
        brand: "Brand",
        price: "50.00",
        trend: "",
      },
    ]);
  });

  it("returns an empty array when Emarsys returns no products", () => {
    const onSuccess = vi.fn();

    emarys.homePageRecomendation(onSuccess);

    const recommendCommand = window.ScarabQueue?.[0];

    const options = recommendCommand?.[1] as {
      success: (sc: any) => void;
    };

    options.success({
      page: {
        products: [],
      },
    });

    expect(onSuccess).toHaveBeenCalledWith([]);
  });

  it("calls onError when Emarsys recommendation fails", () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    emarys.homePageRecomendation(onSuccess, onError);

    const recommendCommand = window.ScarabQueue?.[0];

    const options = recommendCommand?.[1] as {
      onerror: (err: Error) => void;
    };

    const error = new Error("Emarsys recommendation failed");

    options.onerror(error);

    expect(onError).toHaveBeenCalledWith(error);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("does not throw when onError is not provided", () => {
    emarys.homePageRecomendation(vi.fn());

    const recommendCommand = window.ScarabQueue?.[0];

    const options = recommendCommand?.[1] as {
      onerror: (err: Error) => void;
    };

    expect(() => {
      options.onerror(new Error("Recommendation failed"));
    }).not.toThrow();
  });
});