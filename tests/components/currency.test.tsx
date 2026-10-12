import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import Currency from "@/components/currency";
import { expectAccessible } from "./expect-accessible";

const PriceInput = () => {
  const [value, setValue] = useState("");
  return (
    <>
      <label>
        amount
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <output aria-label="formatted">
        <Currency>{value}</Currency>
      </output>
    </>
  );
};

describe("Currency", () => {
  it.each([
    [10, "$10.00"],
    ["12.5", "$12.50"],
    [0, "$0.00"],
    [1234.567, "$1,234.57"],
    [-3, "-$3.00"],
  ])("formats %p as %s", async (input, expected) => {
    const { container } = render(
      <p>
        <Currency>{input}</Currency>
      </p>,
    );

    expect(screen.getByText(expected)).toBeInTheDocument();
    await expectAccessible(container);
  });

  it.each([null, undefined, "abc", Infinity, Number.NaN])(
    "renders nothing for %p",
    (input) => {
      const { container } = render(<Currency>{input}</Currency>);

      expect(container).toBeEmptyDOMElement();
    },
  );

  it("reformats as the user types", async () => {
    const user = userEvent.setup();
    render(<PriceInput />);

    const output = screen.getByRole("status", { name: "formatted" });
    expect(output).toHaveTextContent("$0.00");

    await user.type(screen.getByRole("textbox", { name: "amount" }), "49.9");
    expect(output).toHaveTextContent("$49.90");

    await user.type(screen.getByRole("textbox", { name: "amount" }), "x");
    expect(output).toBeEmptyDOMElement();
  });
});
