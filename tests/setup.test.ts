import { describe, it, expect } from "vitest";
import { getDefaultTestEnv } from "./setup";
describe("test setup", () => {
  it("has the test environment configured", () => {
    const env = getDefaultTestEnv();

    expect(env.VITE_DETAILS_URI).toBe("http://localhost:4000/pdp");
  });

  it("has matchMedia available", () => {
    expect(window.matchMedia).toBeDefined();
  });

  it("has ResizeObserver available", () => {
    expect(ResizeObserver).toBeDefined();
  });

  it("has IntersectionObserver available", () => {
    expect(IntersectionObserver).toBeDefined();
  });
});
