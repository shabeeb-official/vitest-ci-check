import { afterEach, describe, expect, it } from "vitest";

import products from "@/utils/api/get-product";
import { server, createHandlers } from "../setup";

describe("getProductByGroupId", () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it("returns products from the details API", async () => {
    const productResults = [
      {
        id: "product-1",
        name: "Test Product",
      },
      {
        id: "product-2",
        name: "Another Product",
      },
    ];

    server.use(
      ...createHandlers({
        details: [
          {
            method: "GET",
            body: {
              data: {
                results: productResults,
              },
            },
            requireQuery: ["item_group_id", "country"],
          },
        ],
      }),
    );

    const result = await products.getProductByGroupId("GROUP123", {
      token: "test-token",
      country: "IN",
    });

    expect(result).toEqual(productResults);
  });

  it("uses an empty country when country is global", async () => {
    const productResults = [
      {
        id: "global-product",
        name: "Global Product",
      },
    ];

    server.use(
      ...createHandlers({
        details: [
          {
            method: "GET",
            body: {
              data: {
                results: productResults,
              },
            },
          },
        ],
      }),
    );

    const result = await products.getProductByGroupId("GROUP123", {
      token: "test-token",
      country: "global",
    });

    expect(result).toEqual(productResults);
  });

  it("returns an empty array when the API returns no products", async () => {
    server.use(
      ...createHandlers({
        details: [
          {
            method: "GET",
            body: {
              data: {
                results: [],
              },
            },
          },
        ],
      }),
    );

    const result = await products.getProductByGroupId("GROUP123", {
      token: "test-token",
      country: "IN",
    });

    expect(result).toEqual([]);
  });

  it("throws the expected error when the API returns 404", async () => {
    server.use(
      ...createHandlers({
        details: [
          {
            method: "GET",
            status: 404,
            body: {
              error: "Product not found",
            },
          },
        ],
      }),
    );

    await expect(
      products.getProductByGroupId("GROUP123", {
        token: "test-token",
        country: "IN",
      }),
    ).rejects.toThrow("failed to get product by id");
  });

  it("throws the expected error when the API returns 500", async () => {
    server.use(
      ...createHandlers({
        details: [
          {
            method: "GET",
            status: 500,
            body: {
              error: "Details service failed",
            },
          },
        ],
      }),
    );

    await expect(
      products.getProductByGroupId("GROUP123", {
        token: "test-token",
        country: "IN",
      }),
    ).rejects.toThrow("failed to get product by id");
  });

  it("throws the expected error on a network failure", async () => {
    server.use(
      ...createHandlers({
        details: [
          {
            method: "GET",
            error: "network",
          },
        ],
      }),
    );

    await expect(
      products.getProductByGroupId("GROUP123", {
        token: "test-token",
        country: "IN",
      }),
    ).rejects.toThrow("failed to get product by id");
  });
});
