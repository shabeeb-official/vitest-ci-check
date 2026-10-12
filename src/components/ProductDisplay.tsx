import ProductCard from "./ProductCard";
import { ProductBrand } from "./ProductBrand";
import { ProductTitle } from "./ProductTitle";
import { ImageWrapper } from "./ImageWrapper";
import { DetailsWrapper } from "./DetailsWrapper";
import { ProductListImage } from "./ProductListImage";
import { ProductCardBody } from "./ProductCardBody";
import FavoriteButton from "./favorites-button";
import ClearFilterButton from "./clear-filter-button";
import { useLayout } from "@/contexts/layoutContext";
import clsx from "clsx";
import TopBar, {
  BrandFilter,
  ColorFilter,
  PriceFilter,
  SizeFilter,
  SortFilter,
  TopBarRight,
} from "./top-bar";
import { Render } from "./conditional";
import useGoToDetails from "@/hooks/use-goto-details";
import { selectItem } from "@/utils/gtm_events";
import useFilterProducts from "@/hooks/use-filter-products";
import RenderLoop from "./render-loop";
import RenderComponents from "@/utils/render-components";
import ProductDisplay from "./plp-wrapper";
import ExpandeSunny from "./expand-sunny";
import SortPopup from "./filter/sort-popup";
import FilterItem from "./filter/filter-item";
import BrandFilterItems from "./filter/brand-filter-item";
import ColorFilterItem from "./filter/color-filter-item";
import PriceFilterItem from "./filter/price-filter-item";
import SizeFilterItem from "./filter/size-filter-item";
import { ProductPrice } from "./product-price";
import {
  DynamicFilterButtons,
  DynamicFilterPanels,
} from "./filter/dynamic-filter-list";
import CategoryFilter from "./filter/category-filter";
import usePreloadImages from "@/hooks/use-preload-images";

type ProductNotFoundProps = {
  nodata: string;
  nodatacontent: string;
};

export const ProductNotFound = ({
  nodata,
  nodatacontent,
}: ProductNotFoundProps) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium mb-2">{nodata}</h3>
      <p className="text-gray-500">{nodatacontent}</p>
    </div>
  );
};

export const ProductList = ({
  filteredProducts,
  nested,
}: {
  filteredProducts: any[];
  nested: any;
}) => {
  const { sideBarExpanded } = useLayout();
  const goToProduct = useGoToDetails();

  usePreloadImages(
    filteredProducts.map((product) => product.imageUrl).filter(Boolean),
  );

  const navigateToProduct = (product: any) => {
    selectItem(product.title, product.sku);

    goToProduct(product.id, {
      brand: product.brand,
      sku: product.sku,
    });
  };

  // const { onCloseFilter } = useProductListFilter();

  // useEffect(() => {
  //   const layoutContainer = document.querySelector("#layout-container");
  //   if (!layoutContainer) {
  //     return;
  //   }
  //   layoutContainer.addEventListener("scroll", () => {
  //     onCloseFilter();
  //   });
  // }, []);

  return (
    <div
      className={clsx(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 md:gap-3",
        sideBarExpanded ? "xl:grid-cols-4" : "xl:grid-cols-5",
      )}
    >
      <RenderLoop
        list={nested}
        render={(item) => (
          <>
            {filteredProducts.map((product, idx) => (
              <RenderComponents
                item={item}
                key={product.sku || product.id || idx}
                registry={plpRegistry}
                runtimeScope={{
                  product: product,
                  navigateToProduct: () => navigateToProduct(product),
                }}
              />
            ))}
          </>
        )}
      />
    </div>
  );
};

type ProductDisplayGridProps = {
  nodata: string;
  nodatacontent: string;
  nested?: any;
};

const ProductDisplayGrid = (props: ProductDisplayGridProps) => {
  const { nodata, nodatacontent, nested } = props;
  const filteredProducts = useFilterProducts();
  const isEmpty = filteredProducts.length === 0;

  return (
    <Render
      when={isEmpty}
      show={<ProductNotFound nodata={nodata} nodatacontent={nodatacontent} />}
      otherwise={
        <ProductList filteredProducts={filteredProducts} nested={nested} />
      }
    />
  );
};

export const plpRegistry = {
  ProductCardBody,
  TopBarRight,
  BrandFilter,
  ColorFilter,
  SizeFilter,
  PriceFilter,
  SortFilter,
  ProductDisplay,
  TopBar,
  ExpandeSunny,
  SortPopup,
  ProductDisplayGrid,
  ProductCard,
  ImageWrapper,
  DetailsWrapper,
  ProductBrand,
  ProductTitle,
  ProductPrice,
  ProductListImage,
  FavoriteButton,
  ClearFilterButton,
  FilterItem,
  BrandFilterItems,
  ColorFilterItem,
  PriceFilterItem,
  SizeFilterItem,
  DynamicFilterButtons,
  DynamicFilterPanels,
  CategoryFilter,
};

export default ProductDisplayGrid;
