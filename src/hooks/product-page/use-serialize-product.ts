import { Product } from "@/types/product";
import { useLayoutEffect } from "react";
import debug from "debug";
import { LoadingStatus, useProdctDetailDispatch } from "@/store/product-detail";
import useGetSkuFromQuery from "../use-get-sku-from-query";

const log = debug("app:ProductPage");

export const defaultDetailData: Product = {
  id: "",
  sku: "",
  title: "",
  price: "",
  brand: "",
  imageUrl: "",
  description: "",
  sale_price: "",
  pattern: "",
  trend: "",
  colors: [],
  sizes: [],
  mainImageUrl: "",
  swatch: "",
  swatchName: "",
  designerNotes: "",
};

const useSerializeProduct = (
  products: Product[],
  loadingStatus: LoadingStatus,
) => {
  const [sku] = useGetSkuFromQuery();

  const productDetailDispatch = useProdctDetailDispatch();

  // useLayoutEffect so product (and image URLs) are in the store before paint,
  // allowing all gallery images to start downloading together.
  useLayoutEffect(() => {
    if (loadingStatus === "loading") {
      productDetailDispatch({
        type: "LOAD_PRODUCT",
        payload: defaultDetailData,
      });
      return;
    }
    if (loadingStatus === "success" && products.length > 0 && sku) {
      log("finding product with sku ", sku);
      const product = products.find((product) => product.sku === sku);
      if (product) {
        log("product with sku", sku, "found");
        productDetailDispatch({ type: "LOAD_PRODUCT", payload: product });
      } else {
        log("product with sku", sku, "not found");
        productDetailDispatch({ type: "LOAD_PRODUCT", payload: products[0] });
      }
    }
  }, [products, loadingStatus, sku, productDetailDispatch]);
};

export default useSerializeProduct;
