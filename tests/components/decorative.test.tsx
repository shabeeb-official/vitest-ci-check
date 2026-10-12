import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import ColorPill from "@/components/color-pill";
import MobileClickPill from "@/components/mobile-click-pill";
import CircularProgress from "@/components/circular-progress";
import SendIcon from "@/components/chat/send-icon";
import LineIcon from "@/components/chat/line-icon";
import GearIcon from "@/components/chat/gear-icon";
import CollectionIcon from "@/components/chat/collection-icon";
import { expectAccessible } from "./expect-accessible";

// These components render purely decorative markup with no accessible name,
// so DOM queries on the container are the only way to assert on them.

describe("ColorPill", () => {
  it("renders a swatch in the given colour", async () => {
    const { container } = render(<ColorPill color="rgb(255, 0, 0)" />);

    expect(container.querySelector("span")).toHaveStyle({
      backgroundColor: "rgb(255, 0, 0)",
    });
    await expectAccessible(container);
  });
});

describe("MobileClickPill", () => {
  it("renders the drag handle", async () => {
    const { container } = render(<MobileClickPill />);

    expect(container.querySelector("span")).toHaveClass("rounded-full");
    await expectAccessible(container);
  });
});

describe("CircularProgress", () => {
  it("shows the counter in seconds and offsets the ring by the percentage", async () => {
    const { container } = render(
      <CircularProgress counter={2500} total={5000} />,
    );

    expect(screen.getByText("2.5")).toBeInTheDocument();
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(2);
    expect(circles[1]).toHaveAttribute("stroke-dashoffset", "50");
    await expectAccessible(container);
  });
});

describe("SendIcon", () => {
  it("renders the enabled defaults", async () => {
    const { container } = render(<SendIcon />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "47");
    expect(container.querySelector("circle")).toHaveAttribute(
      "fill",
      "#F8E300",
    );
    expect(container.querySelector("path")).toHaveAttribute("fill", "#000000");
    await expectAccessible(container);
  });

  it("renders the disabled defaults in the chat window size", () => {
    const { container } = render(<SendIcon disabled chatWindow />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
    expect(svg).toHaveClass("cursor-not-allowed");
    expect(container.querySelector("circle")).toHaveAttribute(
      "fill",
      "#d4d4d4",
    );
    expect(container.querySelector("path")).toHaveAttribute("fill", "#a3a3a3");
  });

  it("applies custom styles in both states", () => {
    const styles = {
      width: 30,
      height: 32,
      enabledFill: "green",
      disabledFill: "grey",
      arrowEnabledColor: "white",
      arrowDisabledColor: "black",
      cursorEnabled: "cursor-pointer",
      cursorDisabled: "cursor-wait",
    };

    const enabled = render(<SendIcon styles={styles} />);
    expect(enabled.container.querySelector("svg")).toHaveAttribute(
      "width",
      "30",
    );
    expect(enabled.container.querySelector("svg")).toHaveClass(
      "cursor-pointer",
    );
    expect(enabled.container.querySelector("circle")).toHaveAttribute(
      "fill",
      "green",
    );
    enabled.unmount();

    const disabled = render(<SendIcon disabled styles={styles} />);
    expect(disabled.container.querySelector("svg")).toHaveClass("cursor-wait");
    expect(disabled.container.querySelector("path")).toHaveAttribute(
      "fill",
      "black",
    );
  });
});

describe.each([
  ["LineIcon", LineIcon, "0 0 1 20"],
  ["GearIcon", GearIcon, "0 0 21 20"],
  ["CollectionIcon", CollectionIcon, "0 0 16 16"],
])("%s", (_name, Icon, viewBox) => {
  it("renders its svg", async () => {
    const { container } = render(<Icon />);

    expect(container.querySelector("svg")).toHaveAttribute("viewBox", viewBox);
    await expectAccessible(container);
  });
});
