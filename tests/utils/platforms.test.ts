import { describe, expect, it } from "vitest";
import platforms from "@/utils/platforms";

describe("platforms", () => {
  describe("salesforce", () => {
    it("is active for salesforce", () => {
      expect(platforms.salesforce.isActive("salesforce")).toBe(true);
    });

    it("is inactive for shopify", () => {
      expect(platforms.salesforce.isActive("shopify")).toBe(false);
    });

    it("is case-sensitive", () => {
      expect(platforms.salesforce.isActive("Salesforce")).toBe(false);
    });

    it("is inactive for an empty value", () => {
      expect(platforms.salesforce.isActive("")).toBe(false);
    });
  });

  describe("shopify", () => {
    it("is active for shopify", () => {
      expect(platforms.shopify.isActive("shopify")).toBe(true);
    });

    it("is inactive for salesforce", () => {
      expect(platforms.shopify.isActive("salesforce")).toBe(false);
    });

    it("is case-sensitive", () => {
      expect(platforms.shopify.isActive("Shopify")).toBe(false);
    });

    it("is inactive for an empty value", () => {
      expect(platforms.shopify.isActive("")).toBe(false);
    });
  });

  it("exposes both supported platforms", () => {
    expect(Object.keys(platforms)).toEqual(["salesforce", "shopify"]);
  });

  it("provides an isActive predicate for each platform", () => {
    expect(typeof platforms.salesforce.isActive).toBe("function");
    expect(typeof platforms.shopify.isActive).toBe("function");
  });
});
