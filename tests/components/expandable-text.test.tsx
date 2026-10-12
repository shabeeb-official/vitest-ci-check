import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ExpandableTextOption from "@/components/expandable-text-option";
import ExpandableText from "@/registry/generic/expandabelText";
import { expectAccessible } from "./expect-accessible";

const words = (count: number) =>
  Array.from({ length: count }, (_, i) => `word${i + 1}`).join(" ");

describe("ExpandableTextOption", () => {
  it("renders its label", async () => {
    const { container } = render(
      <p>
        <ExpandableTextOption label="read more" />
      </p>,
    );

    expect(screen.getByText("read more")).toBeInTheDocument();
    await expectAccessible(container);
  });
});

describe("ExpandableText", () => {
  it("truncates to 30 words and toggles between read more and less", async () => {
    const user = userEvent.setup();
    const value = words(40);
    const { container } = render(<ExpandableText value={value} />);

    const paragraph = container.querySelector("p");
    expect(paragraph).toHaveTextContent(words(30));
    expect(paragraph).not.toHaveTextContent("word31");
    expect(screen.queryByText("less")).not.toBeInTheDocument();

    await user.click(screen.getByText("read more"));

    expect(paragraph).toHaveTextContent("word40");
    expect(screen.getByText("less")).toBeInTheDocument();
    expect(screen.queryByText("read more")).not.toBeInTheDocument();

    await user.click(screen.getByText("less"));

    expect(paragraph).not.toHaveTextContent("word31");
    expect(screen.getByText("read more")).toBeInTheDocument();
    await expectAccessible(container);
  });

  it("applies a custom className", () => {
    const { container } = render(
      <ExpandableText value="short text" className="custom" />,
    );

    expect(container.querySelector("p")).toHaveClass("custom");
    expect(screen.getByText(/short text/)).toBeInTheDocument();
  });

  it("renders only the toggle label for empty text", () => {
    render(<ExpandableText value="" />);

    expect(screen.getByText("read more")).toBeInTheDocument();
  });
});
