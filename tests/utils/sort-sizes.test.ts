import { describe, it, expect } from "vitest";
import { compareSizesDirect, compareSizes } from "@/utils/sort-sizes";

describe("compareSizesDirect", () => {
  it("compares numeric sizes", () => {
    expect(compareSizesDirect("2", "10")).toBeLessThan(0);
    expect(compareSizesDirect("10", "2")).toBeGreaterThan(0);
    expect(compareSizesDirect("5", "5")).toBe(0);
    expect(compareSizesDirect("2.5", "2.6")).toBeLessThan(0);
  });

  it("compares numeric ranges by first value, then second value", () => {
    expect(compareSizesDirect("2-4", "3-5")).toBeLessThan(0);
    expect(compareSizesDirect("2-3", "2-4")).toBeLessThan(0);
    expect(compareSizesDirect("2/4", "2-4")).toBe(0);
  });

  it("compares alpha sizes using the predefined order", () => {
    expect(compareSizesDirect("XS", "M")).toBeLessThan(0);
    expect(compareSizesDirect("XL", "2XL")).toBeLessThan(0);
    expect(compareSizesDirect("M", "M")).toBe(0);
  });

  it("trims whitespace and ignores case", () => {
    expect(compareSizesDirect(" xs ", "M")).toBeLessThan(0);
  });

  it("compares hybrid sizes lexicographically", () => {
    expect(compareSizesDirect("UK 8", "UK 9")).toBeLessThan(0);
    expect(compareSizesDirect("M10", "M2")).toBeLessThan(0);
  });
  it("handles equal numeric ranges", () => {
    expect(compareSizesDirect("2-4", "2-4")).toBe(0);
  });

  it("handles equal hybrid sizes", () => {
    expect(compareSizesDirect("UK 8", "UK 8")).toBe(0);
  });

  it("handles equal special sizes with different casing", () => {
    expect(compareSizesDirect("custom", "CUSTOM")).toBe(0);
  });

  it("handles numeric and special category boundaries", () => {
    expect(compareSizesDirect("10", "CUSTOM")).toBeLessThan(0);
    expect(compareSizesDirect("CUSTOM", "10")).toBeGreaterThan(0);
  });

  it("handles whitespace-only size values", () => {
    expect(compareSizesDirect("", "XS")).toBeGreaterThan(0);
  });

  it("compares special sizes lexicographically", () => {
    expect(compareSizesDirect("ONE SIZE", "SPECIAL")).toBeLessThan(0);
    expect(compareSizesDirect("CUSTOM", "CUSTOM")).toBe(0);
  });

  it("orders different size categories", () => {
    expect(compareSizesDirect("10", "2-4")).toBeLessThan(0);
    expect(compareSizesDirect("2-4", "XS")).toBeLessThan(0);
    expect(compareSizesDirect("XS", "UK 8")).toBeLessThan(0);
    expect(compareSizesDirect("UK 8", "ONE SIZE")).toBeLessThan(0);
  });

  it("handles hybrid and special category boundaries", () => {
    expect(compareSizesDirect("UK 8", "ONE SIZE")).toBeLessThan(0);
    expect(compareSizesDirect("ABC", "UK 8")).toBeGreaterThan(0);
  });
});

describe("compareSizes", () => {
  it("compares objects containing numeric sizes", () => {
    expect(
      compareSizes({ size: "2" } as any, { size: "10" } as any),
    ).toBeLessThan(0);
  });

  it("compares objects containing ranges", () => {
    expect(
      compareSizes({ size: "2-4" } as any, { size: "2-5" } as any),
    ).toBeLessThan(0);
  });

  it("handles equal numeric ranges", () => {
    expect(compareSizes({ size: "2-4" } as any, { size: "2-4" } as any)).toBe(
      0,
    );
  });

  it("handles equal hybrid sizes", () => {
    expect(compareSizes({ size: "UK 8" } as any, { size: "UK 8" } as any)).toBe(
      0,
    );
  });

  it("handles equal special sizes", () => {
    expect(
      compareSizes({ size: "CUSTOM" } as any, { size: "CUSTOM" } as any),
    ).toBe(0);
  });

  it("handles different numeric and special categories", () => {
    expect(
      compareSizes({ size: "10" } as any, { size: "CUSTOM" } as any),
    ).toBeLessThan(0);
  });

  it("compares objects containing alpha sizes", () => {
    expect(
      compareSizes({ size: "XS" } as any, { size: "M" } as any),
    ).toBeLessThan(0);
  });

  it("compares objects containing hybrid sizes", () => {
    expect(
      compareSizes({ size: "UK 8" } as any, { size: "UK 9" } as any),
    ).toBeLessThan(0);
  });

  it("compares objects containing special sizes", () => {
    expect(
      compareSizes({ size: "CUSTOM" } as any, { size: "SPECIAL" } as any),
    ).toBeLessThan(0);
  });

  it("orders objects with different size categories", () => {
    expect(
      compareSizes({ size: "10" } as any, { size: "XS" } as any),
    ).toBeLessThan(0);
    expect(
      compareSizes({ size: "XS" } as any, { size: "UK 8" } as any),
    ).toBeLessThan(0);
  });
});
