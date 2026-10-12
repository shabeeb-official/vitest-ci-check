import { describe, expect, it, vi } from "vitest";
import axios from "axios";

// vi.mock("@/config", () => ({
//   DETAILS_URI: "http://localhost:4000/pdp",
// }));

import { getDefaultTestEnv } from "./setup/env";
import { server } from "./setup/server";
import { createHandlers } from "./setup/handler";
const { VITE_DETAILS_URI } = getDefaultTestEnv();
describe("DETAILS API", () => {
  it("should fetch product details using item_group_id and country", async () => {
    // const { VITE_DETAILS_URI } = getDefaultTestEnv();
    server.use(
      ...createHandlers({
        details: [
          {
            method: "GET",
            requireQuery: ["item_group_id", "country"],
            status: 200,
            body: {
              data: {
                results: [
                  {
                    id: "product-1",
                    name: "Test Product",
                    price: 100,
                  },
                ],
              },
            },
          },
        ],
      }),
    );

    const response = await axios.get(VITE_DETAILS_URI, {
      params: {
        item_group_id: "product-1",
        country: "IN",
      },
    });

    expect(response.status).toBe(200);

    expect(response.data).toEqual({
      data: {
        results: [
          {
            id: "product-1",
            name: "Test Product",
            price: 100,
          },
        ],
      },
    });
  });
});
it("should return 400 when required query params are missing", async () => {
  server.use(
    ...createHandlers({
      details: [
        {
          method: "GET",
          requireQuery: ["item_group_id", "country"],
          status: 200,
          body: {
            data: {
              results: [],
            },
          },
        },
      ],
    }),
  );

  const response = await axios.get(VITE_DETAILS_URI, {
    params: {
      item_group_id: "product-1",
    },
    validateStatus: () => true,
  });

  expect(response.status).toBe(400);

  expect(response.data).toEqual({
    error: "missing query params",
    missing: ["country"],
  });
});
it("should handle an empty response", async () => {
  server.use(
    ...createHandlers({
      details: [
        {
          method: "GET",
          requireQuery: ["item_group_id", "country"],
          error: "empty",
        },
      ],
    }),
  );

  const response = await axios.get(VITE_DETAILS_URI, {
    params: {
      item_group_id: "product-1",
      country: "IN",
    },
  });

  expect(response.status).toBe(200);
  expect(response.data).toBe("");
});
it("should handle a 404 response", async () => {
  server.use(
    ...createHandlers({
      details: [
        {
          method: "GET",
          requireQuery: ["item_group_id", "country"],
          status: 404,
          body: {
            error: "Product not found",
          },
        },
      ],
    }),
  );

  const response = await axios.get(VITE_DETAILS_URI, {
    params: {
      item_group_id: "unknown-product",
      country: "IN",
    },
    validateStatus: () => true,
  });

  expect(response.status).toBe(404);

  expect(response.data).toEqual({
    error: "Product not found",
  });
});
it("should handle a 500 response", async () => {
  server.use(
    ...createHandlers({
      details: [
        {
          method: "GET",
          requireQuery: ["item_group_id", "country"],
          status: 500,
          body: {
            error: "Internal server error",
          },
        },
      ],
    }),
  );

  const response = await axios.get(VITE_DETAILS_URI, {
    params: {
      item_group_id: "product-1",
      country: "IN",
    },
    validateStatus: () => true,
  });

  expect(response.status).toBe(500);

  expect(response.data).toEqual({
    error: "Internal server error",
  });
});
it("should handle a network error", async () => {
  server.use(
    ...createHandlers({
      details: [
        {
          method: "GET",
          requireQuery: ["item_group_id", "country"],
          error: "network",
        },
      ],
    }),
  );

  await expect(
    axios.get(VITE_DETAILS_URI, {
      params: {
        item_group_id: "product-1",
        country: "IN",
      },
    }),
  ).rejects.toThrow();
});