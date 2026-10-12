import { describe, expect, it } from "vitest";
import axios from "axios";

import { server } from './setup/server';
import { createHandlers } from "./setup/handler";
import { getDefaultTestEnv } from "./setup/env";

describe("Cart MSW handler", () => {
  it("intercepts POST requests to the cart endpoint", async () => {
    const { VITE_ADD_TO_CART_URI } = getDefaultTestEnv();

    server.use(
      ...createHandlers({
        cart: [
          {
            method: "POST",
            status: 200,
            body: {
              success: true,
              message: "Product added to cart",
            },
          },
        ],
      }),
    );

    const params = new URLSearchParams();

    params.append("pid", "SKU123");
    params.append("quantity", "2");
    params.append("cartAction", "add");

    const response = await axios.post(
      VITE_ADD_TO_CART_URI,
      params,
      {
        headers: {
          Authorization: "Basic test-token",
        },
      },
    );

    expect(response.status).toBe(200);

    expect(response.data).toEqual({
      success: true,
      message: "Product added to cart",
    });
  });
});