import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
}));

vi.mock("@/config", () => ({
  PRODUCT_PREFIX: "test-products",
}));

vi.mock("@/utils/session", () => ({
  getSession: mocks.getSession,
}));

import {
  getProductsFromSessionStorage,
  saveProductToSessionStorage,
} from "@/utils/product";

describe("product session storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    mocks.getSession.mockReturnValue("session-123");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getProductsFromSessionStorage", () => {
    it("returns products stored for the current session", () => {
      const key = "test-products-session-123";
      const products = JSON.stringify([{ id: "product-1" }]);

      sessionStorage.setItem(key, products);

      expect(getProductsFromSessionStorage()).toBe(products);
      expect(mocks.getSession).toHaveBeenCalledOnce();
    });

    it("returns null when no products exist for the current session", () => {
      expect(getProductsFromSessionStorage()).toBeNull();
    });

    it("uses the null session value when no session exists", () => {
      mocks.getSession.mockReturnValue("");

      expect(getProductsFromSessionStorage()).toBeNull();
      expect(sessionStorage.getItem("test-products-")).toBeNull();
    });
  });

  describe("saveProductToSessionStorage", () => {
    it("saves products as JSON for the current session", () => {
      const products = [{ id: "product-1" }] as any;

      saveProductToSessionStorage(products);

      expect(sessionStorage.getItem("test-products-session-123")).toBe(
        JSON.stringify(products),
      );
    });

    it("does not save products when the session ID is empty", () => {
      mocks.getSession.mockReturnValue("");

      const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

      saveProductToSessionStorage([] as any);

      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });
});
