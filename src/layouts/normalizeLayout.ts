export function normalizeLayouts(themeConfig: any, layoutSchema: any) {
  const injectSchema = (config: any) => ({
    ...config,
    $schema: layoutSchema, // replace "./layout-schema.json"
  });

  return {
    chat: injectSchema(themeConfig.chat),
    plp: injectSchema(themeConfig.plp),
    pdp: injectSchema(themeConfig.pdp),
    home: injectSchema(themeConfig.home),
  };
}
