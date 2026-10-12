import { describe, expect, it } from "vitest";
import {
  compareSizes,
  compareSizesDirect,
} from "@/utils/sort-sizes";

describe("sort-sizes", () => {
  describe("compareSizesDirect", () => {
    describe("numeric sizes", () => {
      it("sorts integer sizes numerically", () => {
        expect(compareSizesDirect("8", "10")).toBeLessThan(0);
        expect(compareSizesDirect("10", "8")).toBeGreaterThan(0);
      });

      it("sorts decimal sizes numerically", () => {
        expect(compareSizesDirect("8.5", "10.5")).toBeLessThan(0);
        expect(compareSizesDirect("10.5", "8.5")).toBeGreaterThan(0);
      });

      it("treats numerically equal values as a tie", () => {
        expect(compareSizesDirect("10", "10")).toBe(0);
        expect(compareSizesDirect("10.0", "10")).toBe(0);
      });
    });

    describe("range sizes", () => {
      it("sorts ranges by their first value", () => {
        expect(compareSizesDirect("10-12", "12-14")).toBeLessThan(0);
        expect(compareSizesDirect("12-14", "10-12")).toBeGreaterThan(0);
      });

      it("uses the second value when the first values are equal", () => {
        expect(compareSizesDirect("10-12", "10-14")).toBeLessThan(0);
        expect(compareSizesDirect("10-14", "10-12")).toBeGreaterThan(0);
      });

      it("supports slash ranges", () => {
        expect(compareSizesDirect("10/12", "12/14")).toBeLessThan(0);
      });

      it("treats equivalent ranges as equal", () => {
        expect(compareSizesDirect("10-12", "10-12")).toBe(0);
        expect(compareSizesDirect("10/12", "10-12")).toBe(0);
      });

      it("sorts mixed range separators using the same numeric values", () => {
        expect(compareSizesDirect("10/12", "10-14")).toBeLessThan(0);
      });
    });

    describe("alpha sizes", () => {
      it("follows the configured alpha order", () => {
        expect(compareSizesDirect("XS", "S")).toBeLessThan(0);
        expect(compareSizesDirect("S", "M")).toBeLessThan(0);
        expect(compareSizesDirect("M", "L")).toBeLessThan(0);
        expect(compareSizesDirect("L", "XL")).toBeLessThan(0);
        expect(compareSizesDirect("XL", "2XL")).toBeLessThan(0);
      });

      it("supports alpha range values", () => {
        expect(compareSizesDirect("S", "S/M")).toBeLessThan(0);
        expect(compareSizesDirect("S/M", "M")).toBeLessThan(0);
        expect(compareSizesDirect("M", "M/L")).toBeLessThan(0);
        expect(compareSizesDirect("L", "L/XL")).toBeLessThan(0);
      });

      it("handles the complete configured alpha ordering", () => {
        const sizes = [
          "2XS",
          "XS",
          "XS/S",
          "S",
          "S/M",
          "M",
          "M/L",
          "L",
          "L/XL",
          "XL",
          "XLS",
          "2XL",
          "3XL",
          "4XL",
          "5XL",
        ];

        for (let i = 0; i < sizes.length - 1; i += 1) {
          expect(
            compareSizesDirect(sizes[i], sizes[i + 1]),
          ).toBeLessThan(0);
        }
      });

      it("is case-insensitive", () => {
        expect(compareSizesDirect("s", "M")).toBeLessThan(0);
        expect(compareSizesDirect("xl", "2xl")).toBeLessThan(0);
      });

      it("ignores surrounding whitespace", () => {
        expect(compareSizesDirect("  S  ", "M")).toBeLessThan(0);
        expect(compareSizesDirect("M", "  L  ")).toBeLessThan(0);
      });

      it("returns zero for identical alpha sizes", () => {
        expect(compareSizesDirect("M", "M")).toBe(0);
      });
    });

    // describe("hybrid sizes", () => {
    //   it("classifies UK numeric sizes as hybrid", () => {
    //     expect(compareSizesDirect("UK8", "UK10")).toBeLessThan(0);
    //     expect(compareSizesDirect("UK10", "UK8")).toBeGreaterThan(0);
    //   });

    //   it("sorts hybrid values lexicographically", () => {
    //     expect(compareSizesDirect("UK10", "UK8")).toBeLessThan(0);
    //   });

    //   it("supports hybrid values such as M10W", () => {
    //     expect(compareSizesDirect("M10W", "M9W")).toBeLessThan(0);
    //   });

    //   it("supports hybrid values containing spaces", () => {
    //     expect(compareSizesDirect("UK 8", "UK 10")).toBeLessThan(0);
    //   });

    //   it("is case-insensitive for hybrid values", () => {
    //     expect(compareSizesDirect("uk8", "UK9")).toBeLessThan(0);
    //   });

    //   it("returns zero for identical hybrid values", () => {
    //     expect(compareSizesDirect("UK8", "UK8")).toBe(0);
    //   });
    // });

    describe("special and garbage values", () => {
      it("sorts special values lexicographically", () => {
        expect(compareSizesDirect("SPECIAL", "UNKNOWN")).toBeLessThan(0);
        expect(compareSizesDirect("UNKNOWN", "SPECIAL")).toBeGreaterThan(0);
      });

      it("handles empty strings", () => {
        expect(compareSizesDirect("", "M")).toBeGreaterThan(0);
      });

      it("handles whitespace-only strings", () => {
        expect(compareSizesDirect("   ", "M")).toBeGreaterThan(0);
      });

      it("handles special unicode characters", () => {
        expect(compareSizesDirect("³", "UNKNOWN")).toBeLessThan(0);
      });

      it("treats identical special values as equal", () => {
        expect(compareSizesDirect("UNKNOWN", "UNKNOWN")).toBe(0);
      });
    });

    describe("mixed type ordering", () => {
      it("orders numbers before ranges", () => {
        expect(compareSizesDirect("10", "10-12")).toBeLessThan(0);
      });

      it("orders ranges before alpha sizes", () => {
        expect(compareSizesDirect("10-12", "M")).toBeLessThan(0);
      });

      it("orders alpha sizes before hybrid sizes", () => {
        expect(compareSizesDirect("M", "UK8")).toBeLessThan(0);
      });

      it("orders hybrid sizes before special values", () => {
        expect(compareSizesDirect("UK8", "UNKNOWN")).toBeLessThan(0);
      });

      it("follows the complete mixed-type ordering", () => {
        const sizes = [
          "10",
          "10-12",
          "M",
          "UK8",
          "UNKNOWN",
        ];

        for (let i = 0; i < sizes.length - 1; i += 1) {
          expect(
            compareSizesDirect(sizes[i], sizes[i + 1]),
          ).toBeLessThan(0);
        }
      });
    });
  });

  describe("compareSizes", () => {
    it("compares objects using their size property", () => {
      expect(
        compareSizes(
          { size: "S" },
          { size: "M" },
        ),
      ).toBeLessThan(0);
    });

    it("sorts numeric object sizes", () => {
      expect(
        compareSizes(
          { size: "8" },
          { size: "10" },
        ),
      ).toBeLessThan(0);
    });

    it("sorts range object sizes", () => {
      expect(
        compareSizes(
          { size: "10-12" },
          { size: "12-14" },
        ),
      ).toBeLessThan(0);
    });

    it("sorts alpha object sizes", () => {
      expect(
        compareSizes(
          { size: "M" },
          { size: "XL" },
        ),
      ).toBeLessThan(0);
    });

    // it("sorts hybrid object sizes", () => {
    //   expect(
    //     compareSizes(
    //       { size: "UK8" },
    //       { size: "UK10" },
    //     ),
    //   ).toBeLessThan(0);
    // });

    it("sorts special object sizes", () => {
      expect(
        compareSizes(
          { size: "ABC" },
          { size: "XYZ" },
        ),
      ).toBeLessThan(0);
    });

    it("returns zero for equal object sizes", () => {
      expect(
        compareSizes(
          { size: "M" },
          { size: "M" },
        ),
      ).toBe(0);
    });

    it("handles whitespace and case normalization", () => {
      expect(
        compareSizes(
          { size: "  s  " },
          { size: "M" },
        ),
      ).toBeLessThan(0);
    });

    it("supports mixed-type object ordering", () => {
      expect(
        compareSizes(
          { size: "10" },
          { size: "M" },
        ),
      ).toBeLessThan(0);

      expect(
        compareSizes(
          { size: "M" },
          { size: "UK8" },
        ),
      ).toBeLessThan(0);
    });

    it("sorts a large collection correctly", () => {
      const sizes = [
        { size: "XL" },
        { size: "8" },
        { size: "M" },
        { size: "10-12" },
        { size: "UK8" },
        { size: "S" },
        { size: "12" },
        { size: "UNKNOWN" },
      ];

      const sorted = [...sizes].sort(compareSizes);
      expect(sorted.map((item) => item.size)).toEqual([
        "8",
        "12",
        "10-12",
        "S",
        "M",
        "XL",
        "UK8",
        "UNKNOWN",
      ]);
    });
  });
});