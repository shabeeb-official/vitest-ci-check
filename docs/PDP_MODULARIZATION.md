# PDP Modularization Guide

## Overview
The Product Detail Page (PDP) has been fully modularized to match the PLP (Product Listing Page) architecture. All components are now loaded and configured from `pdp.json`, allowing style and arrangement changes directly from the JSON file without modifying React components.

## Files Created/Modified

### New Files Created

#### Layout Configuration
- **[src/layouts/pdp.json](src/layouts/pdp.json)** - Complete JSON layout definition for PDP with:
  - Component hierarchy
  - Theme styles (all tailwind classes)
  - Component props definitions
  - Full referencing system using `$ref` for DRY principles

#### PDP Component Wrappers (src/components/pdp/)
1. **[ProductDetailContainer.tsx](src/components/pdp/ProductDetailContainer.tsx)**
   - Top-level wrapper component
   - Handles mobile/desktop view switching
   - Wraps entire app with `ProductProvider`

2. **[ProductDetailSectionWrapper.tsx](src/components/pdp/ProductDetailSectionWrapper.tsx)**
   - Main section container
   - Applies theme styles
   - Renders child components from JSON

3. **[HeaderBar.tsx](src/components/pdp/HeaderBar.tsx)**
   - Header navigation bar
   - Contains: ExpandeSunny, BackToProducts
   - Responsive styling with sidebar state

4. **[MainGrid.tsx](src/components/pdp/MainGrid.tsx)**
   - Main grid layout container
   - Contains: ImageDisplay, ProductDetail
   - Configurable grid styles

5. **[ProductDetailWrapper.tsx](src/components/pdp/ProductDetailWrapper.tsx)**
   - Core product detail section
   - **Exported Components:**
     - `ProductDetailWrapper` - Main wrapper with all children
     - `ProductBrandComponent` - Brand display
     - `ProductTitleWithFav` - Title with favorite button
     - `ProductPriceComponent` - Price display (with sale price)
     - `ColorSelector` - Color selection UI
     - `SizeSelector` - Size selection UI
     - `BuyNowButtonComponent` - Buy button
     - `PointsAccordionComponent` - Points accordion
     - `RefundidAccordionComponent` - Refund accordion
     - `BuyNowPayLaterComponent` - Payment options
     - `ProductDescriptionComponent` - Description section
     - `AdditionalDetailsComponent` - Details section
     - `ProductNumberComponent` - SKU display

6. **[RecommendedProductsComponent.tsx](src/components/pdp/RecommendedProductsComponent.tsx)**
   - Recommended products section
   - Displays related products

7. **[pdpRegistry.ts](src/components/pdp/pdpRegistry.ts)**
   - Component registry exported for render system
   - Maps component names (in JSON) to actual React components
   - Similar to `plpRegistry` used for PLP

8. **[index.ts](src/components/pdp/index.ts)**
   - Barrel export file for easier imports

### Modified Files

#### [src/pages/ProductPage.tsx](src/pages/ProductPage.tsx)
**Before:**
```tsx
const ProductDetailPage = (props: LayoutProps) => {
  const isMobileWidth = useIsMobileWidth();
  if (isMobileWidth) {
    return <ProductProvider>...</ProductProvider>;
  }
  return <ProductProvider><ProductDetailSection /></ProductProvider>;
};
```

**After:**
```tsx
const ProductDetailPage = (props: LayoutProps) => {
  const runtimeScope = {};
  return (
    <RenderLoop
      list={layoutConfigs.pdp.layout}
      render={(item: any) => (
        <RenderComponents
          item={item}
          registry={pdpRegistry}
          runtimeScope={runtimeScope}
        />
      )}
    />
  );
};
```

#### [src/layouts/index.ts](src/layouts/index.ts)
- Added exports for layout JSON files
- Ensures PDP config is parsed and available

## Architecture

### Layout Structure (pdp.json)

```
ProductDetailContainer (top level)
├── ProductDetailSection (main section)
│   ├── HeaderBar
│   │   ├── ExpandeSunny
│   │   └── BackToProducts
│   ├── MainGrid
│   │   ├── ImageDisplay
│   │   └── ProductDetail
│   │       ├── ProductBrandComponent
│   │       ├── ProductTitleWithFav
│   │       ├── ProductPriceComponent
│   │       ├── ColorSelector
│   │       ├── SizeSelector
│   │       ├── BuyNowButtonComponent
│   │       ├── PointsAccordionComponent
│   │       ├── RefundidAccordionComponent
│   │       ├── BuyNowPayLaterComponent
│   │       ├── ProductDescriptionComponent
│   │       ├── AdditionalDetailsComponent
│   │       └── ProductNumberComponent
│   └── RecommendedProductsComponent
```

## How It Works

### 1. JSON-Driven Rendering
The `RenderComponents` utility:
- Reads component definition from JSON
- Looks up component in `pdpRegistry`
- Passes props from JSON to component
- Recursively renders children

### 2. Style Management
All styles are defined in `pdp.json`:
```json
"styles": {
  "productCard": "bg-white overflow-hidden transition-all duration-200...",
  "colorSection": "mb-6 mt-3",
  "sizeGrid": "grid grid-cols-4 gap-2 justify-start text-nowrap"
}
```

Pass styles as props:
```json
"props": {
  "colorSectionStyle": { "$ref": "#/definitions/theme/styles/colorSection" }
}
```

### 3. Props from JSON
Components receive props directly from JSON:
```json
{
  "component": "ColorSelector",
  "props": {
    "colorSectionStyle": "...",
    "colorLabelStyle": "...",
    "colorPillStyle": "..."
  }
}
```

## Changing Styles & Layout

### To Change Component Styles:
1. Open [src/layouts/pdp.json](src/layouts/pdp.json)
2. Find the component in `definitions.theme.styles`
3. Update the Tailwind classes
4. Changes apply immediately

**Example:** Change color section margin
```json
"colorSection": "mb-6 mt-3"  // Change to:
"colorSection": "mb-8 mt-4"
```

### To Change Component Order:
1. Reorder components in the `children` array of parent component
2. The render system will display them in new order

**Example:** Move ProductBrandComponent after ProductPrice
```json
"children": [
  // Move this...
  { "$ref": "#/definitions/components/productBrand" },
  // After ProductPrice
  { "$ref": "#/definitions/components/productPrice" },
  { "$ref": "#/definitions/components/productBrand" }  // Moved here
]
```

### To Add New Component Properties:
1. Update component props in JSON
2. Update TypeScript interface in wrapper component
3. Use the prop in render

## Component Reusability

All wrapper components accept:
- **Style props** - Applied as className
- **Children** - Rendered from JSON or fallback to defaults
- **Custom props** - Specific to each component

This allows:
- Styling changes via JSON
- Layout restructuring via JSON
- Component reordering without code changes

## Backward Compatibility

- Original components in `src/components/product-page/` remain unchanged
- Old ProductDetail.tsx still exists but unused
- Easy to revert if needed
- No breaking changes to other parts of app

## Runtime Scope

The `runtimeScope` object passes runtime values to components:
```tsx
runtimeScope={{
  sizeObject,
  colors,
  sizes,
  sku,
  updateSku,
}}
```

This allows components to access:
- Product size data
- Available colors
- Selected SKU
- SKU update function

## Future Enhancements

The modular approach enables:
1. **Theme Variants** - Create multiple pdp.json variants
2. **A/B Testing** - Serve different layouts to different users
3. **Dynamic Layouts** - Load layouts from API
4. **Component Plugins** - Register new components at runtime
5. **Layout Editor** - Build UI to edit pdp.json visually

## Testing the Changes

1. **Build**: `npm run build` ✅ (Already tested - builds successfully)
2. **Development**: `npm run dev` and navigate to product page
3. **Verify**: 
   - UI looks identical to before
   - All interactions work (size/color selection, etc.)
   - Mobile view works
   - No console errors

## Key Differences from Old Approach

| Aspect | Old | New |
|--------|-----|-----|
| Component Loading | Hard-coded in React | Loaded from JSON |
| Style Changes | Modify component file | Modify JSON |
| Layout Changes | Modify component structure | Reorder JSON children |
| Props Management | Scattered across components | Centralized in JSON |
| Mobile Handling | Inside component | In wrapper component |
| Component Discovery | Manual | Registry-based |

## Reference Pattern

All style/definition references use JSON Schema `$ref`:

```json
"styles": {
  "$ref": "#/definitions/theme/styles/colorSection"
}
```

This means:
- `#` = Root of JSON document
- `/` = Path separator
- Navigate to: `definitions` → `theme` → `styles` → `colorSection`

Benefits:
- DRY (Don't Repeat Yourself)
- Single source of truth for styles
- Easy to update styles globally
