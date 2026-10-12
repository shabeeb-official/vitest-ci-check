import { plpRegistry } from "@/components/ProductDisplay";
import { useProducts } from "@/store/products";
import MobileView from "@/components/mobile-view";
import IdleSection from "@/components/idle-page";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import ProductListFilterProvider from "@/store/filter";
import { LayoutProps } from "@/types/layout";
import { DEFAULT_HEADER_HEIGHT } from "@/config";
import ProductsLoader from "@/components/products-loader";
import RenderLoop from "@/components/render-loop";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";
import RenderComponents from "@/utils/render-components";

const PLPPage = (props: LayoutProps) => {
  const isMobile = useIsMobileWidth();
  const { status, products } = useProducts();
  const layoutConfigs = useLayoutConfigs();

  if (isMobile) {
    return (
      <ProductListFilterProvider>
        <MobileView
          headerHeight={props.headerHeight || DEFAULT_HEADER_HEIGHT}
        />
      </ProductListFilterProvider>
    );
  }

  if (status === "idle") {
    return <IdleSection />;
  }

  if (status === "loading" && products.length === 0) {
    return <ProductsLoader />;
  }

  const runtimeScope = {};

  return (
    <ProductListFilterProvider>
      <RenderLoop
        list={layoutConfigs.plp.layout}
        render={(item: any) => (
          <RenderComponents
            item={item}
            registry={plpRegistry}
            runtimeScope={runtimeScope}
          />
        )}
      />
    </ProductListFilterProvider>
  );
};

export default PLPPage;
