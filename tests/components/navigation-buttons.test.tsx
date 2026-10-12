import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { ReactElement } from "react";

import BackToProducts from "@/components/product-page/back-to-products";
import ProductNotFound from "@/components/product-not-found";
import ChatButton from "@/components/home-page/chat-button";
import { expectAccessible } from "./expect-accessible";

const ProductsPage = () => {
  const location = useLocation();
  return (
    <p>
      products page {location.state?.showProducts ? "with products" : ""}
    </p>
  );
};

const renderAtHome = (ui: ReactElement) =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("BackToProducts", () => {
  it("navigates to the products page", async () => {
    const user = userEvent.setup();
    const { container } = renderAtHome(<BackToProducts styles="back" />);

    const button = screen.getByRole("button", { name: "back to products" });
    expect(button).toHaveClass("back");
    await expectAccessible(container);

    await user.click(button);

    expect(await screen.findByText(/products page/)).toBeInTheDocument();
  });
});

describe("ProductNotFound", () => {
  it("explains the problem and navigates back with products shown", async () => {
    const user = userEvent.setup();
    const { container } = renderAtHome(<ProductNotFound />);

    expect(
      screen.getByRole("heading", { name: "Product details not found" }),
    ).toBeInTheDocument();
    await expectAccessible(container);

    await user.click(screen.getByRole("button", { name: /back to products/i }));

    expect(
      await screen.findByText("products page with products"),
    ).toBeInTheDocument();
  });
});

describe("ChatButton", () => {
  it("navigates to the products page", async () => {
    const user = userEvent.setup();
    const { container } = renderAtHome(<ChatButton />);
    await expectAccessible(container);

    await user.click(screen.getByRole("button", { name: /let's chat/i }));

    expect(await screen.findByText(/products page/)).toBeInTheDocument();
  });
});
