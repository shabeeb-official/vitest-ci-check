import { fetchLayoutConfig } from "./fetchLayoutConfig";
import { getActiveClientConfig } from "@/utils/clients";

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

export async function loadLayoutConfigs(token?: string) {
  if (process.env.NODE_ENV === "production") {
    const layouts = await fetchLayoutConfig(token);
    if (layouts) {
      return getParsedLayouts(layouts);
    }
    console.log("ERROR: failed to get config using fallback");
  }

  return getLocalLayout();
}

const getParsedLayouts = (layouts: {
  chat: any;
  home: any;
  pdp: any;
  plp: any;
}) => {
  const { chat, home, pdp, plp } = layouts;
  return {
    chat: parseLayout(chat),
    plp: parseLayout(plp),
    pdp: parseLayout(pdp),
    home: parseLayout(home),
  };
};

const getLocalLayout = () => {
  const clientConfig = getActiveClientConfig();
  if (!clientConfig) {
    alert("Failed to load configuration for the current client");
    console.assert("Failed to load configuration for the current client");
  }

  if (!clientConfig.layouts) {
    alert("The loaded configuration does not have a layout");
    console.assert("The loaded configuration does not have a layout");
  }

  return getParsedLayouts(clientConfig.layouts);
};
