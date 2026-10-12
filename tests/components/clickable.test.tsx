import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FilterTypeButton from "@/components/filter-type-button";
import ChatActionButton from "@/components/chat/button";
import TabSwitcher from "@/components/tap-switcher";
import CollectionIcon from "@/components/chat/collection-icon";
import { expectAccessible } from "./expect-accessible";

describe("FilterTypeButton", () => {
  it("renders an inactive filter and reports clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <FilterTypeButton label="shorts" selected={[]} onClick={onClick} />,
    );

    const button = screen.getByRole("button", { name: "shorts" });
    expect(button).toHaveClass("bg-white");

    await user.click(button);

    expect(onClick).toHaveBeenCalledWith("shorts");
    await expectAccessible(container);
  });

  it("renders a selected filter as active", () => {
    render(
      <FilterTypeButton label="shorts" selected={["shorts"]} onClick={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: "shorts" })).toHaveClass(
      "bg-black",
    );
  });
});

describe("chat action Button", () => {
  it("renders the icon and label and reports clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <ChatActionButton
        icon={<CollectionIcon />}
        label="collections"
        onClick={onClick}
      />,
    );

    await user.click(screen.getByText("collections"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("svg")).toHaveLength(2);
    await expectAccessible(container);
  });
});

describe("TabSwitcher", () => {
  it.each([
    ["chat", "products"],
    ["products", "chat"],
  ] as const)("switches from %s to %s", async (activeView, nextView) => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const user = userEvent.setup();
    const handleChangeView = vi.fn();
    const { container } = render(
      <TabSwitcher
        activeView={activeView}
        handleChangeView={handleChangeView}
      />,
    );

    await user.click(container.querySelector("span"));

    expect(handleChangeView).toHaveBeenCalledWith(nextView);
    await expectAccessible(container);
  });

  it("renders a custom icon and class", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { container } = render(
      <TabSwitcher
        activeView="chat"
        handleChangeView={vi.fn()}
        url="/toggle.svg"
        toggleButtonStyle="custom-toggle"
      />,
    );

    expect(container.querySelector("span")).toHaveClass("custom-toggle");
    expect(screen.getByRole("presentation")).toHaveAttribute(
      "src",
      "/toggle.svg",
    );
  });
});
