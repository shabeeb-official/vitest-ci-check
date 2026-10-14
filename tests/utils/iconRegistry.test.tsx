import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import IconRegistry from "@/utils/iconRegistry";

describe("IconRegistry", () => {
  it.each([
    "home",
    "user",
    "settings",
    "cart",
    "chevronsLeft",
    "chevronDown",
    "heart",
    "plus",
    "minus",
    "arrowLeft",
    "loader",
  ] as const)("renders the %s icon", (icon) => {
    const { container } = render(<IconRegistry icon={icon} />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("passes the className to the rendered icon", () => {
    const { container } = render(
      <IconRegistry icon="home" className="test-icon" />,
    );

    expect(container.querySelector("svg")).toHaveClass("test-icon");
  });

  it("renders without a className", () => {
    const { container } = render(<IconRegistry icon="user" />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("returns null for an unsupported icon", () => {
    const { container } = render(
      <IconRegistry icon={"invalid" as any} />,
    );

    expect(container.innerHTML).toBe("");
  });
});
