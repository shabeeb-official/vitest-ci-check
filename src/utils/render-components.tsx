// 1. The function `renderComponents` takes two parameters: `item` and `runtimeScope`. The `item` parameter is expected to be an object that describes the component to be rendered, including its type, properties, children, and any inner layout. The `runtimeScope` parameter is an optional object that provides dynamic values for the component's properties.
// 2. Inside the function, it first checks if the `item` is falsy (null or undefined). If it is, the function returns null, indicating that there is nothing to render.
// 3. The function then destructures the `item` object to extract the `component`, `props`, `children`, and `nested` properties.
// 4. It retrieves the actual React component from a registry (`chatRegistry`) using the `component` name provided in the `item`.
// 5. An empty object `propAcc` is initialized to hold the final properties that will be passed to the component.
// 6. The function iterates over each key in the `props` object. For each property, it checks if there is a corresponding value in the `runtimeScope`. If a value exists in `runtimeScope`, it assigns that value to the `propAcc` object; otherwise, it uses the original value from `props`.
// 7. If the `item` has `children`, the function maps over each child and recursively calls `renderComponents` to render them. The resulting nested components are then included as children of the main component.
// 8. Finally, the function returns a React element created using the `Component`, spreading the `propAcc` properties and including any nested children if they exist. If there are no children, it simply returns the component with its properties and any `nested`.
// 9. If any error occurs during this process, it is caught in the catch block, logged to the console, and the function returns null.

import RenderLoop from "@/components/render-loop";

type Props = {
  item: any;
  registry: any;
  runtimeScope?: any;
};

const buildProps = (props: any, runtimeScope?: any) => {
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

const RenderComponents = (layoutProps: Props) => {
  const { item, registry, runtimeScope = {} } = layoutProps;
  if (!item) return null;

  const { component, props, children, nested } = item;
  const Component = registry[component];

  if (!children) {
    return (
      <Component
        key={component}
        {...buildProps(props, runtimeScope)}
        nested={nested}
      />
    );
  }

  if (children.length > 0) {
    return (
      <Component key={component} {...buildProps(props, runtimeScope)}>
        <RenderLoop
          list={children}
          render={(child: any) => {
            return (
              <RenderComponents
                key={child.component}
                item={child}
                registry={registry}
                runtimeScope={runtimeScope}
              />
            );
          }}
        />
      </Component>
    );
  }

  return null;
};

export default RenderComponents;
