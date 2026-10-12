# PDP Modularization - Quick Reference

## Files at a Glance

| File | Purpose |
|------|---------|
| `src/layouts/pdp.json` | Layout & style definitions |
| `src/components/pdp/` | All modular components |
| `src/pages/ProductPage.tsx` | Entry point (uses pdp.json) |
| `src/layouts/index.ts` | Layout parser & config export |

## Common Tasks

### 1. Change a Component's Style
```json
// In pdp.json, find the style key
"styles": {
  "colorSection": "mb-6 mt-3"  // ← Edit this
}
```

### 2. Reorder Components
```json
// In pdp.json, children are rendered top-to-bottom
"children": [
  { "$ref": "#/definitions/components/productBrand" },      // First
  { "$ref": "#/definitions/components/productPrice" },      // Second
  { "$ref": "#/definitions/components/colorSelector" }      // Third
]
```

### 3. Change Component Props
```json
"props": {
  "colorSectionStyle": "mb-8 mt-4",  // ← Update style
  "colorPillStyle": "flex items-center cursor-pointer"
}
```

### 4. Add/Remove Spacing
```json
"styles": {
  "colorSection": "mb-6 mt-3"          // Original
  "colorSection": "mb-0 mt-0"          // No spacing
  "colorSection": "mb-12 mt-8"         // More spacing
}
```

### 5. Change Grid Layout
```json
"sizeGrid": "grid grid-cols-4 gap-2"   // Original (4 columns)
"sizeGrid": "grid grid-cols-5 gap-3"   // 5 columns, wider gaps
"sizeGrid": "grid grid-cols-3 gap-1"   // 3 columns, tighter gaps
```

## Component Props Reference

### ColorSelector
```json
{
  "component": "ColorSelector",
  "props": {
    "colorSectionStyle": "mb-6 mt-3",
    "colorLabelStyle": "capitalize font-normal block text-md text-[#1A1A1A] mb-2",
    "colorLabelBoldStyle": "font-bold",
    "colorWrapperStyle": "flex flex-wrap gap-2 justify-start",
    "colorPillStyle": "flex justify-center items-center cursor-pointer",
    "colorPillSelectedStyle": "p-[3px] border-black border-2"
  }
}
```

### SizeSelector
```json
{
  "component": "SizeSelector",
  "props": {
    "sizeSectionStyle": "mb-6",
    "sizeLabelStyle": "capitalize font-bold block text-md text-[#1A1A1A] mb-2",
    "sizeGridStyle": "grid grid-cols-4 gap-2 justify-start text-nowrap",
    "sizeItemStyle": "rounded-none hover:bg-none col-span-1 text-center cursor-pointer",
    "sizeItemSelectedStyle": "border-black border-b-2"
  }
}
```

### ProductPriceComponent
```json
{
  "component": "ProductPriceComponent",
  "props": {
    "priceWrapperStyle": "text-lg font-light",
    "priceSaleStyle": "sale-item-color mb-2",
    "priceStrikeStyle": "text-sm font-light text-gray-500 mb-2 line-through"
  }
}
```

## Tailwind Cheat Sheet (for style updates)

| Class | Effect |
|-------|--------|
| `mb-6` | Margin-bottom 1.5rem |
| `mt-3` | Margin-top 0.75rem |
| `p-3` | Padding 0.75rem |
| `gap-2` | Gap 0.5rem |
| `grid grid-cols-4` | 4-column grid |
| `flex flex-wrap` | Flex with wrapping |
| `text-lg` | Large text |
| `font-bold` | Bold text |
| `text-gray-500` | Gray text |
| `border-black border-2` | Black 2px border |
| `line-through` | Strikethrough text |

## Build & Test
```bash
npm run build          # Build for production
npm run dev            # Start dev server
npm run lint          # Check for errors
```

## Key Concepts

1. **JSON-First**: Config first, implementation second
2. **Registry**: Component name → React component mapping
3. **$ref**: Reference to another part of JSON (DRY)
4. **RenderScope**: Runtime values passed to components
5. **RenderComponents**: Utility that reads JSON and renders React

## File Locations

```
bzplatform/
├── src/
│   ├── components/
│   │   ├── pdp/                    ← Modular PDP components
│   │   │   ├── ProductDetailContainer.tsx
│   │   │   ├── ProductDetailSectionWrapper.tsx
│   │   │   ├── HeaderBar.tsx
│   │   │   ├── MainGrid.tsx
│   │   │   ├── ProductDetailWrapper.tsx
│   │   │   ├── RecommendedProductsComponent.tsx
│   │   │   ├── pdpRegistry.ts
│   │   │   └── index.ts
│   │   └── product-page/           ← Original components (unchanged)
│   ├── layouts/
│   │   ├── pdp.json                ← Layout config (edit this!)
│   │   ├── plp.json
│   │   └── index.ts
│   ├── pages/
│   │   └── ProductPage.tsx         ← Entry point (updated)
│   └── utils/
│       └── render-components.tsx   ← Renderer (unchanged)
└── docs/
    └── PDP_MODULARIZATION.md       ← Full documentation
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Styles not applied | Check `$ref` path in JSON |
| Component not rendering | Verify component in `pdpRegistry` |
| Props undefined | Check `runtimeScope` in ProductDetailWrapper |
| Build fails | Run `npm install` then `npm run build` |
| Circular import | Use dynamic `require()` in components |

## Need Help?

- See [PDP_MODULARIZATION.md](PDP_MODULARIZATION.md) for full documentation
- Check `pdp.json` for all available styles
- Review `pdpRegistry.ts` to see all registered components
