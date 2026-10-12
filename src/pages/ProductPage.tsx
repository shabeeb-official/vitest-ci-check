import ProductProvider, { LoadingStatus } from "@/store/product-detail";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import ProductPageMobileView from "@/components/product-page/mobile-view";
import { DEFAULT_HEADER_HEIGHT } from "@/config";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";
import RenderLoop from "@/components/render-loop";
import RenderComponents from "@/utils/render-components";
import { pdpRegistry } from "@/components/pdp/pdpRegistry";
import { createContext, ReactNode, Suspense, useContext } from "react";
import ProductLoading from "@/components/product-page/product-loading";
import useGetProductById from "@/hooks/use-get-product-by-id";
import useLoadingStatus from "@/hooks/product-page/use-loading-status";
import { Product } from "@/types/product";
import ProuductNotFound from "@/components/product-not-found";
import useSerializeProduct from "@/hooks/product-page/use-serialize-product";

type ProductListContextType = {
  products: Product[];
  status: LoadingStatus;
};
const ProductListContext = createContext<ProductListContextType>({
  products: [],
  status: "idle",
});

type ProductListProviderType = ReactNode;

const ProductListProvider = (props: { children: ProductListProviderType }) => {
  const { children } = props;
  const { data, status } = useGetProductById();
  const loadingStatus = useLoadingStatus(data, status);

  return (
    <ProductListContext.Provider
      value={{ products: data, status: loadingStatus }}
    >
      {children}
    </ProductListContext.Provider>
  );
};

export const useProductList = () => useContext(ProductListContext);

const ProductDetailPage = () => {
  const isMobileWidth = useIsMobileWidth();
  const layoutConfigs = useLayoutConfigs();

  if (isMobileWidth) {
    return (
      <ProductListProvider>
        <ProductProvider>
          <ProductGuard>
            <Suspense fallback={<ProductLoading />}>
              <ProductPageMobileView headerHeight={DEFAULT_HEADER_HEIGHT} />
            </Suspense>
          </ProductGuard>
        </ProductProvider>
      </ProductListProvider>
    );
  }

  return (
    <ProductListProvider>
      <ProductProvider>
        <ProductGuard>
          <Suspense fallback={<ProductLoading />}>
            <section className={layoutConfigs.pdp.styles.detailSection}>
              <RenderLoop
                list={layoutConfigs.pdp.layout}
                render={(item: any) => (
                  <RenderComponents item={item} registry={pdpRegistry} />
                )}
              />
            </section>
          </Suspense>
        </ProductGuard>
      </ProductProvider>
    </ProductListProvider>
  );
};

const ProductGuard = ({ children }: { children: ReactNode }) => {
  const { products, status } = useProductList();
  useSerializeProduct(products, status);
  if (status === "empty") {
    return <ProuductNotFound />;
  }

  if (status === "loading") {
    return <ProductLoading />;
  }

  return <>{children}</>;
};

export default ProductDetailPage;
