import { beforeEach, describe, expect, it } from "vitest";

import {
  addUserContext,
  clearUserContext,
  generateUserContextMessage,
  initUserContext,
} from "@/utils/user-context";

describe("user context", () => {
  beforeEach(() => {
    clearUserContext();
  });

  describe("initUserContext", () => {
    it("initializes userContext when it does not exist", () => {
      delete window.userContext;

      initUserContext();

      expect(window.userContext).toEqual([]);
    });

    it("does not replace existing userContext", () => {
      window.userContext = [
        {
          sku: "SKU123",
          brand: "Test Brand",
          name: "Test Product",
          color: "Red",
        },
      ];

      initUserContext();

      expect(window.userContext).toHaveLength(1);
      expect(window.userContext[0]).toMatchObject({
        sku: "SKU123",
        brand: "Test Brand",
        name: "Test Product",
        color: "Red",
      });
    });
  });

  describe("addUserContext", () => {
    beforeEach(() => {
      initUserContext();
    });

    it("adds PDP context", () => {
      addUserContext(
        {
          sku: "SKU123",
          brand: "Nike",
          name: "Running Shoes",
          color: "Black",
        },
        {
          page: "PDP",
        },
      );

      expect(window.userContext).toHaveLength(1);

      expect(window.userContext[0]).toMatchObject({
        sku: "SKU123",
        brand: "Nike",
        name: "Running Shoes",
        color: "Black",
      });

      expect(window.userContext[0]).toHaveProperty("timestamp");
    });

    it("adds PDP context attributes when provided", () => {
      addUserContext(
        {
          sku: "SKU123",
          brand: "Nike",
          name: "Running Shoes",
          color: "Black",
          pdp_context_attributes: "Water resistant",
        },
        {
          page: "PDP",
        },
      );

      expect(window.userContext[0]).toMatchObject({
        sku: "SKU123",
        brand: "Nike",
        name: "Running Shoes",
        color: "Black",
        pdp_context_attributes: "Water resistant",
      });
    });

    it("does not add context for PLP", () => {
      addUserContext(
        {
          sku: "SKU123",
          brand: "Nike",
          name: "Running Shoes",
          color: "Black",
        },
        {
          page: "PLP",
        },
      );

      expect(window.userContext).toEqual([]);
    });

    it("does not add context for CHAT", () => {
      addUserContext(
        {
          sku: "SKU123",
          brand: "Nike",
          name: "Running Shoes",
          color: "Black",
        },
        {
          page: "CHAT",
        },
      );

      expect(window.userContext).toEqual([]);
    });

    it("does not add context when page option is omitted", () => {
      addUserContext({
        sku: "SKU123",
        brand: "Nike",
        name: "Running Shoes",
        color: "Black",
      });

      expect(window.userContext).toEqual([]);
    });
  });

  describe("clearUserContext", () => {
    it("clears all user context", () => {
      window.userContext = [
        {
          sku: "SKU123",
          brand: "Nike",
          name: "Running Shoes",
          color: "Black",
        },
      ];

      clearUserContext();

      expect(window.userContext).toEqual([]);
    });
  });

  describe("generateUserContextMessage", () => {
    it("returns an empty string when there is no user context", () => {
      window.userContext = [];

      expect(generateUserContextMessage()).toBe("");
    });

    it("generates a message from PDP context", () => {
      addUserContext(
        {
          sku: "SKU123",
          brand: "Nike",
          name: "Running Shoes",
          color: "Black",
        },
        {
          page: "PDP",
        },
      );

      expect(generateUserContextMessage()).toBe(
        "** User is currently viewing Running Shoes by the brand Nike of the color Black",
      );
    });

    it("returns an empty string when userContext is undefined", () => {
      delete window.userContext;

      expect(generateUserContextMessage()).toBe("");
    });

    it("includes PDP context attributes when available", () => {
      addUserContext(
        {
          sku: "SKU123",
          brand: "Nike",
          name: "Running Shoes",
          color: "Black",
          pdp_context_attributes: "Water resistant",
        },
        {
          page: "PDP",
        },
      );

      expect(generateUserContextMessage()).toBe(
        "** User is currently viewing Running Shoes by the brand Nike of the color Black, Water resistant",
      );
    });

    it("generates a combined message for multiple products", () => {
      addUserContext(
        {
          sku: "SKU123",
          brand: "Nike",
          name: "Running Shoes",
          color: "Black",
        },
        {
          page: "PDP",
        },
      );

      addUserContext(
        {
          sku: "SKU456",
          brand: "Adidas",
          name: "Training Shirt",
          color: "White",
        },
        {
          page: "PDP",
        },
      );

      expect(generateUserContextMessage()).toBe(
        "** User is currently viewing Running Shoes by the brand Nike of the color Black, Training Shirt by the brand Adidas of the color White",
      );
    });
  });
});
