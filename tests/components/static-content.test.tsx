import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Loader from "@/components/loader";
import ProductLoading from "@/components/product-page/product-loading";
import NoProductMessage from "@/components/no-products-message";
import InDemand from "@/components/product-page/in-demand";
import BuyNowPayLater from "@/components/product-page/buy-now-pay-later";
import HeroBanner from "@/components/home-page/hero-banner";
import LogoSection from "@/components/home-page/logo-section";
import { expectAccessible } from "./expect-accessible";

describe("Loader", () => {
  it("shows a loading message", async () => {
    const { container } = render(<Loader />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await expectAccessible(container);
  });
});
describe("ProductLoading", () => {
  it("shows a loading heading", async () => {
    const { container } = render(<ProductLoading />);

    expect(screen.getByRole("heading", { name: "Loading" })).toBeInTheDocument();
    await expectAccessible(container);
  });
});

describe("NoProductMessage", () => {
  it("invites the user to start chatting", async () => {
    const { container } = render(<NoProductMessage />);

    expect(
      screen.getByRole("heading", { name: "Let's style you" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/start chatting with our assistant/i),
    ).toBeInTheDocument();
    await expectAccessible(container);
  });
});

describe("InDemand", () => {
  it("shows the demand badge", async () => {
    const { container } = render(<InDemand />);

    expect(screen.getByText("In Demand!")).toBeInTheDocument();
    expect(
      screen.getByText("Sold 15 times in the last 7 days"),
    ).toBeInTheDocument();
    await expectAccessible(container);
  });
});

describe("BuyNowPayLater", () => {
  it("renders the default label with no payment methods", () => {
    render(<BuyNowPayLater />);

    expect(screen.getByText("buy now pay later")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders one labelled logo per payment method", async () => {
    const { container } = render(
      <BuyNowPayLater
        label="Pay in 4"
        paymentMethods={[
          { name: "Afterpay", src: "/afterpay.png" },
          { name: "Zip", src: "/zip.png", className: "zip-logo" },
        ]}
      />,
    );

    expect(screen.getByText("Pay in 4")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Afterpay" })).toHaveClass(
      "w-[80px]",
    );
    expect(screen.getByRole("img", { name: "Zip" })).toHaveClass("zip-logo");
    await expectAccessible(container);
  });
});

describe("HeroBanner", () => {
  it("renders the banner image", async () => {
    const { container } = render(<HeroBanner />);

    expect(
      screen.getByRole("img", { name: /season sellout/i }),
    ).toBeInTheDocument();
    await expectAccessible(container);
  });
});

describe("LogoSection", () => {
  it("renders the default logo and title", async () => {
    const { container } = render(<LogoSection />);

    expect(screen.getByRole("img", { name: "app-logo" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /shop with grace & stella/i }),
    ).toBeInTheDocument();
    await expectAccessible(container);
  });

  it("renders custom logo and title text", () => {
    render(
      <LogoSection
        logoImg="/logo.png"
        titleText="welcome to"
        titleBold="city beach"
        styles={{ titleBold: "bold" }}
      />,
    );

    expect(screen.getByRole("img", { name: "app-logo" })).toHaveAttribute(
      "src",
      "/logo.png",
    );
    expect(screen.getByText("city beach")).toHaveClass("bold");
  });
});
