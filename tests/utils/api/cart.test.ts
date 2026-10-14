
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import cartApi from "@/utils/api/cart";
import generateBasicAuthToken from "@/utils/get-basic-auth-token";
import { addToCartEvent } from "@/utils/gtm_events";
import type { AddToCartPayload } from "@/types/cart";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("@/utils/get-basic-auth-token", () => ({
  default: vi.fn(() => "Basic test-token"),
}));

vi.mock("@/utils/gtm_events", () => ({
  addToCartEvent: vi.fn(),
}));

const payload: AddToCartPayload = {
  qty: 2,
  sku: "12345",
  name: "Test Product",
  cartAction: "add",
  options: [],
  preferredStoreId: "store-1",
};

const mockFetch = vi.fn();

describe("cartApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        "cart-drawer": "<div>Cart drawer</div>",
        "cart-icon-bubble": "<span>2</span>",
        header: "<div>Header</div>",
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  describe("salesForceAddToCart", () => {
    it("posts form data and returns the API response", async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: { success: true },
      });

      const result = await cartApi.salesForceAddToCart(
        "/salesforce/cart",
        payload,
      );

      expect(result).toEqual({ success: true });
      expect(axios.post).toHaveBeenCalledTimes(1);

      const [uri, params, config] = vi.mocked(axios.post).mock.calls[0];

      expect(uri).toBe("/salesforce/cart");
      expect(params).toBeInstanceOf(URLSearchParams);
      expect(params.get("pid")).toBe("12345");
      expect(params.get("quantity")).toBe("2");
      expect(params.get("preferredStoreId")).toBe("");
      expect(params.get("options")).toBe("[]");
      expect(params.get("cartAction")).toBe("add");
      expect(config).toMatchObject({
        withCredentials: true,
        headers: { Authorization: "Basic test-token" },
      });
      expect(generateBasicAuthToken).toHaveBeenCalled();
    });

    it("omits optional parameters when they are absent", async () => {
      vi.mocked(axios.post).mockResolvedValue({ data: { success: true } });

      await cartApi.salesForceAddToCart("/salesforce/cart", {
        qty: 1,
        sku: "123",
      });

      const params = vi.mocked(axios.post).mock.calls[0][1] as URLSearchParams;

      expect(params.get("pid")).toBe("123");
      expect(params.get("quantity")).toBe("1");
      expect(params.has("preferredStoreId")).toBe(false);
      expect(params.has("options")).toBe(false);
      expect(params.has("cartAction")).toBe(false);
    });

    it("returns null when the API request fails", async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error("Request failed"));

      await expect(
        cartApi.salesForceAddToCart("/salesforce/cart", payload),
      ).resolves.toBeNull();
    });
  });

  describe("shopifyAddToCart", () => {
    it("posts the SKU and quantity to Shopify", async () => {
      mockFetch.mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      }).mockResolvedValueOnce({ ok: true });

      await cartApi.shopifyAddToCart("/cart/add.js", payload);

      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        "/cart/add.js",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ id: 12345, quantity: 2 }),
        }),
      );

      expect(addToCartEvent).toHaveBeenCalledWith("Test Product", "12345");
    });

    it("stops when Shopify rejects the add-to-cart request", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockFetch.mockResolvedValueOnce({ ok: false });

      await expect(
        cartApi.shopifyAddToCart("/cart/add.js", payload),
      ).resolves.toBeUndefined();

      expect(consoleSpy).toHaveBeenCalledWith("Add to cart failed");
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(addToCartEvent).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("updates the cart drawer, icon, and header", async () => {
      document.body.innerHTML = `
        <div id="CartDrawer"></div>
        <div class="cart-count-bubble"></div>
        <header></header>
      `;

      mockFetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            "cart-drawer": "<p>Updated drawer</p>",
            "cart-icon-bubble": "<span>2</span>",
            header: "<p>Updated header</p>",
          }),
        })
        .mockResolvedValueOnce({ ok: true });

      await cartApi.shopifyAddToCart("/cart/add.js", payload);

      const drawer = document.querySelector("#CartDrawer");
      expect(drawer?.innerHTML).toContain("Updated drawer");
      expect(drawer).toHaveClass("active", "open");

      expect(document.querySelector(".cart-count-bubble")?.innerHTML)
        .toContain("<span>2</span>");
      expect(document.querySelector("header")?.innerHTML)
        .toContain("Updated header");

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        "/?sections=cart-drawer,cart-icon-bubble,header",
      );
      expect(mockFetch).toHaveBeenNthCalledWith(3, "/cart.js");
    });

    it("supports the cart-drawer custom element", async () => {
      document.body.innerHTML = "<cart-drawer></cart-drawer>";

      mockFetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ "cart-drawer": "<p>Cart</p>" }),
        })
        .mockResolvedValueOnce({ ok: true });

      await cartApi.shopifyAddToCart("/cart/add.js", payload);

      expect(document.querySelector("cart-drawer")?.innerHTML).toContain("Cart");
    });

    it("refreshes and opens Elite Cart when available", async () => {
      const openDrawerWithDataRefresh = vi.fn();

      vi.stubGlobal("EliteCart", { openDrawerWithDataRefresh });

      mockFetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({ ok: true });

      await cartApi.shopifyAddToCart("/cart/add.js", payload);

      expect(openDrawerWithDataRefresh).toHaveBeenCalledTimes(1);
    });

    it("does not update sections when Shopify returns no section HTML", async () => {
      document.body.innerHTML = `
        <div id="CartDrawer">Original</div>
        <div class="cart-count-bubble">1</div>
        <header>Original header</header>
      `;

      mockFetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({ ok: true });

      await cartApi.shopifyAddToCart("/cart/add.js", payload);

      expect(document.querySelector("#CartDrawer")?.innerHTML).toBe("Original");
      expect(document.querySelector(".cart-count-bubble")?.innerHTML).toBe("1");
      expect(document.querySelector("header")?.innerHTML).toBe("Original header");
    });
  });
});
