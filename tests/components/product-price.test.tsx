import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProductPrice } from "@/components/product-price";
import { product } from "../fixtures/product";
import { expectAccessible } from "./expect-accessible";

const styles = {
  strike: "strike",
  sale: "sale",
  price: "price",
  priceWrapper: "wrapper",
};

describe("ProductPrice", () => {
  it("renders the regular price when there is no discount", async () => {
    const { container } = render(
      <ProductPrice product={product("1", { price: 49.95 })} styles={styles} />,
    );

    expect(screen.getByText("$49.95")).toHaveClass("price");
    await expectAccessible(container);
  });

  it("renders the original and sale price when discounted", async () => {
    const { container } = render(
      <ProductPrice
        product={product("1", { price: 80, discount_price: "59.5" })}
        styles={styles}
      />,
    );

    expect(screen.getByText("$80.00")).toHaveClass("strike");
    expect(screen.getByText("$59.50")).toHaveClass("sale");
    await expectAccessible(container);
  });
});
