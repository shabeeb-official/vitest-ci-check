import chatJson from "./chat.json";
import plpJson from "./rd/plp.json";
import pdpJson from "./rd/pdp.json";
import homeJson from "./cb/home.json";

const resolveRefs = (obj: any, root: any, visited = new Set()): any => {
  if (!obj || typeof obj !== "object") return obj;

  if (visited.has(obj)) return obj;
  visited.add(obj);

  if (obj.$ref && typeof obj.$ref === "string") {
    const refPath = obj.$ref.replace(/^#\//, "").split("/");
    let resolved = root;

    for (const key of refPath) {
      resolved = resolved?.[key];
    }

    if (!resolved) {
      console.warn(`Could not resolve reference: ${obj.$ref}`);
      return obj;
    }

    return resolveRefs(resolved, root, visited);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveRefs(item, root, new Set(visited)));
  }

  const result: any = {};
  for (const key in obj) {
    result[key] = resolveRefs(obj[key], root, new Set(visited));
  }

  return result;
};

const applyDefaults = (
  layoutArray: any[],
  defaults = { configurable: true },
): any[] => {
  if (typeof layoutArray === "string") {
    return layoutArray;
  }
  return layoutArray.map((item) => {
    const processed = {
      ...item,
      configurable: item.configurable ?? defaults.configurable,
    };

    if (processed.children) {
      processed.children = applyDefaults(processed.children, defaults);
    }

    if (processed.nested) {
      processed.nested = applyDefaults(processed.nested, defaults);
    }

    return processed;
  });
};

const parseLayout = (config: any) => {
  const resolved = resolveRefs(config, config);
  return {
    layout: applyDefaults(resolved.layout),
    content: resolved.definitions.content || {},
    pageLayout: resolved.definitions.theme.pageLayout || {},
    styles: resolved.definitions.theme.styles || {},
  };
};

const layoutConfigs = {
  chat: parseLayout(chatJson),
  plp: parseLayout(plpJson),
  pdp: parseLayout(pdpJson),
  home: parseLayout(homeJson),
};

export { layoutConfigs };
