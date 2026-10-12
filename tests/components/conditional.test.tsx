import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Render } from "@/components/conditional";
import { expectAccessible } from "./expect-accessible";

const Toggle = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        toggle
      </button>
      <Render when={open} show={<p>shown</p>} otherwise={<p>hidden</p>} />
    </>
  );
};

describe("Render", () => {
  it("renders `show` when the condition is true", async () => {
    const { container } = render(
      <Render when show={<p>shown</p>} otherwise={<p>hidden</p>} />,
    );

    expect(screen.getByText("shown")).toBeInTheDocument();
    expect(screen.queryByText("hidden")).not.toBeInTheDocument();
    await expectAccessible(container);
  });

  it("renders `otherwise` when the condition is false", () => {
    render(
      <Render when={false} show={<p>shown</p>} otherwise={<p>hidden</p>} />,
    );

    expect(screen.getByText("hidden")).toBeInTheDocument();
    expect(screen.queryByText("shown")).not.toBeInTheDocument();
  });

  it("renders nothing when false and no fallback is given", () => {
    const { container } = render(<Render when={false} show={<p>shown</p>} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("switches branches when the condition changes", async () => {
    const user = userEvent.setup();
    render(<Toggle />);

    expect(screen.getByText("hidden")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByText("shown")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByText("hidden")).toBeInTheDocument();
  });
});
