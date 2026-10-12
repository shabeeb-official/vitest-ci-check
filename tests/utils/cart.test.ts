import { describe, expect, it } from "vitest";
import cartUtils from "@/utils/cart";

describe("cartUtils", () => {
  describe("getURI", () => {
    it("returns the URI for an existing country code", () => {
      const uriMap = {
        en_AU: "/au/cart",
        en_US: "/us/cart",
      };
      expect(cartUtils.getURI(uriMap, "en_AU")).toBe("/au/cart");
      expect(cartUtils.getURI(uriMap, "en_US")).toBe("/us/cart");
    });
    it("returns an empty string for an unknown country code", () => {
      const uriMap = {
        en_AU: "/au/cart",
      };
      expect(cartUtils.getURI(uriMap, "en_US")).toBe("");
    });

    it("returns an empty string when the country code is empty", () => {
      const uriMap = {
        en_AU: "/au/cart",
      };

      expect(cartUtils.getURI(uriMap, "")).toBe("");
    });

    it("returns an empty string when the URI map is empty", () => {
      expect(cartUtils.getURI({}, "en_AU")).toBe("");
    });

    it("handles country codes containing whitespace as exact keys", () => {
      const uriMap = {
        " en_AU ": "/au/cart",
        en_AU: "/normal/cart",
      };

      expect(cartUtils.getURI(uriMap, " en_AU ")).toBe("/au/cart");
      expect(cartUtils.getURI(uriMap, "en_AU")).toBe("/normal/cart");
    });

    it("returns the mapped value even when it is an empty string", () => {
      const uriMap = {
        en_AU: "",
      };

      expect(cartUtils.getURI(uriMap, "en_AU")).toBe("");
    });

    it("handles numeric-looking country keys", () => {
      const uriMap = {
        "123": "/cart/123",
      };

      expect(cartUtils.getURI(uriMap, "123")).toBe("/cart/123");
    });

    it("does not modify the URI map", () => {
      const uriMap = {
        en_AU: "/au/cart",
        en_US: "/us/cart",
      };

      const original = { ...uriMap };

      cartUtils.getURI(uriMap, "en_AU");

      expect(uriMap).toEqual(original);
    });
  });

  describe("getRoddAndGunnURIS", () => {
    it("returns the configured Rodd & Gunn country URIs", () => {
      const uris = cartUtils.getRoddAndGunnURIS();

      expect(uris.en_AU).toContain("rodd-au-Site/en_AU");
      expect(uris.en_NZ).toContain("rodd-nz-Site/en_NZ");
      expect(uris.en_US).toContain("rodd-us-Site/en_US");
      expect(uris.en_UK).toContain("rodd-uk-Site/en_UK");
      expect(uris.en_CA).toContain("rodd-ca-Site/en_CA");
      expect(uris.fr_CA).toContain("rodd-ca-Site/fr_CA");
      expect(uris.eu).toContain("rodd-eu-Site/en");
      expect(uris.fr_FR).toContain("rodd-eu-Site/fr_FR");
      expect(uris.de_DE).toContain("rodd-eu-Site/de_DE");
    });

    it("returns all supported country/region mappings", () => {
      const uris = cartUtils.getRoddAndGunnURIS();

      expect(Object.keys(uris)).toEqual([
        "en_AU",
        "en_NZ",
        "en_US",
        "en_UK",
        "en_CA",
        "fr_CA",
        "eu",
        "fr_FR",
        "de_DE",
      ]);
    });

    it("returns HTTPS URLs", () => {
      const uris = cartUtils.getRoddAndGunnURIS();

      Object.values(uris).forEach((uri) => {
        expect(uri).toMatch(/^https:\/\//);
      });
    });

    it("returns cart add-product endpoints", () => {
      const uris = cartUtils.getRoddAndGunnURIS();

      Object.values(uris).forEach((uri) => {
        expect(uri).toContain("Cart-AddProduct");
        expect(uri).toContain("format=ajax");
      });
    });

    it("returns a fresh mapping object on each call", () => {
      const first = cartUtils.getRoddAndGunnURIS();
      const second = cartUtils.getRoddAndGunnURIS();

      expect(first).toEqual(second);
      expect(first).not.toBe(second);
    });
  });
});
