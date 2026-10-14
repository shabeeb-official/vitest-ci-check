import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RenderComponents from "@/utils/render-components";

vi.mock("@/components/render-loop", () => ({
  default: ({ list, render: renderItem }: any) => (
    <>
      {list.map((item: any, index: number) => (
        <React.Fragment key={index}>
          {renderItem(item)}
        </React.Fragment>
      ))}
    </>
  ),
}));

const TestComponent = ({ label, count, nested, children }: any) => (
  <div
    data-testid="test-component"
    data-label={label}
    data-count={count}
    data-nested={nested ? JSON.stringify(nested) : undefined}
  >
    {children}
  </div>
);

const makeItem = (overrides: any = {}) => ({
  component: "test",
  props: {},
  children: undefined,
  nested: null,
  ...overrides,
});

const makeProps = (overrides: any = {}) => ({
  item: makeItem(),
  registry: { test: TestComponent },
  runtimeScope: {},
  ...overrides,
});

describe("RenderComponents", () => {
  it.each([null, undefined])("returns null when item is %s", (item) => {
    const { container } = render(
      <RenderComponents {...makeProps({ item })} />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders a component without children and passes nested", () => {
    const nested = { layout: "column" };

    render(
      <RenderComponents
        {...makeProps({
          item: makeItem({ nested }),
        })}
      />,
    );

    expect(screen.getByTestId("test-component")).toHaveAttribute(
      "data-nested",
      JSON.stringify(nested),
    );
  });

  it("resolves props from runtimeScope", () => {
    render(
      <RenderComponents
        {...makeProps({
          item: makeItem({
            props: {
              label: "username",
              count: "itemCount",
            },
          }),
          runtimeScope: {
            username: "Alice",
            itemCount: 5,
          },
        })}
      />,
    );

    const element = screen.getByTestId("test-component");

    expect(element).toHaveAttribute("data-label", "Alice");
    expect(element).toHaveAttribute("data-count", "5");
  });

  it("preserves object props and literal values", () => {
    const style = { color: "red" };

    const Component = ({ config, label }: any) => (
      <div
        data-testid="props-component"
        data-config={JSON.stringify(config)}
        data-label={label}
      />
    );

    render(
      <RenderComponents
        {...makeProps({
          registry: { test: Component },
          item: makeItem({
            props: {
              config: style,
              label: "Hello",
            },
          }),
          runtimeScope: {},
        })}
      />,
    );

    const element = screen.getByTestId("props-component");

    expect(element).toHaveAttribute("data-config", JSON.stringify(style));
    expect(element).toHaveAttribute("data-label", "Hello");
  });

  it("renders child components recursively", () => {
    const item = makeItem({
      props: { label: "Parent" },
      children: [
        makeItem({
          props: { label: "Child" },
        }),
      ],
    });

    render(<RenderComponents {...makeProps({ item })} />);

    expect(screen.getAllByTestId("test-component")).toHaveLength(2);
    expect(screen.getAllByTestId("test-component")[0]).toHaveAttribute(
      "data-label",
      "Parent",
    );
    expect(screen.getAllByTestId("test-component")[1]).toHaveAttribute(
      "data-label",
      "Child",
    );
  });

  it("returns null when children is an empty array", () => {
    const { container } = render(
      <RenderComponents
        {...makeProps({
          item: makeItem({ children: [] }),
        })}
      />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("uses an empty runtimeScope when it is omitted", () => {
    const props = makeProps();
    delete props.runtimeScope;

    render(<RenderComponents {...props} />);

    expect(screen.getByTestId("test-component")).toBeInTheDocument();
  });
});
