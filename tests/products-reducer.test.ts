import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductListItem } from "@/types/product";
import {
  productsInitialState,
  productsReducer,
  type ProductsState,
} from "@/store/products/reducer";
import TabSwitcher from "@/components/tap-switcher";

const product = (
  id: string,
  overrides: Partial<ProductListItem> = {},
): ProductListItem => ({
  id,
  sku: `SKU-${id}`,
  title: `Product ${id}`,
  price: 10,
  brand: "Brand",
  trend: "trend",
  imageUrl: `/img/${id}.jpg`,
  sw_image: `/sw/${id}.jpg`,
  facet_color: "black",
  size_options: "M",
  ...overrides,
});

const freezeState = (state: ProductsState): ProductsState => {
  Object.freeze(state);
  Object.freeze(state.products);
  return state;
};

/** Unique colors from products in store (same idea as color filter UI). */
const uniqueColors = (products: ProductListItem[]) => [
  ...new Set(
    products
      .filter((p) => p.facet_color && p.sw_image)
      .map((p) => p.facet_color),
  ),
];

/** Unique sizes from products in store (same idea as size filter UI). */
const uniqueSizes = (products: ProductListItem[]) => [
  ...new Set(
    products.flatMap((p) =>
      (p.size_options?.split(",") ?? []).map((s) => s.trim()).filter(Boolean),
    ),
  ),
];

const filterByColor = (products: ProductListItem[], colors: string[]) =>
  products.filter((p) => colors.includes(p.facet_color));

const filterBySize = (products: ProductListItem[], sizes: string[]) =>
  products.filter((p) =>
    (p.size_options?.split(",") ?? [])
      .map((s) => s.trim())
      .some((s) => sizes.includes(s)),
  );

const filterByBrand = (products: ProductListItem[], brands: string[]) =>
  products.filter((p) => brands.includes(p.brand));

const filterCatalog = (
  products: ProductListItem[],
  filters: { colors?: string[]; sizes?: string[]; brands?: string[] },
) => {
  let result = products;
  if (filters.colors?.length) result = filterByColor(result, filters.colors);
  if (filters.sizes?.length) result = filterBySize(result, filters.sizes);
  if (filters.brands?.length) result = filterByBrand(result, filters.brands);
  return result;
};

const filterCatalogFixture = [
  product("1", {
    facet_color: "black",
    size_options: "S,M",
    brand: "Nike",
    price: 40,
  }),
  product("2", {
    facet_color: "black",
    size_options: "M,L",
    brand: "Nike",
    price: 60,
  }),
  product("3", {
    facet_color: "white",
    size_options: "L,XL",
    brand: "Adidas",
    price: 80,
  }),
  product("4", {
    facet_color: "red",
    size_options: "XS,S",
    brand: "Puma",
    price: 55,
  }),
];

describe("productsReducer", () => {
  it.each([
    {
      name: "LOADING_PRODUCT keeps products and sets loading",
      prev: {
        products: [product("1")],
        status: "success" as const,
      },
      action: { type: "LOADING_PRODUCT" as const, payload: [] },
      expected: {
        products: [product("1")],
        status: "loading" as const,
      },
    },
    {
      name: "APPEND_PRODUCT concatenates payload and sets success",
      prev: {
        products: [product("1")],
        status: "idle" as const,
      },
      action: {
        type: "APPEND_PRODUCT" as const,
        payload: [product("2")],
      },
      expected: {
        products: [product("1"), product("2")],
        status: "success" as const,
      },
    },
    {
      name: "REPLACE_PRODUCT replaces list and sets success",
      prev: {
        products: [product("1")],
        status: "loading" as const,
      },
      action: {
        type: "REPLACE_PRODUCT" as const,
        payload: [product("9")],
      },
      expected: {
        products: [product("9")],
        status: "success" as const,
      },
    },
    {
      name: "CLEAR_PRODUCT empties list and sets success",
      prev: {
        products: [product("1"), product("2")],
        status: "success" as const,
      },
      action: { type: "CLEAR_PRODUCT" as const, payload: [] },
      expected: {
        products: [],
        status: "success" as const,
      },
    },
    {
      name: "APPEND_PRODUCT with empty payload is a no-op on products",
      prev: productsInitialState,
      action: { type: "APPEND_PRODUCT" as const, payload: [] },
      expected: {
        products: [],
        status: "success" as const,
      },
    },
    {
      name: "REPLACE_PRODUCT with empty payload clears products",
      prev: {
        products: [product("1")],
        status: "success" as const,
      },
      action: { type: "REPLACE_PRODUCT" as const, payload: [] },
      expected: {
        products: [],
        status: "success" as const,
      },
    },
  ])("$name", ({ prev, action, expected }) => {
    expect(productsReducer(prev, action)).toEqual(expected);
  });

  it("returns the same state reference for unknown actions", () => {
    const prev = freezeState({
      products: [product("1")],
      status: "success",
    });
    const next = productsReducer(prev, {
      type: "UNKNOWN" as never,
      payload: [],
    });
    expect(next).toBe(prev);
  });

  it("appends duplicate ids without deduping", () => {
    const dup = product("same");
    const prev = { products: [dup], status: "success" as const };
    const next = productsReducer(prev, {
      type: "APPEND_PRODUCT",
      payload: [dup],
    });
    expect(next.products).toHaveLength(2);
    expect(next.products.map((p) => p.id)).toEqual(["same", "same"]);
  });

  it("does not mutate previous state", () => {
    const prev = freezeState({
      products: [product("1")],
      status: "idle",
    });
    const snapshot = structuredClone(prev);

    productsReducer(prev, {
      type: "APPEND_PRODUCT",
      payload: [product("2")],
    });
    productsReducer(prev, {
      type: "REPLACE_PRODUCT",
      payload: [product("3")],
    });
    productsReducer(prev, { type: "CLEAR_PRODUCT", payload: [] });
    productsReducer(prev, { type: "LOADING_PRODUCT", payload: [] });

    expect(prev).toEqual(snapshot);
  });
});

describe("productsReducer + filter facets", () => {
  it("REPLACE_PRODUCT stores color/size/brand filter fields", () => {
    const next = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    expect(next.status).toBe("success");
    expect(next.products).toHaveLength(4);
    expect(next.products.map((p) => p.facet_color)).toEqual([
      "black",
      "black",
      "white",
      "red",
    ]);
    expect(next.products.map((p) => p.size_options)).toEqual([
      "S,M",
      "M,L",
      "L,XL",
      "XS,S",
    ]);
    expect(next.products.map((p) => p.brand)).toEqual([
      "Nike",
      "Nike",
      "Adidas",
      "Puma",
    ]);
  });

  it("APPEND_PRODUCT adds new color/size variants for filters", () => {
    const seeded = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: [product("1", { facet_color: "black", size_options: "M" })],
    });

    const next = productsReducer(seeded, {
      type: "APPEND_PRODUCT",
      payload: [
        product("2", { facet_color: "navy", size_options: "L,XL" }),
        product("3", { facet_color: "olive", size_options: "S" }),
      ],
    });

    expect(next.products).toHaveLength(3);
    expect(uniqueColors(next.products)).toEqual(["black", "navy", "olive"]);
    expect(uniqueSizes(next.products)).toEqual(["M", "L", "XL", "S"]);
  });

  it("derives unique filter options from reducer state", () => {
    const { products } = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    expect(uniqueColors(products)).toEqual(["black", "white", "red"]);
    expect(uniqueSizes(products)).toEqual(["S", "M", "L", "XL", "XS"]);
  });

  it.each([
    {
      name: "color=white",
      filters: { colors: ["white"] },
      expectedIds: ["3"],
    },
    {
      name: "color=black",
      filters: { colors: ["black"] },
      expectedIds: ["1", "2"],
    },
    {
      name: "size=XL",
      filters: { sizes: ["XL"] },
      expectedIds: ["3"],
    },
    {
      name: "size=S",
      filters: { sizes: ["S"] },
      expectedIds: ["1", "4"],
    },
    {
      name: "brand=Nike",
      filters: { brands: ["Nike"] },
      expectedIds: ["1", "2"],
    },
    {
      name: "color=black + size=L",
      filters: { colors: ["black"], sizes: ["L"] },
      expectedIds: ["2"],
    },
    {
      name: "brand=Adidas + size=L",
      filters: { brands: ["Adidas"], sizes: ["L"] },
      expectedIds: ["3"],
    },
    {
      name: "multi color black+red",
      filters: { colors: ["black", "red"] },
      expectedIds: ["1", "2", "4"],
    },
  ])("filters reducer products by $name", ({ filters, expectedIds }) => {
    const { products } = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    expect(filterCatalog(products, filters).map((p) => p.id)).toEqual(
      expectedIds,
    );
  });

  it("CLEAR_PRODUCT resets filterable catalog to empty", () => {
    const loaded = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    const cleared = productsReducer(loaded, {
      type: "CLEAR_PRODUCT",
      payload: [],
    });

    expect(cleared.products).toEqual([]);
    expect(uniqueColors(cleared.products)).toEqual([]);
    expect(uniqueSizes(cleared.products)).toEqual([]);
    expect(filterCatalog(cleared.products, { colors: ["black"] })).toEqual([]);
  });

  it("LOADING_PRODUCT keeps filter facets while status is loading", () => {
    const loaded = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    const loading = productsReducer(loaded, {
      type: "LOADING_PRODUCT",
      payload: [],
    });

    expect(loading.status).toBe("loading");
    expect(uniqueColors(loading.products)).toEqual(["black", "white", "red"]);
    expect(filterByBrand(loading.products, ["Puma"]).map((p) => p.id)).toEqual([
      "4",
    ]);
  });

  it("skips products without color swatch when building color filters", () => {
    const { products } = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: [
        product("1", { facet_color: "black", sw_image: "/sw/1.jpg" }),
        product("2", { facet_color: "ghost", sw_image: "" }),
        product("3", { facet_color: "", sw_image: "/sw/3.jpg" }),
      ],
    });

    expect(uniqueColors(products)).toEqual(["black"]);
  });
});

const filterInitialValues = {
  brand: "none" as const,
  price: "none" as const,
  sort: "none" as const,
  color: "none" as const,
  size: "none" as const,
};

type SortOption = "none" | "low-high" | "high-low";

/** Mirrors clearFilter() in ProductListFilterProvider. */
const clearFilterValues = () => ({ ...filterInitialValues });

/** Mirrors sort branch in useFilterProducts. */
const sortProducts = (
  products: ProductListItem[],
  sort: SortOption,
): ProductListItem[] => {
  const withEffective = products.map((p) => ({
    ...p,
    effective_price: p.discount_price ?? p.price,
  }));

  return [...withEffective].sort((a, b) => {
    if (sort === "none") return 0;
    const aPrice = parseFloat(String(a.effective_price));
    const bPrice = parseFloat(String(b.effective_price));
    if (sort === "low-high") return aPrice - bPrice;
    return bPrice - aPrice;
  });
};

/** Mirrors TabSwitcher chat ↔ products toggle. */
const toggleChatBoxView = (activeView: "chat" | "products") =>
  activeView === "chat" ? "products" : "chat";

describe("productsReducer + clear filter", () => {
  it("clearFilter resets filter values to initial state", () => {
    const applied = {
      ...filterInitialValues,
      color: ["black"],
      size: ["M", "L"],
      brand: ["Nike"],
      sort: "low-high" as const,
      price: 100,
    };

    expect(clearFilterValues()).toEqual(filterInitialValues);
    expect(clearFilterValues()).not.toEqual(applied);
  });

  it("clearFilter restores full product list from reducer after color filter", () => {
    const { products } = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    const filtered = filterCatalog(products, { colors: ["black"] });
    expect(filtered.map((p) => p.id)).toEqual(["1", "2"]);

    const afterClear = clearFilterValues();
    const restored =
      afterClear.color === "none"
        ? products
        : filterCatalog(products, {
            colors: afterClear.color as string[],
          });

    expect(restored).toEqual(products);
    expect(restored).toHaveLength(4);
  });

  it("clearFilter restores full list after combined color + size + brand filters", () => {
    const { products } = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    const filtered = filterCatalog(products, {
      colors: ["black"],
      sizes: ["L"],
      brands: ["Nike"],
    });
    expect(filtered.map((p) => p.id)).toEqual(["2"]);

    const cleared = clearFilterValues();
    expect(cleared).toEqual(filterInitialValues);
    expect(products.map((p) => p.id)).toEqual(["1", "2", "3", "4"]);
  });

  it("CLEAR_PRODUCT then clearFilter leaves an empty catalog", () => {
    const loaded = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });
    const clearedProducts = productsReducer(loaded, {
      type: "CLEAR_PRODUCT",
      payload: [],
    });
    const clearedFilters = clearFilterValues();

    expect(clearedProducts.products).toEqual([]);
    expect(clearedFilters).toEqual(filterInitialValues);
  });
});

describe("productsReducer + sortBy", () => {
  it.each([
    {
      name: "low-high",
      sort: "low-high" as SortOption,
      expectedIds: ["1", "4", "2", "3"],
    },
    {
      name: "high-low",
      sort: "high-low" as SortOption,
      expectedIds: ["3", "2", "4", "1"],
    },
    {
      name: "none keeps reducer order",
      sort: "none" as SortOption,
      expectedIds: ["1", "2", "3", "4"],
    },
  ])("sorts reducer products $name", ({ sort, expectedIds }) => {
    const { products } = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    expect(sortProducts(products, sort).map((p) => p.id)).toEqual(expectedIds);
  });

  it("sorts by discount_price when present (low-high)", () => {
    const { products } = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: [
        product("a", { price: 100, discount_price: 90 }),
        product("b", { price: 50, discount_price: 20 }),
        product("c", { price: 80 }),
      ],
    });

    expect(sortProducts(products, "low-high").map((p) => p.id)).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  it("applies sort after filter on reducer products", () => {
    const { products } = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    const filtered = filterCatalog(products, { brands: ["Nike"] });
    const sorted = sortProducts(filtered, "high-low");

    expect(sorted.map((p) => p.id)).toEqual(["2", "1"]);
    expect(sorted.map((p) => p.price)).toEqual([60, 40]);
  });

  it("toggling sort off (none) after low-high restores filter-only order", () => {
    const { products } = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    const filtered = filterCatalog(products, { colors: ["black"] });
    const sorted = sortProducts(filtered, "low-high");
    expect(sorted.map((p) => p.id)).toEqual(["1", "2"]);

    const unsorted = sortProducts(filtered, "none");
    expect(unsorted.map((p) => p.id)).toEqual(["1", "2"]);
  });
});

describe("productsReducer + chat box toggle", () => {
  it.each([
    { from: "chat" as const, to: "products" as const },
    { from: "products" as const, to: "chat" as const },
  ])("toggles active view from $from to $to", ({ from, to }) => {
    expect(toggleChatBoxView(from)).toBe(to);
  });

  it("round-trips chat → products → chat", () => {
    const step1 = toggleChatBoxView("chat");
    const step2 = toggleChatBoxView(step1);
    expect(step1).toBe("products");
    expect(step2).toBe("chat");
  });

  it("keeps reducer product catalog when toggling to chat view", () => {
    const loaded = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    const view = toggleChatBoxView("products"); // switch to chat
    expect(view).toBe("chat");
    // Product list in store is unchanged when chat box is toggled open
    expect(loaded.products).toHaveLength(4);
    expect(loaded.status).toBe("success");
  });

  it("keeps reducer product catalog when toggling to products view", () => {
    const loaded = productsReducer(productsInitialState, {
      type: "REPLACE_PRODUCT",
      payload: filterCatalogFixture,
    });

    const view = toggleChatBoxView("chat"); // switch to products
    expect(view).toBe("products");
    expect(loaded.products.map((p) => p.id)).toEqual(["1", "2", "3", "4"]);
  });

  it("TabSwitcher click toggles chat box from chat to products", async () => {
    const handleChangeView = vi.fn();
    const user = userEvent.setup();

    render(
      createElement(TabSwitcher, {
        activeView: "chat",
        handleChangeView,
      }),
    );

    await user.click(document.querySelector(".tab-switcher")!);

    expect(handleChangeView).toHaveBeenCalledWith("products");
  });

  it("TabSwitcher click toggles chat box from products to chat", async () => {
    const handleChangeView = vi.fn();
    const user = userEvent.setup();

    render(
      createElement(TabSwitcher, {
        activeView: "products",
        handleChangeView,
      }),
    );

    await user.click(document.querySelector(".tab-switcher")!);

    expect(handleChangeView).toHaveBeenCalledWith("chat");
  });
});
