import ProductDetail from "@/components/ProductDetail";
import useGetProductById from "@/hooks/use-get-product-by-id";
import RecomendedProducts from "@/components/product-page/recomended-products";
import ImageDisplay from "@/components/product-page/image-display";
import useLoadingStatus from "@/hooks/product-page/use-loading-status";
import useSerializeProduct from "@/hooks/product-page/use-serialize-product";
import ExpandeSunny from "@/components/expand-sunny";
import clsx from "clsx";
import { useLayout } from "@/contexts/layoutContext";
import BackToProducts from "@/components/product-page/back-to-products";
import ProductLoading from "@/components/product-page/product-loading";
import ProuductNotFound from "@/components/product-not-found";
import { useProdctDetail } from "@/store/product-detail";
import { useEffect, useMemo } from "react";
import { addUserContext } from "@/utils/user-context";

const ProductDetailSection = () => {
  const { data: products, status } = useGetProductById();
  const { sideBarExpanded } = useLayout();

  const loadingStatus = useLoadingStatus(products, status);
  useSerializeProduct(products, loadingStatus);

  const product = useProdctDetail();

  useEffect(() => {
    if (product.sku) {
      addUserContext(
        {
          sku: product.sku,
          brand: product.brand,
          name: product.title,
          color: product.colors[0],
        },
        { page: "PDP" },
      );
    }
  }, [product]);

  const swatches = useMemo(() => {
    if (products?.length > 0) {
      const temp = products
        .map((product) => {
          if (product.swatchName) {
            return product.swatchName;
          }
          return null;
        })
        .filter((swatch) => swatch !== null);
      return [...new Set(temp)];
    }
    return [];
  }, [products]);

  const sizeObject = useMemo(() => {
    const temp = {};
    products?.forEach((product) => {
      if (product.swatchName == "") {
        return;
      }
      if (temp[product.swatchName]) {
        temp[product.swatchName] = {
          ...temp[product.swatchName],
          sizes: [
            ...temp[product.swatchName].sizes,
            { id: product.sku, size: product.sizes[0] },
          ],
        };
      } else {
        temp[product.swatchName] = {
          src: product.swatch,
          sizes: [{ id: product.sku, size: product.sizes[0] }],
        };
      }
    });
    return temp;
  }, [products]);
  products?.forEach(({ sku, colors, sizes }) => {
    const [color] = colors;
    const [size] = sizes;
    if (color === "White") {
      console.log(sku, color, size);
    }
  });

  if (loadingStatus === "empty") {
    return <ProuductNotFound />;
  }

  if (loadingStatus === "loading") {
    return <ProductLoading />;
  }

  return (
    <section className="bg-white w-full p-3">
      <div
        className={clsx(
          "flex mb-2 items-center",
          sideBarExpanded ? "gap-5" : "gap-3",
        )}
      >
        <ExpandeSunny />
        <BackToProducts />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <ImageDisplay />
        <ProductDetail swatches={swatches} sizeObject={sizeObject} />
      </div>
      <RecomendedProducts currentProductId={product.sku} />
    </section>
  );
};

export default ProductDetailSection;
