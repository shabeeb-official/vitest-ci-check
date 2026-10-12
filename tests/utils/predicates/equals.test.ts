import { describe, expect, it } from "vitest";
import { isEqualTo } from "@/utils/predicates/equals";

describe("isEqualTo", () => {
  it("returns true when values are equal", () => {
    expect(isEqualTo("salesforce")("salesforce")).toBe(true);
  });

  it("returns false when values are different", () => {
    expect(isEqualTo("salesforce")("shopify")).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(isEqualTo("salesforce")("Salesforce")).toBe(false);
    expect(isEqualTo("shopify")("Shopify")).toBe(false);
  });

  it("does not trim whitespace", () => {
    expect(isEqualTo("salesforce")(" salesforce")).toBe(false);
    expect(isEqualTo("salesforce")("salesforce ")).toBe(false);
  });

  it("works with empty strings", () => {
    expect(isEqualTo("")("")).toBe(true);
    expect(isEqualTo("")("salesforce")).toBe(false);
  });

  it("returns false for different strings with similar content", () => {
    expect(isEqualTo("salesforce")("salesforce1")).toBe(false);
    expect(isEqualTo("shopify")("shopif")).toBe(false);
  });

  it("returns a boolean", () => {
    expect(typeof isEqualTo("salesforce")("salesforce")).toBe("boolean");
  });
});
