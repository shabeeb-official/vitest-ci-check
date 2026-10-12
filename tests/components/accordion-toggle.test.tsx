import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import AccordionToggle from "@/components/accordion-toggle";
import { expectAccessible } from "./expect-accessible";

// Lucide icons are aria-hidden, so the rendered icon is identified by its class.
const iconClass = (container: HTMLElement) =>
  container.querySelector("svg")?.getAttribute("class") ?? "";

const Section = ({ iconType }: { iconType?: "chevron" | "plus" }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen((prev) => !prev)}
    >
      details
      <AccordionToggle open={open} iconType={iconType} />
    </button>
  );
};

describe("AccordionToggle", () => {
  it.each([
    [false, undefined, "lucide-chevron-down"],
    [true, undefined, "lucide-chevron-up"],
    [false, "plus" as const, "lucide-plus"],
    [true, "plus" as const, "lucide-minus"],
  ])("open=%p iconType=%p renders %s", (open, iconType, expected) => {
    const { container } = render(
      <AccordionToggle open={open} iconType={iconType} />,
    );

    expect(iconClass(container)).toContain(expected);
  });

  it.each([
    [undefined, "lucide-chevron-down", "lucide-chevron-up"],
    ["plus" as const, "lucide-plus", "lucide-minus"],
  ])(
    "expands and collapses with iconType=%p",
    async (iconType, closedIcon, openIcon) => {
      const user = userEvent.setup();
      const { container } = render(<Section iconType={iconType} />);
      const trigger = screen.getByRole("button", { name: "details" });

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(iconClass(container)).toContain(closedIcon);

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(iconClass(container)).toContain(openIcon);

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(iconClass(container)).toContain(closedIcon);

      await expectAccessible(container);
    },
  );
});
