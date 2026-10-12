import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import ChatWrapper from "@/components/chat/chat-wrapper";
import HomeWrapper from "@/components/home-page/home-wrapper";
import PDPWrapper from "@/components/pdp/main-grid";
import { ShimmerGrid } from "@/registry/generic/shimmer-grid";
import { expectAccessible } from "./expect-accessible";

describe("ChatWrapper", () => {
  it("renders its children", async () => {
    const { container } = render(
      <ChatWrapper>
        <p>chat content</p>
      </ChatWrapper>,
    );

    expect(screen.getByText("chat content")).toBeInTheDocument();
    await expectAccessible(container);
  });
});

describe("HomeWrapper", () => {
  it("uses the default layout classes", async () => {
    const { container } = render(
      <HomeWrapper headerHeight={80}>
        <p>home content</p>
      </HomeWrapper>,
    );

    expect(screen.getByText("home content").parentElement).toHaveClass(
      "flex-col",
    );
    await expectAccessible(container);
  });

  it("uses custom classes when provided", () => {
    render(
      <HomeWrapper styles="custom-home">
        <p>home content</p>
      </HomeWrapper>,
    );

    expect(screen.getByText("home content").parentElement).toHaveClass(
      "custom-home",
    );
  });
});

describe("PDPWrapper", () => {
  it("renders its children with the given class", async () => {
    const { container } = render(
      <PDPWrapper style="pdp-grid">
        <p>pdp content</p>
      </PDPWrapper>,
    );

    expect(screen.getByText("pdp content").parentElement).toHaveClass(
      "pdp-grid",
    );
    await expectAccessible(container);
  });
});

describe("ShimmerGrid", () => {
  it("renders 16 placeholder cards", async () => {
    const { container } = render(<ShimmerGrid />);

    // Placeholders have no accessible content to query by role or text.
    expect(container.firstElementChild?.children).toHaveLength(16);
    await expectAccessible(container);
  });
});
