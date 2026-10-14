import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/pages/View", () => ({}));

import { getSelectedView, setSelectedView } from "@/utils/view";

describe("view utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("getSelectedView", () => {
    it("returns chat when no view is saved", () => {
      expect(getSelectedView()).toBe("chat");
    });

    it("returns the saved view", () => {
      localStorage.setItem("selected-view", "products");

      expect(getSelectedView()).toBe("products");
    });
  });

  describe("setSelectedView", () => {
    it("stores the selected view in localStorage", () => {
      setSelectedView("chat" as any);

      expect(localStorage.getItem("selected-view")).toBe("chat");
    });

    it("overwrites the previously saved view", () => {
      localStorage.setItem("selected-view", "chat");

      setSelectedView("products" as any);

      expect(localStorage.getItem("selected-view")).toBe("products");
    });
  });
});
