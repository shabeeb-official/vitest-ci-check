import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderNode, renderNodeList } from "@/utils/render-ui";

const makeNode = (overrides: any = {}): any => ({
  name: "test-node",
  element: "test",
  props: {},
  children: [],
  nested: null,
  slots: {},
  properties: {},
  list: [],
  listFields: [],
  render: [],
  when: { operator: "is", lhs: "a", rhs: "a" },
  then: [],
  otherwise: [],
  ...overrides,
});

const makeOpts = (registry: any = {}, runtimeScope: any = {}) => ({
  registry,
  runtimeScope,
});

describe("renderNode", () => {
  it("returns null when the node is missing", () => {
    expect(renderNode(null as any, makeOpts())).toBeNull();
    expect(renderNode(undefined as any, makeOpts())).toBeNull();
  });

  it("returns null when the element is not in the registry", () => {
    expect(
      renderNode(makeNode({ element: "missing" }), makeOpts({})),
    ).toBeNull();
  });

  describe("leaf nodes", () => {
    it("resolves a value from runtimeScope", () => {
      const node = makeNode({
        element: "value",
        props: { value: "productName" },
      });

      expect(
        renderNode(
          node,
          makeOpts({ value: { type: "leaf" } }, { productName: "Shoes" }),
        ),
      ).toBe("Shoes");
    });

    it("returns the original value when it is not in runtimeScope", () => {
      const node = makeNode({
        element: "value",
        props: { value: "literal text" },
      });

      expect(renderNode(node, makeOpts({ value: { type: "leaf" } }, {}))).toBe(
        "literal text",
      );
    });

    it("preserves falsy values resolved from runtimeScope", () => {
      const registry = { value: { type: "leaf" } };

      for (const value of [0, false, ""]) {
        expect(
          renderNode(
            makeNode({
              element: "value",
              props: { value: "item" },
            }),
            makeOpts(registry, { item: value }),
          ),
        ).toBe(value);
      }
    });

    it("falls back to the original value when the scoped value is null", () => {
      const node = makeNode({
        element: "value",
        props: { value: "item" },
      });

      expect(
        renderNode(node, makeOpts({ value: { type: "leaf" } }, { item: null })),
      ).toBe("item");
    });
  });

  describe("loop nodes", () => {
    it("renders a loop over string items", () => {
      const node = makeNode({
        element: "loop",
        list: ["apple", "banana"],
        render: [
          makeNode({
            element: "value",
            props: { value: "value" },
          }),
        ],
      });

      const result = renderNode(
        node,
        makeOpts({ loop: { type: "loop" }, value: { type: "leaf" } }, {}),
      );

      expect(result).toEqual([["apple"], ["banana"]]);
    });

    it("renders a loop over object items using listFields", () => {
      const node = makeNode({
        element: "loop",
        list: [
          { title: "Shirt", sku: "SKU1" },
          { title: "Shoes", sku: "SKU2" },
        ],
        listFields: [
          { key: "title", value: "productName" },
          { key: "sku", value: "productSku" },
        ],
        render: [
          makeNode({
            element: "name",
            props: { value: "productName" },
          }),
          makeNode({
            element: "sku",
            props: { value: "productSku" },
          }),
        ],
      });

      const registry = {
        loop: { type: "loop" },
        name: { type: "leaf" },
        sku: { type: "leaf" },
      };

      expect(renderNode(node, makeOpts(registry, {}))).toEqual([
        ["Shirt", "SKU1"],
        ["Shoes", "SKU2"],
      ]);
    });

    it("makes the loop index available in runtimeScope", () => {
      const node = makeNode({
        element: "loop",
        list: ["first", "second"],
        render: [
          makeNode({
            element: "index",
            props: { value: "i" },
          }),
        ],
      });

      expect(
        renderNode(
          node,
          makeOpts({ loop: { type: "loop" }, index: { type: "leaf" } }, {}),
        ),
      ).toEqual([[0], [1]]);
    });

    it("resolves a list from runtimeScope when list is a string", () => {
      const node = makeNode({
        element: "loop",
        list: "products",
        render: [
          makeNode({
            element: "item",
            props: { value: "value" },
          }),
        ],
      });

      expect(
        renderNode(
          node,
          makeOpts(
            { loop: { type: "loop" }, item: { type: "leaf" } },
            { products: ["one", "two"] },
          ),
        ),
      ).toEqual([["one"], ["two"]]);
    });

    it("returns an empty array for an empty list", () => {
      const node = makeNode({
        element: "loop",
        list: [],
        render: [],
      });

      expect(
        renderNode(node, makeOpts({ loop: { type: "loop" } }, {})),
      ).toEqual([]);
    });

    it("returns undefined when the runtime list is missing", () => {
      const node = makeNode({
        element: "loop",
        list: "missingList",
        render: [],
      });

      expect(
        renderNode(node, makeOpts({ loop: { type: "loop" } }, {})),
      ).toBeUndefined();
    });
  });

  describe("conditional nodes", () => {
    const registry = {
      condition: { type: "conditional" },
      yes: { type: "leaf" },
      no: { type: "leaf" },
    };

    const branches = {
      then: [makeNode({ element: "yes", props: { value: "YES" } })],
      otherwise: [makeNode({ element: "no", props: { value: "NO" } })],
    };

    it("renders then when an is condition matches scoped values", () => {
      const node = makeNode({
        element: "condition",
        when: { operator: "is", lhs: "first", rhs: "second" },
        ...branches,
      });

      expect(
        renderNode(node, makeOpts(registry, { first: "same", second: "same" })),
      ).toEqual(["YES"]);
    });

    it("renders otherwise when an is condition does not match", () => {
      const node = makeNode({
        element: "condition",
        when: { operator: "is", lhs: "first", rhs: "second" },
        ...branches,
      });

      expect(
        renderNode(node, makeOpts(registry, { first: "one", second: "two" })),
      ).toEqual(["NO"]);
    });

    it("uses literal operands when they are not in runtimeScope", () => {
      const node = makeNode({
        element: "condition",
        when: { operator: "is", lhs: "same", rhs: "same" },
        ...branches,
      });

      expect(renderNode(node, makeOpts(registry, {}))).toEqual(["YES"]);
    });

    it("renders then when a not condition does not match", () => {
      const node = makeNode({
        element: "condition",
        when: { operator: "not", lhs: "first", rhs: "second" },
        ...branches,
      });

      expect(
        renderNode(node, makeOpts(registry, { first: "one", second: "two" })),
      ).toEqual(["YES"]);
    });

    it("renders otherwise when a not condition matches", () => {
      const node = makeNode({
        element: "condition",
        when: { operator: "not", lhs: "first", rhs: "second" },
        ...branches,
      });

      expect(
        renderNode(node, makeOpts(registry, { first: "same", second: "same" })),
      ).toEqual(["NO"]);
    });

    it("returns null for an unsupported conditional operator", () => {
      const node = makeNode({
        element: "condition",
        when: {
          operator: "unknown",
          lhs: "first",
          rhs: "second",
        },
        ...branches,
      });

      expect(renderNode(node, makeOpts(registry, {}))).toBeNull();
    });
  });

  describe("function nodes", () => {
    it("passes rendered children to the registered function", () => {
      const fn = vi.fn((children) => children.join("-"));
      const node = makeNode({
        element: "concat",
        children: [
          makeNode({ element: "value", props: { value: "A" } }),
          makeNode({ element: "value", props: { value: "B" } }),
        ],
      });

      expect(
        renderNode(
          node,
          makeOpts(
            {
              concat: { type: "fn", fn },
              value: { type: "leaf" },
            },
            {},
          ),
        ),
      ).toBe("A-B");

      expect(fn).toHaveBeenCalledWith(["A", "B"]);
    });

    it("accepts the expected number of children", () => {
      const fn = vi.fn(() => "result");
      const node = makeNode({
        element: "sum",
        children: [
          makeNode({ element: "value", props: { value: 1 } }),
          makeNode({ element: "value", props: { value: 2 } }),
        ],
      });

      expect(
        renderNode(
          node,
          makeOpts(
            {
              sum: { type: "fn", arity: 2, fn },
              value: { type: "leaf" },
            },
            {},
          ),
        ),
      ).toBe("result");
    });

    it('allows mismatched child count when arity is "n"', () => {
      const fn = vi.fn(() => "result");

      const result = renderNode(
        makeNode({
          element: "combine",
          children: [
            makeNode({
              element: "value",
              props: { value: "A" },
            }),
          ],
        }),
        makeOpts(
          {
            combine: {
              type: "fn",
              arity: "n",
              fn,
            },
            value: { type: "leaf" },
          },
          {},
        ),
      );

      expect(result).toBe("result");
      expect(fn).toHaveBeenCalledWith(["A"]);
    });

    it("accepts zero children when function arity is zero", () => {
      const fn = vi.fn(() => "zero-result");

      const result = renderNode(
        makeNode({
          element: "zeroFn",
          children: [],
        }),
        makeOpts(
          {
            zeroFn: {
              type: "fn",
              arity: 0,
              fn,
            },
          },
          {},
        ),
      );

      expect(result).toBe("zero-result");
      expect(fn).toHaveBeenCalledWith([]);
    });

    it("throws when a function node has too few children", () => {
      const node = makeNode({
        element: "sum",
        children: [makeNode({ element: "value", props: { value: 1 } })],
      });

      expect(() =>
        renderNode(
          node,
          makeOpts(
            {
              sum: { type: "fn", arity: 2, fn: vi.fn() },
              value: { type: "leaf" },
            },
            {},
          ),
        ),
      ).toThrow("Function node sum expects 2 arguments, but got 1");
    });

    it("throws when a function node has too many children", () => {
      const node = makeNode({
        element: "sum",
        children: [
          makeNode({ element: "value", props: { value: 1 } }),
          makeNode({ element: "value", props: { value: 2 } }),
        ],
      });

      expect(() =>
        renderNode(
          node,
          makeOpts(
            {
              sum: { type: "fn", arity: 1, fn: vi.fn() },
              value: { type: "leaf" },
            },
            {},
          ),
        ),
      ).toThrow("Function node sum expects 1 arguments, but got 2");
    });

    it('accepts any number of children when arity is "n"', () => {
      const fn = vi.fn(() => "result");
      const node = makeNode({
        element: "combine",
        children: [
          makeNode({ element: "value", props: { value: "A" } }),
          makeNode({ element: "value", props: { value: "B" } }),
          makeNode({ element: "value", props: { value: "C" } }),
        ],
      });

      expect(
        renderNode(
          node,
          makeOpts(
            {
              combine: { type: "fn", arity: "n", fn },
              value: { type: "leaf" },
            },
            {},
          ),
        ),
      ).toBe("result");
    });

    it("supports a function node without an arity restriction", () => {
      const fn = vi.fn(() => "ok");

      expect(
        renderNode(
          makeNode({ element: "custom", children: [] }),
          makeOpts({ custom: { type: "fn", fn } }, {}),
        ),
      ).toBe("ok");
    });
  });

  describe("transform nodes", () => {
    it("checks transform arity and renders the registered component", () => {
      const Component = () => null;
      const node = makeNode({
        element: "transformer",
        children: [makeNode({ element: "child", props: { value: "hello" } })],
      });

      const result = renderNode(
        node,
        makeOpts(
          {
            transformer: {
              type: "transform",
              arity: 1,
              component: Component,
            },
            child: { type: "leaf" },
          },
          {},
        ),
      );

      expect(React.isValidElement(result)).toBe(true);
      expect(result.type).toBe(Component);
    });

    it("renders a transform component without an arity restriction", () => {
      const Component = () => null;

      const result = renderNode(
        makeNode({
          element: "transformer",
          children: [],
        }),
        makeOpts(
          {
            transformer: {
              type: "transform",
              component: Component,
            },
          },
          {},
        ),
      );

      expect(React.isValidElement(result)).toBe(true);
      expect(result.type).toBe(Component);
    });

    it("throws when transform child count does not match its arity", () => {
      const node = makeNode({
        element: "transformer",
        children: [],
      });

      expect(() =>
        renderNode(
          node,
          makeOpts(
            {
              transformer: {
                type: "transform",
                arity: 1,
                component: () => null,
              },
            },
            {},
          ),
        ),
      ).toThrow("Function node transformer expects 1 arguments, but got 0");
    });
  });

  describe("component nodes", () => {
    it("resolves props from runtimeScope and preserves object props", () => {
      const Component = () => null;
      const originalObject = { color: "red" };
      const node = makeNode({
        element: "box",
        props: {
          title: "productTitle",
          literal: "plain text",
          settings: originalObject,
          count: 0,
        },
      });

      const result = renderNode(
        node,
        makeOpts(
          { box: { type: "component", component: Component } },
          { productTitle: "Shoes" },
        ),
      );

      expect(React.isValidElement(result)).toBe(true);
      expect(result.props.title).toBe("Shoes");
      expect(result.props.literal).toBe("plain text");
      expect(result.props.settings).toBe(originalObject);
      expect(result.props.count).toBe(0);
    });

    it("renders child nodes inside the component", () => {
      const Component = () => null;
      const node = makeNode({
        element: "box",
        children: [makeNode({ element: "text", props: { value: "Hello" } })],
      });

      const result = renderNode(
        node,
        makeOpts(
          {
            box: { type: "component", component: Component },
            text: { type: "leaf" },
          },
          {},
        ),
      );

      expect(result.props.children).toEqual(["Hello"]);
    });

    it("resolves array slots as node lists", () => {
      const Component = () => null;
      const node = makeNode({
        element: "box",
        slots: {
          header: [
            makeNode({
              element: "text",
              props: { value: "Header" },
            }),
          ],
        },
      });

      const result = renderNode(
        node,
        makeOpts(
          {
            box: { type: "component", component: Component },
            text: { type: "leaf" },
          },
          {},
        ),
      );

      expect(result.props.slots.header).toEqual(["Header"]);
    });

    it("resolves a single-node slot", () => {
      const Component = () => null;
      const node = makeNode({
        element: "box",
        slots: {
          footer: makeNode({
            element: "text",
            props: { value: "Footer" },
          }),
        },
      });

      const result = renderNode(
        node,
        makeOpts(
          {
            box: { type: "component", component: Component },
            text: { type: "leaf" },
          },
          {},
        ),
      );

      expect(result.props.slots.footer).toBe("Footer");
    });

    it("passes resolved slots and props to the component", () => {
      const Component = () => null;
      const node = makeNode({
        element: "box",
        props: { id: "box-1" },
        slots: {},
      });

      const result = renderNode(
        node,
        makeOpts({ box: { type: "component", component: Component } }, {}),
      );

      expect(result.props.id).toBe("box-1");
      expect(result.props.slots).toEqual({});
    });
  });
});

describe("renderNodeList", () => {
  it("renders every node in a list", () => {
    const nodes = [
      makeNode({ element: "value", props: { value: "one" } }),
      makeNode({ element: "value", props: { value: "two" } }),
    ];

    expect(
      renderNodeList(nodes, makeOpts({ value: { type: "leaf" } }, {})),
    ).toEqual(["one", "two"]);
  });

  it("returns null when the input is not an array", () => {
    expect(renderNodeList(null as any, makeOpts({}, {}))).toBeNull();
    expect(renderNodeList(undefined as any, makeOpts({}, {}))).toBeNull();
  });

  it("returns an empty array for an empty node list", () => {
    expect(renderNodeList([], makeOpts({}, {}))).toEqual([]);
  });

  it("preserves null results for nodes that cannot be rendered", () => {
    const nodes = [
      makeNode({ element: "missing" }),
      makeNode({ element: "value", props: { value: "hello" } }),
    ];

    expect(
      renderNodeList(nodes, makeOpts({ value: { type: "leaf" } }, {})),
    ).toEqual([null, "hello"]);
  });
});

describe("additional branch coverage", () => {
  it("preserves null props without resolving them from runtimeScope", () => {
    const Component = () => null;

    const result = renderNode(
      makeNode({
        element: "box",
        props: { value: null },
      }),
      makeOpts({ box: { type: "component", component: Component } }, {}),
    );

    expect(result.props.value).toBeNull();
  });

  it("resolves a prop to zero from runtimeScope", () => {
    const Component = () => null;

    const result = renderNode(
      makeNode({
        element: "box",
        props: { count: "itemCount" },
      }),
      makeOpts(
        { box: { type: "component", component: Component } },
        { itemCount: 0 },
      ),
    );

    expect(result.props.count).toBe(0);
  });

  it("resolves a prop to false from runtimeScope", () => {
    const Component = () => null;

    const result = renderNode(
      makeNode({
        element: "box",
        props: { enabled: "isEnabled" },
      }),
      makeOpts(
        { box: { type: "component", component: Component } },
        { isEnabled: false },
      ),
    );

    expect(result.props.enabled).toBe(false);
  });

  it("renders an object loop item when listFields is empty", () => {
    const node = makeNode({
      element: "loop",
      list: [{ name: "Item" }],
      listFields: [],
      render: [
        makeNode({
          element: "value",
          props: { value: "value" },
        }),
      ],
    });

    expect(
      renderNode(
        node,
        makeOpts(
          {
            loop: { type: "loop" },
            value: { type: "leaf" },
          },
          {},
        ),
      ),
    ).toEqual([["value"]]);
  });
});
