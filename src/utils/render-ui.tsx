export type Node = {
  name: string;
  element: string;
  props: any;
  children: any[];
  nested: any;
  slots: any;
  properties: any;
  list: [];
  listFields: [];
  render: any;
  when: {
    operator: "is" | "not";
    lhs: string;
    rhs: string;
  };
  then: Node[];
  otherwise: Node[];
};

export { Node as INode };

export type RenderNodeOpts = {
  registry: any;
  runtimeScope?: any;
};

const renderLeafNode = (props: any, scope: any) => {
  return scope?.[props.value] ?? props.value;
};

export const renderNode = (node: Node, opts: RenderNodeOpts) => {
  if (!node) {
    return null;
  }

  const entry = opts.registry[node.element];
  if (!entry) {
    return null;
  }

  if (entry.type === "loop") {
    const list: any[] =
      typeof node.list === "string" ? opts.runtimeScope[node.list] : node.list;

    return list?.map((listItem, i) => {
      const acc: any = {};
      if (typeof listItem === "string") {
        acc.value = listItem;
      } else {
        node.listFields.forEach(({ key, value }) => {
          acc[value] = listItem[key];
        });
      }
      const temp = { ...opts.runtimeScope, ...acc, i };
      return renderNodeList(node.render, {
        registry: opts.registry,
        runtimeScope: temp,
      });
    });
  }

  if (entry.type === "conditional") {
    const { when, then, otherwise } = node;
    const { operator, lhs, rhs } = when;
    const leftHandOperand =
      opts.runtimeScope[lhs] !== undefined ? opts.runtimeScope[lhs] : lhs;
    const rightHandOperand =
      opts.runtimeScope[rhs] !== undefined ? opts.runtimeScope[rhs] : rhs;

    if (operator === "is") {
      const isEqual = leftHandOperand === rightHandOperand;
      return renderNodeList(isEqual ? then : otherwise, opts);
    } else if (operator === "not") {
      const isEqual = leftHandOperand !== rightHandOperand;
      return renderNodeList(isEqual ? then : otherwise, opts);
    }

    return null;
  }

  if (entry.type === "leaf") {
    const resolved = renderLeafNode(node.props, opts.runtimeScope);
    return resolved;
  }

  if (entry.type === "fn") {
    const parsedChildren = renderNodeList(node.children, opts);
    if (entry.arity !== undefined) {
      verifyArity(entry.arity, parsedChildren.length, node);
    }
    return entry.fn(parsedChildren);
  }

  if (entry.type === "transform") {
    if (entry.arity !== undefined) {
      verifyArity(entry.arity, node.children.length, node);
    }
  }

  const resolvedSlots = resolveSlots(node.slots, opts);
  const resolvedProps = resolveProps(node.props, opts.runtimeScope);

  return (
    <entry.component {...resolvedProps} slots={resolvedSlots}>
      {renderNodeList(node.children, opts)}
    </entry.component>
  );
};

const resolveProps = (props: any, runtimeScope?: any) => {
  const propAcc = {};
  for (const key in props) {
    if (typeof props[key] === "object" && props[key] !== null) {
      propAcc[key] = props[key];
      continue;
    }
    const exists = runtimeScope[props[key]];
    if (exists !== undefined) {
      propAcc[key] = exists;
    } else {
      propAcc[key] = props[key];
    }
  }
  return propAcc;
};

const resolveSlots = (slots: any, opts: RenderNodeListOptTypes) => {
  const resolvedSlots = {};
  for (const slotName in slots) {
    const slotValue = slots[slotName];
    const isSlotArray = Array.isArray(slotValue);

    if (isSlotArray) {
      resolvedSlots[slotName] = renderNodeList(slotValue, opts);
    } else {
      resolvedSlots[slotName] = renderNode(slotValue, opts);
    }
  }
  return resolvedSlots;
};

type VerifyArityFunc = (
  arity: number | "n",
  values: number,
  node: Node,
) => void;

const verifyArity: VerifyArityFunc = (arity, childrenLength, node) => {
  if (childrenLength !== arity) {
    if (arity === "n") {
      return;
    }
    if (childrenLength !== arity) {
      throw new Error(
        `Function node ${node.element} expects ${arity} arguments, but got ${childrenLength}`,
      );
    }
  }
};

type RenderNodeListOptTypes = {
  registry: any;
  runtimeScope?: any;
};

type RenderNodeListFunc = (
  nodeList: Node[],
  opts: RenderNodeListOptTypes,
) => any[];

export const renderNodeList: RenderNodeListFunc = (nodeList, opts) => {
  if (Array.isArray(nodeList)) {
    return nodeList.map((node) => renderNode(node, opts));
  }
  return null;
};
