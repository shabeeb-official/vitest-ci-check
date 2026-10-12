import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import ProductDetail from "../src/components/ProductDetail";
import ProductProvider, {
  useProdctDetailDispatch,
  useProductQuantity,
} from "../src/store/product-detail/index";
import { QuantitySelector } from "../src/components/pdp/quantity";

const { mutateMock } = vi.hoisted(() => ({
  mutateMock: vi.fn(),
}));

vi.mock("@/hooks/use-add-cart", () => ({
  default: () => ({
    mutate: mutateMock,
    isPending: false,
  }),
}));

const isMobileMock = vi.fn(() => false);

vi.mock("@/hooks/use-mobile-width", () => ({
  useIsMobileWidth: () => isMobileMock(),
}));

/**
 * Buy Now stub that mirrors production: cart uses selected SKU (variant)
 * from the URL and quantity from the product-detail store.
 */
vi.mock("@/components/product-page/buy-now-button", () => ({
  default: ({ name }: { name: string }) => {
    const qty = useProductQuantity();
    const [search] = useSearchParams();
    const sku = search.get("sku");

    return (
      <button
        type="button"
        onClick={() =>
          mutateMock({
            qty,
            sku,
            opts: "[]",
          })
        }
      >
        Buy {name}
      </button>
    );
  },
}));

vi.mock("@/components/product-page/buy-now-pay-later", () => ({
  default: () => <div>Buy Now Pay Later</div>,
}));

vi.mock("@/components/product-page/description", () => ({
  default: () => <div>Product Description</div>,
}));

vi.mock("@/components/product-page/details", () => ({
  Details: () => <div>Product Details</div>,
  default: () => <div>Additional Details</div>,
}));

vi.mock("@/components/favorites-button", () => ({
  default: ({ sku }: { sku: string }) => (
    <button type="button">Favorite {sku}</button>
  ),
}));

const testProduct = {
  title: "Test Product",
  brand: "Test Brand",
  sku: "SKU123",
  price: "100",
  sale_price: "",
  swatchName: "Black",
} as any;

const sizeObject = {
  Black: {
    src: "/black.jpg",
    sizes: [
      { id: "SKU123", size: "M" },
      { id: "SKU456", size: "L" },
      { id: "SKU-S", size: "S" },
    ],
  },
  White: {
    src: "/white.jpg",
    sizes: [
      { id: "SKU789", size: "M" },
      { id: "SKU790", size: "XL" },
    ],
  },
  Red: {
    src: "/red.jpg",
    sizes: [{ id: "SKU-RED-M", size: "M" }],
  },
};

const ProductLoader = ({ product }: { product: any }) => {
  const dispatch = useProdctDetailDispatch();

  React.useEffect(() => {
    dispatch({
      type: "LOAD_PRODUCT",
      payload: product,
    });
  }, [dispatch, product]);

  return null;
};

const renderProductDetail = (
  options: {
    initialSku?: string;
    product?: any;
  } = {},
) => {
  const { initialSku = "SKU123", product = testProduct } = options;
  const user = userEvent.setup();

  const view = render(
    <MemoryRouter initialEntries={[`/?sku=${initialSku}`]}>
      <ProductProvider>
        <ProductLoader product={product} />
        <QuantitySelector styles={{}} />
        <ProductDetail
          sizeObject={sizeObject as any}
          swatches={["Black", "White", "Red"]}
        />
      </ProductProvider>
    </MemoryRouter>,
  );

  return { ...view, user };
};

describe("ProductDetail", () => {
  beforeEach(() => {
    mutateMock.mockClear();
  });

  it("renders product information", async () => {
    renderProductDetail();

    expect(await screen.findByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
    expect(screen.getByText("Black")).toBeInTheDocument();
    expect(screen.getByText("product number: SKU123")).toBeInTheDocument();
  });

  it("renders available sizes", async () => {
    renderProductDetail();

    expect(await screen.findByLabelText("Select M size")).toBeInTheDocument();
    expect(screen.getByLabelText("Select L size")).toBeInTheDocument();
  });

  it("updates SKU when a size is selected", async () => {
    const { user } = renderProductDetail();

    await user.click(await screen.findByLabelText("Select L size"));

    expect(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    ).toBeInTheDocument();
  });

  it("updates SKU when a color is selected", async () => {
    const { user } = renderProductDetail();

    await user.click(await screen.findByLabelText("White"));

    // White's first size variant becomes the selected SKU
    expect(
      await screen.findByLabelText("Select M size"),
    ).toBeInTheDocument();
  });

  it("renders the Buy Now button with the product name", async () => {
    renderProductDetail();

    expect(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    ).toBeInTheDocument();
  });

  it("renders the favorite button on mobile", async () => {
    isMobileMock.mockReturnValue(true);

    renderProductDetail();

    expect(
      await screen.findByRole("button", { name: "Favorite SKU123" }),
    ).toBeInTheDocument();

    isMobileMock.mockReturnValue(false);
  });
});

describe("ProductDetail add to cart by selected variant + quantity", () => {
  beforeEach(() => {
    mutateMock.mockClear();
  });

  it("adds to cart with default color/size variant and quantity 1", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 1,
      sku: "SKU123",
      opts: "[]",
    });
  });

  it("adds to cart with selected size variant (L)", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(await screen.findByLabelText("Select L size"));
    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 1,
      sku: "SKU456",
      opts: "[]",
    });
  });

  it("adds to cart with selected size variant (S)", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(await screen.findByLabelText("Select S size"));
    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 1,
      sku: "SKU-S",
      opts: "[]",
    });
  });

  it("adds to cart with selected color variant (White → first size SKU)", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(await screen.findByLabelText("White"));
    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 1,
      sku: "SKU789",
      opts: "[]",
    });
  });

  it("adds to cart with selected color variant (Red)", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(await screen.findByLabelText("Red"));
    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 1,
      sku: "SKU-RED-M",
      opts: "[]",
    });
  });

  it("adds to cart with White color then XL size variant", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(await screen.findByLabelText("White"));
    await user.click(await screen.findByLabelText("Select XL size"));
    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 1,
      sku: "SKU790",
      opts: "[]",
    });
  });

  it("adds to cart with increased quantity for current variant", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 3,
      sku: "SKU123",
      opts: "[]",
    });
  });

  it("adds to cart with size variant L and quantity 2", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(await screen.findByLabelText("Select L size"));
    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 2,
      sku: "SKU456",
      opts: "[]",
    });
  });

  it("adds to cart with color White, size XL, and quantity 4", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(await screen.findByLabelText("White"));
    await user.click(await screen.findByLabelText("Select XL size"));
    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 4,
      sku: "SKU790",
      opts: "[]",
    });
  });

  it("adds to cart with quantity typed into the input for a size variant", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU123" });

    await user.click(await screen.findByLabelText("Select L size"));

    const qtyInput = screen.getByRole("spinbutton");
    fireEvent.change(qtyInput, { target: { value: "5" } });

    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 5,
      sku: "SKU456",
      opts: "[]",
    });
  });

  it("decreases quantity before add to cart", async () => {
    const { user } = renderProductDetail({ initialSku: "SKU456" });

    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(screen.getByLabelText("Increase quantity"));
    await user.click(screen.getByLabelText("Decrease quantity"));
    await user.click(
      await screen.findByRole("button", { name: "Buy Test Product" }),
    );

    expect(mutateMock).toHaveBeenCalledWith({
      qty: 2,
      sku: "SKU456",
      opts: "[]",
    });
  });
});
