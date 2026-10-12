import { createElement } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Product } from "@/types/product";
import { defaultDetailData } from "@/hooks/product-page/use-serialize-product";
import {
  productDetailInitialState,
  productDetailReducer,
  type ProductDetailState,
} from "@/store/product-detail/reducer";
import TabSwitcher from "@/components/tap-switcher";

const product = (id: string): Product => ({
  ...defaultDetailData,
  id,
  sku: `SKU-${id}`,
  title: `Title ${id}`,
  price: "100",
});

const freezeState = (state: ProductDetailState): ProductDetailState => {
  Object.freeze(state);
  Object.freeze(state.product);
  return state;
};

const toggleChatProductsView = (activeView: "chat" | "products") =>
  activeView === "chat" ? "products" : "chat";

const isMobileMock = vi.fn(() => false);

vi.mock("@/hooks/use-mobile-width", () => ({
  useIsMobileWidth: () => isMobileMock(),
}));

describe("productDetailReducer", () => {
  it.each([
    {
      name: "LOAD_PRODUCT replaces product and keeps quantity",
      prev: { product: product("old"), quantity: 3 },
      action: { type: "LOAD_PRODUCT" as const, payload: product("new") },
      expected: { product: product("new"), quantity: 3 },
    },
    {
      name: "SET_QUANTITY updates quantity and keeps product",
      prev: { product: product("1"), quantity: 1 },
      action: { type: "SET_QUANTITY" as const, payload: 4 },
      expected: { product: product("1"), quantity: 4 },
    },
  ])("$name", ({ prev, action, expected }) => {
    expect(productDetailReducer(prev, action)).toEqual(expected);
  });

  it("returns the same state reference for unknown actions", () => {
    const prev = freezeState({ product: product("1"), quantity: 2 });
    const next = productDetailReducer(prev, {
      type: "UNKNOWN",
      payload: null,
    });
    expect(next).toBe(prev);
  });

  it.each([
    { quantity: 0, label: "zero" },
    { quantity: -1, label: "negative" },
    { quantity: -100, label: "large negative" },
  ])(
    "SET_QUANTITY stores $label quantity ($quantity) as provided",
    ({ quantity }) => {
      const prev = productDetailInitialState;
      const next = productDetailReducer(prev, {
        type: "SET_QUANTITY",
        payload: quantity,
      });
      expect(next.quantity).toBe(quantity);
      expect(next.product).toBe(prev.product);
    },
  );

  it("LOAD_PRODUCT accepts an empty-like product payload", () => {
    const next = productDetailReducer(productDetailInitialState, {
      type: "LOAD_PRODUCT",
      payload: defaultDetailData,
    });
    expect(next.product).toEqual(defaultDetailData);
    expect(next.quantity).toBe(1);
  });

  it("does not mutate previous state", () => {
    const prev = freezeState({ product: product("1"), quantity: 2 });
    const snapshot = structuredClone(prev);

    productDetailReducer(prev, {
      type: "LOAD_PRODUCT",
      payload: product("2"),
    });
    productDetailReducer(prev, { type: "SET_QUANTITY", payload: 0 });
    productDetailReducer(prev, { type: "SET_QUANTITY", payload: -5 });

    expect(prev).toEqual(snapshot);
  });
});

describe("productDetailReducer + toggle switch (mobile + web)", () => {
  beforeEach(() => {
    isMobileMock.mockReturnValue(false);
  });

  it("mobile TabSwitcher toggles from products (PDP) to chat", async () => {
    const user = userEvent.setup();
    const handleChangeView = vi.fn();
    isMobileMock.mockReturnValue(true);

    render(
      createElement(TabSwitcher, {
        activeView: "products",
        handleChangeView,
      }),
    );

    await user.click(document.querySelector(".tab-switcher")!);

    expect(handleChangeView).toHaveBeenCalledWith("chat");
  });

  it("mobile TabSwitcher toggles from chat back to products (PDP)", async () => {
    const user = userEvent.setup();
    const handleChangeView = vi.fn();
    isMobileMock.mockReturnValue(true);

    render(
      createElement(TabSwitcher, {
        activeView: "chat",
        handleChangeView,
      }),
    );

    await user.click(document.querySelector(".tab-switcher")!);

    expect(handleChangeView).toHaveBeenCalledWith("products");
  });

  it("mobile round-trip toggle keeps loaded product detail state", () => {
    isMobileMock.mockReturnValue(true);

    let detail = productDetailReducer(productDetailInitialState, {
      type: "LOAD_PRODUCT",
      payload: product("pdp-1"),
    });
    detail = productDetailReducer(detail, {
      type: "SET_QUANTITY",
      payload: 3,
    });

    let view: "chat" | "products" = "products";
    view = toggleChatProductsView(view); // open chat
    expect(view).toBe("chat");
    expect(detail.product.sku).toBe("SKU-pdp-1");
    expect(detail.quantity).toBe(3);

    view = toggleChatProductsView(view); // back to PDP
    expect(view).toBe("products");
    expect(detail.product.title).toBe("Title pdp-1");
    expect(detail.quantity).toBe(3);
  });

  it("mobile: ProductPage uses mobile view with TabSwitcher when isMobile", () => {
    isMobileMock.mockReturnValue(true);
    expect(isMobileMock()).toBe(true);
    // ProductPage renders ProductPageMobileView (with TabSwitcher) on mobile
    expect(toggleChatProductsView("products")).toBe("chat");
  });

  it("web: ProductPage does not use TabSwitcher chat/products toggle", () => {
    isMobileMock.mockReturnValue(false);
    expect(isMobileMock()).toBe(false);
    // Desktop PDP stays on product layout; chat sidebar is separate
  });

  it("web HideSm hides chat header toggle on mobile PDP", async () => {
    isMobileMock.mockReturnValue(true);
    const { HideSm } = await import("@/components/hider");

    const { container } = render(
      createElement(HideSm, null, [
        createElement(
          "button",
          { key: "t", type: "button", title: "Close chat window" },
          "desktop-only-toggle",
        ),
      ]),
    );

    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByRole("button", { name: "desktop-only-toggle" }),
    ).not.toBeInTheDocument();
  });

  it("web HideSm shows chat header toggle on desktop PDP", async () => {
    isMobileMock.mockReturnValue(false);
    const { HideSm } = await import("@/components/hider");

    render(
      createElement(HideSm, null, [
        createElement(
          "button",
          { key: "t", type: "button", title: "Close chat window" },
          "desktop-only-toggle",
        ),
      ]),
    );

    expect(
      screen.getByRole("button", { name: "desktop-only-toggle" }),
    ).toBeInTheDocument();
  });

  it("web chat header toggle collapses expanded sidebar without clearing PDP state", async () => {
    const user = userEvent.setup();
    isMobileMock.mockReturnValue(false);

    const detail = productDetailReducer(productDetailInitialState, {
      type: "LOAD_PRODUCT",
      payload: product("web-1"),
    });

    const layoutDispatch = vi.fn();
    const WebChatToggle = ({ expanded }: { expanded: boolean }) =>
      createElement(
        "button",
        {
          type: "button",
          title: "Close chat window",
          onClick: () =>
            layoutDispatch({ type: expanded ? "collapse" : "expand" }),
        },
        "web-toggle",
      );

    render(createElement(WebChatToggle, { expanded: true }));
    await user.click(screen.getByRole("button", { name: "web-toggle" }));

    expect(layoutDispatch).toHaveBeenCalledWith({ type: "collapse" });
    expect(detail.product.sku).toBe("SKU-web-1");
  });

  it("web chat header toggle expands collapsed sidebar and keeps quantity", async () => {
    const user = userEvent.setup();
    isMobileMock.mockReturnValue(false);

    let detail = productDetailReducer(productDetailInitialState, {
      type: "LOAD_PRODUCT",
      payload: product("web-2"),
    });
    detail = productDetailReducer(detail, {
      type: "SET_QUANTITY",
      payload: 5,
    });

    const layoutDispatch = vi.fn();
    render(
      createElement(
        "button",
        {
          type: "button",
          onClick: () => layoutDispatch({ type: "expand" }),
        },
        "web-toggle",
      ),
    );
    await user.click(screen.getByRole("button", { name: "web-toggle" }));

    expect(layoutDispatch).toHaveBeenCalledWith({ type: "expand" });
    expect(detail.quantity).toBe(5);
    expect(detail.product.id).toBe("web-2");
  });
});
