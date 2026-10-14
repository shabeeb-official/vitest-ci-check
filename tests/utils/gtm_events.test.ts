
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  botStart,
  botEnd,
  botTurn,
  botReengaged,
  viewItemList,
  selectItem,
  addToCartEvent,
} from "@/utils/gtm_events";
import type { ProductListItem } from "@/types/product";

describe("gtm_events", () => {
  const push = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "dataLayer", {
      configurable: true,
      writable: true,
      value: { push },
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(window, "dataLayer");
  });

  it("tracks bot start", () => {
    botStart();

    expect(push).toHaveBeenCalledWith({
      event: "bzai_bot_start",
    });
  });

  it("tracks bot end", () => {
    botEnd();

    expect(push).toHaveBeenCalledWith({
      event: "bzai_bot_end",
    });
  });

  it("tracks bot turn with the provided count", () => {
    botTurn(3);

    expect(push).toHaveBeenCalledWith({
      event: "bzai_bot_turn",
      turn_count: 3,
    });
  });

  it("defaults bot turn count to zero", () => {
    botTurn();

    expect(push).toHaveBeenCalledWith({
      event: "bzai_bot_turn",
      turn_count: 0,
    });
  });

  it("tracks bot reengagement", () => {
    botReengaged();

    expect(push).toHaveBeenCalledWith({
      event: "bzai_bot_reengaged",
    });
  });

  it("tracks a product list", () => {
    const products = [
      { sku: "SKU001", title: "Product One" },
      { sku: "SKU002", title: "Product Two" },
    ] as ProductListItem[];

    viewItemList(products);

    expect(push).toHaveBeenCalledWith({
      event: "bzai_view_item_list",
      ecommerce: {
        items: [
          { item_name: "Product One", item_id: "SKU001" },
          { item_name: "Product Two", item_id: "SKU002" },
        ],
      },
    });
  });

  it("tracks selecting a product", () => {
    selectItem("Test Product", "SKU123");

    expect(push).toHaveBeenCalledWith({
      event: "bzai_select_item",
      ecommerce: {
        items: [{ item_name: "Test Product", item_id: "SKU123" }],
      },
    });
  });

  it("tracks adding a product to cart", () => {
    addToCartEvent("Test Product", "SKU123");

    expect(push).toHaveBeenCalledWith({
      event: "bzai_add_to_cart",
      ecommerce: {
        items: [{ item_name: "Test Product", item_id: "SKU123" }],
      },
    });
  });

  it("tracks an empty product list", () => {
    viewItemList([]);

    expect(push).toHaveBeenCalledWith({
      event: "bzai_view_item_list",
      ecommerce: {
        items: [],
      },
    });
  });
});
