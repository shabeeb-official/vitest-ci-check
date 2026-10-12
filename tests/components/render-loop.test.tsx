import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import RenderLoop from "@/components/render-loop";
import { expectAccessible } from "./expect-accessible";

describe("RenderLoop", () => {
  it("renders every item with its index", async () => {
    const { container } = render(
      <ul>
        <RenderLoop
          list={["Shorts", "Tops"]}
          render={(item, i) => (
            <li key={String(item)}>
              {i}: {String(item)}
            </li>
          )}
        />
      </ul>,
    );

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("0: Shorts");
    expect(items[1]).toHaveTextContent("1: Tops");
    await expectAccessible(container);
  });

  it("renders nothing without a list", () => {
    const { container } = render(<RenderLoop render={() => <p>item</p>} />);

    expect(container).toBeEmptyDOMElement();
  });
});
