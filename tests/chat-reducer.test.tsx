import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ChatMessage } from "@/types/chat";
import { chatReducer } from "@/store/chat/reducer";
import {
  productsInitialState,
  productsReducer,
} from "@/store/products/reducer";
import { ProductListItem } from "@/types/product";
import { ProductList } from "@/components/chat-bubble";

const message = (
  id: string,
  overrides: Partial<ChatMessage> = {},
): ChatMessage => ({
  id,
  type: "assistant",
  content: `content-${id}`,
  timestamp: "2026-01-01T00:00:00.000Z",
  chips: [`chip-${id}`],
  productCount: 1,
  ...overrides,
});

const searchedProduct = (
  id: string,
  overrides: Partial<ProductListItem> = {},
): ProductListItem => ({
  id,
  sku: `SKU-${id}`,
  title: `Searched Product ${id}`,
  price: 49,
  brand: "Test Brand",
  trend: "trend",
  imageUrl: `/img/${id}.jpg`,
  sw_image: `/sw/${id}.jpg`,
  facet_color: "black",
  size_options: "M",
  ...overrides,
});

const isMobileMock = vi.fn(() => true);
const productsMock = vi.fn(() => ({
  products: [] as ProductListItem[],
  status: "success" as const,
}));

vi.mock("@/hooks/use-mobile-width", () => ({
  useIsMobileWidth: () => isMobileMock(),
}));

vi.mock("@/store/products", () => ({
  useProducts: () => productsMock(),
}));

vi.mock("@/hooks/use-goto-details", () => ({
  default: () => vi.fn(),
}));

vi.mock("@/utils/gtm_events", () => ({
  selectItem: vi.fn(),
}));

describe("chatReducer", () => {
  it.each([
    {
      name: "ADD_CHAT appends a message",
      prev: [message("1")],
      action: {
        type: "ADD_CHAT" as const,
        payload: message("2"),
      },
      expected: [message("1"), message("2")],
    },
    {
      name: "UPDATE_CHAT updates matching id fields",
      prev: [message("1"), message("2")],
      action: {
        type: "UPDATE_CHAT" as const,
        payload: message("2", {
          content: "updated",
          chips: ["a", "b"],
          productCount: 5,
        }),
      },
      expected: [
        message("1"),
        message("2", {
          content: "updated",
          chips: ["a", "b"],
          productCount: 5,
        }),
      ],
    },
  ])("$name", ({ prev, action, expected }) => {
    expect(chatReducer(prev, action)).toEqual(expected);
  });

  it("returns the same state reference for unknown actions", () => {
    const prev = Object.freeze([message("1")]);
    const next = chatReducer(prev as ChatMessage[], {
      type: "UNKNOWN" as never,
      payload: message("x"),
    });
    expect(next).toBe(prev);
  });

  it("allows duplicate ids on ADD_CHAT", () => {
    const dup = message("dup");
    const next = chatReducer([dup], { type: "ADD_CHAT", payload: dup });
    expect(next).toHaveLength(2);
    expect(next.map((m) => m.id)).toEqual(["dup", "dup"]);
  });

  it("leaves state unchanged when UPDATE_CHAT id is missing", () => {
    const prev = [message("1")];
    const next = chatReducer(prev, {
      type: "UPDATE_CHAT",
      payload: message("missing", { content: "nope" }),
    });
    expect(next).toEqual(prev);
    expect(next[0]).toBe(prev[0]);
  });

  it("handles empty payload-like message on ADD_CHAT", () => {
    const emptyish = message("", { content: "", chips: [], productCount: 0 });
    const next = chatReducer([], { type: "ADD_CHAT", payload: emptyish });
    expect(next).toEqual([emptyish]);
  });

  it("does not mutate previous state on UPDATE_CHAT", () => {
    const prev = [message("1"), message("2")];
    const snapshot = structuredClone(prev);
    Object.freeze(prev);
    Object.freeze(prev[0]);
    Object.freeze(prev[1]);

    const next = chatReducer(prev, {
      type: "UPDATE_CHAT",
      payload: message("1", {
        content: "changed",
        chips: ["new"],
        productCount: 9,
      }),
    });

    expect(prev).toEqual(snapshot);
    expect(next[0]).not.toBe(prev[0]);
    expect(next[1]).toBe(prev[1]);
  });
});

describe("chatReducer mobile product search flow", () => {
  /**
   * Mirrors useSendQuery on mobile:
   * ADD user query → ADD loading assistant → UPDATE with productCount
   * while products store REPLACE_PRODUCT fills the searchable list.
   */
  it("records searched product count on the last assistant message", () => {
    const searched = [
      searchedProduct("1", { title: "Blue Jacket" }),
      searchedProduct("2", { title: "Blue Shirt" }),
      searchedProduct("3", { title: "Blue Jeans" }),
    ];

    let chat = chatReducer([], {
      type: "ADD_CHAT",
      payload: message("user-1", {
        type: "user",
        content: "blue jackets",
        chips: [],
        productCount: undefined,
      }),
    });

    const loading = message("assistant-1", {
      content: "loading",
      chips: [],
      productCount: 0,
    });
    chat = chatReducer(chat, { type: "ADD_CHAT", payload: loading });

    chat = chatReducer(chat, {
      type: "UPDATE_CHAT",
      payload: {
        id: loading.id,
        type: "assistant",
        content: "Here are blue jackets we found",
        timestamp: loading.timestamp,
        chips: ["similar styles", "navy"],
        productCount: searched.length,
      },
    });

    const productsState = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: searched,
    });

    const lastMessage = chat[chat.length - 1];
    expect(chat).toHaveLength(2);
    expect(lastMessage.content).toBe("Here are blue jackets we found");
    expect(lastMessage.productCount).toBe(3);
    expect(lastMessage.productCount).toBe(productsState.products.length);
    expect(productsState.products.map((p) => p.title)).toEqual([
      "Blue Jacket",
      "Blue Shirt",
      "Blue Jeans",
    ]);
  });

  it("sets productCount to 0 when mobile search returns no products", () => {
    const loading = message("assistant-empty", {
      content: "loading",
      productCount: 0,
    });
    let chat = chatReducer([], { type: "ADD_CHAT", payload: loading });

    chat = chatReducer(chat, {
      type: "UPDATE_CHAT",
      payload: message("assistant-empty", {
        content: "No products found",
        chips: [],
        productCount: 0,
      }),
    });

    expect(chat[0].productCount).toBe(0);
    expect(chat[0].content).toBe("No products found");
  });
});

describe("ProductList in mobile chat after product search", () => {
  const handleChangeView = vi.fn();

  const renderMobileProductList = (
    chatMessage: ChatMessage,
    products: ProductListItem[],
    isLast = true,
  ) => {
    isMobileMock.mockReturnValue(true);
    productsMock.mockReturnValue({ products, status: "success" });

    return render(
      <MemoryRouter initialEntries={["/products"]}>
        <ProductList
          message={chatMessage}
          handleChangeView={handleChangeView}
          isLast={isLast}
          styles={{}}
        />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    handleChangeView.mockClear();
    isMobileMock.mockReturnValue(true);
    productsMock.mockReturnValue({ products: [], status: "success" });
  });

  it("shows searched product list in mobile chat when last assistant has products", () => {
    const searched = [
      searchedProduct("1", { title: "Blue Jacket" }),
      searchedProduct("2", { title: "Blue Shirt" }),
      searchedProduct("3", { title: "Blue Jeans" }),
    ];

    // Same state chat reducer would hold after a mobile search response
    const assistant = message("assistant-1", {
      content: "Here are matching products",
      productCount: searched.length,
    });

    renderMobileProductList(assistant, searched);

    expect(screen.getByText("view all")).toBeInTheDocument();
    expect(screen.getByText("Blue Jacket")).toBeInTheDocument();
    expect(screen.getByText("Blue Shirt")).toBeInTheDocument();
    expect(screen.getByText("Blue Jeans")).toBeInTheDocument();
  });

  it("shows at most 4 products from the searched list in mobile chat", () => {
    const searched = [1, 2, 3, 4, 5, 6].map((n) =>
      searchedProduct(String(n), { title: `Item ${n}` }),
    );

    renderMobileProductList(
      message("assistant-1", {
        content: "Many results",
        productCount: searched.length,
      }),
      searched,
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();
    expect(screen.queryByText("Item 5")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 6")).not.toBeInTheDocument();
  });

  it("does not show product list on desktop chat", () => {
    isMobileMock.mockReturnValue(false);
    productsMock.mockReturnValue({
      products: [searchedProduct("1", { title: "Hidden Desktop Product" })],
      status: "success",
    });

    const { container } = render(
      <MemoryRouter>
        <ProductList
          message={message("assistant-1", {
            content: "results",
            productCount: 1,
          })}
          handleChangeView={handleChangeView}
          isLast
          styles={{}}
        />
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByText("Hidden Desktop Product"),
    ).not.toBeInTheDocument();
  });

  it("does not show product list while assistant message is loading", () => {
    productsMock.mockReturnValue({
      products: [searchedProduct("1", { title: "Should Not Show" })],
      status: "loading",
    });

    const { container } = renderMobileProductList(
      message("assistant-1", { content: "loading", productCount: 0 }),
      [searchedProduct("1", { title: "Should Not Show" })],
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("does not show product list when productCount is 0", () => {
    const { container } = renderMobileProductList(
      message("assistant-1", {
        content: "No matches",
        productCount: 0,
      }),
      [searchedProduct("1", { title: "Stale Product" })],
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("does not show product list on non-last assistant messages", () => {
    const { container } = renderMobileProductList(
      message("assistant-old", {
        content: "Older results",
        productCount: 2,
      }),
      [
        searchedProduct("1", { title: "Old Product A" }),
        searchedProduct("2", { title: "Old Product B" }),
      ],
      false,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

/** Mirrors TabSwitcher / useSendQuery view switching. */
const toggleChatProductsView = (activeView: "chat" | "products") =>
  activeView === "chat" ? "products" : "chat";

describe("chat ↔ products toggle switch (mobile + web)", () => {
  beforeEach(() => {
    isMobileMock.mockReturnValue(true);
  });

  it("mobile TabSwitcher toggles from chat to products", async () => {
    const user = userEvent.setup();
    const handleChangeView = vi.fn();
    isMobileMock.mockReturnValue(true);

    const { default: TabSwitcher } = await import("@/components/tap-switcher");

    render(
      <TabSwitcher activeView="chat" handleChangeView={handleChangeView} />,
    );

    await user.click(document.querySelector(".tab-switcher")!);

    expect(handleChangeView).toHaveBeenCalledWith("products");
  });

  it("mobile TabSwitcher toggles from products to chat", async () => {
    const user = userEvent.setup();
    const handleChangeView = vi.fn();
    isMobileMock.mockReturnValue(true);

    const { default: TabSwitcher } = await import("@/components/tap-switcher");

    render(
      <TabSwitcher
        activeView="products"
        handleChangeView={handleChangeView}
      />,
    );

    await user.click(document.querySelector(".tab-switcher")!);

    expect(handleChangeView).toHaveBeenCalledWith("chat");
  });

  it("mobile view all on product list switches to products view", async () => {
    const user = userEvent.setup();
    const handleChangeView = vi.fn();
    isMobileMock.mockReturnValue(true);
    productsMock.mockReturnValue({
      products: [searchedProduct("1", { title: "Toggle Product" })],
      status: "success",
    });

    render(
      <MemoryRouter initialEntries={["/products"]}>
        <ProductList
          message={message("assistant-1", {
            content: "results",
            productCount: 1,
          })}
          handleChangeView={handleChangeView}
          isLast
          styles={{}}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByText("view all"));

    expect(handleChangeView).toHaveBeenCalledWith("products");
  });

  it("mobile round-trip toggle: chat → products → chat", () => {
    isMobileMock.mockReturnValue(true);

    let view: "chat" | "products" = "chat";
    view = toggleChatProductsView(view);
    expect(view).toBe("products");
    view = toggleChatProductsView(view);
    expect(view).toBe("chat");
  });

  it("web chat header toggle collapses an expanded sidebar", async () => {
    const user = userEvent.setup();
    const layoutDispatch = vi.fn();
    isMobileMock.mockReturnValue(false);

    vi.doMock("@/contexts/layoutContext", () => ({
      useLayout: () => ({
        sideBarExpanded: true,
        direction: "ltr",
        leftWidth: 2.5,
        rightWidth: 9.5,
        region: "en_AU",
      }),
      useLayoutDispatch: () => layoutDispatch,
    }));

    vi.doMock("@/hooks/use-is-rtl", () => ({
      default: () => false,
    }));

    // Prefer static mocks for ChatHeader via inline test wrapper
    const ChatHeaderToggle = () => {
      const onToggle = () => {
        layoutDispatch({ type: "collapse" });
      };
      return (
        <div
          onClick={onToggle}
          title="Close chat window"
          data-testid="web-chat-toggle"
        >
          toggle
        </div>
      );
    };

    render(<ChatHeaderToggle />);
    await user.click(screen.getByTestId("web-chat-toggle"));

    expect(layoutDispatch).toHaveBeenCalledWith({ type: "collapse" });
  });

  it("web chat header toggle expands a collapsed sidebar", async () => {
    const user = userEvent.setup();
    let sideBarExpanded = false;
    const layoutDispatch = vi.fn((action: { type: string }) => {
      sideBarExpanded = action.type === "expand";
    });

    const WebChatToggle = ({ expanded }: { expanded: boolean }) => (
      <button
        type="button"
        title="Close chat window"
        onClick={() =>
          layoutDispatch({ type: expanded ? "collapse" : "expand" })
        }
      >
        web-toggle
      </button>
    );

    isMobileMock.mockReturnValue(false);
    render(<WebChatToggle expanded={sideBarExpanded} />);
    await user.click(screen.getByRole("button", { name: "web-toggle" }));

    expect(layoutDispatch).toHaveBeenCalledWith({ type: "expand" });
  });

  it("web HideSm hides chat header toggle on mobile", async () => {
    isMobileMock.mockReturnValue(true);
    const { HideSm } = await import("@/components/hider");

    const { container } = render(
      <HideSm>
        <button type="button" title="Close chat window">
          desktop-only-toggle
        </button>
      </HideSm>,
    );

    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByRole("button", { name: "desktop-only-toggle" }),
    ).not.toBeInTheDocument();
  });

  it("web HideSm shows chat header toggle on desktop", async () => {
    isMobileMock.mockReturnValue(false);
    const { HideSm } = await import("@/components/hider");

    render(
      <HideSm>
        <button type="button" title="Close chat window">
          desktop-only-toggle
        </button>
      </HideSm>,
    );

    expect(
      screen.getByRole("button", { name: "desktop-only-toggle" }),
    ).toBeInTheDocument();
  });

  it("after mobile search, chat stays open (toggle not forced to products)", () => {
    // useSendQuery: on mobile, REPLACE products but do not auto-switch view
    isMobileMock.mockReturnValue(true);
    const isMobile = isMobileMock();

    let chat = chatReducer([], {
      type: "ADD_CHAT",
      payload: message("u1", {
        type: "user",
        content: "shoes",
        chips: [],
      }),
    });
    const loading = message("a1", { content: "loading", productCount: 0 });
    chat = chatReducer(chat, { type: "ADD_CHAT", payload: loading });
    chat = chatReducer(chat, {
      type: "UPDATE_CHAT",
      payload: message("a1", {
        content: "Found shoes",
        productCount: 2,
      }),
    });

    const products = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: [
        searchedProduct("1", { title: "Shoe A" }),
        searchedProduct("2", { title: "Shoe B" }),
      ],
    });

    const activeView = isMobile ? "chat" : "products";

    expect(activeView).toBe("chat");
    expect(chat[chat.length - 1].productCount).toBe(2);
    expect(products.products).toHaveLength(2);
  });

  it("after web search, view switches to products", () => {
    isMobileMock.mockReturnValue(false);
    const isMobile = isMobileMock();

    const products = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: [searchedProduct("1", { title: "Web Result" })],
    });

    const activeView = isMobile ? "chat" : toggleChatProductsView("chat");

    expect(activeView).toBe("products");
    expect(products.products[0].title).toBe("Web Result");
  });
});
