import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProductCard from "@/components/ProductCard";
import { ProductCardBody } from "@/components/ProductCardBody";
import { ProductTitle } from "@/components/ProductTitle";
import { ProductBrand } from "@/components/ProductBrand";
import { ProductListImage } from "@/components/ProductListImage";
import { ImageWrapper } from "@/components/ImageWrapper";
import { DetailsWrapper } from "@/components/DetailsWrapper";
import { product } from "../fixtures/product";
import { expectAccessible } from "./expect-accessible";

const item = product("1", { title: "Linen Shirt", brand: "Stella" });

const Card = ({ onNavigate = vi.fn() }: { onNavigate?: () => void }) => (
  <ProductCard navigateToProduct={onNavigate} styles={{ base: "card" }}>
    <ImageWrapper styles={{ imageWrap: "image-wrap" }}>
      <ProductListImage product={item} styles={{ image: "image" }} />
    </ImageWrapper>
    <ProductCardBody styles={{ content: "content" }}>
      <DetailsWrapper product={item} styles={{ details: "details" }}>
        <ProductBrand product={item} styles={{ brand: "brand" }} />
        <ProductTitle product={item} styles={{ title: "title" }} />
      </DetailsWrapper>
    </ProductCardBody>
  </ProductCard>
);

describe("product card composition", () => {
  it("renders brand, title and image accessibly", async () => {
    const { container } = render(<Card />);

    expect(screen.getByRole("heading", { name: "Stella" })).toHaveClass(
      "brand",
    );
    expect(screen.getByText("Linen Shirt")).toHaveClass("title");
    expect(screen.getByRole("img", { name: "Linen Shirt" })).toHaveAttribute(
      "src",
      "/img/1.jpg",
    );
    await expectAccessible(container);
  });

  it("navigates when the card is clicked", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<Card onNavigate={onNavigate} />);

    await user.click(screen.getByText("Linen Shirt"));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("does not navigate when the brand is clicked", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<Card onNavigate={onNavigate} />);

    await user.click(screen.getByRole("heading", { name: "Stella" }));

    expect(onNavigate).not.toHaveBeenCalled();
  });
});

describe("ProductCard", () => {
  it("falls back to the base style when no styles are given", () => {
    render(
      <ProductCard navigateToProduct={vi.fn()} styles={undefined}>
        <p>child</p>
      </ProductCard>,
    );

    expect(screen.getByText("child").parentElement).toHaveClass("bg-white");
  });
});

describe("ProductListImage", () => {
  it("is hidden until the image loads", () => {
    render(<ProductListImage product={item} styles={{ image: "image" }} />);
    const img = screen.getByRole("img", { name: "Linen Shirt" });

    expect(img).toHaveStyle({ opacity: "0" });

    fireEvent.load(img);

    expect(img).toHaveStyle({ opacity: "1" });
  });

  it("uses src and alt props when no product is given", async () => {
    const { container } = render(
      <ProductListImage
        src="/img/raw.jpg"
        alt="Raw image"
        fetchPriority="low"
        styles={{ image: "image" }}
      />,
    );

    const img = screen.getByRole("img", { name: "Raw image" });
    expect(img).toHaveAttribute("src", "/img/raw.jpg");
    expect(img).toHaveAttribute("fetchpriority", "low");
    await expectAccessible(container);
  });

  it("renders a decorative image when there is no alt text", () => {
    render(<ProductListImage src="/img/raw.jpg" styles={{ image: "image" }} />);

    expect(screen.getByRole("presentation")).toHaveAttribute("alt", "");
  });

  it("renders nothing without an image source", () => {
    const { container } = render(
      <ProductListImage styles={{ image: "image" }} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
