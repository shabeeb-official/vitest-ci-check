import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

const COMPONENT_FILES = [
  "src/components/conditional.tsx",
  "src/components/currency.tsx",
  "src/components/product-price.tsx",
  "src/components/render-loop.tsx",
  "src/components/ProductCard.tsx",
  "src/components/ProductCardBody.tsx",
  "src/components/ProductTitle.tsx",
  "src/components/ProductBrand.tsx",
  "src/components/ProductListImage.tsx",
  "src/components/ImageWrapper.tsx",
  "src/components/DetailsWrapper.tsx",
  "src/components/loader.tsx",
  "src/components/product-page/product-loading.tsx",
  "src/components/no-products-message.tsx",
  "src/components/product-page/in-demand.tsx",
  "src/components/product-page/buy-now-pay-later.tsx",
  "src/components/home-page/hero-banner.tsx",
  "src/components/home-page/logo-section.tsx",
  "src/components/chat/chat-wrapper.tsx",
  "src/components/home-page/home-wrapper.tsx",
  "src/components/pdp/main-grid.tsx",
  "src/registry/generic/shimmer-grid.tsx",
  "src/components/color-pill.tsx",
  "src/components/mobile-click-pill.tsx",
  "src/components/circular-progress.tsx",
  "src/components/chat/send-icon.tsx",
  "src/components/chat/line-icon.tsx",
  "src/components/chat/gear-icon.tsx",
  "src/components/chat/collection-icon.tsx",
  "src/components/expandable-text-option.tsx",
  "src/registry/generic/expandabelText.tsx",
  "src/hooks/use-expandable-text.ts",
  "src/components/accordion-toggle.tsx",
  "src/components/filter-type-button.tsx",
  "src/components/chat/button.tsx",
  "src/components/tap-switcher.tsx",
  "src/components/product-page/back-to-products.tsx",
  "src/components/product-not-found.tsx",
  "src/components/home-page/chat-button.tsx",
  "src/components/error-boundary.tsx",
];

export default defineConfig(async (env) => {
  const base = await viteConfig(env);

  return {
    ...base,
    test: {
      ...base.test,
      include: ["tests/components/**/*.test.tsx"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: COMPONENT_FILES,
        thresholds: {
          perFile: true,
          lines: 80,
        },
      },
    },
  };
});
