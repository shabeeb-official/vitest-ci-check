import axios from "axios";
import { afterEach, describe, expect, it } from "vitest";
import { getDefaultTestEnv } from "./setup/env";
import { server, createHandlers } from "./setup";
const { VITE_ADD_TO_WISHLIST_URI, VITE_REMOVE_TO_WISHLIST_URI } =
  getDefaultTestEnv();
describe("Wishlist API", () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it("adds a product to wishlist", async () => {
    server.use(
      ...createHandlers({
        wishlist: [
          {
            method: "POST",
            body: {
              wishlistSize: 1,
            },
            requireForm: ["pid", "page"],
          },
        ],
      }),
    );

    const params = new URLSearchParams();

    params.append("pid", "SKU123");
    params.append("page", "plp");

    const response = await axios.post(VITE_ADD_TO_WISHLIST_URI, params);

    expect(response.status).toBe(200);
    expect(response.data.wishlistSize).toBe(1);
  });

  it("removes a product from wishlist", async () => {
    server.use(
      ...createHandlers({
        removeWishlist: [
          {
            method: "GET",
            body: {
              wishlistSize: 0,
            },
            requireQuery: ["pid"],
          },
        ],
      }),
    );

    const response = await axios.get(VITE_REMOVE_TO_WISHLIST_URI, {
      params: {
        pid: "SKU123",
      },
    });

    expect(response.status).toBe(200);
    expect(response.data.wishlistSize).toBe(0);
  });

  it("handles an empty add-wishlist response", async () => {
    server.use(
      ...createHandlers({
        wishlist: [
          {
            method: "POST",
            error: "empty",
            requireForm: ["pid", "page"],
          },
        ],
      }),
    );

    const params = new URLSearchParams();

    params.append("pid", "SKU123");
    params.append("page", "plp");

    const response = await axios.post(
      VITE_ADD_TO_WISHLIST_URI,
      params,
    );

    expect(response.status).toBe(200);
    expect(response.data).toBe("");
  });

  it("handles a 400 response when add-wishlist parameters are missing", async () => {
    server.use(
      ...createHandlers({
        wishlist: [
          {
            method: "POST",
            requireForm: ["pid", "page"],
          },
        ],
      }),
    );

    const params = new URLSearchParams();

    params.append("pid", "SKU123");

    await expect(
      axios.post(VITE_ADD_TO_WISHLIST_URI, params),
    ).rejects.toMatchObject({
      response: {
        status: 400,
      },
    });
  });

  it("handles a 500 add-wishlist response", async () => {
    server.use(
      ...createHandlers({
        wishlist: [
          {
            method: "POST",
            status: 500,
            body: {
              error: "Wishlist service failed",
            },
          },
        ],
      }),
    );

    const params = new URLSearchParams();

    params.append("pid", "SKU123");
    params.append("page", "plp");

    await expect(
      axios.post(VITE_ADD_TO_WISHLIST_URI, params),
    ).rejects.toMatchObject({
      response: {
        status: 500,
      },
    });
  });

  it("handles a network error when adding to wishlist", async () => {
    server.use(
      ...createHandlers({
        wishlist: [
          {
            method: "POST",
            error: "network",
          },
        ],
      }),
    );

    const params = new URLSearchParams();

    params.append("pid", "SKU123");
    params.append("page", "plp");

    await expect(
      axios.post(VITE_ADD_TO_WISHLIST_URI, params),
    ).rejects.toBeTruthy();
  });

  it("handles a 400 response when remove-wishlist pid is missing", async () => {
    server.use(
      ...createHandlers({
        removeWishlist: [
          {
            method: "GET",
            requireQuery: ["pid"],
          },
        ],
      }),
    );

    await expect(
      axios.get(VITE_REMOVE_TO_WISHLIST_URI),
    ).rejects.toMatchObject({
      response: {
        status: 400,
      },
    });
  });

  it("handles a 500 remove-wishlist response", async () => {
    server.use(
      ...createHandlers({
        removeWishlist: [
          {
            method: "GET",
            status: 500,
            body: {
              error: "Wishlist service failed",
            },
          },
        ],
      }),
    );

    await expect(
      axios.get(VITE_REMOVE_TO_WISHLIST_URI, {
        params: {
          pid: "SKU123",
        },
      }),
    ).rejects.toMatchObject({
      response: {
        status: 500,
      },
    });
  });
});
